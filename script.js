// ---------- BOBTOP 5.0 - CSS SNAP VERSIE ----------
const videoDatabase = [
    {
        id: 1,
        type: 'video',
        url: 'video.mp4',
        channel: 'CleanGirlOfficial',
        channelId: 'cleangirl',
        title: 'Cleaning MacDonalds bathroom for free!?',
        description: 'Today i am going to clean MacDonalds bathroom for free!',
        contentType: 'Real',
        weight: 1,
        baseLikes: 12400,
        baseDislikes: 320
    },
    {
        id: 2,
        type: 'video',
        url: 'HEMAregenboogrookworst.mp4',
        channel: 'HEMA',
        channelId: 'hema',
        title: 'HEMA',
        description: 'Koop nu HEMA regenboogrookworst!',
        contentType: 'Real',
        weight: 1,
        baseLikes: 8900,
        baseDislikes: 450
    },
    {
        id: 3,
        type: 'video',
        url: 'MINECRAFTMODS-hoe-je-een-mod-installeerd.mp4',
        channel: 'MINECRAFTMODS',
        channelId: 'minecraftmods',
        title: 'Hoe je een mod installeert',
        description: 'Een eenvoudige uitleg voor how to',
        contentType: 'AI',
        weight: 1,
        baseLikes: 15600,
        baseDislikes: 210
    },
    {
        id: 4,
        type: 'video',
        url: 'FUNNYAI-ik-ga-je-pakken.mp4',
        channel: 'FunnyAI',
        channelId: 'funnyai',
        title: 'IK GA JE PAKKEN! 👻',
        description: 'Hilarische AI video - niet alleen kijken voor het slapen gaan',
        contentType: 'AI',
        weight: 1.8,
        baseLikes: 34200,
        baseDislikes: 89
    }
];

// Fallback video
const FALLBACK_VIDEO_URL = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// ---------- REACTIES ----------
let commentsDatabase = [];

async function loadComments() {
    try {
        const response = await fetch('reacties.txt');
        const text = await response.text();
        commentsDatabase = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    } catch (error) {
        commentsDatabase = [
            "Dit is echt top gemaakt! 🔥",
            "Eerste! 🙋‍♂️",
            "😂😂😂 geweldig",
            "IK GA JE PAKKEN! 👻",
            "FunnyAI is de beste!"
        ];
    }
}

function getRandomComments() {
    if (commentsDatabase.length === 0) return [];
    const numberOfComments = Math.floor(Math.random() * 45) + 1;
    const shuffled = [...commentsDatabase].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(numberOfComments, commentsDatabase.length));
    
    return selected.map((text, index) => ({
        id: index,
        text: text,
        author: generateUsername(),
        avatar: text[0].toUpperCase(),
        time: getRandomTime(),
        likes: Math.floor(Math.random() * 150),
        verified: Math.random() > 0.7
    }));
}

function generateUsername() {
    const prefixes = ['@bob', '@ai', '@user', '@fan', '@funnyai'];
    const suffixes = ['123', 'fan', 'nl', 'xd', '👻'];
    return prefixes[Math.floor(Math.random() * prefixes.length)] + 
           suffixes[Math.floor(Math.random() * suffixes.length)] + 
           Math.floor(Math.random() * 100);
}

function getRandomTime() {
    const hours = Math.floor(Math.random() * 24);
    const days = Math.floor(Math.random() * 7);
    if (days === 0) return `${hours}u geleden`;
    if (days === 1) return 'Gisteren';
    return `${days} dagen geleden`;
}

// ---------- STORAGE ----------
const STORAGE_KEY = 'bobtop_saved_items';
const LIKE_DISLIKE_KEY = 'bobtop_preferences';
let currentFilterChannel = null;
let lastPlayedVideoId = null;
let videoPlayCount = new Map();
const videoCommentsCache = new Map();

