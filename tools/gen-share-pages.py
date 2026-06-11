#!/usr/bin/env python3
"""Generate /p/<id>/index.html share stubs for every painting.

Social crawlers don't run JavaScript, so sharing bakasan.art/#green-tara
shows the generic site preview. These static stubs give each painting its
own og:title/og:image, then bounce real visitors to the SPA deep link.

Run from the repo root after adding paintings:  python3 tools/gen-share-pages.py
"""
import re, os, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://bakasan.art'

src = open(os.path.join(ROOT, 'data/paintings.js')).read()

entries = []
for block in re.finditer(r'\{\s*id:\s*\'([^\']+)\'.*?\}', src, re.S):
    body = block.group(0)
    def field(name):
        m = re.search(name + r":\s*'([^']*)'", body)
        return m.group(1) if m else ''
    pid = block.group(1)
    if not field('file'):
        continue  # template/commented entries
    entries.append({
        'id': pid,
        'title': field('captionTitle') or field('title') or pid,
        'year': field('year'),
        'medium': field('medium'),
        'file': field('file'),
    })

TPL = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title} — Bakasan</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{site}/#{pid}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="{site}/p/{pid}/">
  <meta property="og:title" content="{title} — Bakasan">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="{site}/images/{file}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title} — Bakasan">
  <meta name="twitter:image" content="{site}/images/{file}">
  <meta http-equiv="refresh" content="0; url={site}/#{pid}">
  <script>window.location.replace('{site}/#{pid}');</script>
</head>
<body>
  <p>Viewing <a href="{site}/#{pid}">{title}</a> at bakasan.art&hellip;</p>
</body>
</html>
'''

count = 0
for e in entries:
    desc_parts = [p for p in (e['year'], e['medium']) if p]
    desc = (' · '.join(desc_parts) + ' · ' if desc_parts else '') + \
           'From the collection of Donald "Bakasan" Peterman, a California Buddhist artist.'
    out_dir = os.path.join(ROOT, 'p', e['id'])
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, 'index.html'), 'w') as f:
        f.write(TPL.format(site=SITE, pid=e['id'], file=e['file'],
                           title=html.escape(e['title']), desc=html.escape(desc)))
    count += 1

print(f'{count} share pages generated under p/')
