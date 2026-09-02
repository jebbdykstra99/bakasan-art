# bakasan.art

Static GitHub Pages site for the Bakasan collection (`jebbdykstra99/bakasan-art`). Firebase project: **bakasan-art** only.

Local serve: `python3 -m http.server 8000` from the repo root.

Signed-out visitors without a hash land on `#collection`. `#home` is still the public social feed (it loads real posts after the spinner). The feed is not removed; it is just not the default landing.

## Remaining manual steps (after this PR merges)

These cannot be finished in the client repo:

1. **Wipe legacy `email` fields on `users/{uid}`.** Public profile docs were historically written with email. Firestore cannot hide a single field, so existing values stay readable until deleted. Use the Firebase Console or the one-off note in `scripts/wipe-user-emails.md`. Do not commit service-account keys.
2. **Enable App Check enforcement** in the Firebase Console for project `bakasan-art` (reCAPTCHA v3 is already wired in monitoring mode). The client cannot turn enforcement on.
3. **Deploy `firestore.rules`** to project `bakasan-art` after merge (GitHub Pages does not publish rules). Conversations, messages, and admins stay auth-gated; profile read stays public because chat search needs `displayName`.
4. **Collector-name PII** on painting essays or other editorial pages is out of scope for this PR. The biography “Selected Private & Public Collections” identity list has been removed.

Contact for the public site is `jebb@subx.it`.
