# Advertising preparation

Advertising is **disabled** in this release. No AdSense IDs have been supplied.
There are no Google advertising requests, auto ads, ads.txt claims or visible empty
ad boxes. Do not fabricate a publisher ID or publish a placeholder ads.txt.

## Prepared placement

Each full guide article has one hidden placement after the reading content,
questions, practice link, related guides and references. Its visible state has
160px margins above and below, separating it from interactive content.
The game, results, guide hubs and information pages have no placements or ad script.
Only a manual article placement is supported; do not enable site-wide Auto ads.

## Before enabling

1. Use the actual account's publisher and manual ad-unit IDs.
2. Integrate and verify a Google-certified CMP where required. The current event
   hook is a scaffold, **not a certified CMP**. The real adapter must handle
   regional requirements, consent decisions, withdrawal and Google consent
   signals correctly. It may dispatch `signtoki:ads-consent` with
   `detail: {allowed: true}` only after that work is complete. Do not dispatch
   it just because a banner was dismissed.
3. Review the actual data flows and update all ten privacy notices. Validate the
   integration in required regions and consent states before marking
   `consentIntegrationReady` and `privacyReviewComplete`.
4. Update `content/site-settings.json`, regenerate the static pages, and inspect
   desktop and mobile ad spacing with real creatives. The builder rejects enabled
   settings with missing IDs or readiness flags.
5. Add the exact ads.txt entry provided by the publisher account if requested.
   Public crawler access and account verification are separate launch steps.

Approval is Google's decision. There is no official article-count or word-count
threshold used by this project, and translations are not counted as new topics.

Official references:

- [Publisher policies](https://support.google.com/adsense/answer/10502938)
- [Ads and games](https://support.google.com/adsense/answer/2768340)
- [CMP requirements](https://support.google.com/adsense/answer/13554116)
- [Google partner-site data use](https://policies.google.com/technologies/partner-sites)
