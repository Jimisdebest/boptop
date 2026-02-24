// ---------- BOBTOP 7.0 - RANDOM FEED + KANAAL WEERGAVE ----------
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
        title: 'HEMA Regenboogrookworst',
        description: 'Koop nu HEMA regenboogrookworst!',
        contentType: 'Real',
        weight: 0.8,
        baseLikes: 8900,
        baseDislikes: 450
    },
    {
        id: 3,
        type: 'video',
        url: 'HEMA-koop-deze-mevrouw-bij-ons.mp4',
        channel: 'HEMA',
        channelId: 'hema',
        title: 'Koop deze mevrouw bij ons!',
        description: 'Ze ligt nu in de winkel: henatje.',
        contentType: 'Real',
        weight: 0.8,
        baseLikes: 8900,
        baseDislikes: 450
    },
    {
        id: 4,
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
        id: 5,
        type: 'video',
        url: 'FUNNYAI-ik-ga-je-pakken.mp4',
        channel: 'FunnyAI',
        channelId: 'funnyai',
        title: 'IK GA JE PAKKEN! 👻',
        description: 'Hilarische AI video - niet alleen kijken voor het slapen gaan',
        contentType: 'AI',
        weight: 1.0,
        baseLikes: 34200,
        baseDislikes: 89
    },
    {
        id: 6,
        type: 'photo',
        url: 'DRIPSKIPPER-zie-mijn-drip-pak.png',
        channel: 'DripSkipper',
        channelId: 'dripskipper',
        title: 'Zie mijn drippak.',
        description: 'Ik ben #DripSkipper en ik heb een drippak.',
        contentType: 'Real',
        weight: 1.0,
        baseLikes: 350,
        baseDislikes: 10
    },
    {
        id: 7,
        type: 'video',
        url: 'DRIPSKIPPER-yo-ik-ben-snelle-dripper.mp4',
        channel: 'DripSkipper',
        channelId: 'dripskipper',
        title: 'Zie mijn nieuwe drippak.',
        description: 'Ik ben #DripSkipper en ik heb heel veel drippakken.',
        contentType: 'Real',
        weight: 1.0,
        baseLikes: 350,
        baseDislikes: 10
    },
    {
        id: 8,
        type: 'video',
        url: 'NATUREVIDEOS-see-the-see.mp4',
        channel: 'Naturevideo´s',
        channelId: 'naturevideos',
        title: 'See the see',
        description: 'De zee in india, zo prachtig!',
        contentType: 'AI',
        weight: 1.0,
        baseLikes: 300,
        baseDislikes: 5
    },
    {
        id: 9,
        type: 'video',
        url: 'NATUREVIDEOS-see-the-strand.mp4',
        channel: 'Naturevideo´s',
        channelId: 'naturevideos',
        title: 'See the strand',
        description: 'Het strand in afrika, het was er koud!',
        contentType: 'AI',
        weight: 1.0,
        baseLikes: 300,
        baseDislikes: 5
    },
    {
        id: 5,
        type: 'video',
        url: 'FUNNYAI-ik-ben-een-paard-en-ik-ga-pindakaaskoekjes-eten.mp4',
        channel: 'FunnyAI',
        channelId: 'funnyai',
        title: 'Ik ben een paard en ik ga pindakaaskoekjes eten.',
        description: 'Ik hou van pindakaaskoekjes dus ik ben een paard.',
        contentType: 'AI',
        weight: 1.0,
        baseLikes: 34200,
        baseDislikes: 89
    },
    
];
// Fallback video
const FALLBACK_VIDEO_URL = 'https://jimisdebest.github.io/musical/HetBloemenlandDansvideo.mp4';

// ---------- REACTIES ----------
let commentsDatabase = [];

async function loadComments() {
    try {
        const response = await fetch('reacties.txt');
        if (!response.ok) throw new Error('Bestand niet gevonden');
        const text = await response.text();
        commentsDatabase = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        console.log(`📝 ${commentsDatabase.length} reacties geladen`);
    } catch (error) {
        commentsDatabase = [
            "Dit is echt top gemaakt! 🔥",
            "Eerste! 🙋‍♂️",
            "😂😂😂 geweldig",
            "IK GA JE PAKKEN! 👻",
            "FunnyAI is de beste!",
            "Echt AI? Niet te geloven",
            "Hahaha geniaal dit",
            "Like voor deel 2!"
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
    const prefixes = ['@bob', '@ai', '@user', '@fan', '@funnyai', '@kijker'];
    const suffixes = ['123', 'fan', 'nl', 'xd', '👻', 'lover'];
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
const LIKE_DISLIKE_KEY = 'bobtop_preferences';
let lastPlayedVideoId = null;
let videoPlayCount = new Map();
const videoCommentsCache = new Map();
let currentChannelVideos = [];
let isChannelView = false;
let searchTimeout = null;

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

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2300);
}

// ---------- GEWOGEN RANDOM ----------
function getWeightedRandomItem() {
    let available = [...videoDatabase];
    
    if (available.length === 1) return available[0];
    
    const prefs = getPreferences();
    let candidates = available.map(item => {
        let weight = item.weight || 1;
        const pref = prefs[item.id];
        if (pref === 'dislike') weight = 0.02;
        else if (pref === 'like') weight *= 2.2;
        if (item.id === lastPlayedVideoId) weight *= 0.3;
        
        const playCount = videoPlayCount.get(item.id) || 0;
        if (playCount > 3) weight *= 0.7;
        
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
            const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.7;
            
            if (isVisible) {
                document.querySelectorAll('.feed-item video').forEach(otherVideo => {
                    if (otherVideo !== video) {
                        otherVideo.pause();
                        otherVideo.muted = true;
                    }
                });
                
                video.muted = false;
                video.play().catch(() => {
                    video.muted = false;
                    video.play().catch(e => console.log('Kan niet afspelen zonder interactie'));
                });
                
                updateProfilePicture(mediaItem.channelId);
            } else {
                video.pause();
                video.muted = true;
            }
        });
    }, { threshold: 0.7 });
    
    videoObserver.observe(video);
    itemDiv._videoObserver = videoObserver;
    video.muted = true;
}

