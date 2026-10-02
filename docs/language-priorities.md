# Language priorities — 2026-10-02

SignToki serves incoming travelers and people curious about Korean culture. Country of origin is not the same as preferred language. Visitor counts and cultural favorability are separate signals; no combined country ranking is claimed.

## Evidence

The Ministry of Culture, Sports and Tourism's September 28, 2026 release uses Korea Tourism Organization statistics for January–August 2026:

| Selected market | Arrivals |
| --- | ---: |
| China | 4,816,134 |
| Japan | 2,698,857 |
| Taiwan | 1,656,255 |
| Hong Kong | 495,680 |
| Philippines | 454,007 |
| Vietnam | 406,816 |
| Indonesia | 295,279 |
| Singapore | 243,078 |
| Thailand | 229,746 |
| Malaysia | 206,838 |

This is a selection of markets in the official release, not a complete global ranking. The Americas are aggregated there and are not interpreted as a US count.

Source: https://www.mcst.go.kr/english/policy/pressView.jsp?pSeq=666

The 2026 Overseas Hallyu Survey (2025 data), published March 30, 2026, reports high Korean cultural-content favorability in the Philippines (87.0%), India (83.8%), Indonesia (82.7%), and Thailand (79.4%). The survey covers 27,400 people aged 15–59 in 30 regions who have experienced Korean cultural content. These figures are favorability among that sample, not the share of all citizens interested in Korea or the total number of fans.

Source: https://www.mcst.go.kr/english/policy/pressView.jsp?pSeq=622

## Implemented order and coverage

1. Simplified Chinese: large China travel market.
2. Japanese: large Japan travel market.
3. Traditional Chinese: Taiwan and Hong Kong readers.
4. English: international fallback and an option for visitors from English-speaking countries, Singapore, the Philippines, India, and Malaysia. It is not assumed to be everyone's preferred language.
5. Filipino: travel volume plus the survey's highest favorability among the highlighted countries.
6. Vietnamese: substantial travel market.
7. Indonesian: travel growth plus high cultural favorability.
8. Thai: travel market plus high cultural favorability.
9. Hindi: an additional language for a subset of the Indian market, informed by cultural favorability. Hindi does not represent all languages in India.
10. Korean: retained for Korean readers and learners.

This is the product's implementation priority, not a statistical ranking. Dedicated Malay and further Indian languages remain outside this release. Browser preferences, explicit choice, and saved preference determine the user's language; no geolocation or nationality inference is used.

## Behavior and validation

- URL `lang` wins over saved preference, then browser language, then English.
- Chinese script variants and Filipino/Tagalog browser codes are normalized.
- All interface strings, 40 meanings, and 40 notes in each added language are local content.
- Korean signs and Korean speech stay Korean; reading choices use Latin romanization in every UI language.
- Shared sets include their language and set number.
- Language changes preserve the current question, submitted answer, and score.
- Run `node tests/localization.cjs` for coverage and progression checks.

Translations are authored drafts, not professionally certified or native-speaker-reviewed. Native-speaker review during first usability tests remains necessary, especially for Filipino, Thai, and Hindi. The dataset has no paid translation or dictionary API dependency.
