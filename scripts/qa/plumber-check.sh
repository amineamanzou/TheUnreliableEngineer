#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$root"

PLUMBER_VERSION="${PLUMBER_VERSION:-v0.3.76}"
export PLUMBER_NO_UPDATE_CHECK="${PLUMBER_NO_UPDATE_CHECK:-1}"

if [[ -n "${PLUMBER_GITHUB_TOKEN:-}" ]]; then
  export GH_TOKEN="$PLUMBER_GITHUB_TOKEN"
elif [[ -n "${GH_TOKEN:-}" ]]; then
  export GH_TOKEN
elif [[ -n "${GITHUB_TOKEN:-}" ]]; then
  export GH_TOKEN="$GITHUB_TOKEN"
fi

if [[ -n "${GH_TOKEN:-}" && -z "${PLUMBER_METADATA_TOKEN:-}" ]]; then
  export PLUMBER_METADATA_TOKEN="$GH_TOKEN"
fi

install_plumber() {
  local os arch asset tmp_dir checksum_line

  os="$(uname -s | tr '[:upper:]' '[:lower:]')"
  arch="$(uname -m)"

  case "$os" in
    linux) os="linux" ;;
    darwin) os="darwin" ;;
    *) printf 'Unsupported OS for Plumber binary install: %s\n' "$os" >&2; return 1 ;;
  esac

  case "$arch" in
    x86_64 | amd64) arch="amd64" ;;
    arm64 | aarch64) arch="arm64" ;;
    *) printf 'Unsupported architecture for Plumber binary install: %s\n' "$arch" >&2; return 1 ;;
  esac

  asset="plumber-${os}-${arch}"
  tmp_dir="$(mktemp -d)"
  curl -fsSL "https://github.com/getplumber/plumber/releases/download/${PLUMBER_VERSION}/${asset}" -o "${tmp_dir}/plumber"
  curl -fsSL "https://github.com/getplumber/plumber/releases/download/${PLUMBER_VERSION}/checksums.txt" -o "${tmp_dir}/checksums.txt"

  checksum_line="$(grep "  ${asset}$" "${tmp_dir}/checksums.txt")"
  if [[ -z "$checksum_line" ]]; then
    printf 'Missing checksum for %s in Plumber %s\n' "$asset" "$PLUMBER_VERSION" >&2
    return 1
  fi

  printf '%s  %s\n' "${checksum_line%%  *}" "${tmp_dir}/plumber" > "${tmp_dir}/plumber.sha256"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum -c "${tmp_dir}/plumber.sha256"
  else
    shasum -a 256 -c "${tmp_dir}/plumber.sha256"
  fi

  chmod +x "${tmp_dir}/plumber"
  export PATH="${tmp_dir}:$PATH"
}

if ! command -v plumber >/dev/null 2>&1; then
  install_plumber
fi

plumber config validate
plumber analyze --config .plumber.yaml --threshold "${PLUMBER_THRESHOLD:-100}"