// ---------- PROFIELFOTO ----------
function updateProfilePicture(channelId) {
    const profileDiv = document.getElementById('currentChannelProfile');
    const profileImg = document.getElementById('profileImage');
    
    profileImg.src = `${channelId.toUpperCase()}.png`;
    profileImg.onerror = () => {
        profileImg.src = 'https://via.placeholder.com/60/333/fff?text=' + channelId[0].toUpperCase();
    };
    
    profileDiv.style.display = 'block';
    profileDiv.dataset.channelId = channelId;
}

// ---------- KANAAL WEERGAVE ----------
function showChannelVideos(channelId) {
    // Haal alle videos van dit kanaal op
    const channelVideos = videoDatabase.filter(v => v.channelId === channelId);
    
    if (channelVideos.length === 0) return;
    
    isChannelView = true;
    currentChannelVideos = channelVideos;
    
    // Leeg de feed
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    currentRenderedIds.clear();
    
    // Voeg alle videos van dit kanaal toe
    channelVideos.forEach(video => {
        const feedItem = createFeedItem(video);
        feed.appendChild(feedItem);
        currentRenderedIds.add(video.id);
    });
    
    showToast(`📺 Alle videos van @${channelId}`);
}

// ---------- TERUG NAAR RANDOM FEED ----------
function showRandomFeed() {
    if (!isChannelView) return;
    
    isChannelView = false;
    currentChannelVideos = [];
    
    // Leeg de feed
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    currentRenderedIds.clear();
    
    // Voeg 3 random videos toe
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
    
    showToast('🎲 Willekeurige videos');
}

// ---------- ZOEKFUNCTIE ----------
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase().trim();
        
        searchTimeout = setTimeout(() => {
            if (query.length === 0) {
                showRandomFeed();
                return;
            }
            
            // Zoek in videos
            const results = videoDatabase.filter(video => 
                video.title.toLowerCase().includes(query) ||
                video.description.toLowerCase().includes(query) ||
                video.channelId.toLowerCase().includes(query) ||
                video.channel.toLowerCase().includes(query)
            );
            
            if (results.length > 0) {
                isChannelView = true;
                currentChannelVideos = results;
                
                const feed = document.getElementById('feed');
                feed.innerHTML = '';
                currentRenderedIds.clear();
                
                results.forEach(video => {
                    const feedItem = createFeedItem(video);
                    feed.appendChild(feedItem);
                    currentRenderedIds.add(video.id);
                });
                
                showToast(`🔍 ${results.length} resultaten`);
            }
        }, 300);
    });
}

// ---------- FEED ----------
let loadedItemCount = 0;
let currentRenderedIds = new Set();
const feedEl = document.getElementById('feed');
const sentinel = document.getElementById('sentinel');
const actionPanelTemplate = document.getElementById('action-panel-template').innerHTML;
const shareMenu = document.getElementById('share-menu');
const commentsModal = document.getElementById('comments-modal');
let currentShareItemId = null;

