// ---------- BOBTOP 6.0 - MET SWIPE, PROFIEL FOTO, GEEN DISLIKES ----------
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
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cleangirl'
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
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hema'
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
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minecraft'
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
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=funnyai'
    }
];

// ---------- REACTIES ----------
let commentsDatabase = [];

async function loadComments() {
    try {
        const response = await fetch('reacties.txt');
        const text = await response.text();
        commentsDatabase = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        console.log(`📝 ${commentsDatabase.length} reacties geladen`);
    } catch (error) {
        console.warn('⚠️ reacties.txt niet gevonden, gebruik standaard reacties');
        commentsDatabase = [
            "Dit is echt top gemaakt! 🔥",
            "Eerste! 🙋‍♂️",
            "Hoe lang ben je hiermee bezig geweest?",
            "😂😂😂 geweldig",
            "Eindelijk normaal commentaar",
            "Like voor deel 2!",
            "AI wordt steeds beter zeg",
            "Dit verdient meer views"
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
    const prefixes = ['@bob', '@ai', '@video', '@tiktok', '@user', '@filmpje', '@bobtop', '@creative'];
    const suffixes = ['123', 'fan', 'lover', 'nl', 'official', 'xd', '4life'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix + Math.floor(Math.random() * 100);
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
const LIKE_KEY = 'bobtop_likes';

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

function getLikes() {
    try { return JSON.parse(localStorage.getItem(LIKE_KEY)) || {}; } catch { return {}; }
}

function setLike(itemId, liked) {
    const likes = getLikes();
    if (liked) likes[itemId] = true;
    else delete likes[itemId];
    localStorage.setItem(LIKE_KEY, JSON.stringify(likes));
}

function isItemLiked(itemId) {
    return getLikes()[itemId] || false;
}

// Genereer random likes
function getRandomLikeCount(item, userLiked) {
    const base = item.baseLikes || 10000;
    const variation = Math.floor(Math.random() * 5000) - 2500;
    let count = Math.max(0, base + variation);
    if (userLiked) count += 1;
    return count.toLocaleString();
}

// ---------- STATE ----------
let currentFilterChannel = null;
let lastPlayedVideoId = null;
let videoPlayCount = new Map();
const videoCommentsCache = new Map();

// ---------- FILTER OP KANAAL (voor swipe naar rechts) ----------
function filterByChannel(channelId) {
    if (currentFilterChannel === channelId) return; // Al bezig
    
    currentFilterChannel = channelId;
    feedEl.innerHTML = '';
    currentRenderedIds.clear();
    lastPlayedVideoId = null;
    
    showToast(`📺 Alleen @${channelId}`);
    
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

// ---------- RANDOM FEED (voor swipe omlaag) ----------
function showRandomFeed() {
    if (currentFilterChannel === null) return; // Al random
    
    currentFilterChannel = null;
    feedEl.innerHTML = '';
    currentRenderedIds.clear();
    lastPlayedVideoId = null;
    
    showToast(`🎲 Willekeurige video's`);
    
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

// ---------- GEWOGEN RANDOM ----------
function getWeightedRandomItem() {
    let available = currentFilterChannel 
        ? videoDatabase.filter(item => item.channelId === currentFilterChannel)
        : [...videoDatabase];
    
    if (available.length === 0) {
        currentFilterChannel = null;
        available = [...videoDatabase];
    }
    
    if (available.length === 1) {
        return available[0];
    }
    
    const likes = getLikes();
    const playCounts = videoPlayCount;
    
    let candidates = available.map(item => {
        let baseWeight = item.weight || 1;
        
        if (likes[item.id]) baseWeight *= 2.2;
        
        if (item.id === lastPlayedVideoId) {
            baseWeight *= 0.1;
        }
        
        const playCount = playCounts.get(item.id) || 0;
        if (playCount > 2) {
            baseWeight *= 0.7;
        }
        
        return { item, weight: Math.max(0.01, baseWeight) };
    });
    
    const total = candidates.reduce((sum, c) => sum + c.weight, 0);
    let rand = Math.random() * total;
    
    for (let c of candidates) {
        if (rand < c.weight) {
            const currentCount = videoPlayCount.get(c.item.id) || 0;
            videoPlayCount.set(c.item.id, currentCount + 1);
            lastPlayedVideoId = c.item.id;
            return c.item;
        }
        rand -= c.weight;
    }
    
    const fallback = available[0];
    videoPlayCount.set(fallback.id, (videoPlayCount.get(fallback.id) || 0) + 1);
    lastPlayedVideoId = fallback.id;
    return fallback;
}

// ---------- FEED & UI ----------
let loadedItemCount = 0;
let currentRenderedIds = new Set();
const feedEl = document.getElementById('feed');
const sentinel = document.getElementById('sentinel');
const actionPanelTemplate = document.getElementById('action-panel-template').innerHTML;
const shareMenu = document.getElementById('share-menu');
const commentsModal = document.getElementById('comments-modal');
const searchInput = document.getElementById('searchInput');

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2300);
}

// ---------- ZOEKBALK ----------
searchInput.addEventListener('focus', () => {
    // Wordt groter via CSS
});

searchInput.addEventListener('blur', () => {
    if (searchInput.value.length === 0) {
        // Blijft klein als er niets is ingevuld
    }
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length > 2) {
        // Hier kun je zoekfunctionaliteit toevoegen
        console.log('Zoeken naar:', query);
    }
});

// ---------- SWIPE DETECTIE ----------
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let touchStartTime = 0;
const MIN_SWIPE_DISTANCE = 50;
const MAX_SWIPE_TIME = 500;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeTime = Date.now() - touchStartTime;
    if (swipeTime > MAX_SWIPE_TIME) return;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Check of het een horizontale swipe is (meer X dan Y beweging)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
        // Swipe naar RECHTS -> filter op huidige kanaal
        if (deltaX > 0) {
            const currentItem = getCurrentVideoItem();
            if (currentItem && currentItem.dataset.channelId) {
                filterByChannel(currentItem.dataset.channelId);
            }
        }
    }
    // Check of het een verticale swipe is (meer Y dan X beweging)
    else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > MIN_SWIPE_DISTANCE) {
        // Swipe naar BENEDEN -> random feed
        if (deltaY > 0) {
            showRandomFeed();
        }
    }
}

