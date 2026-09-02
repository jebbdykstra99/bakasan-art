# Operator membership (bakasan-art)

Project: **bakasan-art** only.

Do not pin Jebb's Gmail uid (`qMyaEu886sYMoXjKGTZQpVWNMCU2`) as operator. That uid is full admin: `admins/{uid}` with `role: 'admin'` or a legacy doc with no `role`. Do not merge `{ role: 'operator' }` onto it.

Do not create a `subx.it` login. `jebb@subx.it` is the public contact address only. It is not a live Google mailbox yet and is not a sign-in.

Operator is a future dedicated Bakasan CMO Google account — not the Gmail admin, not `jebb@subx.it`. Wait until he creates that Google email and sends it. Then:

1. Have him sign in once (or look the user up in Firebase Auth) so the Auth uid exists. Do not invent a uid.
2. Create `admins/{newUid}` with `{ role: 'operator' }` from the Console or a local Admin SDK script.
3. Until that doc exists, zero operator docs is correct. Client writes to `admins/{uid}` are denied.

```js
// local only — GOOGLE_APPLICATION_CREDENTIALS must point at bakasan-art
// Do not commit a service-account key.
// Set NEW_OPERATOR_UID to the Auth uid after the CMO Google account exists.
const NEW_OPERATOR_UID = process.env.NEW_OPERATOR_UID;
if (!NEW_OPERATOR_UID) {
  throw new Error('set NEW_OPERATOR_UID to the Auth uid; do not invent one');
}
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'bakasan-art' });
admin.firestore().doc('admins/' + NEW_OPERATOR_UID)
  .set({ role: 'operator' }, { merge: true })
  .then(() => console.log('operator role field set'));
```

A full site admin stays `{ role: 'admin' }` or a legacy no-`role` doc, Console-only.

## Operator write scope

Allowed: replies on posts, likes, chat replies in threads that already include that uid.

Not allowed: legal pages, deploy, invite-code rotation, user-delete, admin-doc writes, top-level posts, new chat threads, follows, reposts, bookmarks, poll votes.
