// -----------------------------
// Config
// -----------------------------
const STORAGE_KEY = "bobtopVideosV1";

// Basisvideo's (alleen gebruikt bij eerste keer)
const BASE_VIDEOS = [
    {
        src: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
        channel: "Kanaal 1",
        profile: "https://via.placeholder.com/80?text=K1"
    },
    {
        src: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
        channel: "Kanaal 2",
        profile: "https://via.placeholder.com/80?text=K2"
    },
    {
        src: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
        channel: "Kanaal 3",
        profile: "https://via.placeholder.com/80?text=K3"
    }
];

let videos = [];
let reactiesPool = [];
let currentVideoIndex = null;

// DOM
const feed = document.getElementById("feed");
const commentsModal = document.getElementById("comments-modal");
const commentsList = document.getElementById("comments-list");
const commentInput = document.getElementById("commentInput");
const sendCommentBtn = document.getElementById("sendCommentBtn");
const closeCommentsBtns = document.querySelectorAll(".close-comments, .close-comments-btn");

// -----------------------------
// Helpers
// -----------------------------
function saveVideos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

function loadVideosFromStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function getRandomComments(count) {
    if (reactiesPool.length === 0) return [];
    const shuffled = [...reactiesPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// -----------------------------
// Init data
// -----------------------------
async function initData() {
    // 1. Reacties inladen uit reacties.txt
    try {
        const res = await fetch("reacties.txt");
        const text = await res.text();
        reactiesPool = text
            .split("\n")
            .map(l => l.trim())
            .filter(l => l.length > 0);
    } catch (e) {
        console.warn("Kon reacties.txt niet laden, ga verder zonder pool.", e);
        reactiesPool = [];
    }

    // 2. Videos uit localStorage of basis
    const stored = loadVideosFromStorage();
    if (stored && Array.isArray(stored) && stored.length > 0) {
        videos = stored;
    } else {
        videos = BASE_VIDEOS.map(v => ({
            ...v,
            likes: 0,
            comments: getRandomComments(3) // random startcomments
        }));
        saveVideos();
    }
}

// -----------------------------
// UI bouwen
// -----------------------------
function renderFeed() {
    feed.innerHTML = "";

    videos.forEach((v, index) => {
        const page = document.createElement("div");
        page.className = "video-page";
        page.dataset.index = index;

        page.innerHTML = `
            <video class="video" playsinline muted loop></video>

            <div class="right-actions">
                <button class="action like">❤️<br><span class="like-count">${v.likes || 0}</span></button>
                <button class="action comment">💬</button>
                <button class="action share">📤</button>
            </div>

            <div class="video-info">
                <img class="channel-icon" src="${v.profile}">
                <span class="channel-name">${v.channel}</span>
            </div>
        `;

        const videoEl = page.querySelector("video");
        videoEl.src = v.src;

        // Like
        page.querySelector(".like").addEventListener("click", () => {
            videos[index].likes = (videos[index].likes || 0) + 1;
            saveVideos();
            page.querySelector(".like-count").textContent = videos[index].likes;
        });

        // Comments
        page.querySelector(".comment").addEventListener("click", () => {
            openComments(index);
        });

        // Share (simpel)
        page.querySelector(".share").addEventListener("click", () => {
            const url = window.location.href;
            navigator.clipboard?.writeText(url);
            alert("Link gekopieerd naar klembord.");
        });

        feed.appendChild(page);
    });

    setupIntersectionObserver();
}

// -----------------------------
// Autoplay via IntersectionObserver
// -----------------------------
let io = null;

function setupIntersectionObserver() {
    if (io) io.disconnect();

    io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const video = entry.target.querySelector("video");
            if (!video) return;

            if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.9 });

    document.querySelectorAll(".video-page").forEach(page => io.observe(page));
}

// -----------------------------
// Scroll-snapping (klein beetje scroll = volgende video)
// -----------------------------
let lastScroll = 0;
feed.addEventListener("scroll", () => {
    const current = feed.scrollTop;
    const height = window.innerHeight;

    if (Math.abs(current - lastScroll) > 40) {
        const page = Math.round(current / height);
        feed.scrollTo({ top: page * height, behavior: "smooth" });
    }

    lastScroll = current;
});

// -----------------------------
// Comments
// -----------------------------
function openComments(index) {
    currentVideoIndex = index;
    const vid = videos[index];

    commentsList.innerHTML = "";
    (vid.comments || []).forEach(c => {
        const div = document.createElement("div");
        div.className = "comment";
        div.textContent = c;
        commentsList.appendChild(div);
    });

    commentsModal.style.display = "flex";
}

closeCommentsBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        commentsModal.style.display = "none";
    });
});

sendCommentBtn.addEventListener("click", () => {
    const text = commentInput.value.trim();
    if (!text || currentVideoIndex === null) return;

    videos[currentVideoIndex].comments = videos[currentVideoIndex].comments || [];
    videos[currentVideoIndex].comments.push(text);
    saveVideos();

    const div = document.createElement("div");
    div.className = "comment";
    div.textContent = text;
    commentsList.appendChild(div);

    commentInput.value = "";
});

// -----------------------------
// Start
// -----------------------------
(async function start() {
    await initData();
    renderFeed();
})();
