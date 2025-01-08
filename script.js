// Variables
const photoUpload = document.getElementById("photoUpload");
const uploadBtn = document.getElementById("uploadBtn");
const tagInput = document.getElementById("tagInput");
const addTagsBtn = document.getElementById("addTagsBtn");
const filterInput = document.getElementById("filterInput");
const photoAlbum = document.getElementById("photoAlbum");
// New Variables for Save and Load Buttons
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");

let photos = []; // Store uploaded photos and their tags
let selectedPhoto = null; // For tagging specific photos

// Functions
const createPhotoCard = (photo) => {
    const card = document.createElement("div");
    card.classList.add("photo-card");
    card.innerHTML = `
        <img src="${photo.src}" alt="Photo">
        <div class="tags">${photo.tags.join(", ")}</div>
    `;
    card.addEventListener("click", () => {
        selectedPhoto = photo;
        alert("Selected photo for tagging");
    });
    return card;
};

const renderAlbum = (filterTag = "") => {
    photoAlbum.innerHTML = "";
    photos
        .filter(photo => filterTag === "" || photo.tags.includes(filterTag))
        .forEach(photo => {
            const photoCard = createPhotoCard(photo);
            photoAlbum.appendChild(photoCard);
        });
};

const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ src: reader.result, tags: [] });
        reader.onerror = () => reject("Failed to load file");
        reader.readAsDataURL(file);
    });
};

const addTags = async () => {
    if (selectedPhoto) {
        const tags = tagInput.value.split(",").map(tag => tag.trim());
        selectedPhoto.tags.push(...tags);
        selectedPhoto.tags = [...new Set(selectedPhoto.tags)]; // Avoid duplicates
        tagInput.value = "";
        renderAlbum();
    } else {
        alert("Please select a photo to add tags.");
    }
};

// Event Listeners
uploadBtn.addEventListener("click", async () => {
    const files = Array.from(photoUpload.files);
    const filePromises = files.map(handleFileUpload);
    try {
        const newPhotos = await Promise.all(filePromises);
        photos.push(...newPhotos);
        renderAlbum();
    } catch (error) {
        console.error("Error uploading files:", error);
    }
});

addTagsBtn.addEventListener("click", addTags);

filterInput.addEventListener("input", () => {
    const filterTag = filterInput.value.trim();
    renderAlbum(filterTag);
});

// Initial Render
renderAlbum();

// Function to Save Photos to LocalStorage
const savePhotos = () => {
    try {
        localStorage.setItem("photoAlbum", JSON.stringify(photos));
        alert("Photos saved successfully!");
    } catch (error) {
        console.error("Error saving photos:", error);
    }
};

// Function to Load Photos from LocalStorage
const loadPhotos = () => {
    try {
        const savedPhotos = localStorage.getItem("photoAlbum");
        if (savedPhotos) {
            photos = JSON.parse(savedPhotos);
            renderAlbum();
            alert("Photos loaded successfully!");
        } else {
            alert("No saved photos found.");
        }
    } catch (error) {
        console.error("Error loading photos:", error);
    }
};

// Event Listeners for Save and Load
saveBtn.addEventListener("click", savePhotos);
loadBtn.addEventListener("click", loadPhotos);
