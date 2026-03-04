// ------------------------------
// Fake data voor demo
// ------------------------------
let videoIndex = 0;

function generateFakeVideo() {
    videoIndex++;
    return {
        id: videoIndex,
        channel: "Kanaal " + videoIndex,
        profile: "https://via.placeholder.com/80",
        video: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        likes: Math.floor(Math.random() * 200),
        comments: [],
    };
}

let feedData = [];
for (let i = 0; i < 5; i++) feedData.push(generateFakeVideo());

// ------------------------------
// Elementen
// ------------------------------
const feed = document.getElementById("feed");
const sentinel = document.getElementById("sentinel");
const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("searchSuggestions");

const commentsModal = document.getElementById("comments-modal");
const commentsList = document.getElementById("comments-list");
const commentInput = document.getElementById("commentInput");
const sendCommentBtn = document.getElementById("sendCommentBtn");

// ------------------------------
// Feed renderen
// ------------------------------
function renderFeed() {
    feed.innerHTML = "";

    feedData.forEach(video => {
        const card = document.createElement("div");
        card.className = "video-card";

        card.innerHTML = `
            <video src="${video.video}" controls class="video-player"></video>
            <div class="video-info">
                <img src="${video.profile}" class="channel-icon">
                <span>${video.channel}</span>
            </div>
            <div class="actions">
                <button class="like-btn" data-id="${video.id}">❤️ ${video.likes}</button>
                <button class="comment-btn" data-id="${video.id}">💬 ${video.comments.length}</button>
                <button class="share-btn" data-id="${video.id}">📤 Deel</button>
            </div>
        `;

        feed.appendChild(card);
    });

    attachActionEvents();
}

renderFeed();

// ------------------------------
// Infinite scroll
// ------------------------------
const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        for (let i = 0; i < 3; i++) feedData.push(generateFakeVideo());
        renderFeed();
    }
});

observer.observe(sentinel);

// ------------------------------
// Actieknoppen
// ------------------------------
function attachActionEvents() {
    document.querySelectorAll(".like-btn").forEach(btn => {
        btn.onclick = () => {
            const id = btn.dataset.id;
            const video = feedData.find(v => v.id == id);
            video.likes++;
            renderFeed();
        };
    });

    document.querySelectorAll(".comment-btn").forEach(btn => {
        btn.onclick = () => openComments(btn.dataset.id);
    });

    document.querySelectorAll(".share-btn").forEach(btn => {
        btn.onclick = () => alert("Delen werkt nog niet 😉");
    });
}

// ------------------------------
// Comments
// ------------------------------
let currentVideoId = null;

function openComments(id) {
    currentVideoId = id;
    const video = feedData.find(v => v.id == id);

    commentsList.innerHTML = video.comments
        .map(c => `<div class="comment">${c}</div>`)
        .join("");

    commentsModal.style.display = "flex";
}

document.querySelectorAll(".close-comments, .close-comments-btn").forEach(btn => {
    btn.onclick = () => commentsModal.style.display = "none";
});

sendCommentBtn.onclick = () => {
    const text = commentInput.value.trim();
    if (!text) return;

    const video = feedData.find(v => v.id == currentVideoId);
    video.comments.push(text);

    commentInput.value = "";
    openComments(currentVideoId);
};

// ------------------------------
// Zoeksuggesties (demo)
// ------------------------------
searchInput.oninput = () => {
    const q = searchInput.value.toLowerCase();
    if (q.length < 1) {
        suggestionsBox.style.display = "none";
        return;
    }

    const results = feedData
        .filter(v => v.channel.toLowerCase().includes(q))
        .slice(0, 5);

    suggestionsBox.innerHTML = results
        .map(r => `<div class="suggestion">${r.channel}</div>`)
        .join("");

    suggestionsBox.style.display = "block";

    document.querySelectorAll(".suggestion").forEach(s => {
        s.onclick = () => {
            searchInput.value = s.innerText;
            suggestionsBox.style.display = "none";
        };
    });
};