// ---------- FEED ITEM CREATIE ----------
function createFeedItem(mediaItem) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'feed-item';
    itemDiv.dataset.itemId = mediaItem.id;
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
    }

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
        showChannelVideos(mediaItem.channelId);
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
    
    likeBtn.querySelector('.like-count').textContent = getRandomLikeCount(mediaItem, pref === 'like');
    dislikeBtn.querySelector('.dislike-count').textContent = getRandomDislikeCount(mediaItem, pref === 'dislike');
    commentBtn.querySelector('.comment-count').textContent = Math.floor(Math.random() * 45) + 1;
    saveBtn.querySelector('.save-count').textContent = '0';
    
    if (pref === 'like') likeBtn.classList.add('liked');
    if (pref === 'dislike') dislikeBtn.classList.add('disliked');

    likeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = Number(likeBtn.dataset.id);
        const item = videoDatabase.find(v => v.id === id);
        const current = getPreference(id);
        
        if (current === 'like') {
            setPreference(id, null);
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('.like-count').textContent = getRandomLikeCount(item, false);
            showToast('❤️ Like verwijderd');
        } else {
            setPreference(id, 'like');
            likeBtn.classList.add('liked');
            likeBtn.querySelector('.like-count').textContent = getRandomLikeCount(item, true);
            if (current === 'dislike') {
                dislikeBtn.classList.remove('disliked');
                dislikeBtn.querySelector('.dislike-count').textContent = getRandomDislikeCount(item, false);
            }
            showToast('❤️ Video geliked!');
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
            showToast('👎 Dislike verwijderd');
        } else {
            setPreference(id, 'dislike');
            dislikeBtn.classList.add('disliked');
            dislikeBtn.querySelector('.dislike-count').textContent = getRandomDislikeCount(item, true);
            if (current === 'like') {
                likeBtn.classList.remove('liked');
                likeBtn.querySelector('.like-count').textContent = getRandomLikeCount(item, false);
            }
            showToast('👎 Dislike geplaatst');
        }
    });

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('💾 Opgeslagen!');
    });

    commentBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCommentsModal(mediaItem);
    });

    shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentShareItemId = mediaItem.id;
        openShareMenu(mediaItem);
    });

    itemDiv.appendChild(actionButtons);
    return itemDiv;
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

// ---------- SHARE MENU ----------
function openShareMenu(mediaItem) {
    shareMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeShareMenu() {
    shareMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ---------- PROFIEL KLIK ----------
document.getElementById('currentChannelProfile').addEventListener('click', (e) => {
    const channelId = e.currentTarget.dataset.channelId;
    if (channelId) {
        showChannelVideos(channelId);
    }
});

// ---------- INFINITE SCROLL ----------
let isLoading = false;
let pendingLoad = false;

function addItemToFeed() {
    if (isLoading || isChannelView) return;
    isLoading = true;
    
    const item = getWeightedRandomItem();
    
    const lastItem = feedEl.lastChild;
    if (lastItem && lastItem.dataset.itemId == item.id) {
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
    if (entries[0].isIntersecting && !isChannelView) {
        maybeLoadMore();
    }
}, { threshold: 0.1 });
observer.observe(sentinel);

// ---------- SHARE EVENT LISTENERS ----------
document.getElementById('share-whatsapp')?.addEventListener('click', () => {
    const currentItem = videoDatabase.find(v => v.id === currentShareItemId);
    if (currentItem) {
        const text = `📱 Check dit filmpje op Bobtop: ${currentItem.title} door @${currentItem.channelId} - ${window.location.href}?video=${currentItem.id}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        showToast('📤 Gedeeld via WhatsApp');
    }
    closeShareMenu();
});

document.getElementById('share-discord')?.addEventListener('click', () => {
    const currentItem = videoDatabase.find(v => v.id === currentShareItemId);
    
    if (currentItem) {
        const shareText = `**🎬 ${currentItem.title}**\n` +
                         `**👤 Kanaal:** @${currentItem.channelId}\n` +
                         `**📝 Beschrijving:** ${currentItem.description}\n` +
                         `**🔗 Link:** ${window.location.origin}${window.location.pathname}?video=${currentItem.id}\n\n` +
                         `_Gedeeld via Bobtop_ 📱`;
        
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('📋 Discord bericht gekopieerd!');
            
            setTimeout(() => {
                if (confirm('📋 Bericht gekopieerd!\n\nWil je Discord openen om te plakken?')) {
                    window.open('discord://', '_blank');
                    setTimeout(() => {
                        window.open('https://discord.com/channels/@me', '_blank');
                    }, 1000);
                }
            }, 100);
        });
    }
    closeShareMenu();
});

document.getElementById('share-copy')?.addEventListener('click', async () => {
    const currentItem = videoDatabase.find(v => v.id === currentShareItemId);
    const shareUrl = currentItem ? 
        `${window.location.origin}${window.location.pathname}?video=${currentItem.id}` : 
        window.location.href;
    
    await navigator.clipboard.writeText(shareUrl);
    showToast('🔗 Link gekopieerd!');
    closeShareMenu();
});

document.querySelector('.share-close')?.addEventListener('click', closeShareMenu);

// Modal event listeners
commentsModal.addEventListener('click', (e) => {
    if (e.target === commentsModal) {
        closeCommentsModal();
    }
});

document.querySelector('.close-comments')?.addEventListener('click', closeCommentsModal);
document.querySelector('.close-comments-btn')?.addEventListener('click', closeCommentsModal);

// ---------- INIT ----------
async function init() {
    await loadComments();
    setupSearch();
    
    // Start met 3 random videos
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

init();

// Cleanup
window.addEventListener('beforeunload', () => {
    document.querySelectorAll('.feed-item').forEach(item => {
        if (item._videoObserver) {
            item._videoObserver.disconnect();
        }
    });
});
