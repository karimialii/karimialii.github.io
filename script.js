const reveals = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.top nav a');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach((el) => revealObserver.observe(el));

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach((section) => navObserver.observe(section));
