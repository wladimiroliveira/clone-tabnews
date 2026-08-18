#!/usr/bin/env bash
set -euo pipefail

# Trust github.com up front, otherwise the first git push stops on an
# interactive host key confirmation prompt.
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
if ! ssh-keygen -F github.com >/dev/null 2>&1; then
  ssh-keyscan -t rsa,ecdsa,ed25519 github.com >>"$HOME/.ssh/known_hosts" 2>/dev/null
  chmod 600 "$HOME/.ssh/known_hosts"
fi

npm ci
