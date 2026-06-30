# CODEX.md — Islamic Fiqh Publishing QC Instructions

Codex is expected to act primarily as a quality-control and code-review agent for this repository.

Before reviewing, editing, or approving any change, Codex must read:

1. `CLAUDE.md` — authoritative editorial and technical charter
2. `AGENTS.md` — universal AI agent handoff
3. Any task-specific handoff or roadmap document referenced by One or by the changed files

`CLAUDE.md` remains the single source of truth. This file does not replace or weaken it.

## QC priority order

1. Safety and child-safety override
2. Secret handling, privacy, and repository security
3. Preservation of Arabic source text and editorial fidelity
4. Compliance with Thai/Arabic transliteration and house style
5. Citation, bibliography, locator, and primary-source standards
6. HTML structure, semantic markup, and typography rules
7. Data integrity for JSON, generated indexes, article metadata, and gated corpus files
8. Auth, session, payment, webhook, and entitlement correctness
9. Accessibility, performance, and non-regression checks

## Codex must block or request changes when

- A change violates `CLAUDE.md`
- Arabic text, ayah, hadith, isnad, citation, or translation is altered without verification or approval
- Secrets, tokens, private keys, API keys, webhook secrets, or sensitive identifiers are exposed
- Auth/session/payment changes weaken security
- Protected/gated data becomes public unintentionally
- A generated artifact is edited manually when the project expects generation from source/script
- HTML or JSON validity is broken
- Public pages, article routing, search indexes, or Cloudflare Pages Functions regress

## Codex should avoid false positives for

- Byte-exact Arabic orthography inherited from source texts
- Intentional unvowelled `ar-quote` blocks where permitted by `CLAUDE.md`
- Generated fields that should be changed only through their generator scripts
- Existing house-style decisions recorded in `CLAUDE.md`, `AGENTS.md`, golden-master docs, or task handoff files

## Review style

Codex reviews should be concrete and actionable:

- cite the exact file and line when possible
- explain which rule is affected
- distinguish blocker issues from suggestions
- avoid rewriting the author's prose unless asked
- avoid broad refactors unrelated to the task

## Auth/payment migration note

For work involving Clerk removal, Google/Apple login, passkeys, Stripe, D1 sessions, or entitlement gates, Codex must verify that:

- no `CLERK_*` dependency remains after final migration
- old subscription entitlements remain mapped to the correct internal user
- session cookies are secure, httpOnly, sameSite, and not logged
- OAuth state/nonce and WebAuthn challenges are validated
- Stripe metadata uses the correct internal user identifier going forward
- gated Time Machine and Ijazah APIs stay locked for unauthorized users

## Final approval expectation

Codex should approve only when the change is compliant with `CLAUDE.md`, does not weaken repository security, and does not silently alter editorial content or gated access behavior.
