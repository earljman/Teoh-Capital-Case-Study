(function () {
    const stage = document.getElementById('deckStage');
    let slides = [];
    const progressLabel = document.getElementById('progressLabel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pdfBtn = document.getElementById('pdfBtn');
    const trackerEl = document.getElementById('deckTracker');
    let current = 0;
    const storageKey = 'wms-deck-v2';

    function total() {
        return slides.length;
    }

    const ACTS = {
        I: { label: 'Act I', title: 'Thesis & Positioning' },
        II: { label: 'Act II', title: 'Scope & Roadmap' },
        III: { label: 'Act III', title: 'Surfaces & Flows' },
        IV: { label: 'Act IV', title: 'Commercial Close' },
        V: { label: 'Act V', title: 'How This Was Built' }
    };

    const trackerSegs = [];

    function getSlideTitle(slide, index) {
        if (slide.dataset.title) return slide.dataset.title;
        const section = slide.querySelector('.section-label');
        if (section) return section.textContent.trim();
        return 'Slide ' + String(index + 1).padStart(2, '0');
    }

    function getActMeta(slide) {
        const key = slide.dataset.act;
        return ACTS[key] || { label: 'Act', title: '' };
    }

    function isActTitleSlide(slide) {
        return slide.classList.contains('act-divider');
    }

    function findActTitleIndex(actKey) {
        return slides.findIndex(function (slide) {
            return slide.dataset.act === actKey && isActTitleSlide(slide);
        });
    }

    function buildTracker() {
        if (!trackerEl) return;
        trackerEl.innerHTML = '';
        trackerSegs.length = 0;
        let currentGroup = null;
        let lastAct = null;

        slides.forEach(function (slide, index) {
            const act = slide.dataset.act;
            const actTitle = isActTitleSlide(slide);

            if (act !== lastAct) {
                if (lastAct !== null) {
                    const titleIndex = findActTitleIndex(act);
                    const divider = document.createElement('button');
                    divider.type = 'button';
                    divider.className = 'deck-tracker-divider';
                    const actMeta = ACTS[act] || { label: 'Act', title: '' };
                    const label = actMeta.label + (actMeta.title ? ' · ' + actMeta.title : '');
                    divider.setAttribute('aria-label', 'Go to ' + label);
                    divider.title = label;
                    if (titleIndex >= 0) {
                        divider.addEventListener('click', function () { showSlide(titleIndex); });
                    } else {
                        divider.disabled = true;
                    }
                    trackerEl.appendChild(divider);
                }
                currentGroup = document.createElement('div');
                currentGroup.className = 'deck-tracker-group';
                currentGroup.dataset.act = act;
                trackerEl.appendChild(currentGroup);
                lastAct = act;
            }

            // Act title slides are reached via the divider, not a tracker segment
            if (actTitle) return;

            const actMeta = getActMeta(slide);
            const title = getSlideTitle(slide, index);
            const num = String(index + 1).padStart(2, '0');

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'deck-tracker-seg';
            btn.dataset.index = String(index);
            btn.setAttribute('aria-label', actMeta.label + ' · ' + title + ' (slide ' + num + ')');

            const tooltip = document.createElement('span');
            tooltip.className = 'deck-tracker-tooltip';
            tooltip.setAttribute('role', 'tooltip');
            tooltip.innerHTML =
                '<span class="tooltip-act">' + actMeta.label + ' · ' + actMeta.title + '</span>' +
                '<span class="tooltip-slide">' + num + ' · ' + title + '</span>';
            btn.appendChild(tooltip);

            btn.addEventListener('click', function () { showSlide(index); });
            currentGroup.appendChild(btn);
            trackerSegs.push(btn);
        });
    }

    function updateTracker() {
        trackerSegs.forEach(function (seg) {
            const index = parseInt(seg.dataset.index, 10);
            seg.classList.toggle('active', index === current);
            seg.classList.toggle('passed', index < current);
            if (index === current) seg.setAttribute('aria-current', 'step');
            else seg.removeAttribute('aria-current');
        });

        if (!trackerEl) return;
        trackerEl.querySelectorAll('.deck-tracker-divider').forEach(function (divider) {
            const actGroup = divider.nextElementSibling;
            const actKey = actGroup && actGroup.dataset ? actGroup.dataset.act : null;
            const titleIndex = actKey ? findActTitleIndex(actKey) : -1;
            divider.classList.toggle('active', titleIndex === current);
            divider.classList.toggle('passed', titleIndex >= 0 && titleIndex < current);
        });
    }

    const viewportEl = document.querySelector('.deck-viewport');

    function fitStage() {
        const vw = viewportEl.clientWidth;
        const vh = viewportEl.clientHeight;
        const factor = Math.min(vw / 1920, vh / 1080);
        const x = (vw - 1920 * factor) / 2;
        const y = (vh - 1080 * factor) / 2;
        stage.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + factor + ')';
    }

    function showSlide(index) {
        if (!slides.length) return;
        current = Math.max(0, Math.min(index, total() - 1));
        slides.forEach(function (slide, i) {
            const on = i === current;
            slide.classList.toggle('active', on);
            slide.classList.toggle('visible', on);
        });
        const n = String(current + 1).padStart(2, '0');
        const t = String(total()).padStart(2, '0');
        progressLabel.textContent = n + ' / ' + t;
        updateTracker();
        const nextHash = String(current + 1);
        if (location.hash.replace(/^#/, '') !== nextHash) {
            location.hash = nextHash;
        }
    }

    function next() { showSlide(current + 1); }
    function prev() { showSlide(current - 1); }

    async function loadSlides() {
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
        stage.innerHTML = parts.join('\n');
        slides = Array.from(stage.querySelectorAll('.slide'));
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const probe = document.createElement('div');
                probe.innerHTML = saved;
                const savedSlides = probe.querySelectorAll('.slide');
                // Only restore inline edits when the deck structure still matches
                if (savedSlides.length === slides.length) {
                    stage.innerHTML = saved;
                    slides = Array.from(stage.querySelectorAll('.slide'));
                } else {
                    localStorage.removeItem(storageKey);
                }
            }
        } catch (err) { /* ignore */ }
        buildTracker();
        wireGotoButtons();
        stage.removeAttribute('aria-busy');
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

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    function eagerLoadSlideImages() {
        stage.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
            img.loading = 'eager';
            // Force fetch while still on screen (lazy images on later slides may never load)
            if (!img.complete && img.dataset.src) img.src = img.dataset.src;
            else if (!img.complete && img.src) {
                const src = img.getAttribute('src');
                if (src) img.src = src;
            }
        });
    }

    function waitForImages(timeoutMs) {
        const images = Array.from(stage.querySelectorAll('img'));
        if (!images.length) return Promise.resolve();
        return Promise.race([
            Promise.all(
                images.map(function (img) {
                    if (img.complete) return Promise.resolve();
                    return new Promise(function (resolve) {
                        img.addEventListener('load', resolve, { once: true });
                        img.addEventListener('error', resolve, { once: true });
                    });
                })
            ),
            new Promise(function (resolve) { setTimeout(resolve, timeoutMs || 4000); })
        ]);
    }

    function preparePrint() {
        document.title = 'AI-First-WMS-Phase-1-Scoping-Pack';
        document.body.classList.add('is-printing');
        eagerLoadSlideImages();
        return waitForImages(4000);
    }

    function cleanupPrint() {
        document.body.classList.remove('is-printing');
    }

    window.addEventListener('beforeprint', function () {
        document.body.classList.add('is-printing');
        eagerLoadSlideImages();
    });
    window.addEventListener('afterprint', cleanupPrint);

    pdfBtn.addEventListener('click', function () {
        pdfBtn.disabled = true;
        pdfBtn.setAttribute('aria-busy', 'true');
        preparePrint().finally(function () {
            window.print();
            pdfBtn.disabled = false;
            pdfBtn.removeAttribute('aria-busy');
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.target && e.target.getAttribute('contenteditable') === 'true') {
            if (e.key === 'Escape') e.target.blur();
            return;
        }
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            e.preventDefault();
            next();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            prev();
        } else if (e.key === 'Home') {
            e.preventDefault();
            showSlide(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            showSlide(total() - 1);
        }
    });

    let touchX = null;
    document.addEventListener('touchstart', function (e) {
        touchX = e.changedTouches[0].screenX;
    }, { passive: true });
    document.addEventListener('touchend', function (e) {
        if (touchX === null) return;
        const dx = e.changedTouches[0].screenX - touchX;
        if (Math.abs(dx) > 50) {
            if (dx < 0) next();
            else prev();
        }
        touchX = null;
    }, { passive: true });

    let wheelLock = false;
    document.addEventListener('wheel', function (e) {
        if (wheelLock) return;
        if (Math.abs(e.deltaY) < 20) return;
        wheelLock = true;
        if (e.deltaY > 0) next();
        else prev();
        setTimeout(function () { wheelLock = false; }, 500);
    }, { passive: true });

    window.addEventListener('resize', fitStage);
    window.addEventListener('hashchange', function () {
        const hash = parseInt(location.hash.replace('#', ''), 10);
        if (!isNaN(hash) && hash - 1 !== current) showSlide(hash - 1);
    });
    fitStage();

    const editor = {
        isActive: false,
        toggleEditMode: function () {
            this.isActive = !this.isActive;
            document.body.classList.toggle('edit-mode', this.isActive);
            editToggle.classList.toggle('active', this.isActive);
            editToggle.textContent = this.isActive ? 'Editing' : 'Edit';
            const nodes = document.querySelectorAll('h1, h2, h3, h4, p, li, td, .label, .kicker, .panel-title, .lead, .body, .caption, .stat, .skill-chip, .feature-card h3, .feature-card p, .slot, .frame-hint, .metric-label, .block-label, .note-label, .col-label, .slot-label, .phase-num, .phase, .frame-label');
            nodes.forEach(function (el) {
                el.setAttribute('contenteditable', this.isActive ? 'true' : 'false');
            }.bind(this));
            if (!this.isActive) this.save();
        },
        save: function () {
            try { localStorage.setItem(storageKey, stage.innerHTML); } catch (err) { /* ignore */ }
        }
    };

    const hotzone = document.querySelector('.edit-hotzone');
    const editToggle = document.getElementById('editToggle');
    let hideTimeout = null;

    editToggle.addEventListener('click', function () { editor.toggleEditMode(); });
    hotzone.addEventListener('mouseenter', function () {
        clearTimeout(hideTimeout);
        editToggle.classList.add('show');
    });
    hotzone.addEventListener('mouseleave', function () {
        hideTimeout = setTimeout(function () {
            if (!editor.isActive) editToggle.classList.remove('show');
        }, 400);
    });
    editToggle.addEventListener('mouseenter', function () { clearTimeout(hideTimeout); });
    editToggle.addEventListener('mouseleave', function () {
        hideTimeout = setTimeout(function () {
            if (!editor.isActive) editToggle.classList.remove('show');
        }, 400);
    });
    hotzone.addEventListener('click', function () { editor.toggleEditMode(); });

    document.addEventListener('keydown', function (e) {
        if ((e.key === 'e' || e.key === 'E') && !e.target.getAttribute('contenteditable')) {
            editor.toggleEditMode();
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            editor.save();
        }
    });

    stage.addEventListener('input', function () {
        if (editor.isActive) editor.save();
    });
})();
