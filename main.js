function openImageModal(imageUrl) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageUrl;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeImageModal(event) {
    // Stop event propagation if the click is on the image itself, to prevent closing when interacting with the image.
    if (event && event.target.id === 'modalImage') {
        return;
    }
    const modal = document.getElementById('imageModal');
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}