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

async function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('drop-area').style.border = '2px dashed #ccc';
    await handleFileSelect(event);
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
        };
        reader.readAsDataURL(file);
    }
}

function loaderOn() {
    document.getElementById('rainbowLoader').style.display = 'block';
    document.getElementById('submit-image').disabled = true;
}


function loaderOff() {
    document.getElementById('rainbowLoader').style.display = 'none';
    document.getElementById('submit-image').disabled = false;
}

document.getElementById('submit-image').addEventListener('click', async () => {

    loaderOn();
    const base64Image = document.getElementById('image-preview').src.split(',')[1];
    const fileName = document.getElementById('image-preview').alt;
    const searchResults = await getImageSearchResults(base64Image, fileName);
    console.log(searchResults);
    if (searchResults && searchResults.length > 0) {
        renderSearchResults(searchResults);
    }
    loaderOff();
});

function renderSearchResults(results) {
    const table = document.createElement('table');

    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Image';
    headerRow.insertCell().textContent = 'Name';
    headerRow.insertCell().textContent = 'Domain';
    headerRow.insertCell().textContent = 'Breach Date';
    headerRow.insertCell().textContent = 'Verified';

    results.forEach(result => {
        const { Name, Domain, BreachDate, LogoPath, IsVerified } = result;
        const row = table.insertRow();


        row.insertCell().textContent = Name;
        row.insertCell().textContent = Domain;
        row.insertCell().textContent = BreachDate;

        // Creating an image element for the logo
        const logoCell = row.insertCell();
        const logoImg = document.createElement('img');
        logoImg.src = LogoPath;
        logoImg.alt = 'Logo';
        logoCell.appendChild(logoImg);

        // Converting boolean value to "Yes" or "No"
        const verifiedCell = row.insertCell();
        verifiedCell.textContent = IsVerified ? 'Yes' : 'No';
    });

    // Append the table to a container div
    const container = document.getElementById('result-container');
    container.innerHTML = ''; // Clear previous results
    container.appendChild(table);
}

async function getImageSearchResults(base64Image, fileName) {
    try {
        const title = Math.random().toString(36).slice(-6) + '-' + fileName;
        const requestBody = `image=${encodeURIComponent(base64Image)}`;
        let response = await fetch('http://localhost:8080/api/web-detection?fileName=' + title, {
            method: 'POST',
            body: requestBody,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to fetch image search results');
        }
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}
