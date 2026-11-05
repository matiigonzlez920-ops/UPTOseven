import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const outputDir = path.resolve('public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Common metallic top and bottom definitions
const metalDefs = `
  <linearGradient id="metalRim" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#9aa2aa"/>
    <stop offset="12%" stop-color="#d9dfe5"/>
    <stop offset="35%" stop-color="#ffffff"/>
    <stop offset="60%" stop-color="#cbd3da"/>
    <stop offset="85%" stop-color="#949da6"/>
    <stop offset="100%" stop-color="#6c747d"/>
  </linearGradient>
  <linearGradient id="metalTopDome" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#cbd3da"/>
    <stop offset="50%" stop-color="#e9eef2"/>
    <stop offset="100%" stop-color="#a0a9b2"/>
  </linearGradient>
  <linearGradient id="cylinderSheen" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#000000" stop-opacity="0.55"/>
    <stop offset="8%" stop-color="#000000" stop-opacity="0.15"/>
    <stop offset="26%" stop-color="#ffffff" stop-opacity="0.42"/>
    <stop offset="48%" stop-color="#ffffff" stop-opacity="0.06"/>
    <stop offset="78%" stop-color="#000000" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.6"/>
  </linearGradient>
  <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
    <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#022812" flood-opacity="0.32"/>
  </filter>
  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="6" result="blur"/>
    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
  </filter>
`;

function renderCanSvg({
  id,
  bodyFill,
  canTheme,
  flavorTextVertical,
  flavorTextColor,
  badgeText,
  badgeBg,
  extraArtwork,
}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 850" width="500" height="850">
  <defs>
    ${metalDefs}
    ${bodyFill}
    <clipPath id="canBodyClip">
      <path d="M 85 92 C 85 70 415 70 415 92 L 420 740 C 420 780 380 798 250 798 C 120 798 80 780 80 740 Z" />
    </clipPath>
  </defs>

  <g filter="url(#dropShadow)">
    <!-- BOTTOM METAL BEVEL -->
    <ellipse cx="250" cy="740" rx="170" ry="32" fill="url(#metalRim)" />
    <path d="M 85 736 C 90 770 140 798 250 798 C 360 798 410 770 415 736 L 400 762 C 340 784 160 784 100 762 Z" fill="#7a828a" />

    <!-- CAN BODY -->
    <g clip-path="url(#canBodyClip)">
      <!-- Main flavor background -->
      <rect x="75" y="70" width="350" height="740" fill="url(#flavorBg)" />

      <!-- Extra artwork (sun, palm leaves, cherries, etc.) -->
      ${extraArtwork || ''}

      <!-- Condensation droplets pattern -->
      <g opacity="0.45">
        <circle cx="150" cy="220" r="3" fill="#ffffff" />
        <circle cx="152" cy="223" r="1.5" fill="#000000" opacity="0.3"/>
        <circle cx="185" cy="180" r="4.5" fill="#ffffff" />
        <circle cx="187" cy="183" r="2" fill="#000000" opacity="0.3"/>
        <circle cx="140" cy="340" r="3.5" fill="#ffffff" />
        <circle cx="210" cy="420" r="5" fill="#ffffff" />
        <circle cx="290" cy="260" r="4" fill="#ffffff" />
        <circle cx="340" cy="380" r="3" fill="#ffffff" />
        <circle cx="320" cy="510" r="4.5" fill="#ffffff" />
        <circle cx="160" cy="600" r="3" fill="#ffffff" />
        <circle cx="240" cy="650" r="4" fill="#ffffff" />
        <circle cx="360" cy="620" r="3.5" fill="#ffffff" />
        <circle cx="130" cy="480" r="5" fill="#ffffff" />
        <circle cx="270" cy="150" r="3" fill="#ffffff" />
      </g>

      <!-- Vertical Text on Left -->
      <g transform="translate(132, 620) rotate(-90)">
        <text x="0" y="0" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" letter-spacing="4" fill="${flavorTextColor}">${flavorTextVertical}</text>
      </g>

      <!-- Badge Top Right (e.g. 140 CALORIES or ZERO SUGAR) -->
      <g transform="translate(340, 160)">
        <rect x="-80" y="-18" width="130" height="32" rx="16" fill="${badgeBg}" />
        <text x="-15" y="4" font-family="system-ui, sans-serif" font-size="12" font-weight="900" letter-spacing="1" fill="#ffffff" text-anchor="middle">${badgeText}</text>
      </g>

      <!-- ICONIC 7UP LOGO (Massive, tilted, bold) -->
      <g transform="translate(265, 415) rotate(-9)">
        <!-- 7 with shadow/bevel -->
        <path d="M -105 -130 L 35 -130 L -15 140 L -68 140 L -25 -72 L -105 -72 Z" fill="#000000" opacity="0.25" transform="translate(4, 6)" />
        <path d="M -105 -130 L 35 -130 L -15 140 L -68 140 L -25 -72 L -105 -72 Z" fill="#ffffff" />

        <!-- RED CIRCULAR DOT -->
        <circle cx="58" cy="-5" r="46" fill="#e51e2b" filter="url(#dropShadow)" />
        <circle cx="58" cy="-5" r="46" fill="url(#dotGradient)" />
        <!-- Dot highlight reflection -->
        <ellipse cx="46" cy="-20" rx="18" ry="10" fill="#ffffff" opacity="0.38" transform="rotate(-30 46 -20)" />

        <!-- UP text in bold inside / next to the dot -->
        <text x="58" y="11" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="900" font-style="italic" fill="#ffffff" text-anchor="middle" letter-spacing="-1">UP</text>
      </g>

      <!-- Net Volume Bottom -->
      <text x="250" y="710" font-family="system-ui, sans-serif" font-size="13" font-weight="800" letter-spacing="2" fill="#ffffff" opacity="0.9" text-anchor="middle">12 FL OZ (355 mL)</text>

      <!-- Cylindrical Light & Specular Sheen Overlay -->
      <rect x="75" y="70" width="350" height="740" fill="url(#cylinderSheen)" />
    </g>

    <!-- TOP METAL DOME & RIM -->
    <ellipse cx="250" cy="85" rx="165" ry="32" fill="url(#metalRim)" />
    <ellipse cx="250" cy="82" rx="148" ry="24" fill="url(#metalTopDome)" />
    <ellipse cx="250" cy="80" rx="138" ry="20" fill="#a4adb6" />
    <ellipse cx="250" cy="78" rx="130" ry="17" fill="#d2d9df" />

    <!-- PULL TAB -->
    <g transform="translate(236, 62)">
      <rect x="0" y="0" width="28" height="26" rx="6" fill="#c4cbd2" stroke="#68717a" stroke-width="1.5" />
      <circle cx="14" cy="13" r="6" fill="#4d555d" />
      <ellipse cx="14" cy="28" rx="12" ry="4" fill="#32383e" />
    </g>
  </g>
</svg>`;
}

// 1. ORIGINAL 7UP
const originalSvg = renderCanSvg({
  id: 'original',
  bodyFill: `
    <linearGradient id="flavorBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#006c30" />
      <stop offset="35%" stop-color="#009643" />
      <stop offset="70%" stop-color="#008039" />
      <stop offset="100%" stop-color="#004d21" />
    </linearGradient>
    <radialGradient id="dotGradient" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ff4a58" />
      <stop offset="70%" stop-color="#e51e2b" />
      <stop offset="100%" stop-color="#a60c17" />
    </radialGradient>
  `,
  flavorTextVertical: 'LIME LEMON',
  flavorTextColor: '#ffffff',
  badgeText: '140 CALORIES',
  badgeBg: '#024d22',
  extraArtwork: `
    <circle cx="250" cy="410" r="150" fill="#7ed957" opacity="0.16" />
    <path d="M 80 500 Q 250 420 420 540 L 420 740 L 80 740 Z" fill="#005726" opacity="0.3" />
  `,
});

// 2. ZERO SUGAR 7UP
const zeroSvg = renderCanSvg({
  id: 'zero',
  bodyFill: `
    <linearGradient id="flavorBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d110f" />
      <stop offset="40%" stop-color="#1b221e" />
      <stop offset="75%" stop-color="#121815" />
      <stop offset="100%" stop-color="#050806" />
    </linearGradient>
    <radialGradient id="dotGradient" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ff4a58" />
      <stop offset="70%" stop-color="#e51e2b" />
      <stop offset="100%" stop-color="#a60c17" />
    </radialGradient>
  `,
  flavorTextVertical: 'LIME LEMON',
  flavorTextColor: '#8bf347',
  badgeText: 'ZERO SUGAR',
  badgeBg: '#8bf347',
  extraArtwork: `
    <!-- Top Zero Sugar Lime underline -->
    <rect x="250" y="180" width="130" height="5" fill="#8bf347" rx="2.5" />
    <!-- Electric lime subtle aura -->
    <circle cx="260" cy="410" r="140" fill="#8bf347" opacity="0.1" />
    <text x="250" y="680" font-family="system-ui, sans-serif" font-size="11" font-weight="900" letter-spacing="3" fill="#8bf347" text-anchor="middle">CAFFEINE FREE</text>
  `,
});

// 3. CHERRY 7UP
const cherrySvg = renderCanSvg({
  id: 'cherry',
  bodyFill: `
    <linearGradient id="flavorBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#73051a" />
      <stop offset="35%" stop-color="#aa0b2b" />
      <stop offset="70%" stop-color="#880720" />
      <stop offset="100%" stop-color="#4a010f" />
    </linearGradient>
    <radialGradient id="dotGradient" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ff6075" />
      <stop offset="70%" stop-color="#e51e2b" />
      <stop offset="100%" stop-color="#850812" />
    </radialGradient>
  `,
  flavorTextVertical: 'CHERRY',
  flavorTextColor: '#ff5c7c',
  badgeText: '140 CALORIES',
  badgeBg: '#540212',
  extraArtwork: `
    <!-- Cherry background bubbles and glow -->
    <circle cx="250" cy="410" r="140" fill="#ff2a55" opacity="0.18" />
    <circle cx="340" cy="580" r="28" fill="#520010" opacity="0.5" />
    <circle cx="365" cy="590" r="24" fill="#660014" opacity="0.5" />
    <path d="M 340 552 Q 355 520 375 530" stroke="#408c35" stroke-width="4" fill="none" opacity="0.6"/>
  `,
});

// 4. TROPICAL 7UP
const tropicalSvg = renderCanSvg({
  id: 'tropical',
  bodyFill: `
    <linearGradient id="flavorBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fdb813" />
      <stop offset="35%" stop-color="#f99d1c" />
      <stop offset="60%" stop-color="#00a8a8" />
      <stop offset="100%" stop-color="#006b7a" />
    </linearGradient>
    <radialGradient id="dotGradient" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ff5463" />
      <stop offset="70%" stop-color="#e51e2b" />
      <stop offset="100%" stop-color="#a60c17" />
    </radialGradient>
  `,
  flavorTextVertical: 'TROPICAL',
  flavorTextColor: '#ffffff',
  badgeText: 'CAFFEINE FREE',
  badgeBg: '#e51e2b',
  extraArtwork: `
    <!-- Bright sun circle -->
    <circle cx="250" cy="380" r="125" fill="#ffe153" opacity="0.45" />
    <!-- Palm leaf silhouettes in teal -->
    <path d="M 80 620 Q 150 560 210 600 Q 140 640 80 660 Z" fill="#00515e" opacity="0.45" />
    <path d="M 420 640 Q 330 580 270 630 Q 340 670 420 680 Z" fill="#00515e" opacity="0.45" />
    <!-- "Tropical" Cursive Accent -->
    <text x="250" y="580" font-family="'Brush Script MT', cursive, sans-serif" font-size="52" font-weight="bold" fill="#ffffff" text-anchor="middle" transform="rotate(-6 250 580)">Tropical</text>
    <text x="250" y="615" font-family="system-ui, sans-serif" font-size="11" font-weight="900" letter-spacing="2" fill="#ffe153" text-anchor="middle">MANGO &amp; PEACH FLAVOR</text>
  `,
});

const canConfigs = [
  { name: '7up.png', svg: originalSvg },
  { name: '7up-zero-sugar.png', svg: zeroSvg },
  { name: '7up-cherry.png', svg: cherrySvg },
  { name: '7up-tropical.png', svg: tropicalSvg },
];

for (const { name, svg } of canConfigs) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 500,
    },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const outPath = path.join(outputDir, name);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`Generated ${outPath} (${pngBuffer.length} bytes)`);
}
