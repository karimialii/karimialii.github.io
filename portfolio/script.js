// Dark Mode Toggle
const toggleButton = document.getElementById("dark-mode-toggle");
toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    toggleButton.textContent = document.body.classList.contains("light-mode")
        ? "Switch to Dark Mode"
        : "Switch to Light Mode";
});

// Add a comment to a specific portfolio item
function addComment(itemId) {
    const inputField = document.getElementById(`comment-input-${itemId}`);
    const commentList = document.getElementById(`comments-${itemId}`);
    const commentText = inputField.value.trim();

    if (commentText) {
        const newComment = document.createElement('li');
        newComment.textContent = commentText;
        commentList.appendChild(newComment);
        inputField.value = '';
    }
}

// Popup Functions
function openPopup(imageSrc) {
    const popup = document.getElementById("image-popup");
    const popupImg = document.getElementById("popup-img");
    popup.style.display = "flex"; // Show the popup
    popupImg.src = imageSrc; // Set the image source
}

function closePopup() {
    const popup = document.getElementById("image-popup");
    popup.style.display = "none"; // Hide the popup
}
