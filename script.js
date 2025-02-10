const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

// Scroll-triggered animations
const sections = document.querySelectorAll('section');
const otherSections = document.querySelector('.other-sections');

const options = {
    threshold: 0.2,
    rootMargin: '-50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

sections.forEach(section => observer.observe(section));


// Active link highlighting on scroll
const navLinks = document.querySelectorAll('.right-nav a');

// Section title switching
const sectionTitles = {
    'home': document.getElementById('homeTitle'),
    'about': document.getElementById('aboutTitle')
};

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= (sectionTop - 100)) { 
            current = section.getAttribute('id');
        }
    });

    // Update navigation links
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });

    // Update section titles
    Object.keys(sectionTitles).forEach(section => {
        if (section === current) {
            sectionTitles[section].style.display = 'flex';
        } else {
            sectionTitles[section].style.display = 'none';
        }
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: "smooth" });

    });
});

