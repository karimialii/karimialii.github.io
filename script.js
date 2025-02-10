const navMenu = document.getElementById("nav-menu");
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.right-nav a');

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '-50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Debugging: Log all sections in the console
console.log("All sections on the page:", sections);
sections.forEach(section => {
    console.log("Section ID:", section.id);
});

// Active link highlighting on scroll
window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 3; // Adjusted offset

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    console.log("Current active section:", currentSection); // Debugging

    // Update navigation links' active state
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: "smooth" });
    });
});
