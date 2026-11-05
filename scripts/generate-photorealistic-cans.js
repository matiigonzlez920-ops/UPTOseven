import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

const outputDir = path.resolve('public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate photorealistic water condensation droplets
function generateCondensationDrops(count = 65) {
  let drops = '';
  const seedRandom = (s) => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 0; i < count; i++) {
    const r1 = seedRandom(i * 7 + 1);
    const r2 = seedRandom(i * 13 + 3);
    const r3 = seedRandom(i * 19 + 5);
    
    // x between 110 and 390
    const cx = 110 + r1 * 280;
    // y between 220 and 800
    const cy = 220 + r2 * 580;
    // radius between 2.5 and 7.5
    const rx = 2.5 + r3 * 5.0;
    const ry = rx * (0.85 + seedRandom(i + 4) * 0.4);
    const rot = (seedRandom(i + 9) - 0.5) * 30;

    drops += `
      <g transform="translate(${cx}, ${cy}) rotate(${rot})">
        <!-- Drop shadow -->
        <ellipse cx="0.8" cy="1.2" rx="${rx}" ry="${ry}" fill="#000000" fill-opacity="0.32" />
        <!-- Drop body -->
        <ellipse cx="0" cy="0" rx="${rx}" ry="${ry}" fill="#ffffff" fill-opacity="0.22" />
        <!-- Inner refraction -->
        <ellipse cx="-0.4" cy="-0.5" rx="${rx * 0.6}" ry="${ry * 0.55}" fill="#ffffff" fill-opacity="0.75" />
        <circle cx="${-rx * 0.35}" cy="${-ry * 0.35}" r="${rx * 0.28}" fill="#ffffff" fill-opacity="0.95" />
      </g>
    `;
  }
  return drops;
}

