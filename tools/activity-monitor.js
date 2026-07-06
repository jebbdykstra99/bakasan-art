#!/usr/bin/env node
/**
 * bakasan.art activity monitor
 * ----------------------------
 * Reports everything new since the last check:
 *   • Sign-ups   — from Firebase Auth account-creation times
 *   • Comments   — new posts + replies in the `posts` collection
 *   • Chats      — conversation activity (participants + message COUNTS only,
 *                  never message text — owner privacy line by default)
 *
 * Auth: a Firebase service-account key. Point to it with either
 *   - env GOOGLE_APPLICATION_CREDENTIALS=/abs/path/key.json, or
 *   - tools/serviceAccountKey.json  (gitignored; default location)
 *
 * A watermark of the last successful check is stored in
 *   tools/.activity-watermark.json  (gitignored)
 *
 * Usage:
 *   node tools/activity-monitor.js            # since last watermark (first run: 24h)
 *   node tools/activity-monitor.js --since 6h # override window (h/d/m suffixes)
 *   node tools/activity-monitor.js --peek     # don't advance the watermark
 *   node tools/activity-monitor.js --json     # machine-readable output
 */

'use strict';
const fs   = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const HERE = __dirname;
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS
  || path.join(HERE, 'serviceAccountKey.json');
const WATERMARK = path.join(HERE, '.activity-watermark.json');

// ── args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const has  = f => args.includes(f);
const val  = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const PEEK = has('--peek');
const JSON_OUT = has('--json');

function parseDuration(s) {
  const m = /^(\d+)\s*([mhd])$/.exec((s || '').trim());
  if (!m) return null;
  const n = +m[1], unit = m[2];
  return n * (unit === 'm' ? 60e3 : unit === 'h' ? 3600e3 : 86400e3);
}

// ── init ──────────────────────────────────────────────────────────────
if (!fs.existsSync(KEY_PATH)) {
  console.error(`\n✗ Service-account key not found.\n  Expected at: ${KEY_PATH}\n` +
    `  Generate one: Firebase Console → Project Settings → Service Accounts →\n` +
    `  "Generate new private key", then save it as tools/serviceAccountKey.json\n`);
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert(require(KEY_PATH)) });
const db = admin.firestore();

// ── watermark ─────────────────────────────────────────────────────────
function loadSince() {
  const override = parseDuration(val('--since'));
  if (override) return new Date(Date.now() - override);
  try {
    const w = JSON.parse(fs.readFileSync(WATERMARK, 'utf8'));
    if (w.lastCheck) return new Date(w.lastCheck);
  } catch (_) {}
  return new Date(Date.now() - 86400e3); // first run: last 24h
}
function saveWatermark(when) {
  if (PEEK) return;
  fs.writeFileSync(WATERMARK, JSON.stringify({ lastCheck: when.toISOString() }, null, 2));
}

const fmt = d => new Date(d).toLocaleString('en-US',
  { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const clip = (s, n = 90) => { s = (s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s; };

// ── collectors ────────────────────────────────────────────────────────
async function newSignups(since) {
  const out = [];
  let token;
  do {
    const page = await admin.auth().listUsers(1000, token);
    for (const u of page.users) {
      const created = new Date(u.metadata.creationTime);
      if (created > since) {
        out.push({ name: u.displayName || u.email || u.uid, email: u.email || '(no email)',
          provider: (u.providerData[0] || {}).providerId || 'password', at: created.toISOString() });
      }
    }
    token = page.pageToken;
  } while (token);
  return out.sort((a, b) => a.at.localeCompare(b.at));
}

async function newPosts(since) {
  const snap = await db.collection('posts')
    .where('createdAt', '>', admin.firestore.Timestamp.fromDate(since))
    .orderBy('createdAt', 'asc').get();
  const posts = [], comments = [];
  snap.forEach(d => {
    const p = d.data();
    const row = { id: d.id, author: p.authorName || 'Member', text: clip(p.text),
      hasImage: !!p.imageUrl, hasPoll: !!p.poll,
      at: (p.createdAt && p.createdAt.toDate ? p.createdAt.toDate() : new Date()).toISOString() };
    (p.parentId ? comments : posts).push(row);
  });
  return { posts, comments };
}

async function chatActivity(since) {
  const sinceTs = admin.firestore.Timestamp.fromDate(since);
  const snap = await db.collection('conversations')
    .where('lastMessageAt', '>', sinceTs).orderBy('lastMessageAt', 'asc').get();
  const rows = [];
  for (const d of snap.docs) {
    const c = d.data();
    const names = Object.values(c.participantNames || {});
    // Count new messages (metadata only — no text is read into the report)
    let count = 0;
    try {
      const msgs = await d.ref.collection('messages')
        .where('createdAt', '>', sinceTs).get();
      count = msgs.size;
    } catch (_) { count = null; }
    rows.push({ between: names.length ? names.join(' ↔ ') : d.id, messages: count,
      at: (c.lastMessageAt && c.lastMessageAt.toDate ? c.lastMessageAt.toDate() : new Date()).toISOString() });
  }
  return rows;
}

// ── run ───────────────────────────────────────────────────────────────
(async () => {
  const since = loadSince();
  const now = new Date();
  const [signups, { posts, comments }, chats] = await Promise.all([
    newSignups(since), newPosts(since), chatActivity(since),
  ]);
  const chatMsgTotal = chats.reduce((s, c) => s + (c.messages || 0), 0);

  const summary = {
    window: { since: since.toISOString(), until: now.toISOString() },
    counts: { signups: signups.length, posts: posts.length,
      comments: comments.length, chatConversations: chats.length, chatMessages: chatMsgTotal },
    signups, posts, comments, chats,
  };

  if (JSON_OUT) { console.log(JSON.stringify(summary, null, 2)); saveWatermark(now); return; }

  const L = [];
  L.push(`bakasan.art — activity since ${fmt(since)} (PT)`);
  L.push(`Sign-ups: ${signups.length}   Posts: ${posts.length}   Comments: ${comments.length}   ` +
         `Chats: ${chats.length} conv / ${chatMsgTotal} msgs`);
  const total = signups.length + posts.length + comments.length + chats.length;
  if (total === 0) L.push('\nNothing new. 🪷');

  if (signups.length) {
    L.push('\n── New sign-ups ──');
    signups.forEach(s => L.push(`  • ${s.name} <${s.email}> via ${s.provider} — ${fmt(s.at)}`));
  }
  if (posts.length) {
    L.push('\n── New posts ──');
    posts.forEach(p => L.push(`  • ${p.author}: "${p.text}"${p.hasImage ? ' [photo]' : ''}${p.hasPoll ? ' [poll]' : ''} — ${fmt(p.at)}`));
  }
  if (comments.length) {
    L.push('\n── New comments ──');
    comments.forEach(c => L.push(`  • ${c.author}: "${c.text}" — ${fmt(c.at)}`));
  }
  if (chats.length) {
    L.push('\n── Chat activity (counts only) ──');
    chats.forEach(c => L.push(`  • ${c.between} — ${c.messages == null ? '?' : c.messages} message${c.messages === 1 ? '' : 's'}`));
  }
  console.log(L.join('\n'));
  saveWatermark(now);
})().catch(err => { console.error('activity-monitor error:', err.message); process.exit(1); });
