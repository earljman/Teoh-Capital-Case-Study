import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** @param {string} rel */
function readSource(rel) {
	return readFileSync(join(root, rel), 'utf8');
}

/** @param {string} text */
function escapeHtml(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/**
 * @param {string} file
 * @param {number} [startLine] 1-based inclusive
 * @param {number} [endLine] 1-based inclusive
 */
function excerpt(file, startLine, endLine) {
	const lines = readSource(file).split('\n');
	const start = (startLine ?? 1) - 1;
	const end = endLine ?? lines.length;
	return lines.slice(start, end).join('\n');
}

/**
 * @typedef {{ label: string, file: string, start?: number, end?: number }} SourceBlock
 * @typedef {{ id: string, title: string, blocks: SourceBlock[] }} SlideSection
 */

/** @type {SlideSection[]} */
const sections = [
	{
		id: 'global',
		title: 'Global — cross-cutting',
		blocks: [
			{ label: '3-present/notes.md — header & deck meta', file: '3-present/notes.md', start: 1, end: 11 },
			{ label: '3-present/notes.md — The Bet', file: '3-present/notes.md', start: 15, end: 22 },
			{ label: '3-present/notes.md — Slide 4 test', file: '3-present/notes.md', start: 25, end: 32 },
			{ label: '3-present/notes.md — Narrative arc & presentation rule (Act III intro)', file: '3-present/notes.md', start: 87, end: 97 },
			{ label: '3-present/notes.md — Mock build sequence', file: '3-present/notes.md', start: 199, end: 213 },
			{ label: '3-present/notes.md — Deck vs. appendix', file: '3-present/notes.md', start: 216, end: 232 },
			{ label: '1-plan/00-phase1-planning-brief.md — §1 The Bet', file: '1-plan/00-phase1-planning-brief.md', start: 27, end: 32 },
			{ label: '1-plan/00-phase1-planning-brief.md — §6 Slide 4 test (updated)', file: '1-plan/00-phase1-planning-brief.md', start: 204, end: 205 },
			{ label: '_meta/advisory-panel.md — §B Slide-by-slide skeleton (full)', file: '_meta/advisory-panel.md', start: 111, end: 172 },
			{ label: '_meta/case-study-prompt.md', file: '_meta/case-study-prompt.md' },
		],
	},
	{
		id: 'slide-01',
		title: 'Slide 01 — Title + one-liner',
		blocks: [
			{ label: '3-present/notes.md — Act I table', file: '3-present/notes.md', start: 35, end: 43 },
			{ label: '_meta/advisory-panel.md — slide 1', file: '_meta/advisory-panel.md', start: 117, end: 117 },
			{ label: '_meta/case-study-prompt.md', file: '_meta/case-study-prompt.md' },
			{ label: '1-plan/00-phase1-planning-brief.md — §1 The Bet', file: '1-plan/00-phase1-planning-brief.md', start: 27, end: 32 },
		],
	},
	{
		id: 'slide-02',
		title: 'Slide 02 — The problem',
		blocks: [
			{ label: '3-present/notes.md — Act I table (slide 2)', file: '3-present/notes.md', start: 37, end: 41 },
			{ label: '_meta/advisory-panel.md — slide 2', file: '_meta/advisory-panel.md', start: 118, end: 118 },
			{ label: '1-plan/00-phase1-planning-brief.md — §2 ICP (switch trigger + scale)', file: '1-plan/00-phase1-planning-brief.md', start: 35, end: 43 },
			{ label: '1-plan/00-phase1-planning-brief.md — §3.1 portfolio painkiller rows', file: '1-plan/00-phase1-planning-brief.md', start: 84, end: 88 },
			{ label: '3-present/process-documentation.md — define-problem-statement note', file: '3-present/process-documentation.md', start: 47, end: 47 },
		],
	},
	{
		id: 'slide-03',
		title: 'Slide 03 — Market & wedge',
		blocks: [
			{ label: '3-present/notes.md — Act I table (slide 3)', file: '3-present/notes.md', start: 37, end: 43 },
			{ label: '_meta/advisory-panel.md — slide 3', file: '_meta/advisory-panel.md', start: 119, end: 119 },
			{ label: '1-plan/00-phase1-planning-brief.md — §2 ICP Assumption (full)', file: '1-plan/00-phase1-planning-brief.md', start: 35, end: 54 },
			{ label: '1-plan/03-roadmap.md — ICP assumption paragraph', file: '1-plan/03-roadmap.md', start: 30, end: 32 },
			{ label: '1-plan/04-users-and-checkpoints.md — operator context', file: '1-plan/04-users-and-checkpoints.md', start: 25, end: 39 },
		],
	},
	{
		id: 'slide-04',
		title: 'Slide 04 — The AI-first bet',
		blocks: [
			{ label: '3-present/notes.md — The Bet', file: '3-present/notes.md', start: 15, end: 22 },
			{ label: '3-present/notes.md — Act I table (slide 4)', file: '3-present/notes.md', start: 37, end: 43 },
			{ label: '_meta/advisory-panel.md — slide 4', file: '_meta/advisory-panel.md', start: 120, end: 120 },
			{ label: '1-plan/00-phase1-planning-brief.md — §1 The Bet', file: '1-plan/00-phase1-planning-brief.md', start: 27, end: 32 },
			{ label: '1-plan/00-phase1-planning-brief.md — §3.1 honest framing', file: '1-plan/00-phase1-planning-brief.md', start: 97, end: 97 },
			{ label: '1-plan/02-main-flows.md — Bet line', file: '1-plan/02-main-flows.md', start: 24, end: 24 },
			{ label: '1-plan/03-roadmap.md — Bet line', file: '1-plan/03-roadmap.md', start: 30, end: 30 },
		],
	},
	{
		id: 'slide-05',
		title: 'Slide 05 — Positioning',
		blocks: [
			{ label: '3-present/notes.md — Act I table (slide 5)', file: '3-present/notes.md', start: 37, end: 45 },
			{ label: '_meta/advisory-panel.md — slide 5', file: '_meta/advisory-panel.md', start: 121, end: 121 },
			{ label: '_meta/case-study-prompt.md — Competitors list', file: '_meta/case-study-prompt.md', start: 14, end: 19 },
		],
	},
	{
		id: 'slide-06',
		title: 'Slide 06 — Phase 1 feature portfolio',
		blocks: [
			{ label: '3-present/notes.md — Slide 6', file: '3-present/notes.md', start: 49, end: 61 },
			{ label: '_meta/advisory-panel.md — Act II portfolio', file: '_meta/advisory-panel.md', start: 127, end: 130 },
			{ label: '1-plan/00-phase1-planning-brief.md — §3.0 Architecture', file: '1-plan/00-phase1-planning-brief.md', start: 59, end: 80 },
			{ label: '1-plan/00-phase1-planning-brief.md — §3.1 Mapping table', file: '1-plan/00-phase1-planning-brief.md', start: 82, end: 97 },
			{ label: '1-plan/00-phase1-planning-brief.md — §3.2 Ship / Hold / Kill', file: '1-plan/00-phase1-planning-brief.md', start: 99, end: 109 },
			{ label: '1-plan/03-roadmap.md — Phase 1 ship scope (Week 12+ target)', file: '1-plan/03-roadmap.md', start: 291, end: 311 },
		],
	},
	{
		id: 'slide-07',
		title: 'Slide 07 — Roadmap arc',
		blocks: [
			{ label: '3-present/notes.md — Slide 7', file: '3-present/notes.md', start: 63, end: 83 },
			{ label: '_meta/advisory-panel.md — roadmap arc', file: '_meta/advisory-panel.md', start: 131, end: 131 },
			{ label: '1-plan/00-phase1-planning-brief.md — §3.3 Timeline', file: '1-plan/00-phase1-planning-brief.md', start: 111, end: 119 },
			{ label: '1-plan/03-roadmap.md — Roadmap arc', file: '1-plan/03-roadmap.md', start: 36, end: 49 },
			{ label: '1-plan/03-roadmap.md — Checkpoint 1 — Demo (intro)', file: '1-plan/03-roadmap.md', start: 53, end: 57 },
		],
	},
	{
		id: 'slide-08',
		title: 'Slide 08 — Checkpoint · Week 4',
		blocks: [
			{ label: '3-present/notes.md — Week 4', file: '3-present/notes.md', start: 67, end: 75 },
			{ label: '_meta/advisory-panel.md — Week 4 checkpoint', file: '_meta/advisory-panel.md', start: 132, end: 136 },
			{ label: '1-plan/00-phase1-planning-brief.md — Week 4 row', file: '1-plan/00-phase1-planning-brief.md', start: 115, end: 115 },
			{ label: '1-plan/03-roadmap.md — Checkpoint 2 — Week 4 (full)', file: '1-plan/03-roadmap.md', start: 139, end: 214 },
		],
	},
	{
		id: 'slide-09',
		title: 'Slide 09 — Checkpoint · Week 12',
		blocks: [
			{ label: '3-present/notes.md — Week 12', file: '3-present/notes.md', start: 77, end: 83 },
			{ label: '_meta/advisory-panel.md — Week 12 checkpoint', file: '_meta/advisory-panel.md', start: 137, end: 141 },
			{ label: '1-plan/00-phase1-planning-brief.md — Week 12 row', file: '1-plan/00-phase1-planning-brief.md', start: 116, end: 116 },
			{ label: '1-plan/03-roadmap.md — Checkpoint 3 — Week 12 (full)', file: '1-plan/03-roadmap.md', start: 218, end: 287 },
		],
	},
	{
		id: 'slide-10',
		title: 'Slide 10 — Executive dashboard',
		blocks: [
			{ label: '3-present/notes.md — Slide 10', file: '3-present/notes.md', start: 99, end: 114 },
			{ label: '3-present/notes.md — Slide 4 test (dashboard requirements)', file: '3-present/notes.md', start: 25, end: 32 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.1 Slide map (slide 10)', file: '1-plan/00-phase1-planning-brief.md', start: 142, end: 151 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.2 mock priority 1', file: '1-plan/00-phase1-planning-brief.md', start: 155, end: 157 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.3 drill-down (executive widgets)', file: '1-plan/00-phase1-planning-brief.md', start: 166, end: 174 },
			{ label: '1-plan/01-dashboard-ia.md — §1 Persona split', file: '1-plan/01-dashboard-ia.md', start: 32, end: 52 },
			{ label: '1-plan/01-dashboard-ia.md — §4 Executive dashboard Layout A', file: '1-plan/01-dashboard-ia.md', start: 161, end: 245 },
			{ label: '1-plan/01-dashboard-ia.md — §5 Executive drill-down map', file: '1-plan/01-dashboard-ia.md', start: 248, end: 256 },
			{ label: '1-plan/01-dashboard-ia.md — §6 Viewport (executive)', file: '1-plan/01-dashboard-ia.md', start: 270, end: 281 },
			{ label: '1-plan/01-dashboard-ia.md — §7 Executive mock states', file: '1-plan/01-dashboard-ia.md', start: 299, end: 306 },
			{ label: '1-plan/01-dashboard-ia.md — §8 Deck alignment', file: '1-plan/01-dashboard-ia.md', start: 320, end: 331 },
			{ label: '1-plan/04-users-and-checkpoints.md — Executive buyer', file: '1-plan/04-users-and-checkpoints.md', start: 56, end: 67 },
			{ label: '2-build/demo/README.md — Screens (executive row)', file: '2-build/demo/README.md', start: 11, end: 19 },
		],
	},
	{
		id: 'slide-11',
		title: 'Slide 11 — Compliance (AI-native)',
		blocks: [
			{ label: '3-present/notes.md — Slide 11', file: '3-present/notes.md', start: 120, end: 126 },
			{ label: '1-plan/02-main-flows.md — Slide 11 (full)', file: '1-plan/02-main-flows.md', start: 42, end: 61 },
			{ label: '1-plan/00-phase1-planning-brief.md — Feature 1 row', file: '1-plan/00-phase1-planning-brief.md', start: 86, end: 86 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.2 mock priority 2', file: '1-plan/00-phase1-planning-brief.md', start: 158, end: 158 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.3 compliance row', file: '1-plan/00-phase1-planning-brief.md', start: 170, end: 172 },
			{ label: '1-plan/01-dashboard-ia.md — §3.1 Action queue (compliance signals)', file: '1-plan/01-dashboard-ia.md', start: 102, end: 113 },
			{ label: '1-plan/04-users-and-checkpoints.md — Compliance manager', file: '1-plan/04-users-and-checkpoints.md', start: 87, end: 96 },
			{ label: '2-build/demo/README.md — /compliance route', file: '2-build/demo/README.md', start: 17, end: 17 },
		],
	},
	{
		id: 'slide-12',
		title: 'Slide 12 — Pick-path (AI-enhanced)',
		blocks: [
			{ label: '3-present/notes.md — Slide 12', file: '3-present/notes.md', start: 128, end: 134 },
			{ label: '1-plan/02-main-flows.md — Slide 12 (full)', file: '1-plan/02-main-flows.md', start: 65, end: 84 },
			{ label: '1-plan/00-phase1-planning-brief.md — Feature 2 row', file: '1-plan/00-phase1-planning-brief.md', start: 87, end: 87 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.2 mock priority 3', file: '1-plan/00-phase1-planning-brief.md', start: 159, end: 159 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.3 labor saved row', file: '1-plan/00-phase1-planning-brief.md', start: 172, end: 173 },
			{ label: '1-plan/01-dashboard-ia.md — §3.2 Dynamic batch status', file: '1-plan/01-dashboard-ia.md', start: 115, end: 123 },
			{ label: '1-plan/04-users-and-checkpoints.md — Picker', file: '1-plan/04-users-and-checkpoints.md', start: 100, end: 110 },
			{ label: '2-build/demo/README.md — /pick route', file: '2-build/demo/README.md', start: 18, end: 18 },
		],
	},
	{
		id: 'slide-13',
		title: 'Slide 13 — Cartonization (AI-enhanced)',
		blocks: [
			{ label: '3-present/notes.md — Slide 13', file: '3-present/notes.md', start: 136, end: 142 },
			{ label: '1-plan/02-main-flows.md — Slide 13 (full)', file: '1-plan/02-main-flows.md', start: 88, end: 97 },
			{ label: '1-plan/00-phase1-planning-brief.md — Feature 3 row', file: '1-plan/00-phase1-planning-brief.md', start: 88, end: 88 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.2 mock priority 4', file: '1-plan/00-phase1-planning-brief.md', start: 160, end: 160 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.3 DIM waste row', file: '1-plan/00-phase1-planning-brief.md', start: 174, end: 174 },
			{ label: '1-plan/01-dashboard-ia.md — §3.2 Cartonization efficiency', file: '1-plan/01-dashboard-ia.md', start: 119, end: 121 },
			{ label: '1-plan/04-users-and-checkpoints.md — Packer', file: '1-plan/04-users-and-checkpoints.md', start: 114, end: 124 },
			{ label: '2-build/demo/README.md — /pack route', file: '2-build/demo/README.md', start: 19, end: 19 },
		],
	},
	{
		id: 'slide-14',
		title: 'Slide 14 — Why this wins',
		blocks: [
			{ label: '3-present/notes.md — Slide 14', file: '3-present/notes.md', start: 156, end: 168 },
			{ label: '_meta/advisory-panel.md — Why this wins', file: '_meta/advisory-panel.md', start: 155, end: 155 },
			{ label: '1-plan/00-phase1-planning-brief.md — §7 Commercial Hooks', file: '1-plan/00-phase1-planning-brief.md', start: 208, end: 216 },
			{ label: '1-plan/03-roadmap.md — ROI anchors', file: '1-plan/03-roadmap.md', start: 394, end: 400 },
			{ label: '1-plan/01-dashboard-ia.md — §4.1 ROI anchors for mock copy', file: '1-plan/01-dashboard-ia.md', start: 198, end: 204 },
		],
	},
	{
		id: 'slide-15',
		title: 'Slide 15 — Assumptions & risks',
		blocks: [
			{ label: '3-present/notes.md — Slide 15', file: '3-present/notes.md', start: 170, end: 181 },
			{ label: '3-present/notes.md — ICP open question (Act I)', file: '3-present/notes.md', start: 45, end: 45 },
			{ label: '_meta/advisory-panel.md — Assumptions & risks', file: '_meta/advisory-panel.md', start: 156, end: 156 },
			{ label: '1-plan/00-phase1-planning-brief.md — §4 Top Four Risks', file: '1-plan/00-phase1-planning-brief.md', start: 123, end: 132 },
			{ label: '1-plan/03-roadmap.md — Top risks to test mitigation for', file: '1-plan/03-roadmap.md', start: 404, end: 413 },
			{ label: '1-plan/03-roadmap.md — Open questions', file: '1-plan/03-roadmap.md', start: 432, end: 440 },
		],
	},
	{
		id: 'slide-16',
		title: 'Slide 16 — Process overview',
		blocks: [
			{ label: '3-present/notes.md — Act V table (slide 16)', file: '3-present/notes.md', start: 185, end: 195 },
			{ label: '3-present/process-documentation.md — Slide 15 Process overview', file: '3-present/process-documentation.md', start: 7, end: 18 },
			{ label: '_meta/advisory-panel.md — Act V process overview', file: '_meta/advisory-panel.md', start: 164, end: 164 },
		],
	},
	{
		id: 'slide-17',
		title: 'Slide 17 — Research + Planning',
		blocks: [
			{ label: '3-present/notes.md — Act V table (slide 17)', file: '3-present/notes.md', start: 189, end: 193 },
			{ label: '3-present/process-documentation.md — Slide 16 Research', file: '3-present/process-documentation.md', start: 22, end: 37 },
			{ label: '3-present/process-documentation.md — Slide 17 Planning', file: '3-present/process-documentation.md', start: 41, end: 60 },
			{ label: '_meta/advisory-panel.md — Research + Planning slides', file: '_meta/advisory-panel.md', start: 165, end: 166 },
		],
	},
	{
		id: 'slide-18',
		title: 'Slide 18 — Development + Present',
		blocks: [
			{ label: '3-present/notes.md — Act V table (slide 18)', file: '3-present/notes.md', start: 189, end: 195 },
			{ label: '3-present/process-documentation.md — Slide 18 Development', file: '3-present/process-documentation.md', start: 64, end: 81 },
			{ label: '_meta/advisory-panel.md — Development + Present', file: '_meta/advisory-panel.md', start: 167, end: 168 },
			{ label: '2-build/demo/README.md (full)', file: '2-build/demo/README.md' },
			{ label: '3-present/notes.md — builder craft todos', file: '3-present/notes.md', start: 8, end: 9 },
		],
	},
	{
		id: 'appendix',
		title: 'Appendix — supervisor console, states, full sources',
		blocks: [
			{ label: '3-present/notes.md — Supervisor console', file: '3-present/notes.md', start: 116, end: 118 },
			{ label: '3-present/notes.md — Required states (all mocks)', file: '3-present/notes.md', start: 144, end: 152 },
			{ label: '1-plan/00-phase1-planning-brief.md — §5.4 Required states', file: '1-plan/00-phase1-planning-brief.md', start: 178, end: 187 },
			{ label: '1-plan/00-phase1-planning-brief.md — §6 Deck vs. Appendix', file: '1-plan/00-phase1-planning-brief.md', start: 191, end: 202 },
			{ label: '1-plan/01-dashboard-ia.md — §2 Supervisor console Layout A', file: '1-plan/01-dashboard-ia.md', start: 55, end: 157 },
			{ label: '1-plan/01-dashboard-ia.md — §6 Viewport (supervisor)', file: '1-plan/01-dashboard-ia.md', start: 282, end: 293 },
			{ label: '1-plan/01-dashboard-ia.md — §7 Supervisor mock states', file: '1-plan/01-dashboard-ia.md', start: 308, end: 316 },
			{ label: '1-plan/01-dashboard-ia.md — §4.4 Appendix trend chart', file: '1-plan/01-dashboard-ia.md', start: 225, end: 227 },
			{ label: '1-plan/02-main-flows.md — Mock states (minimum)', file: '1-plan/02-main-flows.md', start: 101, end: 119 },
			{ label: '1-plan/04-users-and-checkpoints.md (full)', file: '1-plan/04-users-and-checkpoints.md' },
			{ label: '1-plan/03-roadmap.md — Checkpoint 1 Demo (full)', file: '1-plan/03-roadmap.md', start: 53, end: 135 },
			{ label: '1-plan/03-roadmap.md — Explicitly out of scope', file: '1-plan/03-roadmap.md', start: 315, end: 369 },
			{ label: '1-plan/03-roadmap.md — Testing summary matrix', file: '1-plan/03-roadmap.md', start: 373, end: 390 },
			{ label: '1-plan/03-roadmap.md — Deck alignment', file: '1-plan/03-roadmap.md', start: 417, end: 428 },
		],
	},
	{
		id: 'full-sources',
		title: 'Full source files (verbatim)',
		blocks: [
			{ label: '3-present/notes.md', file: '3-present/notes.md' },
			{ label: '3-present/process-documentation.md', file: '3-present/process-documentation.md' },
			{ label: '1-plan/00-phase1-planning-brief.md', file: '1-plan/00-phase1-planning-brief.md' },
			{ label: '1-plan/01-dashboard-ia.md', file: '1-plan/01-dashboard-ia.md' },
			{ label: '1-plan/02-main-flows.md', file: '1-plan/02-main-flows.md' },
			{ label: '1-plan/03-roadmap.md', file: '1-plan/03-roadmap.md' },
			{ label: '1-plan/04-users-and-checkpoints.md', file: '1-plan/04-users-and-checkpoints.md' },
			{ label: '2-build/demo/README.md', file: '2-build/demo/README.md' },
			{ label: '_meta/advisory-panel.md — §A Include/Cut/Imply', file: '_meta/advisory-panel.md', start: 84, end: 107 },
			{ label: '_meta/case-study-prompt.md', file: '_meta/case-study-prompt.md' },
		],
	},
];

function renderSection(section) {
	const blocks = section.blocks
		.map((block) => {
			const text = excerpt(block.file, block.start, block.end);
			return `        <details class="source-block">
          <summary>${escapeHtml(block.label)}</summary>
          <pre class="source-text">${escapeHtml(text)}</pre>
        </details>`;
		})
		.join('\n');

	return `    <details class="slide-section" id="${section.id}" open>
      <summary class="slide-summary">${escapeHtml(section.title)}</summary>
      <div class="slide-body">
${blocks}
      </div>
    </details>`;
}

const body = sections.map(renderSection).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Deck Content Bank — AI-First WMS</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:wght@500;600&display=swap" rel="stylesheet" />
<style>
:root {
  --navy: #1C2644;
  --cream: #F0ECE3;
  --ink: #1A2030;
  --gold: #C8A870;
  --border: #CAC4B4;
  --muted: #5A6270;
  --font-serif: 'Source Serif 4', Georgia, serif;
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--cream);
  color: var(--ink);
  line-height: 1.5;
}
.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--navy);
  color: var(--cream);
  padding: 20px 32px;
  border-bottom: 1px solid #2E3D5C;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 24px;
  flex-wrap: wrap;
}
.page-header h1 {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}
.page-header p {
  margin: 0;
  font-size: 14px;
  color: #8A96A8;
}
.page-header a {
  color: var(--gold);
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
}
.toolbar {
  padding: 12px 32px;
  background: #E6E0D4;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  position: sticky;
  top: 72px;
  z-index: 9;
}
.toolbar button, .toolbar a {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--cream);
  border: 1px solid var(--border);
  color: var(--ink);
  padding: 8px 12px;
  cursor: pointer;
  text-decoration: none;
}
.toolbar button:hover, .toolbar a:hover {
  border-color: var(--gold);
  color: var(--navy);
}
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: calc(100vh - 120px);
}
.nav {
  border-right: 1px solid var(--border);
  padding: 20px 0;
  position: sticky;
  top: 120px;
  align-self: start;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}
