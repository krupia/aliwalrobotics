# News section: how it works and how to update it

The pages under `/news/` and the "Latest news" block on the home page are generated.
Edit the article files here, then rebuild. Don't hand-edit `news/**/index.html`.

```
tools/news/articles/<slug>.html   one file per article: JSON meta header + body HTML
tools/news/build.py               builds news/index.html, news/<slug>/index.html, home block
```

Rebuild from the repo root:

```
python3 tools/news/build.py
```

## Topics

| key | shown as |
|---|---|
| `tariffs` | Tariffs & import rules |
| `us-facilities` | US robotics facilities |

Add a topic in `TOPICS` in `build.py` before using it in an article.

## Article file format

```html
<!--meta
{
  "slug": "same-as-file-name",
  "title": "Headline in sentence case",
  "short": "Short title for the browser tab",
  "dek": "Two-sentence summary shown under the title and in lists.",
  "date": "2026-10-28",             // date of the development (sorts the lists)
  "kicker": "Section 232",          // small label in lists
  "topic": "tariffs",
  "published": "2026-10-29",
  "updated": "2026-11-05",          // optional: set when facts change
  "update_note": "optional one line shown at the top of the article",
  "keydates": [["28 Oct 2026", "What happened"]],
  "sources": [["Publisher: title (date)", "https://..."]]
}
-->
<h2>What happened</h2>
<p>...</p>
```

Body HTML can use `<h2>`, `<p>`, `<ul>`, `<div class="table-wrap"><table>…</table></div>` and `<div class="callout"><p>…</p></div>`.

## Editorial rules (also for the weekly scheduled update)

- Scope: US tariffs, import bans, export controls and customs rules that affect **robotics components** and **data-collection devices** (headsets, cameras, sensors, gloves, drones' shared parts); and new or expanding **robotics/component facilities in the US**.
- Every factual claim needs a source in `sources`. Prefer primary sources (Federal Register, USTR, CBP, White House, company press releases), then law-firm or major trade-press analysis. Don't publish a claim that only one low-quality source supports.
- Give dates and numbers exactly as sources state them. If sources conflict, say so or leave it out.
- When a development changes an existing article (a deadline passes, an exclusion is extended, a rate changes), update that article, set `updated`, and add an `update_note`. Don't leave stale deadlines unflagged.
- Plain, direct sentences. No hype, no predictions presented as fact. Company plans are "plans" or "targets".
- Never remove the disclaimer (the builder adds it automatically).
- Keep the site's scope: Aliwal Robotics sources components and data-collection devices, not complete robots.
