# One-off: delete `email` from bakasan-art `users` docs

Project: **bakasan-art** only. Do not run this against any other Firebase project.

The site no longer writes `email` to `users/{uid}`. Existing documents still have the field until an admin deletes it. Firestore rules cannot hide one field on an otherwise public-read document.

## Firebase Console (no script)

1. Open [Firestore](https://console.firebase.google.com/project/bakasan-art/firestore) for `bakasan-art`.
2. Open the `users` collection.
3. For each document, delete the `email` field.

## Optional Admin SDK (local machine, not in this repo)

Use a local service-account JSON that is **not** committed. Example:

```js
// local only — GOOGLE_APPLICATION_CREDENTIALS must point at bakasan-art
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'bakasan-art' });
const db = admin.firestore();

(async () => {
  const snap = await db.collection('users').get();
  const batch = db.batch();
  snap.docs.forEach((doc) => {
    if (doc.get('email') !== undefined) {
      batch.update(doc.ref, { email: admin.firestore.FieldValue.delete() });
    }
  });
  await batch.commit();
  console.log('Removed email from', snap.size, 'user docs (no-op if already gone)');
})();
```

Confirm `projectId` is `bakasan-art` before running. Do not put a key in this repository.
