# One-off: delete leftover public-profile PII on bakasan-art

Project: **bakasan-art** only. Do not run this against any other Firebase project.

`users/{uid}` is public-read. Firestore cannot hide a single field. The client no longer writes `email`, `lastSeen`, or `location` on that document. Existing documents may still have those fields until an admin deletes them.

Do not put service-account keys or live invite codes in this repository.

## Firebase Console (no script)

1. Open [Firestore](https://console.firebase.google.com/project/bakasan-art/firestore) for `bakasan-art`.
2. Open the `users` collection.
3. For each document, delete `email`, `lastSeen`, and `location` if present.

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
    batch.update(doc.ref, {
      email: admin.firestore.FieldValue.delete(),
      lastSeen: admin.firestore.FieldValue.delete(),
      location: admin.firestore.FieldValue.delete()
    });
  });
  await batch.commit();
  console.log('Stripped email/lastSeen/location from', snap.size, 'user docs');
})();
```

Confirm `projectId` is `bakasan-art` before running.
