#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Sync latest changes from main (e.g. updates pushed by Antigravity)
cd "$CLAUDE_PROJECT_DIR"
git fetch origin main
git merge --ff-only origin/main || echo "Note: fast-forward merge not possible, manual sync may be needed"
