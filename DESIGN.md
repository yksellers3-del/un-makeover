# Design Brief — Makeup by Pinkie Thakur

## Aesthetic Direction
Luxury/premium refined makeup artist portfolio. Warm beige & chocolate brown palette with gold accents. Elegant serif + modern sans typography. Blurry glow effects, soft elevation, ambient animations. Celebrity credibility through visual hierarchy.

## Color Palette (OKLCH)

| Token | Light | Dark | Role |
|-------|-------|------|------|
| background | 0.98 0.008 71 | 0.15 0.012 65 | Cream canvas |
| foreground | 0.20 0.015 41 | 0.92 0.010 72 | Rich brown text |
| primary | 0.52 0.12 65 | 0.72 0.14 52 | Chocolate brown CTA |
| secondary | 0.82 0.08 62 | 0.32 0.014 68 | Warm beige accent |
| accent | 0.68 0.14 55 | 0.75 0.12 58 | Warm gold highlight |
| card | 0.99 0.012 68 | 0.20 0.015 68 | Elevated surfaces |
| muted | 0.92 0.010 73 | 0.28 0.012 70 | Subtle backgrounds |

## Typography
- **Display**: Fraunces (serif, 700–900 weight) — luxury headline presence
- **Body**: General Sans (sans-serif, 400–700) — clean modern readability
- **Mono**: Geist Mono (400–700) — technical details
- **Scale**: 12/14/16/18/24/32/40/48px with line-height 1.5–1.6

## Elevation & Depth
- **Flat**: no shadow, neutral backgrounds
- **Subtle**: `box-shadow: 0 2px 4px rgba(0,0,0,0.03)`
- **Base**: `0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03)` — default card
- **Elevated**: `0 8px 20px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.05)` — on hover
- **Luxury**: `0 2px 8px rgba(172, 145, 119, 0.2)` — warm glow on CTAs

## Structural Zones

| Zone | Treatment | Intent |
|------|-----------|--------|
| Header/Nav | Floating with glow-soft, high contrast | Premium, always accessible |
| Hero | Blur-glow bg, 3D particles animation | Celebrity/premium impression |
| Content sections | Card-elevated with card-bg, alternating muted backgrounds | Clear hierarchy, breathing room |
| CTA buttons | btn-luxury with hover lift + pulse-glow | Action emphasis, luxury feel |
| Footer | bg-muted/30, subtle border-t | Grounded close |
| Floating buttons (WhatsApp/Instagram) | pulse-glow animation, fixed positioning | Always accessible, premium polish |

## Component Patterns
- **Cards**: `.card-elevated` — soft rounded corners (0.875rem), base shadow, hover lift + shadow increase
- **Buttons**: `.btn-luxury` — primary brown, smooth transitions, luxury shadow on hover
- **Typography**: Fraunces for h1/h2, General Sans for body/labels
- **Icons**: Inline SVGs with primary/accent colors, no fills
- **Spacing**: 8px base unit, 1rem/1.5rem/2rem/3rem/4rem intervals

## Motion & Animation
- **Entrance**: Fade-in + subtle scale (200ms ease-out)
- **Float**: `.float-slow` — 6s infinite Y-axis drift (3D particle elements)
- **Pulse**: `.pulse-glow` — 2s infinite glow intensity (floating buttons)
- **Hover**: `.transition-smooth` (300ms cubic-bezier) on all interactive elements
- **3D**: Three.js particles, gem floating in hero, subtle camera tilt on scroll

## Differentiation
Warm luxury aesthetic + 3D animations distinguish from typical makeup portfolios. Gold accents + blurred glow effects signal premium positioning. Celebrity work highlighted through dedicated section. Professional, trustworthy, memorable.

## Constraints
- No generic blues or purples
- No harsh shadows or flat colors
- No bouncy or distracting animations
- No image backgrounds — images are content, not decoration
- 3D animations serve narrative, not distraction
- Minimum contrast AA+ on all text