// Huidige video item ophalen (meest zichtbare)
function getCurrentVideoItem() {
    const feedItems = document.querySelectorAll('.feed-item');
    if (feedItems.length === 0) return null;
    
    const viewportHeight = window.innerHeight;
    let bestItem = null;
    let bestVisibility = 0;
    
    feedItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibilityRatio = visibleHeight / viewportHeight;
        
        if (visibilityRatio > bestVisibility) {
            bestVisibility = visibilityRatio;
            bestItem = item;
        }
    });
    
    return bestItem;
}

// ---------- VIDEO SETUP (AUTOPLAY + LOOP) ----------
function setupVideo(video, itemDiv, mediaItem) {
    video.loop = true;
    video.muted = false;
    video.playsInline = true;
    video.preload = 'auto';
    
    let isPlaying = false;
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const ratio = entry.intersectionRatio;
            const isFullyVisible = ratio > 0.7;
            
            if (isFullyVisible) {
                if (!isPlaying) {
                    video.play()
                        .then(() => {
                            isPlaying = true;
                        })
                        .catch(e => {
                            console.log('🔇 Autoplay geblokkeerd');
                            const playOnInteraction = () => {
                                video.play();
                                document.removeEventListener('click', playOnInteraction);
                                document.removeEventListener('touchstart', playOnInteraction);
                            };
                            document.addEventListener('click', playOnInteraction, { once: true });
                            document.addEventListener('touchstart', playOnInteraction, { once: true });
                        });
                }
            } else {
                if (isPlaying) {
                    video.pause();
                    isPlaying = false;
                }
            }
        });
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
    
    videoObserver.observe(video);
    
    video.onerror = () => {
        console.warn(`❌ Video ${video.src} niet geladen`);
        itemDiv.remove();
        maybeLoadMore();
    };
    
    itemDiv._videoObserver = videoObserver;
    itemDiv.dataset.channelId = mediaItem.channelId;
}

// ---------- SCROLL SNAP ----------
function setupScrollSnap() {
    let isSnapping = false;
    
    function checkAndSnap() {
        if (isSnapping) {
            requestAnimationFrame(checkAndSnap);
            return;
        }
        
        const feedItems = document.querySelectorAll('.feed-item');
        if (feedItems.length === 0) {
            requestAnimationFrame(checkAndSnap);
            return;
        }
        
        const viewportHeight = window.innerHeight;
        let targetItem = null;
        let bestMatch = 0;
        
        feedItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            const visibleRatio = visibleHeight / viewportHeight;
            
            if (visibleRatio > bestMatch) {
                bestMatch = visibleRatio;
                targetItem = item;
            }
        });
        
        if (targetItem && bestMatch > 0.3 && bestMatch < 0.8) {
            isSnapping = true;
            
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            setTimeout(() => {
                isSnapping = false;
            }, 200);
        }
        
        requestAnimationFrame(checkAndSnap);
    }
    
    requestAnimationFrame(checkAndSnap);
}

