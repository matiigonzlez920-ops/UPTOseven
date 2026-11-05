const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');

// High fidelity illustration matching the exact user photo of the "Up to seven" 7UP cap
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <!-- Crown gradients -->
    <linearGradient id="crownGrad" x1="0.2" y1="0.1" x2="0.8" y2="0.9">
      <stop offset="0%" stop-color="#F2EDE2"/>
      <stop offset="45%" stop-color="#E8E2D5"/>
      <stop offset="85%" stop-color="#D7D0C1"/>
      <stop offset="100%" stop-color="#C5BEAE"/>
    </linearGradient>
    <linearGradient id="crownShadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="70%" stop-color="rgba(0,0,0,0.03)"/>
      <stop offset="100%" stop-color="rgba(10,30,15,0.2)"/>
    </linearGradient>

    <!-- Visor gradients -->
    <linearGradient id="visorTop" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="#2D7447"/>
      <stop offset="35%" stop-color="#22623B"/>
      <stop offset="75%" stop-color="#1B5130"/>
      <stop offset="100%" stop-color="#133D23"/>
    </linearGradient>
    <linearGradient id="visorUnder" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#13381F"/>
      <stop offset="100%" stop-color="#0A2213"/>
    </linearGradient>

    <!-- Embroidery 3D gradient -->
    <linearGradient id="emboss3D" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="#347C4F"/>
      <stop offset="30%" stop-color="#235F3A"/>
      <stop offset="80%" stop-color="#154226"/>
      <stop offset="100%" stop-color="#0C2D19"/>
    </linearGradient>

    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#051C0D" flood-opacity="0.12"/>
    </filter>

    <filter id="embroideryGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="#0B2B16" flood-opacity="0.6"/>
      <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#55A672" flood-opacity="0.35"/>
    </filter>
  </defs>

  <g filter="url(#dropShadow)">
    <!-- Underside rim edge shadow -->
    <path d="M 120 635 C 130 655, 340 705, 530 630 C 580 610, 680 620, 680 628 C 680 635, 560 635, 520 632 C 340 700, 140 655, 120 635 Z" fill="url(#visorUnder)"/>

    <!-- VISOR (Curved green peak) -->
    <path d="M 82 632 C 160 558, 475 585, 545 615 C 500 660, 395 696, 320 696 C 210 696, 120 665, 82 632 Z" fill="url(#visorTop)"/>

    <!-- Visor stitching curves -->
    <g fill="none" stroke="#164326" stroke-width="1.8" stroke-dasharray="7,4" opacity="0.65">
      <path d="M 105 631 C 180 575, 450 598, 515 621"/>
      <path d="M 125 636 C 195 587, 440 609, 498 630"/>
      <path d="M 148 642 C 210 599, 430 621, 480 639"/>
      <path d="M 172 649 C 230 612, 415 634, 460 648"/>
      <path d="M 198 656 C 255 625, 400 646, 438 658"/>
    </g>

    <!-- CROWN BACK & SIDES -->
    <path d="M 218 565 
             C 230 400, 310 305, 480 300 
             C 490 300, 500 303, 505 304 
             C 610 320, 700 405, 715 540 
             C 718 565, 715 605, 705 620 
             C 690 622, 600 616, 542 615 
             C 475 585, 260 560, 218 565 Z" 
          fill="url(#crownGrad)"/>

    <!-- Crown 3D subtle panel shading overlay -->
    <path d="M 218 565 
             C 230 400, 310 305, 480 300 
             C 490 300, 500 303, 505 304 
             C 610 320, 700 405, 715 540 
             C 718 565, 715 605, 705 620 
             C 690 622, 600 616, 542 615 
             C 475 585, 260 560, 218 565 Z" 
          fill="url(#crownShadow)"/>

    <!-- Panel Seam lines (5-panel construction) -->
    <g fill="none" stroke="#C4BCAB" stroke-width="2" opacity="0.8">
      <!-- Front-to-side seam (vertical curve) -->
      <path d="M 505 305 C 508 380, 515 500, 540 614"/>
      <!-- Eyelet on side panel -->
      <ellipse cx="600" cy="380" rx="4" ry="5.5" stroke="#B8B09E" stroke-width="2" fill="#8C8474"/>
    </g>

    <!-- Top green squatchee (button) -->
    <ellipse cx="482" cy="301" rx="19" ry="7" fill="#1C4F2F"/>
    <ellipse cx="482" cy="299" rx="16" ry="5" fill="#286940"/>

    <!-- EMBROIDERY: "Up to" (Front Top Line) -->
    <g filter="url(#embroideryGlow)">
      <!-- "Up to" stylized bold retro cursive/serif -->
      <text x="260" y="445" 
            font-family="'Fira Sans', 'Outfit', sans-serif" 
            font-size="108" 
            font-weight="900" 
            font-style="italic" 
            letter-spacing="-2" 
            fill="url(#emboss3D)" 
            stroke="#0D2E19" 
            stroke-width="5" 
            stroke-linejoin="round"
            transform="rotate(-5 260 445)">
        Up to
      </text>

      <!-- "seven" (Front Bottom Line) -->
      <text x="230" y="535" 
            font-family="'Fira Sans', 'Outfit', sans-serif" 
            font-size="112" 
            font-weight="900" 
            font-style="italic" 
            letter-spacing="-3" 
            fill="url(#emboss3D)" 
            stroke="#0D2E19" 
            stroke-width="5" 
            stroke-linejoin="round"
            transform="rotate(-4 230 535)">
        seven
      </text>
    </g>

    <!-- EMBROIDERY: "7up" on side panel -->
    <g filter="url(#embroideryGlow)" transform="translate(615, 530) scale(0.95) rotate(-6)">
      <!-- 7 -->
      <text x="0" y="50" 
            font-family="'Righteous', 'Rubik', sans-serif" 
            font-size="62" 
            font-weight="900" 
            font-style="italic" 
            fill="#1E5E37" 
            stroke="#0C2C18" 
            stroke-width="3">
        7
      </text>
      <!-- Red dot -->
      <circle cx="34" cy="24" r="8" fill="#E51E2B" stroke="#A30E18" stroke-width="2"/>
      <!-- up -->
      <text x="35" y="52" 
            font-family="'Righteous', 'Rubik', sans-serif" 
            font-size="44" 
            font-weight="900" 
            font-style="italic" 
            fill="#1E5E37" 
            stroke="#0C2C18" 
            stroke-width="2.5">
        up
      </text>
    </g>
  </g>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 800 },
});

const pngData = resvg.render().asPng();
const path = require('path');
const outPath1 = path.join(__dirname, '../public/gorra 2 1.png');
const outPath2 = path.join(__dirname, '../public/gorra.png');
fs.writeFileSync(outPath1, pngData);
fs.writeFileSync(outPath2, pngData);
console.log('Successfully rendered ' + outPath1 + ' and ' + outPath2);
