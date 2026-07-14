# searchcolleges.ai — "Low Value Content" Fix (July 2026)

## Why it got flagged again
Googlebot **renders JavaScript**. Your MutationObserver hides the static editorial
content as soon as JS runs — so Google's reviewer sees the app-only view, which
looks thin. On top of that, the site is a single URL with no privacy policy,
about page, or separate article pages. AdSense's own program policies require a
privacy policy that discloses ad cookies; its absence alone can sustain a
"low value content" flag.

## Step 1 — Copy the new files into your project's public/ folder

Run these in the VS Code terminal (PowerShell). Edit $src if you downloaded
the files somewhere other than Downloads:

```powershell
# --- Paths ---
$src = "$env:USERPROFILE\Downloads\searchcolleges-fix"
$proj = "C:\Users\brian\Documents\Github\college-fit-finder-react"

# --- Copy files into public/ ---
copy "$src\privacy.html" "$proj\public\"
copy "$src\about.html" "$proj\public\"
copy "$src\contact.html" "$proj\public\"
copy "$src\sitemap.xml" "$proj\public\"
copy "$src\robots.txt" "$proj\public\"

# --- Guides subfolder ---
mkdir "$proj\public\guides" -Force
copy "$src\guides\index.html" "$proj\public\guides\"
copy "$src\guides\college-application-timeline.html" "$proj\public\guides\"
copy "$src\guides\financial-aid-explained.html" "$proj\public\guides\"
copy "$src\guides\campus-visit-guide.html" "$proj\public\guides\"

# --- Verify everything landed ---
dir "$proj\public\"
dir "$proj\public\guides\"
```

Then commit and deploy:

```powershell
cd $proj
git add public/
git commit -m "Add privacy, about, contact, guides pages + sitemap for AdSense fix"
git push
```

Note: if you already have a robots.txt in public/, just add this line to it
instead of overwriting:
```
Sitemap: https://www.searchcolleges.ai/sitemap.xml
```

## Step 2 — CRITICAL: stop hiding the static content from rendered pages

In `public/index.html`, find the MutationObserver script that hides the static
editorial section when React mounts, and DELETE it entirely.

Instead, make the static content sit BELOW the app for everyone. Wrap your
existing static section like this (if it isn't already wrapped):

```html
<div id="static-content">
  <!-- existing editorial articles + landing content stay here unchanged -->
</div>
```

And add this CSS in the <head> so it reads as a normal content section under
the tool rather than competing with it:

```html
<style>
  #static-content { max-width: 860px; margin: 0 auto; padding: 48px 24px;
    border-top: 1px solid #E3E0D8; }
</style>
```

Real users scrolling past the app will just see helpful articles — which is
exactly what Google wants to see too. Identical content for users and crawlers
removes any cloaking risk and means the rendered page Google reviews is no
longer thin.

Also remove the duplicated block: the fetched page currently shows the
"College Fit Finder / What Is College Fit Finder" landing content appearing
twice. Keep one copy.

## Step 3 — Add footer links inside the React app

AdSense reviewers look at the rendered app view for privacy/about/contact
links. Add a small footer at the bottom of App.js (plain <a> tags are correct
here — these are static pages outside the React router):

```jsx
<footer style={{
  marginTop: 48, padding: '24px 16px', borderTop: '1px solid #E3E0D8',
  textAlign: 'center', fontSize: 13, color: '#5C6B7A'
}}>
  <a href="/guides/index.html" style={{ color: '#1E3A5F', margin: '0 10px' }}>College Guides</a>
  <a href="/about.html" style={{ color: '#1E3A5F', margin: '0 10px' }}>About</a>
  <a href="/contact.html" style={{ color: '#1E3A5F', margin: '0 10px' }}>Contact</a>
  <a href="/privacy.html" style={{ color: '#1E3A5F', margin: '0 10px' }}>Privacy Policy</a>
  <div style={{ marginTop: 8 }}>© 2026 College Fit Finder · searchcolleges.ai</div>
</footer>
```

## Step 4 — Email address

The contact page lists contact@searchcolleges.ai. Set up forwarding for that
address (Vercel domains → your registrar's email forwarding, or ImprovMX free
tier works fine), or tell me the address you'd rather use and I'll update the
page.

## Step 5 — Deploy and verify

1. Commit + push (GitHub Desktop), let Vercel deploy.
2. Verify each URL loads: /privacy.html, /about.html, /contact.html,
   /guides/index.html, /sitemap.xml, /robots.txt
3. In Google Search Console, submit sitemap.xml (add the property if you
   haven't — it also speeds up AdSense re-review indirectly).
4. In AdSense → Sites → searchcolleges.ai → **Request review**.

Reviews typically take a few days to a couple of weeks. The combination of
(a) content visible in the rendered page, (b) a privacy policy, and
(c) real multi-page structure with internal links addresses all three of the
usual "low value content" causes at once.
