// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animate Header Text
gsap.fromTo(
    "header h1",
    { y: -50, opacity: 0 }, // Initial state
    { y: 0, opacity: 1, duration: 1, delay: 0.5 } // Final state
);

gsap.fromTo(
    "header p",
    { y: 50, opacity: 0 }, // Initial state
    { y: 0, opacity: 1, duration: 1, delay: 1 } // Final state
);

// Animate Links under Header
gsap.fromTo(
    "header .header-links a",
    { y: 50, opacity: 0 }, // Initial state (reduce y for better visibility)
    { y: 0, opacity: 1, duration: 1, delay: 1.5 } // Staggered animation
);

// Section animations on scroll
document.querySelectorAll("section").forEach((section) => {
    gsap.fromTo(
        section,
        { y: 0, opacity: 0 }, // Initial state
        {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // Start animation when the section enters the viewport
                end: "top 60%", // End animation when the section moves higher
                scrub: 0.5, // Smooth animation on scroll
            },
        }
    );
});

// Dark Mode Toggle
const toggleButton = document.getElementById("dark-mode-toggle");

toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    // Update button text
    toggleButton.textContent = document.body.classList.contains("light-mode")
        ? "Switch to Dark Mode"
        : "Switch to Light Mode";
});
