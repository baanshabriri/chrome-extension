document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('drop-area').addEventListener('click', triggerInputClick);
    document.getElementById('drop-area').addEventListener('dragover', handleDragOver);
    document.getElementById('drop-area').addEventListener('drop', handleDrop);
    document.getElementById('file-input').addEventListener('change', handleFileSelect);
});

function triggerInputClick() {
    document.getElementById('file-input').click();
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('drop-area').style.border = '2px dashed #333';
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('drop-area').style.border = '2px dashed #ccc';
    handleFileSelect(event);
}

async function handleFileSelect(event) {
    let file;

    if (event.target.files && event.target.files.length > 0) {
        // File selected using input[type=file]
        file = event.target.files[0];
    } else if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        // File dropped into the drop area
        file = event.dataTransfer.files[0];
    }
    if (file) {
        const reader = new FileReader();

        reader.onload = async function (e) {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.src = e.target.result;
            imagePreview.alt = file.name;

            // Convert the image to base64
            const base64Data = e.target.result.split(',')[1];
            await getImageSearchResults();
            console.log('Base64 Encoded Image:', base64Data);
        };
        reader.readAsDataURL(file);
    }
}