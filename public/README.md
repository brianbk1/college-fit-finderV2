# College Fit Finder — new post: "Seven Questions to Find Your College Fit"

Built into the CURRENT files you sent; nothing overwritten. I added one card to the
blog index and one <url> to the sitemap.

## Where each file goes (relative to your project's public/ root)

| File in this zip | Put it at | Action |
|---|---|---|
| `blog/seven-questions-to-find-your-college-fit.html` | `public/blog/…same name.html` | **Add** (new file) |
| `blog/seven-questions-hero.jpg` | `public/blog/seven-questions-hero.jpg` | **Add** (hero image) |
| `blog/index.html` | `public/blog/index.html` | **Replace** (adds one card at top) |
| `sitemap.xml` | `public/sitemap.xml` | **Replace** (adds post URL; bumps blog-index lastmod) |
| `seven-questions-instagram.png` | *(not for the site)* | Your Instagram graphic — post separately |

## What changed
- **Post page:** built in your exact CFF blog chrome (navy `#1E3A5F` / gold `#B8860B`,
  Georgia body, `🎓 College Fit Finder` header, `← All posts` backlink, kicker, sources,
  CTA). The body is your docx text, unchanged; the seven questions are rendered as the
  `<h2>` headings and I added in-page `[1]`–`[4]` source anchors. Kicker set to
  "Campus Visits · 5 min read."
- **index.html:** one new `<article>` card at the top. It now leads, ahead of the FAFSA,
  September-checklist and 3-trends cards already there.
- **sitemap.xml:** added the post URL; bumped `/blog/index.html` lastmod to 2026-10-08.
- **Hero image:** your journal/compass illustration, optimized from a 3.5 MB PNG to a
  230 KB JPG (1200px wide). Caption kept: "Original AI-generated editorial illustration.
  No specific college or campus is depicted."

## Instagram graphic
`seven-questions-instagram.png` is the portrait social card from your docx — in the zip
root (NOT under blog/) because the site doesn't reference it. Per your docx note: post it
after the article is live and set the IG link to the published URL.

## Still your call: welcome-to-the-blog
Unrelated to this post, and I did NOT touch it: `welcome-to-the-blog.html` is still in
your sitemap but has no card on the blog index (reachable by Google, not linked for
humans). Tell me whether to (a) re-add its card, or (b) drop it from the sitemap, and
I'll fold that into the next update.
