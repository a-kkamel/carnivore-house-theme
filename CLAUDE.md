# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a customized Shopify **Debut theme** (v17.7.0) for a meat/food wholesale business. It includes retail and B2B wholesale channels with extensive third-party app integrations. There is no build pipeline — this is a pure Liquid/CSS/JS Shopify theme.

## Development Commands

Use the [Shopify CLI](https://shopify.dev/docs/storefronts/themes/tools/cli) for all theme development:

```bash
# Start local development server (hot reload)
shopify theme dev --store=<store-name>.myshopify.com

# Push theme changes to Shopify
shopify theme push

# Pull latest theme from Shopify
shopify theme pull

# Deploy to a specific theme by ID
shopify theme push --theme=<theme-id>
```

No npm/build step — edit files directly and use `shopify theme dev` to preview changes.

## Architecture

### Directory Roles
- `layout/` — Master page wrappers. `theme.liquid` is the root for all storefront pages.
- `sections/` — Page-level components rendered by templates or the theme editor.
- `snippets/` — Reusable sub-components included via `{% render %}` or `{% include %}`.
- `templates/` — Route-to-section mapping for each page type (product, collection, page, etc.).
- `assets/` — Static files (CSS, JS, images). `custom.css` is 217 KB of minified custom styles.
- `config/` — `settings_schema.json` defines theme editor controls; `settings_data.json` stores current values.

### Key Files
- `layout/theme.liquid` — Loads all global scripts/styles, includes Google Analytics, jQuery, cart/search modals, and custom registration redirect logic.
- `snippets/css-variables.liquid` — Generates CSS custom properties from theme settings at render time.
- `assets/custom.css` — Primary custom styling. Minified; search by selector/class when editing.
- `config/settings_data.json` — Current live settings (brand green: `#22ad87`, body text: `#3a3a3a`).

### B2B Wholesale System
Wholesale access is tag-based: customers with the `wholesale` or `b2b` Liquid tag see gated pricing/catalog. See `sections/b2b-landing.liquid` and `snippets/b2b-catalog.liquid`. An approval workflow redirects untagged customers to a registration flow.

### Specialized Collection Sections
Separate sections exist per product category: `collection.beef.liquid`, `collection.goat.liquid`, `collection.jerky.liquid`, `collection.lamb.liquid`, `collection.poultry.liquid`, `collection.merchandise.liquid`. Each maps to a matching template in `templates/`.

### Third-Party Integrations
All integrated via Liquid snippets rendered from `layout/theme.liquid` or section files:
- **Wiser** — AI product recommendations (11 snippet files, `snippets/wiser_*.liquid`)
- **JudgeMe** — Product reviews (`snippets/judgeme_*.liquid`, `sections/judgeme_carousel_section.liquid`)
- **Appstle** — Subscription products (`assets/appstle-*.js`)
- **Smile.io** — Loyalty rewards (`snippets/smile-initializer.liquid`)
- **Powr** — Image slider (`sections/powr-image-slider.liquid`)

### Cart & AJAX
Custom jQuery cart logic lives in `layout/theme.liquid`. Cart interactions trigger a modal popup (`snippets/cart-popup.liquid`) with an AJAX loader. jQuery 3.5.1 is loaded from CDN.

### Responsive Images
Images use `lazysizes.js` with `data-src`, `data-widths`, and `data-sizes` attributes. The `snippets/bgset.liquid` and `snippets/media.liquid` snippets handle responsive image rendering.
