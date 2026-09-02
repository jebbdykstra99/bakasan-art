# bakasan.art

Static GitHub Pages site for the Bakasan collection (`jebbdykstra99/bakasan-art`). Firebase project: **bakasan-art** only.

Local serve: `python3 -m http.server 8000` from the repo root.

Signed-out visitors without a hash land on `#collection`. `#home` is still the public social feed (it loads real posts after the spinner). The feed is not removed; it is just not the default landing.

Account creation (email register or Google) requires an invite code stored in Firestore `config/invite`. Existing signed-in users stay signed in. Strangers can still view the collection unsigned.

## Remaining manual steps (after this PR merges)

These cannot be finished in the client repo:

1. **Set the invite code** in Firestore for project `bakasan-art`: create `config/invite` with a string field `code`. Do not commit a live code. Rotate it in the Console. `allow get: if true` / `allow list: if false` / writes admin-only — security is obscurity + rotation. Email sign-in for existing accounts does not need the code. Register and both Google buttons do (Google can create an account). Existing signed-in sessions stay signed in.
2. **Deploy `firestore.rules` and `storage.rules`** to project `bakasan-art` (`firebase deploy --only firestore:rules,storage` using `firebase.json`). GitHub Pages does not publish rules.
3. **Wipe leftover public-profile PII** on `users/{uid}`: delete `email`, `lastSeen`, and `location` if present. Firestore cannot hide a field on a public-read document. See `scripts/wipe-public-pii.md`. Do not commit service-account keys.
4. **HSTS leftover.** GitHub Pages does not send `Strict-Transport-Security` (verified on `https://bakasan.art`). Do not fake it with a meta tag. HSTS requires Cloudflare (or moving off Pages).
5. **Enable App Check enforcement** in the Firebase Console for project `bakasan-art` (reCAPTCHA v3 is already wired in monitoring mode). The client cannot turn enforcement on.

Contact for the public site is `jebb@subx.it`.
