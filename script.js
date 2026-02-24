// ---------- BOBTOP 6.0 - MET SWIPE EN KANAALPROFIELEN ----------
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
        title: 'Ik ben een paard en ik ga pindakaas',
        description: 'Hilarische AI video - niet alleen kijken voor het slapen gaan',
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

// ---------- STORAGE & STATE ----------
const LIKE_DISLIKE_KEY = 'bobtop_preferences';
let currentChannelFilter = null;
let lastPlayedVideoId = null;
let videoPlayCount = new Map();
const videoCommentsCache = new Map();
let currentSwipeIndex = 0;
let swipeStartX = 0;
let isSwiping = false;

// Groepeer videos per kanaal
const channelVideos = {};
videoDatabase.forEach(video => {
    if (!channelVideos[video.channelId]) {
        channelVideos[video.channelId] = [];
    }
    channelVideos[video.channelId].push(video);
});

// Lijst van kanalen in volgorde
const channels = Object.keys(channelVideos);

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
                document.querySelectorAll(`.swipe-item[data-channel="${currentChannelFilter || 'all'}"] video`).forEach(otherVideo => {
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

// ---------- FEED ITEM CREATIE ----------
function createFeedItem(mediaItem) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'feed-item';
    itemDiv.dataset.itemId = mediaItem.id;

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
        filterToChannel(mediaItem.channelId);
    });

    const actionsDiv = document.createElement('div');
    actionsDiv.innerHTML = document.getElementById('action-panel-template').innerHTML;
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
        showToast('💾 Opgeslagen! (Lijsten komen later)');
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
    
    document.getElementById('comments-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCommentsModal() {
    document.getElementById('comments-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ---------- SHARE MENU ----------
let currentShareItemId = null;

function openShareMenu(mediaItem) {
    const shareMenu = document.getElementById('share-menu');
    shareMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeShareMenu() {
    document.getElementById('share-menu').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ---------- KANAAL FILTER FUNCTIES ----------
function filterToChannel(channelId) {
    const index = channels.indexOf(channelId);
    if (index !== -1) {
        currentSwipeIndex = index;
        updateSwipePosition();
        updateActiveProfile();
        showToast(`📺 @${channelId}`);
    }
}

function updateActiveProfile() {
    document.querySelectorAll('.channel-profile').forEach(profile => {
        const channelId = profile.dataset.channelId;
        if (channelId === channels[currentSwipeIndex]) {
            profile.classList.add('active');
        } else {
            profile.classList.remove('active');
        }
    });
}

// ---------- SWIPE FUNCTIES ----------
function initSwipe() {
    const container = document.querySelector('.swipe-container');
    const wrapper = document.querySelector('.swipe-wrapper');
    
    // Maak swipe items voor elk kanaal
    channels.forEach(channelId => {
        const swipeItem = document.createElement('div');
        swipeItem.className = 'swipe-item';
        swipeItem.dataset.channel = channelId;
        
        const feed = document.createElement('div');
        feed.className = 'feed';
        
        // Voeg alle videos van dit kanaal toe
        channelVideos[channelId].forEach(video => {
            feed.appendChild(createFeedItem(video));
        });
        
        swipeItem.appendChild(feed);
        wrapper.appendChild(swipeItem);
    });
    
    // Voeg sentinel toe aan laatste feed
    const lastSwipeItem = wrapper.lastElementChild;
    if (lastSwipeItem) {
        const sentinel = document.createElement('div');
        sentinel.className = 'bottom-sentinel';
        sentinel.id = 'sentinel';
        lastSwipeItem.querySelector('.feed').appendChild(sentinel);
    }
    
    // Swipe event listeners
    container.addEventListener('touchstart', (e) => {
        swipeStartX = e.touches[0].clientX;
        isSwiping = true;
    }, { passive: true });
    
    container.addEventListener('touchmove', (e) => {
        if (!isSwiping) return;
        
        const currentX = e.touches[0].clientX;
        const diff = currentX - swipeStartX;
        const swipeWidth = window.innerWidth;
        
        // Alleen swipen als het geen verticale scroll is
        if (Math.abs(diff) > 20) {
            e.preventDefault();
            
            // Bereken nieuwe positie met weerstand
            let newPosition = (currentSwipeIndex * -swipeWidth) + diff * 0.3;
            wrapper.style.transform = `translateX(${newPosition}px)`;
            wrapper.style.transition = 'none';
        }
    }, { passive: false });
    
    container.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = endX - swipeStartX;
        const swipeWidth = window.innerWidth;
        
        wrapper.style.transition = 'transform 0.3s ease-out';
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSwipeIndex > 0) {
                // Swipe naar rechts (vorig kanaal)
                currentSwipeIndex--;
            } else if (diff < 0 && currentSwipeIndex < channels.length - 1) {
                // Swipe naar links (volgend kanaal)
                currentSwipeIndex++;
            }
        }
        
        updateSwipePosition();
        updateActiveProfile();
        
        isSwiping = false;
        swipeStartX = 0;
    }, { passive: true });
}

function updateSwipePosition() {
    const wrapper = document.querySelector('.swipe-wrapper');
    const swipeWidth = window.innerWidth;
    wrapper.style.transform = `translateX(-${currentSwipeIndex * swipeWidth}px)`;
}

// ---------- KANAAL PROFIELEN ----------
function createChannelProfiles() {
    const sidebar = document.createElement('div');
    sidebar.className = 'channel-sidebar';
    
    channels.forEach(channelId => {
        const profile = document.createElement('div');
        profile.className = `channel-profile ${channelId === channels[0] ? 'active' : ''}`;
        profile.dataset.channelId = channelId;
        
        const img = document.createElement('img');
        img.src = `${channelId.toUpperCase()}.png`;
        img.alt = `@${channelId}`;
        img.onerror = () => {
            img.src = 'https://via.placeholder.com/60/333/fff?text=' + channelId[0].toUpperCase();
        };
        
        profile.appendChild(img);
        
        profile.addEventListener('click', () => {
            filterToChannel(channelId);
        });
        
        sidebar.appendChild(profile);
    });
    
    document.querySelector('.app-container').appendChild(sidebar);
}

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
document.getElementById('comments-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('comments-modal')) {
        closeCommentsModal();
    }
});

document.querySelector('.close-comments')?.addEventListener('click', closeCommentsModal);
document.querySelector('.close-comments-btn')?.addEventListener('click', closeCommentsModal);

// ---------- INIT ----------
async function init() {
    await loadComments();
    
    // Maak app container
    const appContainer = document.createElement('div');
    appContainer.className = 'app-container';
    document.body.appendChild(appContainer);
    
    // Maak swipe container
    const swipeContainer = document.createElement('div');
    swipeContainer.className = 'swipe-container';
    const swipeWrapper = document.createElement('div');
    swipeWrapper.className = 'swipe-wrapper';
    swipeContainer.appendChild(swipeWrapper);
    appContainer.appendChild(swipeContainer);
    
    // Verplaats feed naar swipe wrapper
    const feed = document.getElementById('feed');
    feed.remove();
    swipeWrapper.appendChild(feed);
    
    // Initialiseer swipe en profielen
    createChannelProfiles();
    initSwipe();
    
    // Update active profile
    updateActiveProfile();
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
