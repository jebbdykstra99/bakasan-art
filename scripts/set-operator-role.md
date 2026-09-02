# Stamp the bakasan-art operator role

Project: **bakasan-art** only.

Operator Google account (do not invent another): **`jebb.dykstra@gmail.com`**. Same human as Jebb; dedicated operator use. CMO never gets the password. Sign-in is Jebb on the CoS computer when needed.

`isAdmin()` (full) stays Console-only. The operator is the same `admins/{uid}` collection with a distinct `role`.

## After the account exists in Auth

1. Sign in once as `jebb.dykstra@gmail.com` on bakasan.art (invite code required for Google).
2. Copy that user's Auth uid from the Firebase Console (Authentication).
3. Write the membership doc with the Admin SDK or Console. Client writes to `admins/{uid}` are denied.

```js
// local only — GOOGLE_APPLICATION_CREDENTIALS must point at bakasan-art
// Do not commit a key or a live uid.
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'bakasan-art' });
const uid = process.env.BAKASAN_OPERATOR_UID; // paste from Auth, do not commit
if (!uid) throw new Error('set BAKASAN_OPERATOR_UID');
admin.firestore().doc('admins/' + uid).set({ role: 'operator' }).then(() => {
  console.log('operator role set for', uid);
});
```

Full site admin (different uid) remains `{ role: 'admin' }` or a legacy doc with no `role`, created from the Console.

## Operator write scope

Allowed: replies on posts, likes, chat replies in threads that already include that uid.

Not allowed: legal pages, deploy, invite-code rotation, user-delete, admin-doc writes, top-level posts, new chat threads, follows, reposts, bookmarks, poll votes.