// ---------- COMMENTS MODAL ----------
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
                    ${comment.verified ? '<span style="color: #3897f0;"> ✓</span>' : ''}
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
    
    const headerTitle = commentsModal.querySelector('h2');
    headerTitle.innerHTML = `💬 Reacties <span style="color: #999; font-size: 0.9rem;">(${comments.length})</span>`;
    
    commentsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCommentsModal() {
    commentsModal.classList.remove('active');
    document.querySelectorAll('.comment-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

function closeShareMenu() {
    shareMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ---------- FEED ITEM CREATIE ----------
function createFeedItem(mediaItem) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'feed-item';
    itemDiv.dataset.itemId = mediaItem.id;
    itemDiv.dataset.type = mediaItem.type;
    itemDiv.dataset.url = mediaItem.url;
    itemDiv.dataset.channelId = mediaItem.channelId;

    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';

    let mediaEl;
    if (mediaItem.type === 'video') {
        mediaEl = document.createElement('video');
        mediaEl.src = mediaItem.url;
        setupVideo(mediaEl, itemDiv, mediaItem);
    } else {
        mediaEl = document.createElement('img');
        mediaEl.src = mediaItem.url;
        mediaEl.alt = mediaItem.title || 'AI afbeelding';
        mediaEl.loading = 'lazy';
        mediaEl.onerror = () => {
            console.warn(`Afbeelding ${mediaItem.url} niet gevonden`);
            itemDiv.remove();
            maybeLoadMore();
        };
    }

    mediaContainer.appendChild(mediaEl);
    itemDiv.appendChild(mediaContainer);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'item-info';
    infoDiv.innerHTML = `
        <div class="channel-name">
            <a href="#" class="channel-link" data-channel-id="${mediaItem.channelId}">
                @${mediaItem.channelId || mediaItem.channel}
            </a>
            <span class="content-badge">${mediaItem.contentType || 'AI'}</span>
        </div>
        <div class="title-description">
            <strong>${mediaItem.title || ''}</strong> ${mediaItem.description ? '· ' + mediaItem.description : ''}
        </div>
    `;
    itemDiv.appendChild(infoDiv);

    const channelLink = infoDiv.querySelector('.channel-link');
    channelLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        filterByChannel(mediaItem.channelId);
    });

    const actionsDiv = document.createElement('div');
    actionsDiv.innerHTML = actionPanelTemplate;
    const actionButtons = actionsDiv.firstElementChild.cloneNode(true);
    
    const profileBtn = actionButtons.querySelector('.profile-btn');
    const likeBtn = actionButtons.querySelector('.like-btn');
    const commentBtn = actionButtons.querySelector('.comment-btn');
    const saveBtn = actionButtons.querySelector('.save-btn');
    const shareBtn = actionButtons.querySelector('.share-btn');
    
    // Set profile image
    const profileImg = profileBtn.querySelector('.profile-image');
    if (mediaItem.profileImage) {
        profileImg.src = mediaItem.profileImage;
    }
    
    likeBtn.dataset.id = mediaItem.id;
    saveBtn.dataset.id = mediaItem.id;
    commentBtn.dataset.id = mediaItem.id;
    shareBtn.dataset.id = mediaItem.id;

    const userLiked = isItemLiked(mediaItem.id);
    const saved = isItemSaved(mediaItem.id);
    
    const likeCountSpan = likeBtn.querySelector('.like-count');
    const saveCountSpan = saveBtn.querySelector('.save-count');
    const commentCountSpan = commentBtn.querySelector('.comment-count');
    
    const commentCount = Math.floor(Math.random() * 45) + 1;
    commentCountSpan.textContent = commentCount;
    
    likeCountSpan.textContent = getRandomLikeCount(mediaItem, userLiked);
    
    if (saved) {
        saveBtn.classList.add('saved');
        saveCountSpan.textContent = '1';
    } else {
        saveCountSpan.textContent = '0';
    }
    
    if (userLiked) {
        likeBtn.classList.add('liked');
    }

    // EVENT LISTENERS
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        showToast(`👤 @${mediaItem.channelId}`);
        // Hier kun je later een profielpagina toevoegen
    });

    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const id = Number(likeBtn.dataset.id);
        const liked = isItemLiked(id);
        const item = videoDatabase.find(v => v.id === id);
        
        if (liked) {
            setLike(id, false);
            likeBtn.classList.remove('liked');
            likeCountSpan.textContent = getRandomLikeCount(item, false);
            showToast('❤️ Like verwijderd');
        } else {
            setLike(id, true);
            likeBtn.classList.add('liked');
            likeCountSpan.textContent = getRandomLikeCount(item, true);
            showToast('❤️ Video geliked!');
        }
    });

    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        const id = Number(saveBtn.dataset.id);
        const isSaved = isItemSaved(id);
        
        if (isSaved) {
            unsaveItemLocally(id);
            saveBtn.classList.remove('saved');
            saveCountSpan.textContent = '0';
            showToast('❌ Verwijderd uit opgeslagen');
        } else {
            saveItemLocally(id);
            saveBtn.classList.add('saved');
            saveCountSpan.textContent = '1';
            showToast('✅ Opgeslagen in Bobtop-lijst');
        }
    });

    commentBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        openCommentsModal(mediaItem);
        commentBtn.classList.add('active');
    });

    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        openShareMenu(mediaItem);
    });

    itemDiv.appendChild(actionButtons);
    return itemDiv;
}