// Create photorealistic SVG of a 12 FL OZ (355ml) beverage can
function buildPhotorealisticCanSvg({
  id,
  baseGradient,
  artwork,
  themeColor,
  accentColor = '#E51E2B',
}) {
  const drops = generateCondensationDrops(75);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 960" width="500" height="960">
    <defs>
      <!-- Metallic Can Top & Rim Gradients -->
      <linearGradient id="metalRimGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#555d65"/>
        <stop offset="6%" stop-color="#9aa3ab"/>
        <stop offset="14%" stop-color="#dce2e6"/>
        <stop offset="25%" stop-color="#ffffff"/>
        <stop offset="38%" stop-color="#cfd6dc"/>
        <stop offset="65%" stop-color="#7e8790"/>
        <stop offset="85%" stop-color="#cad1d7"/>
        <stop offset="94%" stop-color="#9da6ae"/>
        <stop offset="100%" stop-color="#4d545b"/>
      </linearGradient>

      <linearGradient id="metalNeckGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#2a2e33"/>
        <stop offset="10%" stop-color="#69727a"/>
        <stop offset="26%" stop-color="#ffffff"/>
        <stop offset="42%" stop-color="#b8c0c7"/>
        <stop offset="70%" stop-color="#4a5259"/>
        <stop offset="88%" stop-color="#9da6ae"/>
        <stop offset="100%" stop-color="#30353a"/>
      </linearGradient>

      <linearGradient id="lidDomeGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9099a2"/>
        <stop offset="40%" stop-color="#d4dade"/>
        <stop offset="85%" stop-color="#edf2f5"/>
        <stop offset="100%" stop-color="#abb4bd"/>
      </linearGradient>

      <linearGradient id="pullTabMetal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="35%" stop-color="#ccd3d9"/>
        <stop offset="75%" stop-color="#8a939b"/>
        <stop offset="100%" stop-color="#586067"/>
      </linearGradient>

      <!-- Photorealistic Aluminum Cylinder Studio Lighting Overlay -->
      <linearGradient id="cylinderStudioLighting" x1="0" y1="0" x2="1" y2="0">
        <!-- Left edge ambient occlusion -->
        <stop offset="0%" stop-color="#000000" stop-opacity="0.75"/>
        <stop offset="5%" stop-color="#000000" stop-opacity="0.45"/>
        <stop offset="12%" stop-color="#000000" stop-opacity="0.10"/>
        <!-- Studio Key Light / Softbox Specular Streak -->
        <stop offset="22%" stop-color="#ffffff" stop-opacity="0.35"/>
        <stop offset="28%" stop-color="#ffffff" stop-opacity="0.65"/>
        <stop offset="34%" stop-color="#ffffff" stop-opacity="0.25"/>
        <stop offset="48%" stop-color="#ffffff" stop-opacity="0.0"/>
        <stop offset="68%" stop-color="#000000" stop-opacity="0.12"/>
        <!-- Right Rim Backlight Bounce -->
        <stop offset="82%" stop-color="#ffffff" stop-opacity="0.22"/>
        <stop offset="90%" stop-color="#ffffff" stop-opacity="0.42"/>
        <stop offset="96%" stop-color="#000000" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.80"/>
      </linearGradient>

      <!-- Shoulder curvature specular highlight -->
      <linearGradient id="shoulderHighlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
        <stop offset="25%" stop-color="#ffffff" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>
      </linearGradient>

      <!-- Bottom Rim Metallic Gradient -->
      <linearGradient id="bottomRimGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#3d4247"/>
        <stop offset="12%" stop-color="#8c949c"/>
        <stop offset="28%" stop-color="#ffffff"/>
        <stop offset="50%" stop-color="#a3abb2"/>
        <stop offset="78%" stop-color="#555d64"/>
        <stop offset="90%" stop-color="#9da5ad"/>
        <stop offset="100%" stop-color="#363a3e"/>
      </linearGradient>

      <!-- Can Body Cutout Clip Path -->
      <clipPath id="canCylinderClip">
        <!-- Realistic can body with tapered neck and rounded base chime -->
        <path d="
          M 124 136
          C 124 125 138 120 148 116
          L 352 116
          C 362 120 376 125 376 136
          L 396 178
          C 400 186 404 196 404 210
          L 404 832
          C 404 854 394 870 380 882
          L 364 894
          C 350 904 310 908 250 908
          C 190 908 150 904 136 894
          L 120 882
          C 106 870 96 854 96 832
          L 96 210
          C 96 196 100 186 104 178
          Z
        "/>
      </clipPath>

      <!-- Shadow Filter for Ground Contact -->
      <filter id="canGroundShadow" x="-20%" y="-20%" width="140%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="16" />
        <feOffset dx="0" dy="24" />
        <feComponentTransfer><feFuncA type="linear" slope="0.4" /></feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      ${baseGradient}
    </defs>

    <!-- Floor Drop Shadow -->
    <ellipse cx="250" cy="918" rx="165" ry="26" fill="#000000" fill-opacity="0.38" filter="blur(18px)" />
    <ellipse cx="250" cy="914" rx="120" ry="14" fill="#000000" fill-opacity="0.55" filter="blur(7px)" />

    <!-- ============================================== -->
    <!-- 1. TOP METALLIC CAN LID & PULL TAB            -->
    <!-- ============================================== -->

    <!-- Outer Rim Top Curve -->
    <ellipse cx="250" cy="116" rx="104" ry="26" fill="url(#metalRimGradient)" />
    <ellipse cx="250" cy="114" rx="100" ry="24" fill="#6d767f" />
    <ellipse cx="250" cy="113" rx="98" ry="23" fill="url(#metalRimGradient)" />
    
    <!-- Inset Top Lid Dome (Countersink Chime) -->
    <ellipse cx="250" cy="116" rx="88" ry="19" fill="#2d3237" />
    <ellipse cx="250" cy="117" rx="86" ry="18" fill="url(#lidDomeGradient)" />

    <!-- Lid Score Line & Aperture Depression -->
    <ellipse cx="250" cy="113" rx="66" ry="13" fill="#848d96" stroke="#484f56" stroke-width="1" />
    <path d="M 235 110 C 235 106 265 106 265 110 C 265 116 235 116 235 110 Z" fill="#2b3035" />

    <!-- Realistic Aluminum Pull Tab -->
    <g transform="translate(250, 117) rotate(-4)">
      <!-- Tab Shadow -->
      <path d="M -15 2 L -18 -16 C -18 -26 18 -26 18 -16 L 15 2 Z" fill="#1b1f23" fill-opacity="0.6" filter="blur(2px)" />
      <!-- Tab Metal Body -->
      <path d="M -14 0 L -17 -16 C -17 -25 17 -25 17 -16 L 14 0 C 12 6 -12 6 -14 0 Z" fill="url(#pullTabMetal)" stroke="#ffffff" stroke-width="0.8" />
      <!-- Tab Finger Loop Hole -->
      <ellipse cx="0" cy="-14" rx="9" ry="5" fill="#586169" stroke="#373d42" stroke-width="1" />
      <!-- Center Rivet Button -->
      <circle cx="0" cy="-1" r="3.6" fill="#ccd3d8" stroke="#33383d" stroke-width="0.8" />
      <circle cx="-0.8" cy="-1.8" r="1.2" fill="#ffffff" />
    </g>

    <!-- Metallic Neck Ring (Transition to Body) -->
    <path d="
      M 146 116
      C 136 122 124 128 124 138
      L 104 178
      C 100 186 96 196 96 210
      L 404 210
      C 404 196 400 186 396 178
      L 376 138
      C 376 128 364 122 354 116
      Z
    " fill="url(#metalNeckGradient)" />

    <!-- ============================================== -->
    <!-- 2. PRINTED CAN CYLINDER BODY (CLIPPED)         -->
    <!-- ============================================== -->
    <g clip-path="url(#canCylinderClip)">
      <!-- Base Color Fill (Vibrant 7UP Emerald, Matte Black, Burgundy, or Tropical) -->
      <rect x="80" y="110" width="340" height="810" fill="url(#${id}BaseGrad)" />

      <!-- Brand Artwork Layer (Specific to Flavor) -->
      ${artwork}

      <!-- Cylindrical Studio Lighting & Specular Reflection Layer (Screen / Overlay) -->
      <rect x="80" y="110" width="340" height="810" fill="url(#cylinderStudioLighting)" />

      <!-- Shoulder Specular Ring -->
      <ellipse cx="250" cy="188" rx="150" ry="18" fill="url(#shoulderHighlight)" />

      <!-- Realistic Cold Water Condensation Droplets -->
      ${drops}
    </g>

    <!-- ============================================== -->
    <!-- 3. BOTTOM METALLIC BEVELED CHIME               -->
    <!-- ============================================== -->
    <!-- Bottom inward taper & aluminum chime lip -->
    <path d="
      M 96 832
      C 96 854 106 870 120 882
      L 136 894
      C 150 904 190 908 250 908
      C 310 908 350 904 364 894
      L 380 882
      C 394 870 404 854 404 832
      L 396 846
      C 386 864 360 882 342 890
      C 314 900 284 904 250 904
      C 216 904 186 900 158 890
      C 140 882 114 864 104 846
      Z
    " fill="url(#bottomRimGradient)" />

    <!-- Bottom contact lip rim -->
    <ellipse cx="250" cy="902" rx="98" ry="11" fill="none" stroke="url(#metalRimGradient)" stroke-width="4.5" />
    <ellipse cx="250" cy="902" rx="94" ry="9" fill="#1b1e22" fill-opacity="0.3" />

    <!-- Exterior Crisp Aluminum Highlight Border -->
    <path d="
      M 104 178
      L 96 210
      L 96 832
      C 96 854 106 870 120 882
      L 136 894
    " fill="none" stroke="#ffffff" stroke-width="1.2" stroke-opacity="0.4" />
    <path d="
      M 396 178
      L 404 210
      L 404 832
      C 404 854 394 870 380 882
      L 364 894
    " fill="none" stroke="#ffffff" stroke-width="0.8" stroke-opacity="0.25" />
  </svg>`;
}

// -------------------------------------------------------------
// CAN 1: 7UP ORIGINAL (Lime Lemon)
// -------------------------------------------------------------
const originalBaseGrad = `
  <linearGradient id="originalBaseGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#005724"/>
    <stop offset="12%" stop-color="#007632"/>
    <stop offset="28%" stop-color="#00A045"/>
    <stop offset="45%" stop-color="#008B3B"/>
    <stop offset="75%" stop-color="#007130"/>
    <stop offset="92%" stop-color="#008B3B"/>
    <stop offset="100%" stop-color="#00471c"/>
  </linearGradient>
`;

const originalArtwork = `
  <!-- Top Right "CAFFEINE FREE" -->
  <g transform="translate(378, 220)">
    <text x="0" y="0" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="12.5" font-weight="900" fill="#013f17" letter-spacing="1">CAFFEINE FREE</text>
  </g>

  <!-- Left Side Vertical "LIME LEMON" in Neon Electric Lime -->
  <g transform="translate(138, 485) rotate(-90)">
    <text x="0" y="0" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="34" font-weight="900" fill="#50E528" letter-spacing="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))">LIME LEMON</text>
  </g>

  <!-- Giant Modern 2023 7UP Angled Logo -->
  <g transform="translate(240, 440) rotate(-7)">
    <!-- Drop shadow for the logo -->
    <path d="
      M -48 -140
      L 72 -140
      L 72 -88
      L 22 72
      L -28 72
      L 18 -92
      L -48 -92
      Z
    " fill="#000000" fill-opacity="0.32" transform="translate(4, 6)" />

    <!-- Stylized 7 in crisp white -->
    <path d="
      M -48 -140
      L 72 -140
      L 72 -88
      L 22 72
      L -28 72
      L 18 -92
      L -48 -92
      Z
    " fill="#ffffff" />

    <!-- Solid Cherry Red Circle in the crook of the 7 -->
    <circle cx="46" cy="-44" r="32" fill="#E51E2B" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))" />
    <circle cx="41" cy="-49" r="10" fill="#ffffff" fill-opacity="0.3" />

    <!-- "UP" Typography in heavy white -->
    <text x="84" y="-30" font-family="Liberation Sans, FreeSans, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))">UP</text>
    <text x="160" y="-56" font-family="Liberation Sans, FreeSans, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">®</text>
  </g>

  <!-- Bottom Left: "140 CALORIES PER CAN" Badge -->
  <g transform="translate(142, 690)">
    <rect x="-8" y="-12" width="60" height="74" rx="14" fill="#00471c" stroke="#ffffff" stroke-width="2" stroke-opacity="0.85" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"/>
    <text x="22" y="16" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="20" font-weight="900" fill="#ffffff">140</text>
    <text x="22" y="32" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="8.5" font-weight="900" fill="#ffffff" letter-spacing="0.5">CALORIES</text>
    <text x="22" y="46" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="8" font-weight="900" fill="#ffffff" letter-spacing="0.5">PER CAN</text>
  </g>

  <!-- Bottom Center: "12 FL OZ (355 mL)" -->
  <g transform="translate(250, 785)">
    <text x="0" y="0" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="16" font-weight="900" fill="#50E528" letter-spacing="1">12 FL OZ (355 mL)</text>
  </g>

  <!-- Bottom Right Description -->
  <g transform="translate(378, 725)">
    <text x="0" y="0" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="9" font-weight="900" fill="#50E528" letter-spacing="0.5">LIME LEMON</text>
    <text x="0" y="14" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="8" font-weight="bold" fill="#ffffff">FLAVORED SODA</text>
    <text x="0" y="27" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="7" font-weight="bold" fill="#ffffff" fill-opacity="0.85">WITH OTHER NATURAL FLAVORS</text>
  </g>
`;

// -------------------------------------------------------------
// CAN 2: 7UP ZERO SUGAR (Matte Black & Electric Lime)
// -------------------------------------------------------------
const zeroBaseGrad = `
  <linearGradient id="zeroBaseGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#0c0d0e"/>
    <stop offset="12%" stop-color="#18191b"/>
    <stop offset="28%" stop-color="#2a2c30"/>
    <stop offset="45%" stop-color="#1e2023"/>
    <stop offset="75%" stop-color="#141517"/>
    <stop offset="92%" stop-color="#222428"/>
    <stop offset="100%" stop-color="#09090a"/>
  </linearGradient>
`;

const zeroArtwork = `
  <!-- Top Right "CAFFEINE FREE" in Neon Green -->
  <g transform="translate(378, 220)">
    <text x="0" y="0" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="12.5" font-weight="900" fill="#00FF44" letter-spacing="1">CAFFEINE FREE</text>
  </g>

  <!-- Left Side Vertical "LIME LEMON" in Neon Green -->
  <g transform="translate(138, 485) rotate(-90)">
    <text x="0" y="0" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="34" font-weight="900" fill="#00FF44" letter-spacing="3" filter="drop-shadow(0 2px 5px rgba(0,0,0,0.6))">LIME LEMON</text>
  </g>

  <!-- Giant Modern 2023 7UP Angled Logo + ZERO SUGAR -->
  <g transform="translate(230, 440) rotate(-7)">
    <!-- Drop shadow -->
    <path d="
      M -48 -140
      L 72 -140
      L 72 -88
      L 22 72
      L -28 72
      L 18 -92
      L -48 -92
      Z
    " fill="#000000" fill-opacity="0.6" transform="translate(4, 6)" />

    <!-- Stylized 7 in crisp white -->
    <path d="
      M -48 -140
      L 72 -140
      L 72 -88
      L 22 72
      L -28 72
      L 18 -92
      L -48 -92
      Z
    " fill="#ffffff" />

    <!-- Solid Red Circle in the crook of the 7 -->
    <circle cx="46" cy="-44" r="32" fill="#E51E2B" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.5))" />
    <circle cx="41" cy="-49" r="10" fill="#ffffff" fill-opacity="0.3" />

    <!-- "UP" in heavy white -->
    <text x="84" y="-30" font-family="Liberation Sans, FreeSans, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1">UP</text>

    <!-- "ZERO SUGAR" in two stacked lines next to UP -->
    <g transform="translate(86, 12)">
      <text x="0" y="0" font-family="Liberation Sans, FreeSans, sans-serif" font-size="21" font-weight="900" fill="#ffffff" letter-spacing="1">ZERO</text>
      <text x="0" y="20" font-family="Liberation Sans, FreeSans, sans-serif" font-size="21" font-weight="900" fill="#ffffff" letter-spacing="1">SUGAR</text>
      <text x="76" y="-3" font-family="Liberation Sans, FreeSans, sans-serif" font-size="11" font-weight="bold" fill="#ffffff">®</text>
    </g>
  </g>

  <!-- Bottom Center: "12 FL OZ (355 mL)" in Neon Green -->
  <g transform="translate(250, 785)">
    <text x="0" y="0" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="16" font-weight="900" fill="#00FF44" letter-spacing="1">12 FL OZ (355 mL)</text>
  </g>

  <!-- Bottom Right Description in Neon Green & White -->
  <g transform="translate(378, 725)">
    <text x="0" y="0" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="9" font-weight="900" fill="#00FF44" letter-spacing="0.5">LIME LEMON</text>
    <text x="0" y="14" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="8" font-weight="bold" fill="#ffffff">FLAVORED SODA</text>
    <text x="0" y="27" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="7" font-weight="bold" fill="#ffffff" fill-opacity="0.85">WITH OTHER NATURAL FLAVORS</text>
  </g>
