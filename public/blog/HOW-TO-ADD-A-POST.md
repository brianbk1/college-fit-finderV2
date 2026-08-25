# How to publish a new blog post (~5 minutes/week)

Your blog lives in `public/blog/`. Each post is a standalone HTML file, and
the blog landing page (`index.html`) builds its list automatically from a
small list at the bottom of that file. Here's the weekly routine.

## The 4 steps

### 1. Create the post file
Copy `_TEMPLATE.html` to a new file named after your post, using
lowercase-dashes:

```
public/blog/2026-09-01-early-decision-explained.html
```

The part before `.html` is the post's **slug** — you'll need it in step 2.

### 2. Fill in the post
Open your new file and replace the 6 spots marked `⟨REPLACE⟩`:
- the `<title>` (shows in the browser tab and Google)
- the meta `description` (the gray text under the link in Google)
- the `canonical` and two `og:url` links (paste your slug)
- the kicker line (category · read time)
- the `<h1>` headline
- the article body between the `ARTICLE BODY START/END` comments

Then delete the big instructions comment at the very top.

### 3. Add it to the blog list
Open `public/blog/index.html`, find the `POSTS` list near the bottom, and
paste a new entry at the top (copy the sample that's already there):

```js
{
  slug: "2026-09-01-early-decision-explained",
  title: "Early Decision, Explained",
  date: "2026-09-01",
  category: "Admissions",
  readMins: 5,
  excerpt: "What binding early decision really commits you to — and when it helps."
},
```

Posts sort newest-first by `date` automatically, so order in the list
doesn't matter.

### 4. Add it to the sitemap (good for Google)
Open `public/sitemap.xml` and copy an existing `<url>` block, swapping in
your new post's URL and today's date. Also bump the `<lastmod>` on the
`/blog/index.html` entry to today.

### 5. Deploy
Commit and push (or run your normal `npm run build` + deploy). Done.

## Tips
- **Images:** drop an image in `public/blog/` and reference it with
  `<img src="/blog/my-image.jpg" alt="describe it" style="max-width:100%;border-radius:8px;margin:20px 0">`.
- **Highlight box:** wrap a key takeaway in `<div class="tip">…</div>`.
- **Don't rename a slug after publishing** — it changes the URL and breaks
  any links Google has already indexed. If you must, set up a redirect.
- `_TEMPLATE.html` starts with `_` so it's easy to spot and won't be mistaken
  for a real post. Leave it in place; you'll copy it every week.