// ---------- SHARE MENU ----------
function openShareMenu(mediaItem) {
    shareMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const whatsappBtn = document.getElementById('share-whatsapp');
    const copyBtn = document.getElementById('share-copy');
    const closeBtn = shareMenu.querySelector('.share-close');
    
    const newWhatsapp = whatsappBtn.cloneNode(true);
    const newCopy = copyBtn.cloneNode(true);
    const newClose = closeBtn.cloneNode(true);
    whatsappBtn.parentNode.replaceChild(newWhatsapp, whatsappBtn);
    copyBtn.parentNode.replaceChild(newCopy, copyBtn);
    shareMenu.querySelector('.share-close').replaceWith(newClose);
    
    newWhatsapp.addEventListener('click', () => {
        const text = `📱 Check dit filmpje op Bobtop: ${mediaItem.title} door @${mediaItem.channelId}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        closeShareMenu();
        showToast('📤 Gedeeld via WhatsApp');
    });
    
    newCopy.addEventListener('click', async () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?video=${mediaItem.id}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            showToast('🔗 Link gekopieerd naar klembord');
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('🔗 Link gekopieerd');
        }
        closeShareMenu();
    });
    
    newClose.addEventListener('click', closeShareMenu);
}

// ---------- MODAL EVENT LISTENERS ----------
shareMenu.addEventListener('click', (e) => {
    if (e.target === shareMenu) {
        closeShareMenu();
    }
});

commentsModal.addEventListener('click', (e) => {
    if (e.target === commentsModal) {
        closeCommentsModal();
    }
});

document.querySelector('.close-comments')?.addEventListener('click', closeCommentsModal);
document.querySelector('.close-comments-btn')?.addEventListener('click', closeCommentsModal);

// ---------- INFINITE SCROLL ----------
let isLoading = false;
let pendingLoad = false;

function addItemToFeed() {
    if (isLoading) return;
    isLoading = true;
    
    const item = getWeightedRandomItem();
    
    const lastItem = feedEl.lastChild;
    if (lastItem && lastItem.dataset.itemId == item.id) {
        console.log('⚠️ Dubbele video voorkomen');
        isLoading = false;
        setTimeout(() => addItemToFeed(), 50);
        return;
    }

    const feedItem = createFeedItem(item);
    feedEl.appendChild(feedItem);
    currentRenderedIds.add(item.id);
    loadedItemCount++;
    
    setTimeout(() => {
        isLoading = false;
        if (pendingLoad) {
            pendingLoad = false;
            maybeLoadMore();
        }
    }, 300);
}

function maybeLoadMore() {
    if (isLoading) {
        pendingLoad = true;
        return;
    }
    addItemToFeed();
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        maybeLoadMore();
    }
}, { threshold: 0.1, rootMargin: '100px' });
observer.observe(sentinel);

// ---------- INIT ----------
async function initFeed() {
    await loadComments();
    setupScrollSnap();
    
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    
    if (videoId) {
        const found = videoDatabase.find(v => v.id === Number(videoId));
        if (found) {
            const feedItem = createFeedItem(found);
            feedEl.appendChild(feedItem);
            currentRenderedIds.add(found.id);
            loadedItemCount++;
            
            setTimeout(() => {
                feedItem.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
    
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

initFeed();