`;

// -------------------------------------------------------------
// CAN 3: 7UP CHERRY (Burgundy & Red)
// -------------------------------------------------------------
const cherryBaseGrad = `
  <linearGradient id="cherryBaseGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#4d0514"/>
    <stop offset="12%" stop-color="#69091d"/>
    <stop offset="28%" stop-color="#930e2a"/>
    <stop offset="45%" stop-color="#7a0a22"/>
    <stop offset="75%" stop-color="#5a0618"/>
    <stop offset="92%" stop-color="#7a0a22"/>
    <stop offset="100%" stop-color="#3c030f"/>
  </linearGradient>
`;

const cherryArtwork = `
  <!-- Top Right "CAFFEINE FREE" in Bright Red -->
  <g transform="translate(378, 220)">
    <text x="0" y="0" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="12.5" font-weight="900" fill="#E51E2B" letter-spacing="1">CAFFEINE FREE</text>
  </g>

  <!-- Left Side Vertical "CHERRY" in Candy Red -->
  <g transform="translate(138, 485) rotate(-90)">
    <text x="0" y="0" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="34" font-weight="900" fill="#E51E2B" letter-spacing="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">CHERRY</text>
  </g>

  <!-- Giant Modern 2023 7UP Angled Logo -->
  <g transform="translate(240, 440) rotate(-7)">
    <path d="
      M -48 -140
      L 72 -140
      L 72 -88
      L 22 72
      L -28 72
      L 18 -92
      L -48 -92
      Z
    " fill="#000000" fill-opacity="0.35" transform="translate(4, 6)" />

    <!-- Stylized 7 in crisp white -->
    <path d="
      M -48 -140
      L 72 -140
      L 72 -88
      L 22 72
      L -28 72
      L 18 -92
      L -48 -92
      Z
    " fill="#ffffff" />

    <!-- Red Circle with white dot reflection -->
    <circle cx="46" cy="-44" r="32" fill="#E51E2B" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))" />
    <circle cx="41" cy="-49" r="10" fill="#ffffff" fill-opacity="0.3" />

    <!-- "UP" Typography in heavy white -->
    <text x="84" y="-30" font-family="Liberation Sans, FreeSans, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1">UP</text>
    <text x="160" y="-56" font-family="Liberation Sans, FreeSans, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">®</text>
  </g>

  <!-- Bottom Left: "140 CALORIES PER CAN" in White Badge with Red Text -->
  <g transform="translate(142, 690)">
    <rect x="-8" y="-12" width="60" height="74" rx="14" fill="#ffffff" stroke="#E51E2B" stroke-width="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"/>
    <text x="22" y="16" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="20" font-weight="900" fill="#E51E2B">140</text>
    <text x="22" y="32" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="8.5" font-weight="900" fill="#E51E2B" letter-spacing="0.5">CALORIES</text>
    <text x="22" y="46" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="8" font-weight="900" fill="#E51E2B" letter-spacing="0.5">PER CAN</text>
  </g>

  <!-- Bottom Center: "12 FL OZ (355 mL)" -->
  <g transform="translate(250, 785)">
    <text x="0" y="0" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="16" font-weight="900" fill="#E51E2B" letter-spacing="1">12 FL OZ (355 mL)</text>
  </g>

  <!-- Bottom Right Description in Red & White -->
  <g transform="translate(378, 725)">
    <text x="0" y="0" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="9" font-weight="900" fill="#E51E2B" letter-spacing="0.5">CHERRY</text>
    <text x="0" y="14" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="8" font-weight="bold" fill="#ffffff">FLAVORED SODA</text>
    <text x="0" y="27" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="7" font-weight="bold" fill="#ffffff" fill-opacity="0.85">WITH OTHER NATURAL FLAVORS</text>
  </g>
