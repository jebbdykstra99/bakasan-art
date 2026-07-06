# bakasan.art owner tools

## activity-monitor.js
Reports new sign-ups, comments, and chat activity since the last check.

### Setup
1. **Service-account key (required).** Firebase Console → Project settings →
   Service accounts → *Generate new private key*. Save as
   `tools/serviceAccountKey.json` (gitignored).
2. **Email (optional).** Copy `monitor-config.example.json` to
   `monitor-config.json` (gitignored) and add a [Resend](https://resend.com)
   API key. Without it, the digest still prints to stdout / the daily
   notification — email is just an extra channel.

### Usage
```
cd tools
node activity-monitor.js            # since last run (first run: 24h)
node activity-monitor.js --since 6h # custom window (m/h/d)
node activity-monitor.js --peek     # don't advance the watermark
node activity-monitor.js --json     # machine-readable
node activity-monitor.js --no-email # skip email this run
```

Chat reporting is **metadata only** — participant names + message counts,
never the message text.
