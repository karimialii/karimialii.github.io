// Dark Mode Toggle
const toggleButton = document.getElementById("dark-mode-toggle");

toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    // Update button text
    toggleButton.textContent = document.body.classList.contains("light-mode")
        ? "Switch to Dark Mode"
        : "Switch to Light Mode";
});
