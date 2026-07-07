import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const present = join(root, '3-present');
const sourcePath = join(present, 'index.html');
const html = readFileSync(sourcePath, 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const scriptMatch = html.match(/<script>\n([\s\S]*?)\n<\/script>\s*<\/body>/);

if (!styleMatch || !scriptMatch) {
	throw new Error('Could not extract style or script from index.html');
}

const mainMatch = html.match(/<main class="deck-stage" id="deckStage">([\s\S]*?)<\/main>/);
if (!mainMatch) {
	throw new Error('Could not find deck stage in index.html');
}

const slideBlocks = mainMatch[1].split(/(?=<!-- SLIDE \d+)/).filter((block) => block.trim());

const sharedDir = join(present, 'shared');
const slidesDir = join(present, 'slides');
mkdirSync(sharedDir, { recursive: true });
mkdirSync(slidesDir, { recursive: true });

writeFileSync(join(sharedDir, 'deck.css'), styleMatch[1].trim() + '\n');

const manifest = [];

for (const block of slideBlocks) {
	const headerMatch = block.match(/<!-- SLIDE (\d+) — (.+?) -->/);
	const sectionMatch = block.match(/(<section[\s\S]*?<\/section>)/);
	if (!headerMatch || !sectionMatch) continue;

	const num = headerMatch[1];
	const titleSlug = headerMatch[2]
		.trim()
		.toLowerCase()
		.replace(/&amp;/g, 'and')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

	const filename = `${num.padStart(2, '0')}-${titleSlug}.html`;
	let section = sectionMatch[1];

	// Only the first slide should ship with active class; shell sets visibility at runtime.
	section = section.replace(/\s+active\b/, '');

	const fileContent = `<!-- SLIDE ${num} — ${headerMatch[2].trim()} -->\n${section}\n`;
	writeFileSync(join(slidesDir, filename), fileContent);

	const dataTitleMatch = section.match(/data-title="([^"]+)"/);
	manifest.push({
		file: filename,
		slide: Number(num),
		title: dataTitleMatch ? dataTitleMatch[1].replace(/&amp;/g, '&') : headerMatch[2].trim()
	});
}

writeFileSync(join(slidesDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

const deckJs = scriptMatch[1]
	.replace(
		"const stage = document.getElementById('deckStage');\n    const slides = Array.from(document.querySelectorAll('.slide'));",
		`const stage = document.getElementById('deckStage');
    let slides = [];`
	)
	.replace(
		'    buildTracker();\n\n    document.querySelectorAll',
		`    async function loadSlides() {
        const manifestRes = await fetch('slides/manifest.json');
        if (!manifestRes.ok) throw new Error('Failed to load slides/manifest.json');
        const manifest = await manifestRes.json();
        const parts = await Promise.all(
            manifest.map(async function (entry) {
                const res = await fetch('slides/' + entry.file);
                if (!res.ok) throw new Error('Failed to load slide: ' + entry.file);
                return res.text();
            })
        );
        stage.innerHTML = parts.join('\\n');
        slides = Array.from(stage.querySelectorAll('.slide'));
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) stage.innerHTML = saved;
            slides = Array.from(stage.querySelectorAll('.slide'));
        } catch (err) { /* ignore */ }
        buildTracker();
        wireGotoButtons();
        const hash = parseInt(location.hash.replace('#', ''), 10);
        showSlide(isNaN(hash) ? 0 : hash - 1);
        fitStage();
    }

    function wireGotoButtons() {
        document.querySelectorAll('[data-goto]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const target = parseInt(btn.getAttribute('data-goto'), 10);
                if (!isNaN(target)) showSlide(target - 1);
            });
        });
    }

    loadSlides().catch(function (err) {
        console.error(err);
        stage.innerHTML = '<p style="padding:48px;font-family:sans-serif;color:#DC2626;">Failed to load slides. Serve from a local server (not file://).</p>';
    });

    document.querySelectorAll`
	)
	.replace(
		`    document.querySelectorAll('[data-goto]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const target = parseInt(btn.getAttribute('data-goto'), 10);
            if (!isNaN(target)) showSlide(target - 1);
        });
    });

    prevBtn.addEventListener`,
		`    prevBtn.addEventListener`
	)
	.replace(
		`    const hash = parseInt(location.hash.replace('#', ''), 10);
    showSlide(isNaN(hash) ? 0 : hash - 1);

    const editor`,
		`    const editor`
	);

writeFileSync(join(sharedDir, 'deck.js'), deckJs.trim() + '\n');

const shell = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AI-First WMS — Phase 1 Scoping Pack</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="shared/deck.css" />
</head>
<body>
<div class="edit-hotzone" aria-hidden="true"></div>
<button class="edit-toggle" id="editToggle" type="button" title="Edit mode (E)">Edit</button>

<div class="deck-shell">
<nav class="deck-controls" aria-label="Presentation controls">
    <button type="button" id="prevBtn" aria-label="Previous slide">Prev</button>
    <span id="progressLabel">01 / 18</span>
    <button type="button" id="nextBtn" aria-label="Next slide">Next</button>
    <button type="button" id="pdfBtn" aria-label="Download slides as PDF">PDF</button>
    <a href="content-bank.html" aria-label="Open deck content bank">Content</a>
    <a href="https://github.com/earljman/Teoh-Capital-Case-Study" target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub">GitHub</a>
</nav>
<div class="deck-viewport">
<main class="deck-stage" id="deckStage" aria-busy="true"></main>
</div>

<nav class="deck-tracker" id="deckTracker" aria-label="Slide navigation"></nav>
</div>

<script src="shared/deck.js"></script>
</body>
</html>
`;

writeFileSync(join(present, 'index.html'), shell);

console.log(`Split ${manifest.length} slides into 3-present/slides/`);
console.log('Wrote shared/deck.css, shared/deck.js, and updated index.html shell');
