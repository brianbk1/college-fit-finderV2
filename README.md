# searchcolleges.ai — blog index + sitemap update

Your sitemap listed three blog posts, but the deployed blog index only showed one.
These two files bring the index in sync and tidy the sitemap.

## Replace these two files

| File in this zip | Put it at (site root) | Action |
|---|---|---|
| `blog/index.html` | `/blog/index.html` | **Replace** |
| `sitemap.xml`     | `/sitemap.xml`      | **Replace** |

## What changed

**blog/index.html** — now lists all three posts, newest-first:
1. The September Senior Checklist: 58 Days to November 1  (Sep 4)
2. The College Search Is Changing: 3 Trends Families Should Watch This Fall  (existing card, unchanged)
3. Welcome to the Blog  (Aug 25)

**sitemap.xml** — kept every existing URL and date; two edits only:
- `/blog/index.html` `lastmod` bumped to 2026-09-09 (the index changed today).
- Added `/terms.html` — your nav and footer link to it, but it was missing from the sitemap.

## ⚠️ Confirm two blurbs
I only had the actual copy for the "3 Trends" post. For the other two I inferred the
title and one-line blurb from the filename + sitemap date (they're marked with
`<!-- TODO -->` comments in the HTML):
- **september-senior-checklist-58-days-to-november-1** — headline + blurb are a best guess.
- **welcome-to-the-blog** — same.

Open those two posts, and if the real headline or summary differs, paste it into the
matching card. Or send me the two HTML files and I'll drop in the exact copy. Also: the
first card's kicker reads "Admissions · Checklist" (no read-time) since I didn't know it —
add "· N min read" if you want it to match the other cards exactly.