function getSavedItems() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveItemLocally(itemId) {
    let saved = getSavedItems();
    if (!saved.includes(itemId)) {
        saved.push(itemId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
    return saved;
}

function unsaveItemLocally(itemId) {
    let saved = getSavedItems().filter(id => id !== itemId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return saved;
}

function isItemSaved(itemId) {
    return getSavedItems().includes(itemId);
}

function getPreferences() {
    try { return JSON.parse(localStorage.getItem(LIKE_DISLIKE_KEY)) || {}; } catch { return {}; }
}

function setPreference(itemId, type) {
    const prefs = getPreferences();
    if (type === null) delete prefs[itemId];
    else prefs[itemId] = type;
    localStorage.setItem(LIKE_DISLIKE_KEY, JSON.stringify(prefs));
}

function getPreference(itemId) {
    return getPreferences()[itemId] || null;
}

function getRandomLikeCount(item, userLiked) {
    const base = item.baseLikes || 10000;
    const variation = Math.floor(Math.random() * 5000) - 2500;
    let count = Math.max(0, base + variation);
    if (userLiked) count += 1;
    return count.toLocaleString();
}

function getRandomDislikeCount(item, userDisliked) {
    const base = item.baseDislikes || 500;
    const variation = Math.floor(Math.random() * 200) - 100;
    let count = Math.max(0, base + variation);
    if (userDisliked) count += 1;
    return count.toLocaleString();
}

// ---------- FILTER ----------
function filterByChannel(channelId) {
    currentFilterChannel = channelId;
    feedEl.innerHTML = '';
    currentRenderedIds.clear();
    lastPlayedVideoId = null;
    showToast(`📺 Alleen @${channelId}`);
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

// ---------- RANDOM ITEM ----------
function getWeightedRandomItem() {
    let available = currentFilterChannel 
        ? videoDatabase.filter(item => item.channelId === currentFilterChannel)
        : [...videoDatabase];
    
    if (available.length === 0) {
        currentFilterChannel = null;
        available = [...videoDatabase];
    }
    
    if (available.length === 1) return available[0];
    
    const prefs = getPreferences();
    let candidates = available.map(item => {
        let weight = item.weight || 1;
        const pref = prefs[item.id];
        if (pref === 'dislike') weight = 0.02;
        else if (pref === 'like') weight *= 2.2;
        if (item.id === lastPlayedVideoId) weight *= 0.1;
        return { item, weight: Math.max(0.01, weight) };
    });
    
    const total = candidates.reduce((sum, c) => sum + c.weight, 0);
    let rand = Math.random() * total;
    
    for (let c of candidates) {
        if (rand < c.weight) {
            videoPlayCount.set(c.item.id, (videoPlayCount.get(c.item.id) || 0) + 1);
            lastPlayedVideoId = c.item.id;
            return c.item;
        }
        rand -= c.weight;
    }
    return available[0];
}

// ---------- FEED ----------
let loadedItemCount = 0;
let currentRenderedIds = new Set();
const feedEl = document.getElementById('feed');
const sentinel = document.getElementById('sentinel');
const actionPanelTemplate = document.getElementById('action-panel-template').innerHTML;
const shareMenu = document.getElementById('share-menu');
const commentsModal = document.getElementById('comments-modal');

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2300);
}

// ---------- VIDEO SETUP ----------
function setupVideo(video, itemDiv, mediaItem) {
    video.loop = true;
    video.muted = false;
    video.playsInline = true;
    video.preload = 'auto';
    
    video.onerror = () => {
        console.log(`Video ${video.src} niet gevonden, gebruik fallback`);
        video.src = FALLBACK_VIDEO_URL;
    };
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.7 });
    
    videoObserver.observe(video);
    itemDiv._videoObserver = videoObserver;
}

