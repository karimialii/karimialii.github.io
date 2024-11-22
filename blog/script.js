// Add a comment to a specific post
function addComment(postId) {
    const inputField = document.getElementById(`comment-input-${postId}`);
    const commentList = document.getElementById(`comments-${postId}`);
    const commentText = inputField.value.trim();

    if (commentText) {
        // Create a new comment element
        const newComment = document.createElement('li');
        newComment.textContent = commentText;

        // Add the comment to the list
        commentList.appendChild(newComment);

        // Clear the input field
        inputField.value = '';
    }
}