`;

// -------------------------------------------------------------
// CAN 4: 7UP TROPICAL (Red wave, Golden Sun, Turquoise & Palms)
// -------------------------------------------------------------
const tropicalBaseGrad = `
  <linearGradient id="tropicalBaseGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#006b77"/>
    <stop offset="12%" stop-color="#008c9c"/>
    <stop offset="28%" stop-color="#00b4c8"/>
    <stop offset="45%" stop-color="#009db0"/>
    <stop offset="75%" stop-color="#007987"/>
    <stop offset="92%" stop-color="#009db0"/>
    <stop offset="100%" stop-color="#005660"/>
  </linearGradient>
`;

const tropicalArtwork = `
  <!-- Top Red/Coral Wave Banner -->
  <path d="
    M 80 110
    L 420 110
    L 420 270
    C 340 305 260 250 180 290
    C 130 310 90 280 80 275
    Z
  " fill="#E52D27" />

  <!-- Top Right "CAFFEINE FREE" in White on Red Wave -->
  <g transform="translate(378, 205)">
    <text x="0" y="0" text-anchor="end" font-family="Liberation Sans, FreeSans, sans-serif" font-size="12.5" font-weight="900" fill="#ffffff" letter-spacing="1">CAFFEINE FREE</text>
  </g>

  <!-- Big Golden-Yellow Sun Circle behind the 7UP Logo -->
  <circle cx="255" cy="410" r="115" fill="#FFC700" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.25))" />
  <circle cx="255" cy="410" r="105" fill="#FFD700" />

  <!-- Tropical Palm Frond Silhouettes in Lower Half -->
  <g fill="#006977" fill-opacity="0.45">
    <path d="M 90 620 C 130 580 190 590 220 630 C 170 630 130 640 90 620 Z" />
    <path d="M 390 640 C 350 590 290 600 260 650 C 310 650 350 660 390 640 Z" />
    <path d="M 100 730 C 150 710 200 730 220 770 C 170 760 140 765 100 730 Z" />
    <path d="M 400 740 C 350 715 310 735 290 780 C 330 770 370 775 400 740 Z" />
  </g>

  <!-- Giant Modern 2023 7UP Angled Logo -->
  <g transform="translate(240, 430) rotate(-7)">
    <path d="
      M -48 -140
      L 72 -140
      L 72 -88
      L 22 72
      L -28 72
      L 18 -92
      L -48 -92
      Z
    " fill="#000000" fill-opacity="0.3" transform="translate(4, 6)" />

    <!-- Stylized 7 in crisp white -->
    <path d="
      M -48 -140
      L 72 -140
      L 72 -88
      L 22 72
      L -28 72
      L 18 -92
      L -48 -92
      Z
    " fill="#ffffff" />

    <!-- Solid Red Circle -->
    <circle cx="46" cy="-44" r="32" fill="#E51E2B" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.35))" />
    <circle cx="41" cy="-49" r="10" fill="#ffffff" fill-opacity="0.3" />

    <!-- "UP" Typography in heavy white -->
    <text x="84" y="-30" font-family="Liberation Sans, FreeSans, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="-1">UP</text>
    <text x="160" y="-56" font-family="Liberation Sans, FreeSans, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">®</text>
  </g>

  <!-- Cursive "Tropical" Script Typography in White -->
  <g transform="translate(235, 615)">
    <text x="0" y="0" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-style="italic" font-size="44" font-weight="900" fill="#ffffff" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))" letter-spacing="1">Tropical</text>
  </g>

  <!-- Peach & Mango Fruit Slices Illustration -->
  <g transform="translate(345, 605)">
    <!-- Mango slice -->
    <ellipse cx="0" cy="0" rx="16" ry="11" transform="rotate(-25)" fill="#FF9A24" stroke="#ffffff" stroke-width="1.5" />
    <!-- Peach slice -->
    <ellipse cx="14" cy="6" rx="13" ry="9" transform="rotate(20)" fill="#FF6B4A" stroke="#ffffff" stroke-width="1.5" />
  </g>

  <!-- Bottom Center: "12 FL OZ (355 mL)" -->
  <g transform="translate(250, 785)">
    <text x="0" y="0" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="16" font-weight="900" fill="#ffffff" letter-spacing="1">12 FL OZ (355 mL)</text>
  </g>

  <!-- Bottom Description in White -->
  <g transform="translate(250, 725)">
    <text x="0" y="0" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="10" font-weight="900" fill="#ffffff" letter-spacing="0.5">TROPICAL FLAVORED SODA</text>
    <text x="0" y="16" text-anchor="middle" font-family="Liberation Sans, FreeSans, sans-serif" font-size="8" font-weight="bold" fill="#ffffff" fill-opacity="0.9">WITH OTHER NATURAL FLAVORS</text>
  </g>
`;

// List of cans to render
const cans = [
  {
    id: 'original',
    filename: '7up.png',
    baseGradient: originalBaseGrad,
    artwork: originalArtwork,
    themeColor: '#008B3E',
  },
  {
    id: 'zero',
    filename: '7up-zero-sugar.png',
    baseGradient: zeroBaseGrad,
    artwork: zeroArtwork,
    themeColor: '#161719',
  },
  {
    id: 'cherry',
    filename: '7up-cherry.png',
    baseGradient: cherryBaseGrad,
    artwork: cherryArtwork,
    themeColor: '#7A0A22',
  },
  {
    id: 'tropical',
    filename: '7up-tropical.png',
    baseGradient: tropicalBaseGrad,
    artwork: tropicalArtwork,
    themeColor: '#009DB0',
  },
];

console.log('Rendering 4 photorealistic studio 3D cans...');

for (const can of cans) {
  const svg = buildPhotorealisticCanSvg(can);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 600,
    },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: 'Liberation Sans',
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outPath = path.join(outputDir, can.filename);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`Saved photorealistic can: ${outPath} (${(pngBuffer.length / 1024).toFixed(1)} KB)`);
}

console.log('All 4 real 7UP cans generated successfully!');
