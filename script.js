(() => {
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];

    /* Theme toggle: light paper and blueprint */
    $('.theme-toggle').addEventListener('click', () => {
        const dark = root.dataset.theme
            ? root.dataset.theme === 'dark'
            : matchMedia('(prefers-color-scheme: dark)').matches;
        const next = dark ? 'light' : 'dark';
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) {}
    });

    /* Pointer effects share one rAF-throttled handler: grid highlight and card spotlight */
    let px = 0, py = 0, pending = false, target = null;
    const onMove = (e) => {
        px = e.clientX; py = e.clientY; target = e.target;
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            pending = false;
            root.style.setProperty('--mx', px + 'px');
            root.style.setProperty('--my', py + 'px');
            const spot = target && target.closest && target.closest('.spot');
            if (spot) {
                const r = spot.getBoundingClientRect();
                spot.style.setProperty('--x', px - r.left + 'px');
                spot.style.setProperty('--y', py - r.top + 'px');
            }
        });
    };
    if (finePointer && !reduce) document.addEventListener('pointermove', onMove, { passive: true });

    /* Magnetic buttons */
    if (finePointer && !reduce) {
        $$('[data-magnetic]').forEach((el) => {
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                el.style.setProperty('--mx-btn', ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px');
                el.style.setProperty('--my-btn', ((e.clientY - r.top - r.height / 2) * 0.28).toFixed(1) + 'px');
            });
            el.addEventListener('pointerleave', () => {
                el.style.setProperty('--mx-btn', '0px');
                el.style.setProperty('--my-btn', '0px');
            });
        });
    }

    /* Turbine schematic: hover or focus a part to read how it is modeled */
    const caption = $('.sch-caption');
    const capTitle = $('b', caption);
    const capText = $('span', caption);
    const defTitle = capTitle.textContent;
    const defText = capText.textContent;
    let capTimer;
    const showPart = (part) => {
        clearTimeout(capTimer);
        $$('.part').forEach((p) => p.classList.toggle('on', p === part));
        caption.classList.add('swap');
        capTimer = setTimeout(() => {
            capTitle.textContent = part ? part.dataset.title + '.' : defTitle;
            capText.textContent = part ? part.dataset.text : defText;
            caption.classList.remove('swap');
        }, 120);
    };
    $$('.part').forEach((p) => {
        p.addEventListener('pointerenter', () => showPart(p));
        p.addEventListener('focus', () => showPart(p));
        p.addEventListener('pointerleave', () => showPart(null));
        p.addEventListener('blur', () => showPart(null));
        p.addEventListener('click', () => { location.hash = '#projects'; });
    });

    /* Scroll reveal with per-group stagger */
    $$('[data-stagger]').forEach((group) => {
        $$('.reveal', group).forEach((el, i) => el.style.setProperty('--i', i));
    });
    const revealIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            revealIO.unobserve(entry.target);
            $$('[data-count]', entry.target).forEach(countUp);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => revealIO.observe(el));
    $$('h2').forEach((h) => revealIO.observe(h));

    /* Count-up */
    function countUp(el) {
        const end = +el.dataset.count;
        if (reduce) { el.textContent = end; return; }
        const start = performance.now();
        const dur = 1400;
        const ease = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
        el.textContent = '0';
        (function tick(now) {
            const t = Math.min((now - start) / dur, 1);
            el.textContent = Math.round(end * ease(t));
            if (t < 1) requestAnimationFrame(tick);
        })(start);
    }

    /* Section index: mark the section in view */
    const indexLinks = $$('.index a');
    const setActive = (id) => indexLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    const sectionIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    [...$$('main section[id]'), $('#contact')].forEach((s) => sectionIO.observe(s));
    new IntersectionObserver((entries) => { if (entries[0].isIntersecting) setActive('top'); }, { rootMargin: '-45% 0px -50% 0px' }).observe($('.hero'));

    /* Software scroller buttons */
    const scroller = $('.scroller');
    $$('[data-scroll]').forEach((btn) => btn.addEventListener('click', () => {
        scroller.scrollBy({ left: +btn.dataset.scroll * 340, behavior: reduce ? 'auto' : 'smooth' });
    }));

    /* Research filter */
    const items = $$('.research .item');
    $$('.chip').forEach((chip) => chip.addEventListener('click', () => {
        $$('.chip').forEach((c) => {
            const on = c === chip;
            c.classList.toggle('active', on);
            c.setAttribute('aria-selected', on);
        });
        const f = chip.dataset.filter;
        items.forEach((it) => {
            const show = f === 'all' || it.dataset.cat === f;
            if (show) {
                it.hidden = false;
                requestAnimationFrame(() => it.classList.remove('hide'));
            } else {
                it.classList.add('hide');
                setTimeout(() => { if (it.classList.contains('hide')) it.hidden = true; }, 220);
            }
        });
    }));

    /* Accordion slider */
    const panels = $$('.panel');
    const studyCaption = $('.caption');
    const setStudyCaption = (p) => {
        $('.cap-title', studyCaption).textContent = p.dataset.title;
        $('.cap-body', studyCaption).textContent = p.dataset.text;
        $('.cap-tools', studyCaption).textContent = p.dataset.tools;
    };
    const activate = (panel) => {
        if (panel.classList.contains('active')) return;
        panels.forEach((p) => {
            const on = p === panel;
            p.classList.toggle('active', on);
            p.setAttribute('aria-selected', on);
        });
        studyCaption.classList.add('swap');
        setTimeout(() => { setStudyCaption(panel); studyCaption.classList.remove('swap'); }, 200);
    };
    panels.forEach((p) => {
        p.addEventListener('click', () => activate(p));
        p.addEventListener('focus', () => activate(p));
        if (finePointer) p.addEventListener('pointerenter', () => activate(p));
    });
    setStudyCaption($('.panel.active'));

    /* Copy email with toast */
    const toast = $('.toast');
    let toastTimer;
    $('.copy').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        try { await navigator.clipboard.writeText(btn.dataset.email); } catch (err) { location.href = 'mailto:' + btn.dataset.email; return; }
        btn.classList.add('done');
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { toast.classList.remove('show'); btn.classList.remove('done'); }, 2000);
    });
})();
