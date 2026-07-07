(function () {
    const stage = document.getElementById('deckStage');
    let slides = [];
    const progressLabel = document.getElementById('progressLabel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pdfBtn = document.getElementById('pdfBtn');
    const trackerEl = document.getElementById('deckTracker');
    let current = 0;
    const storageKey = 'wms-deck-v1';

    function total() {
        return slides.length;
    }

    const ACTS = {
        I: { label: 'Act I', title: 'Thesis & Positioning' },
        II: { label: 'Act II', title: 'Scope & Roadmap' },
        III: { label: 'Act III', title: 'Dashboard & Workflows' },
        IV: { label: 'Act IV', title: 'Commercial Close' },
        V: { label: 'Act V', title: 'How This Deck Was Built' }
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

    function buildTracker() {
        if (!trackerEl) return;
        trackerEl.innerHTML = '';
        trackerSegs.length = 0;
        let currentGroup = null;
        let lastAct = null;

        slides.forEach(function (slide, index) {
            const act = slide.dataset.act;

            if (act !== lastAct) {
                if (lastAct !== null) {
                    const divider = document.createElement('div');
                    divider.className = 'deck-tracker-divider';
                    divider.setAttribute('aria-hidden', 'true');
                    trackerEl.appendChild(divider);
                }
                currentGroup = document.createElement('div');
                currentGroup.className = 'deck-tracker-group';
                currentGroup.dataset.act = act;
                trackerEl.appendChild(currentGroup);
                lastAct = act;
            }

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
        trackerSegs.forEach(function (seg, i) {
            seg.classList.toggle('active', i === current);
            seg.classList.toggle('passed', i < current);
            if (i === current) seg.setAttribute('aria-current', 'step');
            else seg.removeAttribute('aria-current');
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
        location.hash = String(current + 1);
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
            if (saved) stage.innerHTML = saved;
            slides = Array.from(stage.querySelectorAll('.slide'));
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
    pdfBtn.addEventListener('click', function () { window.print(); });

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