.nav a {
  display: block;
  padding: 8px 24px;
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
  border-left: 2px solid transparent;
}
.nav a:hover, .nav a.active {
  color: var(--ink);
  border-left-color: var(--gold);
  background: rgba(200, 168, 112, 0.08);
}
.main {
  padding: 24px 32px 64px;
  max-width: 1100px;
}
.slide-section {
  border: 1px solid var(--border);
  margin-bottom: 16px;
  background: #fff;
}
.slide-section > summary.slide-summary {
  list-style: none;
  cursor: pointer;
  padding: 16px 20px;
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1px solid transparent;
}
.slide-section[open] > summary.slide-summary {
  border-bottom-color: var(--border);
  background: rgba(200, 168, 112, 0.06);
}
.slide-section > summary.slide-summary::-webkit-details-marker { display: none; }
.slide-section > summary.slide-summary::before {
  content: '▸ ';
  color: var(--gold);
  font-family: var(--font-mono);
}
.slide-section[open] > summary.slide-summary::before { content: '▾ '; }
.slide-body {
  padding: 12px 16px 16px;
}
.source-block {
  border: 1px solid var(--border);
  margin-bottom: 10px;
}
.source-block > summary {
  list-style: none;
  cursor: pointer;
  padding: 10px 14px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--muted);
  background: var(--cream);
}
.source-block > summary::-webkit-details-marker { display: none; }
.source-block > summary::before {
  content: '+ ';
  color: var(--gold);
}
.source-block[open] > summary::before { content: '− '; }
.source-block[open] > summary {
  border-bottom: 1px solid var(--border);
  color: var(--ink);
}
.source-text {
  margin: 0;
  padding: 14px 16px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-x: auto;
  max-height: 70vh;
  overflow-y: auto;
  background: #fff;
}
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .nav { display: none; }
}
</style>
</head>
<body>
<header class="page-header">
  <div>
    <h1>Deck Content Bank</h1>
    <p>Verbatim source material · organized by slide · expand to copy into deck</p>
  </div>
  <a href="index.html">← Back to slides</a>
