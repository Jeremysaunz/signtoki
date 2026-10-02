# SignToki · 사인토키

A Korean street-sign reading game for travelers, with English and Korean interfaces.

## Features

- 8 topics and 40 Korean expressions
- Five-question rounds: guess the meaning or match the reading
- Browser speech synthesis for Korean pronunciation
- Round review, next-topic play, and shareable set links
- Responsive fictional Seoul street illustration and a street guide

## Local preview

No dependencies or build step are required.

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173.

## Files

- `dist/index.html`: page structure and metadata
- `dist/style.css`: responsive styles
- `dist/app.js`: content, language switching, and game logic
- `dist/street.png`: original generated fictional street artwork
- `.openai/hosting.json`: Sites hosting configuration

Korean audio availability depends on the browser and installed voices. The guide uses authored explanations rather than dictionary API data. No accounts, uploads, location tracking, or live AI generation are required.
