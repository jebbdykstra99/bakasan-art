# bakasan.art

Static GitHub Pages site for the Bakasan collection (`jebbdykstra99/bakasan-art`). Firebase project: **bakasan-art** only.

Local serve: `python3 -m http.server 8000` from the repo root.

Signed-out visitors without a hash land on `#collection`. `#home` is still the public social feed (it loads real posts after the spinner). The feed is not removed; it is just not the default landing.

Account creation (email register or Google) requires an invite code stored in Firestore `config/invite`. Existing signed-in users stay signed in. Strangers can still view the collection unsigned.

**Live-safe is still NO** until the eight items are closed in production (invite code set, rules deployed, leftover PII wiped). This PR does not make the site live-safe by itself.

## Operator vs site admin

One operator Google account — do not invent a `subx.it` login: **`jebb.dykstra@gmail.com`** / bakasan-art uid **`qMyaEu886sYMoXjKGTZQpVWNMCU2`** (already in `admins/`). Same human as Jebb; dedicated operator use. CMO never gets that password. Sign-in is Jebb on the CoS computer when needed.

`jebb@subx.it` is the public contact address only. It is not a live Google mailbox yet and is not a sign-in.

| Role | Firestore doc | May write |
| --- | --- | --- |
| Site admin (full) | `admins/{uid}` with `role: 'admin'` or a legacy doc with no `role` (not the operator uid) | Existing `isAdmin()` powers (moderation delete, invite rotation). Console-only membership. |
| Operator | `qMyaEu886sYMoXjKGTZQpVWNMCU2` (already in `admins/`; optional `{ role: 'operator' }`) | Replies on posts, likes, chat replies in existing threads. |

Rules pin that uid as operator even if the existing admin doc has no `role` — a missing role must not grant full admin. Operator **cannot**: edit legal pages, deploy, rotate the invite code, delete users or others' posts, write `admins/{uid}`, start new chats, publish top-level posts, follow, repost, bookmark, or vote in polls.

See `scripts/set-operator-role.md`. Do not commit a service-account key.

## Remaining manual steps (after this PR merges)

These cannot be finished in the client repo:

1. **Set the invite code** in Firestore for project `bakasan-art`: create `config/invite` with a string field `code`. Do not commit a live code. Rotate it in the Console (full admin only — not the operator). `allow get: if true` / `allow list: if false` / writes `isAdmin()` — security is obscurity + rotation. Email sign-in for existing accounts does not need the code. Register and both Google buttons do (Google can create an account). Existing signed-in sessions stay signed in.
2. **Optional operator role field.** `qMyaEu886sYMoXjKGTZQpVWNMCU2` is already in `admins/` and is treated as operator in rules. Optionally merge `{ role: 'operator' }` on that doc (`scripts/set-operator-role.md`). Full admin docs stay Console-only. Do not create a `subx.it` login.
3. **Deploy `firestore.rules` and `storage.rules`** to project `bakasan-art` (`firebase deploy --only firestore:rules,storage` using `firebase.json`). GitHub Pages does not publish rules.
4. **Wipe leftover public-profile PII** on `users/{uid}`: delete `email`, `lastSeen`, and `location` if present. Firestore cannot hide a field on a public-read document. See `scripts/wipe-public-pii.md`. Do not commit service-account keys.
5. **HSTS leftover.** GitHub Pages does not send `Strict-Transport-Security` (verified on `https://bakasan.art`). Do not fake it with a meta tag. HSTS requires Cloudflare (or moving off Pages).
6. **Enable App Check enforcement** in the Firebase Console for project `bakasan-art` (reCAPTCHA v3 is already wired in monitoring mode). The client cannot turn enforcement on.

Public contact for the site is `jebb@subx.it` (mailto only — not a live Google mailbox / not a login).