</header>
<div class="toolbar">
  <button type="button" id="expandAll">Expand all</button>
  <button type="button" id="collapseAll">Collapse all</button>
  <button type="button" id="expandSlides">Slides only</button>
</div>
<div class="layout">
  <nav class="nav" aria-label="Slide sections">
${sections.map((s) => `    <a href="#${s.id}">${escapeHtml(s.title.replace(/^Slide \d+ — /, ''))}</a>`).join('\n')}
  </nav>
  <main class="main">
${body}
  </main>
</div>
<script>
(function () {
  const slideSections = document.querySelectorAll('.slide-section');
  const sourceBlocks = document.querySelectorAll('.source-block');
  document.getElementById('expandAll').addEventListener('click', function () {
    slideSections.forEach(function (el) { el.open = true; });
    sourceBlocks.forEach(function (el) { el.open = true; });
  });
  document.getElementById('collapseAll').addEventListener('click', function () {
    slideSections.forEach(function (el) { el.open = false; });
    sourceBlocks.forEach(function (el) { el.open = false; });
  });
  document.getElementById('expandSlides').addEventListener('click', function () {
    slideSections.forEach(function (el) { el.open = true; });
    sourceBlocks.forEach(function (el) { el.open = false; });
  });
  document.querySelectorAll('.nav a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.open = true;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
</script>
</body>
</html>
`;

writeFileSync(join(root, '3-present/content-bank.html'), html);
console.log('Wrote 3-present/content-bank.html');