// ---------- COMMENTS ----------
function openCommentsModal(mediaItem) {
    if (!videoCommentsCache.has(mediaItem.id)) {
        videoCommentsCache.set(mediaItem.id, getRandomComments());
    }
    
    const comments = videoCommentsCache.get(mediaItem.id);
    const commentsList = document.getElementById('comments-list');
    
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item">
            <div class="comment-avatar">${comment.avatar}</div>
            <div class="comment-body">
                <div class="comment-author">
                    ${comment.author}
                    ${comment.verified ? ' ✓' : ''}
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <span class="comment-likes">❤️ ${comment.likes}</span>
                    <span>💬 Antwoorden</span>
                </div>
            </div>
        </div>
    `).join('');
    
    commentsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCommentsModal() {
    commentsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeShareMenu() {
    shareMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ---------- FEED ITEM ----------
function createFeedItem(mediaItem) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'feed-item';
    itemDiv.dataset.itemId = mediaItem.id;

    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';

    const mediaEl = document.createElement('video');
    mediaEl.src = mediaItem.url;
    setupVideo(mediaEl, itemDiv, mediaItem);

    mediaContainer.appendChild(mediaEl);
    itemDiv.appendChild(mediaContainer);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'item-info';
    infoDiv.innerHTML = `
        <div class="channel-name">
            <a href="#" class="channel-link" data-channel-id="${mediaItem.channelId}">
                @${mediaItem.channelId}
            </a>
            <span class="content-badge">${mediaItem.contentType}</span>
        </div>
        <div class="title-description">
            <strong>${mediaItem.title}</strong> · ${mediaItem.description}
        </div>
    `;
    itemDiv.appendChild(infoDiv);

    infoDiv.querySelector('.channel-link').addEventListener('click', (e) => {
        e.preventDefault();
        filterByChannel(mediaItem.channelId);
    });

    const actionsDiv = document.createElement('div');
    actionsDiv.innerHTML = actionPanelTemplate;
    const actionButtons = actionsDiv.firstElementChild.cloneNode(true);
    
    const likeBtn = actionButtons.querySelector('.like-btn');
    const dislikeBtn = actionButtons.querySelector('.dislike-btn');
    const saveBtn = actionButtons.querySelector('.save-btn');
    const commentBtn = actionButtons.querySelector('.comment-btn');
    const shareBtn = actionButtons.querySelector('.share-btn');
    
    likeBtn.dataset.id = mediaItem.id;
    dislikeBtn.dataset.id = mediaItem.id;
    saveBtn.dataset.id = mediaItem.id;
    commentBtn.dataset.id = mediaItem.id;
    shareBtn.dataset.id = mediaItem.id;

    const pref = getPreference(mediaItem.id);
    const saved = isItemSaved(mediaItem.id);
    
    likeBtn.querySelector('.like-count').textContent = getRandomLikeCount(mediaItem, pref === 'like');
    dislikeBtn.querySelector('.dislike-count').textContent = getRandomDislikeCount(mediaItem, pref === 'dislike');
    commentBtn.querySelector('.comment-count').textContent = Math.floor(Math.random() * 45) + 1;
    
    if (saved) {
        saveBtn.classList.add('saved');
        saveBtn.querySelector('.save-count').textContent = '1';
    }
    if (pref === 'like') likeBtn.classList.add('liked');
    if (pref === 'dislike') dislikeBtn.classList.add('disliked');

    // Event listeners
    likeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = Number(likeBtn.dataset.id);
        const item = videoDatabase.find(v => v.id === id);
        const current = getPreference(id);
        
        if (current === 'like') {
            setPreference(id, null);
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('.like-count').textContent = getRandomLikeCount(item, false);
        } else {
            setPreference(id, 'like');
            likeBtn.classList.add('liked');
            likeBtn.querySelector('.like-count').textContent = getRandomLikeCount(item, true);
            if (current === 'dislike') {
                dislikeBtn.classList.remove('disliked');
                dislikeBtn.querySelector('.dislike-count').textContent = getRandomDislikeCount(item, false);
            }
        }
    });

    dislikeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = Number(dislikeBtn.dataset.id);
        const item = videoDatabase.find(v => v.id === id);
        const current = getPreference(id);
        
        if (current === 'dislike') {
            setPreference(id, null);
            dislikeBtn.classList.remove('disliked');
            dislikeBtn.querySelector('.dislike-count').textContent = getRandomDislikeCount(item, false);
        } else {
            setPreference(id, 'dislike');
            dislikeBtn.classList.add('disliked');
            dislikeBtn.querySelector('.dislike-count').textContent = getRandomDislikeCount(item, true);
            if (current === 'like') {
                likeBtn.classList.remove('liked');
                likeBtn.querySelector('.like-count').textContent = getRandomLikeCount(item, false);
            }
        }
    });

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = Number(saveBtn.dataset.id);
        if (isItemSaved(id)) {
            unsaveItemLocally(id);
            saveBtn.classList.remove('saved');
            saveBtn.querySelector('.save-count').textContent = '0';
            showToast('❌ Verwijderd');
        } else {
            saveItemLocally(id);
            saveBtn.classList.add('saved');
            saveBtn.querySelector('.save-count').textContent = '1';
            showToast('✅ Opgeslagen');
        }
    });

    commentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCommentsModal(mediaItem);
    });

    shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        shareMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    itemDiv.appendChild(actionButtons);
    return itemDiv;
}

// ---------- INFINITE SCROLL ----------
let isLoading = false;

function addItemToFeed() {
    if (isLoading) return;
    isLoading = true;
    
    const item = getWeightedRandomItem();
    const feedItem = createFeedItem(item);
    feedEl.appendChild(feedItem);
    currentRenderedIds.add(item.id);
    
    setTimeout(() => { isLoading = false; }, 300);
}

function maybeLoadMore() {
    if (!isLoading) addItemToFeed();
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) maybeLoadMore();
}, { threshold: 0.1 });
observer.observe(sentinel);

// ---------- MODAL EVENT LISTENERS ----------
shareMenu.addEventListener('click', (e) => {
    if (e.target === shareMenu) closeShareMenu();
});

commentsModal.addEventListener('click', (e) => {
    if (e.target === commentsModal) closeCommentsModal();
});

document.querySelector('.close-comments')?.addEventListener('click', closeCommentsModal);
document.querySelector('.close-comments-btn')?.addEventListener('click', closeCommentsModal);

document.getElementById('share-whatsapp')?.addEventListener('click', () => {
    window.open('https://wa.me/?text=Check%20dit%20op%20Bobtop!', '_blank');
    closeShareMenu();
});

document.getElementById('share-copy')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Gekopieerd!');
    closeShareMenu();
});

document.querySelector('.share-close')?.addEventListener('click', closeShareMenu);

// ---------- INIT ----------
async function initFeed() {
    await loadComments();
    for (let i = 0; i < 3; i++) addItemToFeed();
}

initFeed();
