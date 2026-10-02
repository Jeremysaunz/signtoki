# SignToki · 사인토키

A Korean street-sign reading game for travelers, with 10 language interfaces.

## Features

- 8 topics and 40 Korean expressions
- Five-question rounds: guess the meaning or match the reading
- Browser speech synthesis for Korean pronunciation
- Round review, next-topic play, and shareable set links
- Responsive fictional Seoul street illustration and a street guide
- Six practical travel guides in all 10 languages, with standalone readable pages
- Place comparisons, contextual examples, audio word collections, and links into related five-question rounds

## Local preview

No package dependencies are required. The committed `dist` directory is ready to serve. After changing guide content, regenerate its static pages:

```sh
node scripts/build-guides.cjs
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173.

## Files

- `dist/index.html`: page structure and metadata
- `dist/style.css` and `dist/redesign.css`: responsive styles
- `dist/app.js`: content, language switching, and game logic
- `dist/i18n.js`: localized interface strings, meanings, and explanations
- `dist/scene-atlas.webp`: 24 fictional illustrated places used as visual clues for all 40 expressions
- `content/guides.json` and `content/guide-*.json`: authored explanations and translations
- `scripts/build-guides.cjs`: generate all 60 article pages and 10 guide indexes
- `dist/guide-data.js`: guide summaries used by the game
- `dist/guides/<locale>/`: standalone pages; full article text is present without JavaScript
- `.openai/hosting.json`: Sites hosting configuration

Korean audio availability depends on the browser and installed voices. The guide uses authored explanations rather than dictionary API data. No accounts, uploads, location tracking, or live AI generation are required.

## Languages

Simplified Chinese, Japanese, Traditional Chinese, English, Filipino, Vietnamese, Indonesian, Thai, Hindi, and Korean. Browser language detection, saved preferences, and language-aware set links are supported.

See [language priorities and sources](docs/language-priorities.md).

```sh
node tests/localization.cjs
node tests/guides.cjs
```

## Visual hints

Every question displays its Hangul sign inside a matching illustrated setting. The 24-scene atlas includes a pharmacy, convenience store, café, bakery, restaurant, transport stops, shops, everyday services, and visitor destinations. Related expressions share a setting. Korean signs are rendered as live text, not baked into the artwork.

## Guide editorial scope

The six guides cover pharmacy versus clinic, convenience stores versus markets, café menu context, restaurant categories, transport directions, and small business notices. Explanations and fictional sign examples are original learning content. Further-reading links point to the National Institute of Korean Language and Korea Tourism Organization; no dictionary definitions or travel articles are reproduced. Romanization is a learning aid, not phonetic transcription. The guides do not infer a business's current hours, prices, services, ingredients, or eligibility from its sign. Pharmacy content teaches place names, not treatment choices.

Translations are authored drafts and have not been independently reviewed by native-speaking editors. The automated checks verify completeness and behavior, not linguistic certification.

Open `/guides/en/index.html` or `/guides/ko/index.html`. A guide keeps its article when the reader changes language. Practice links use `?lang=<locale>&set=<topic>&play=1` to start the related game; feedback links take readers back to a matching guide. Existing game and set-share links remain supported.
