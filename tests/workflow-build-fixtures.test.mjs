import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdtempSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {configurationHash} from '../scripts/qa/release-candidate.mjs';
const workflow=file=>JSON.parse(execFileSync('ruby',['-ryaml','-rjson','-e','puts JSON.generate(YAML.load_file(ARGV[0]))',`.github/workflows/${file}`],{encoding:'utf8'}));
test('every production-canonical Astro quality build pins the exact site and base',()=>{
  for(const file of ['build-staging.yml','ci.yml']) {
    const parsed=workflow(file);
    for(const job of Object.values(parsed.jobs))for(const step of job.steps??[])if(step.run?.includes('npm run build')) {
      const env={...parsed.env,...job.env,...step.env};
      assert.equal(env.SITE_URL,'https://theunreliable.engineer',`${file}: missing canonical site`);
      assert.equal(env.BASE_PATH,'/',`${file}: missing canonical base`);
    }
  }
});
test('every app Docker workflow caller supplies all required release arguments',()=>{
  const required=[...readFileSync('Dockerfile','utf8').matchAll(/^ARG ([A-Z_]+)$/gm)].map(match=>match[1]);
  let callers=0;
  for(const file of readdirSync('.github/workflows').filter(f=>f.endsWith('.yml')))for(const job of Object.values(workflow(file).jobs))for(const step of job.steps??[])if(step.uses?.startsWith('docker/build-push-action@')) {
    callers++;
    const supplied=new Map((step.with['build-args']??'').trim().split('\n').map(line=>[line.split('=')[0],line.slice(line.indexOf('=')+1)]));
    for(const arg of required)assert.ok(supplied.get(arg),`${file}: missing ${arg}`);
  }
  assert.equal(callers,2,'Inventory a new Docker caller explicitly');
});
test('dependency image fixture freezes valid metadata before building without publishing',()=>{
  const steps=workflow('dependency-image.yml').jobs.image.steps;
  const freeze=steps.findIndex(s=>s.name==='Freeze image fixture build identity');
  const build=steps.findIndex(s=>s.name==='Build the final site image');
  assert.ok(freeze>=0&&freeze<build);
  const dir=mkdtempSync(join(tmpdir(),'tue-image-env-')),out=join(dir,'env');
  try{
    execFileSync('bash',['-eu','-o','pipefail','-c',steps[freeze].run],{env:{...process.env,GITHUB_ENV:out}});
    const env=Object.fromEntries(readFileSync(out,'utf8').trim().split('\n').map(line=>[line.split('=')[0],line.slice(line.indexOf('=')+1)]));
    assert.match(env.TREE_SHA,/^[a-f0-9]{40}$/);assert.match(env.PUBLICATION_DATE,/^\d{4}-\d{2}-\d{2}$/);
    const configuration=JSON.parse(env.RELEASE_CONFIGURATION);
    assert.equal(configuration.siteUrl,'https://theunreliable.engineer');
    assert.equal(configuration.productAnalyticsEnabled,false);assert.equal(configuration.browserObservabilityEnabled,false);
    assert.match(configurationHash(configuration),/^[a-f0-9]{64}$/);
    assert.equal(steps[build].with.push,false);
  }finally{rmSync(dir,{recursive:true,force:true});}
});
