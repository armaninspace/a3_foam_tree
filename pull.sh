#!/usr/bin/env bash
set -euo pipefail

branch="$(git branch --show-current)"
if [[ -z "$branch" ]]; then
  echo "Not on a branch; checkout a branch before pulling." >&2
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Worktree has uncommitted changes. Commit or stash before pulling." >&2
  exit 1
fi

git fetch origin "$branch"
git pull --ff-only origin "$branch"
