#!/usr/bin/env python3
"""
scripts/check_source_immutable.py — Source immutability guard (R60/R88).

Once an arabicExcerpt is committed for a given account id, it must never
be modified.  This script compares the current working-tree state against
origin/main and reports any account where arabicExcerpt changed.

Rules:
  - NEW accounts (id absent in origin/main) are exempt — adding is allowed.
  - CHANGED arabicExcerpt for an existing account → ERROR (printed, not blocking).
  - If any commit message in the branch diff contains "[source-edit]" → skip
    entirely (owner has explicitly approved the change).

This script is INFORMATIONAL only: exit code is always 0.
Violations are printed so the gate-agent (R87) can FLAG them.

Usage:
  python3 scripts/check_source_immutable.py
  python3 scripts/check_source_immutable.py --base origin/main
"""
import argparse
import json
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def git(*args, check=True) -> str:
    result = subprocess.run(
        ['git', '-C', str(REPO_ROOT)] + list(args),
        capture_output=True, text=True, check=False
    )
    if check and result.returncode != 0:
        print(f'git error: {result.stderr.strip()}', file=sys.stderr)
        sys.exit(1)
    return result.stdout


def has_source_edit_tag(base: str) -> bool:
    """Check if any commit message in HEAD..base contains [source-edit]."""
    log = git('log', f'{base}...HEAD', '--format=%s %b')
    return '[source-edit]' in log


def load_shard_accounts(json_text: str) -> dict:
    """Return {account_composite_id: arabicExcerpt} from shard JSON text."""
    try:
        data = json.loads(json_text)
    except (json.JSONDecodeError, ValueError):
        return {}
    accounts = {}
    for event in data.get('events', []):
        eid = event.get('id', '')
        for ai, account in enumerate(event.get('accounts', [])):
            source = account.get('source', f'?{ai}')
            key = f'{eid}::{ai}'
            accounts[key] = account.get('arabicExcerpt', '')
    return accounts


def main():
    ap = argparse.ArgumentParser(description='Source immutability guard (R60/R88).')
    ap.add_argument('--base', default='origin/main',
                    help='Base ref to compare against (default: origin/main)')
    a = ap.parse_args()

    # Check for [source-edit] override in commit messages
    if has_source_edit_tag(a.base):
        print(f'[SKIP] [source-edit] tag found in branch commits — immutability check waived.')
        sys.exit(0)

    # Get list of changed shard files
    diff_output = git('diff', '--name-only', f'{a.base}...HEAD', '--', '*.json')
    changed_files = [f.strip() for f in diff_output.splitlines() if f.strip()]
    shard_files = [f for f in changed_files if Path(f).name.startswith('bidayah-h')]

    if not shard_files:
        print('[OK] No bidayah shard files changed.')
        sys.exit(0)

    print(f'Checking {len(shard_files)} changed shard(s) for arabicExcerpt immutability ...')
    violations = []

    for rel_path in shard_files:
        # Read base version
        base_text = git('show', f'{a.base}:{rel_path}', check=False)
        base_accounts = load_shard_accounts(base_text) if base_text else {}

        # Read HEAD version
        head_path = REPO_ROOT / rel_path
        if not head_path.exists():
            continue
        head_text = head_path.read_text(encoding='utf-8')
        head_accounts = load_shard_accounts(head_text)

        for key, head_excerpt in head_accounts.items():
            if key not in base_accounts:
                # New account — exempt
                continue
            base_excerpt = base_accounts[key]
            if head_excerpt != base_excerpt:
                violations.append({
                    'file': rel_path,
                    'account': key,
                    'base_len': len(base_excerpt),
                    'head_len': len(head_excerpt),
                })

    if not violations:
        print('[OK] No arabicExcerpt mutations detected.')
        sys.exit(0)

    print()
    print(f'[ERROR] {len(violations)} arabicExcerpt mutation(s) detected (R60/R88):')
    for v in violations:
        print(f'  {v["file"]} :: account index {v["account"]}')
        print(f'    base length: {v["base_len"]}  →  head length: {v["head_len"]}')
        print(f'    Add [source-edit] to the commit message if this change is owner-approved.')
    print()
    print('BLOCKING: arabicExcerpt mutations are not allowed without [source-edit] tag (R60/R88).')
    sys.exit(1)


if __name__ == '__main__':
    main()
