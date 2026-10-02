# Search and AI discovery

## Current site implementation

- The homepage and all 100 guide/information URLs have stable canonical pages in the 101-URL sitemap.
- Every localized guide and information page declares an absolute canonical URL, reciprocal language alternates, and an English `x-default` alternate.
- Static pages include unique titles and descriptions, social sharing metadata, and JSON-LD that describes the visible article, guide collection, or information page.
- The homepage contains a small static English sign-reading guide and direct links to four practical lessons, so its central subject remains available before JavaScript runs.
- `robots.txt` allows public search and answer-engine crawling. `OAI-SearchBot` is for ChatGPT Search discovery; `GPTBot` is a separate model-training choice. `Google-Extended` controls Gemini-related training and grounding and does not affect ordinary Google Search ranking.
- A branded 1200 × 630 preview image is available at `/og-image.png`.

## Search Console follow-through

For Google Search generative AI features, open the verified `signtoki.com` property in Search Console, then go to **Settings → Search generative AI** and select **Include my site's links and content in Search generative AI features**. Google says a site must be included there to be eligible for its generative AI features. Check the Search performance reports later for impressions and pages; eligibility does not guarantee inclusion.

The submitted sitemap is `https://signtoki.com/sitemap.xml`. After deployment, use URL Inspection on the homepage and a guide page to request indexing if needed. Search Console decides whether and when to index URLs.

## Limits and next content work

Metadata and crawler access remove technical obstacles; they do not buy rankings or citations. The best next gain is editorial: publish new, carefully reviewed answers to real visitor questions, with examples from SignToki's fictional signs, clear Korean spellings and pronunciation, and references to authoritative sources where useful. Avoid producing near-duplicate pages for keyword variations. The current translations are drafts and need native-speaker review before being treated as fully reliable language editions.

Google says there is no special GEO schema, `llms.txt`, or text-chunking requirement for its AI Search features. OpenAI says `OAI-SearchBot`, rather than `GPTBot`, controls appearance in ChatGPT Search. Allowing `GPTBot` permits possible model-training use; this is separate from citations. Neither crawler setting guarantees traffic.

## Official guidance

- [Google: Optimize for generative AI features in Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google: Search generative AI control in Search Console](https://support.google.com/webmasters/answer/16908024?hl=en)
- [Google: Google-Extended crawler](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
- [OpenAI: Overview of OpenAI crawlers](https://developers.openai.com/api/docs/bots)
