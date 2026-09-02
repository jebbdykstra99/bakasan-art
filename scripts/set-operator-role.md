# Operator membership (bakasan-art)

Project: **bakasan-art** only.

Operator Google account (do not invent another, including any `subx.it` login): **`jebb.dykstra@gmail.com`**.

- Auth uid (already in `admins/`): `qMyaEu886sYMoXjKGTZQpVWNMCU2`
- Same human as Jebb; dedicated operator use
- CMO never gets the password
- Sign-in is Jebb on the CoS computer when needed
- `jebb@subx.it` is the public contact address only. It is not a live Google mailbox yet and is not a sign-in.

Rules treat this uid as operator even if the existing `admins/{uid}` doc has no `role` field (a missing role must not grant full `isAdmin()`). Optional: set `{ role: 'operator' }` on that doc so the document matches. Client writes to `admins/{uid}` are denied.

```js
// local only — GOOGLE_APPLICATION_CREDENTIALS must point at bakasan-art
// Do not commit a service-account key.
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'bakasan-art' });
admin.firestore().doc('admins/qMyaEu886sYMoXjKGTZQpVWNMCU2')
  .set({ role: 'operator' }, { merge: true })
  .then(() => console.log('operator role field set'));
```

A different uid used as full site admin stays `{ role: 'admin' }` or a legacy no-`role` doc, Console-only.

## Operator write scope

Allowed: replies on posts, likes, chat replies in threads that already include that uid.

Not allowed: legal pages, deploy, invite-code rotation, user-delete, admin-doc writes, top-level posts, new chat threads, follows, reposts, bookmarks, poll votes.
