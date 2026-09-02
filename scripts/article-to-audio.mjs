#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

function decodeEntities(value) {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function ensureSentence(value) {
  return /[.!?…:]$/.test(value) ? value : `${value}.`;
}

export function articleMarkdownToSpeech(source) {
  const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  const rawTitle = frontmatter?.[1].match(/^title:\s*(.+?)\s*$/m)?.[1] ?? "Article";
  const title = rawTitle.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, "$1$2");
  let body = frontmatter ? source.slice(frontmatter[0].length) : source;

  body = body.split(/^##\s+(?:Sources|Notes et sources)\s*$/im, 1)[0];
  body = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<figure\b[\s\S]*?<\/figure>/gi, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<https?:\/\/[^>]+>/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\[\d+\]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/(^|\s)[*_~]{1,3}([^\n]*?)[*_~]{1,3}(?=\s|[.,;:!?]|$)/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1");

  const spokenLines = body.split(/\r?\n/).map((rawLine) => {
    let line = decodeEntities(rawLine).trim();
    if (!line || /^-{3,}$/.test(line)) return "";
    if (/^\|?(?:\s*:?-+:?\s*\|)+\s*$/.test(line)) return "";
    if (line.includes("|")) {
      line = line.split("|").map((cell) => cell.trim()).filter(Boolean).join(". ");
    }
    line = line.replace(/^#{1,6}\s+/, "").replace(/^>\s?/, "");
    const bullet = line.match(/^[-*+]\s+(.+)$/);
    if (bullet) return `${ensureSentence(bullet[1])}\n`;
    return line;
  });

  const bodyText = spokenLines.join("\n").replace(/\n{2,}/g, "\n\n").trim();
  return [decodeEntities(title), bodyText].filter(Boolean).join("\n\n");
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "inherit", "inherit"] });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with status ${code}`));
    });
  });
}

function parseArgs(argv) {
  const options = { outputDir: path.resolve("review-audio"), voice: "Thomas", rate: "185", files: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--output-dir") options.outputDir = path.resolve(argv[++index]);
    else if (argument === "--voice") options.voice = argv[++index];
    else if (argument === "--rate") options.rate = argv[++index];
    else options.files.push(path.resolve(argument));
  }
  if (options.files.length === 0) {
    throw new Error("Usage: article-to-audio.mjs [--output-dir DIR] [--voice VOICE] [--rate WPM] ARTICLE.md [...]");
  }
  return options;
}

async function exportArticle(file, options, temporaryDirectory) {
  const source = await readFile(file, "utf8");
  const speech = articleMarkdownToSpeech(source);
  const basename = path.basename(file, path.extname(file));
  const textFile = path.join(temporaryDirectory, `${basename}.txt`);
  const aiffFile = path.join(temporaryDirectory, `${basename}.aiff`);
  const outputFile = path.join(options.outputDir, `${basename}.mp3`);
  const title = speech.split("\n", 1)[0];

  await writeFile(textFile, `${speech}\n`, "utf8");
  await run("/usr/bin/say", ["-v", options.voice, "-r", options.rate, "-o", aiffFile, "-f", textFile]);
  await run("ffmpeg", [
    "-y", "-hide_banner", "-loglevel", "error", "-i", aiffFile,
    "-codec:a", "libmp3lame", "-b:a", "96k", "-ac", "1",
    "-metadata", `title=${title}`, outputFile,
  ]);
  return outputFile;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  await mkdir(options.outputDir, { recursive: true });
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "article-audio-"));
  try {
    const outputs = [];
    for (const file of options.files) {
      outputs.push(await exportArticle(file, options, temporaryDirectory));
    }
    console.log(JSON.stringify({ voice: options.voice, rate: Number(options.rate), outputs }, null, 2));
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
