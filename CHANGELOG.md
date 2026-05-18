# Changelog

## Release v1.1.0
### Features
- Add internationalization (i18n) support with English and Indonesian translations (#fcee198, #a7b75b0, #98cdfd9, #98bdb6c, #e0fce2d, #cb7046d) [mhmmadjid@gmail.com]
- Add language switcher component with improved UI consistency (#509d6ab, #2bb1a98) [mhmmadjid@gmail.com]
- Add entrance animations to core UI components (#2cec08b) [mhmmadjid@gmail.com]
- Add timezone persistence and improved timezone handling (#8868c94, #09ea559, #4bcfbf3, #25c151a, #f828b60) [mhmmadjid@gmail.com]
- Add host timezone toggle for time slot display (#f828b60) [mhmmadjid@gmail.com]
- Add 24-hour time format toggle (#5e0f715) [mhmmadjid@gmail.com]
- Refactor slot picking into reusable SlotPicker component (#3ebce97) [mhmmadjid@gmail.com]
- Refactor to use SWR hooks and client-side API client (#8ad1c29) [mhmmadjid@gmail.com]
- Refactor to use server actions instead of API routes (#f3750b5) [mhmmadjid@gmail.com]
- Replace Next.js OG with Cloudflare OG image generation (#35717a9, #15afb1d) [garyteofanus@gmail.com]
- Add Cloudflare worker with open-next support (#2386f01) [garyteofanus@gmail.com]
- Switch package manager to pnpm (#4efdc00) [mhmmadjid@gmail.com]
- Replace proxy.ts with middleware.ts (#bd6dc93, #f70c638) [mhmmadjid@gmail.com]
- Add sticky headers to TimeSlots component (#25c151a) [mhmmadjid@gmail.com]

### Bugfixes
- Fix logged only first byte issue (#9c9ac00) [mhmmadjid@gmail.com]
- Fix runtime flag configuration (#7eca28f) [mhmmadjid@gmail.com]
- Fix timezone consistency in date formatting (#312e69b) [mhmmadjid@gmail.com]
- Fix timezone handling bugs and improve slot revalidation (#9db83ec) [mhmmadjid@gmail.com]
- Fix race condition in slot availability check (#470c740) [mhmmadjid@gmail.com]
- Fix code quality issues and improve consistency (#2bb1a98) [mhmmadjid@gmail.com]
- Fix path for OG background image (#eb572f1) [garyteofanus@gmail.com]
- Revert OG route to hardcoded image with semibold font only (#c5f4a72) [mhmmadjid@gmail.com]

## Release v1.0.4
### Features
- Add create release command (#60caa63) [garyteofanus@gmail.com]
- Improve TimeSlots confirm button UX (#c3c7df9) [mhmmadjid@gmail.com]
- Simplify OG image generation and optimize background image (#86bf910) [mhmmadjid@gmail.com]

### Maintenance
- Update ignore files (#bcfa95b) [garyteofanus@gmail.com]
- Update generate changelog script (#37fe0fe) [garyteofanus@gmail.com]

## Release v1.0.3
### Improvements
- Improve layout and flexbox properties for better responsive design (#056b809) [MassiveMassimo]

## Release v1.0.2
### Bug Fixes
- Improve timezone handling and search functionality (#211089f) [MassiveMassimo]

## Release v1.0.1
### Bug Fixes
- Fixed host_username field in booking detail API (#d2b6d42) [MassiveMassimo]

### Features
- Improved booking flow with server actions and enhanced error handling (#df18e16) [MassiveMassimo]

## Release v1.0.0
### Features
- Add API integration with username-based routing and dynamic OG images (#96e489e, #046ace3, #3b8c1aa, #6af91df) [mhmmadjid@gmail.com]
- Add calendar integration and improve booking form (#7e0a585, #6f684cc, #89d600c) [mhmmadjid@gmail.com]
- Add theme customization with gradient backgrounds and color picker (#1f3b733, #9eed244, #078156d) [mhmmadjid@gmail.com]
- Add responsive Drawer UI and migrate TimezoneSelector to shadcn Combobox with flags (#9a435ec, #81c780d) [mhmmadjid@gmail.com]
- Add switch component and enhance debug functionality (#c6d71d2, #e489d51) [mhmmadjid@gmail.com]
- Refactor components and add UI primitives (#916cff4, #2873e95, #8223295, #f11573e, #7a1427b, #d5b0339, #312273a, #6e6de73) [mhmmadjid@gmail.com]
- Improve OG images and optimize (#50982d4, #7bbacfd, #b11d7e6, #64ebd27, #c2cf06a) [mhmmadjid@gmail.com, hokiman@bahasa.ai]
- Book Meeting AI - Calendly clone with beautiful UI (#b71d0cb) [hokiman@bahasa.ai]
- Add readme-llm.md for AI/LLM context (#6a53f96) [hokiman@bahasa.ai]
- Remove static page (#d979fc5) [garyteofanus@gmail.com]
- Add dotenv (#de781ed) [garyteofanus@gmail.com]

### Bugfixes
- Fix: wrapped in suspense (#290f4b5) [mhmmadjid@gmail.com]
- Fix mobile layout issues (#4735e6d) [mhmmadjid@gmail.com]
- Fix incorrect route (#5f9ff9b) [mhmmadjid@gmail.com]
- Fix production URL construction for API calls (#ab72cf7) [mhmmadjid@gmail.com]