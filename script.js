// ---------- BOBTOP 2.0 - MET GELUID, KANAALFILTER, DELEN & PERFECTE SCROLL ----------
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
        weight: 1
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
        weight: 1
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
        weight: 1
    }
];

// ---------- STORAGE & STATE ----------
const STORAGE_KEY = 'bobtop_saved_items';
const LIKE_DISLIKE_KEY = 'bobtop_preferences';
let currentFilterChannel = null; // null = alle videos, anders channelId
let activeVideos = []; // alle videos die getoond worden (gefilterd)

// ---------- HELPER FUNCTIES ----------
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

// ---------- FILTER OP KANAAL ----------
function filterByChannel(channelId) {
    currentFilterChannel = channelId;
    // leeg de feed en reset
    feedEl.innerHTML = '';
    currentRenderedIds.clear();
    loadedItemCount = 0;
    
    // toon toastje
    showToast(`📺 Alleen @${channelId}`);
    
    // laad nieuwe items
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

// ---------- GEWOGEN RANDOM MET KANAALFILTER ----------
function getWeightedRandomItem() {
    // welke items zijn beschikbaar?
    let available = currentFilterChannel 
        ? videoDatabase.filter(item => item.channelId === currentFilterChannel)
        : [...videoDatabase];
    
    if (available.length === 0) {
        // als geen items in dit kanaal, terug naar alle videos
        currentFilterChannel = null;
        available = [...videoDatabase];
    }
    
    const prefs = getPreferences();
    let candidates = available.map(item => {
        let baseWeight = item.weight || 1;
        const pref = prefs[item.id];
        if (pref === 'dislike') baseWeight = 0.02;
        else if (pref === 'like') baseWeight *= 2.2;
        return { item, weight: baseWeight };
    });
    
    const total = candidates.reduce((sum, c) => sum + Math.max(0.01, c.weight), 0);
    let rand = Math.random() * total;
    for (let c of candidates) {
        if (rand < c.weight) return c.item;
        rand -= c.weight;
    }
    return candidates[0]?.item || available[0];
}

// ---------- FEED & SCROLL ----------
let loadedItemCount = 0;
let currentRenderedIds = new Set();
const feedEl = document.getElementById('feed');
const sentinel = document.getElementById('sentinel');
const actionPanelTemplate = document.getElementById('action-panel-template').innerHTML;
const shareMenu = document.getElementById('share-menu');
let currentShareItemId = null;

// Toast
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2300);
}

// ---------- VIDEO AUTOPLAY & GELUID ----------
function setupVideo(video, itemDiv) {
    video.loop = true;
    video.muted = false; // GELUID AAN!
    video.playsInline = true;
    video.preload = 'auto';
    
    // autoplay met geluid - alleen als in viewport
    const tryPlay = () => {
        video.play().catch(e => {
            console.log('Autoplay geblokkeerd, wacht op interactie');
        });
    };
    
    // Intersection Observer voor play/pause
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.currentTime = 0;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.6 });
    
    videoObserver.observe(video);
    
    // error handling
    video.onerror = () => {
        console.warn(`Video ${video.src} niet geladen`);
        itemDiv.remove();
        maybeLoadMore();
    };
}

// ---------- FEED ITEM CREATIE ----------
function createFeedItem(mediaItem) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'feed-item';
    itemDiv.dataset.itemId = mediaItem.id;
    itemDiv.dataset.type = mediaItem.type;
    itemDiv.dataset.url = mediaItem.url;

    // media container
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';

    let mediaEl;
    if (mediaItem.type === 'video') {
        mediaEl = document.createElement('video');
        mediaEl.src = mediaItem.url;
        setupVideo(mediaEl, itemDiv);
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

    // info + KLIKBAAR KANAAL
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

    // kanaal click event
    const channelLink = infoDiv.querySelector('.channel-link');
    channelLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        filterByChannel(mediaItem.channelId);
    });

    // actieknoppen
    const actionsDiv = document.createElement('div');
    actionsDiv.innerHTML = actionPanelTemplate;
    const actionButtons = actionsDiv.firstElementChild.cloneNode(true);
    
    const likeBtn = actionButtons.querySelector('.like-btn');
    const dislikeBtn = actionButtons.querySelector('.dislike-btn');
    const saveBtn = actionButtons.querySelector('.save-btn');
    const shareBtn = actionButtons.querySelector('.share-btn');
    
    likeBtn.dataset.id = mediaItem.id;
    dislikeBtn.dataset.id = mediaItem.id;
    saveBtn.dataset.id = mediaItem.id;
    shareBtn.dataset.id = mediaItem.id;

    // counts & states
    const likeCountSpan = likeBtn.querySelector('.like-count');
    const dislikeCountSpan = dislikeBtn.querySelector('.dislike-count');
    const saveCountSpan = saveBtn.querySelector('.save-count');
    
    const pref = getPreference(mediaItem.id);
    if (pref === 'like') {
        likeBtn.classList.add('liked');
        likeCountSpan.textContent = '1';
    } else likeCountSpan.textContent = '0';
    
    if (pref === 'dislike') {
        dislikeBtn.classList.add('disliked');
        dislikeCountSpan.textContent = '1';
    } else dislikeCountSpan.textContent = '0';
    
    const saved = isItemSaved(mediaItem.id);
    if (saved) {
        saveBtn.classList.add('saved');
        saveCountSpan.textContent = '1';
    } else saveCountSpan.textContent = '0';

    // EVENT LISTENERS
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(likeBtn.dataset.id);
        const current = getPreference(id);
        if (current === 'like') {
            setPreference(id, null);
            likeBtn.classList.remove('liked');
            likeCountSpan.textContent = '0';
        } else {
            setPreference(id, 'like');
            likeBtn.classList.add('liked');
            likeCountSpan.textContent = '1';
            if (current === 'dislike') {
                dislikeBtn.classList.remove('disliked');
                dislikeCountSpan.textContent = '0';
            }
        }
    });

    dislikeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(dislikeBtn.dataset.id);
        const current = getPreference(id);
        if (current === 'dislike') {
            setPreference(id, null);
            dislikeBtn.classList.remove('disliked');
            dislikeCountSpan.textContent = '0';
        } else {
            setPreference(id, 'dislike');
            dislikeBtn.classList.add('disliked');
            dislikeCountSpan.textContent = '1';
            if (current === 'like') {
                likeBtn.classList.remove('liked');
                likeCountSpan.textContent = '0';
            }
        }
    });

    saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
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

    // DEEL KNOP
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentShareItemId = mediaItem.id;
        openShareMenu(mediaItem);
    });

    itemDiv.appendChild(actionButtons);
    return itemDiv;
}

// ---------- DEEL MENU ----------
function openShareMenu(mediaItem) {
    shareMenu.classList.add('active');
    
    // WhatsApp delen
    const whatsappBtn = document.getElementById('share-whatsapp');
    const copyBtn = document.getElementById('share-copy');
    const closeBtn = shareMenu.querySelector('.share-close');
    
    // Verwijder oude listeners
    const newWhatsapp = whatsappBtn.cloneNode(true);
    const newCopy = copyBtn.cloneNode(true);
    const newClose = closeBtn.cloneNode(true);
    whatsappBtn.parentNode.replaceChild(newWhatsapp, whatsappBtn);
    copyBtn.parentNode.replaceChild(newCopy, copyBtn);
    shareMenu.querySelector('.share-close').replaceWith(newClose);
    
    // Nieuwe listeners
    newWhatsapp.addEventListener('click', () => {
        const text = `Check dit filmpje op Bobtop: ${mediaItem.title} door @${mediaItem.channelId}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        shareMenu.classList.remove('active');
    });
    
    newCopy.addEventListener('click', () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?video=${mediaItem.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast('🔗 Link gekopieerd naar klembord');
            shareMenu.classList.remove('active');
        }).catch(() => {
            // fallback
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('🔗 Link gekopieerd');
            shareMenu.classList.remove('active');
        });
    });
    
    newClose.addEventListener('click', () => {
        shareMenu.classList.remove('active');
    });
}

// Sluit share menu bij klik buiten content
shareMenu.addEventListener('click', (e) => {
    if (e.target === shareMenu) {
        shareMenu.classList.remove('active');
    }
});

// ---------- ONEINDIG SCROLLEN ----------
let isLoading = false;
function addItemToFeed() {
    let item = getWeightedRandomItem();
    
    // voorkom directe repeats
    const lastTwoIds = Array.from(currentRenderedIds).slice(-2);
    let attempts = 0;
    while (lastTwoIds.includes(item.id) && attempts < 20) {
        item = getWeightedRandomItem();
        attempts++;
    }

    const feedItem = createFeedItem(item);
    feedEl.appendChild(feedItem);
    currentRenderedIds.add(item.id);
    loadedItemCount++;
}

function maybeLoadMore() {
    if (isLoading) return;
    isLoading = true;
    addItemToFeed();
    setTimeout(() => { isLoading = false; }, 300);
}

// Intersection Observer voor sentinel
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        maybeLoadMore();
    }
}, { threshold: 0.1 });
observer.observe(sentinel);

// ---------- SCROLL SNAP FIX ----------
// forceer snap naar dichtsbijzijnde video na scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const feedItems = document.querySelectorAll('.feed-item');
        if (feedItems.length === 0) return;
        
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        // vind welke video het meest in beeld is
        let bestItem = null;
        let bestVisibility = 0;
        
        feedItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            if (visibleHeight > bestVisibility) {
                bestVisibility = visibleHeight;
                bestItem = item;
            }
        });
        
        if (bestItem && bestVisibility > viewportHeight * 0.4) {
            bestItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
});

// ---------- INIT ----------
function initFeed() {
    // check URL voor video parameter (direct delen)
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('video');
    
    if (videoId) {
        const found = videoDatabase.find(v => v.id === Number(videoId));
        if (found) {
            // toon deze video als eerste
            const feedItem = createFeedItem(found);
            feedEl.appendChild(feedItem);
            currentRenderedIds.add(found.id);
            loadedItemCount++;
        }
    }
    
    // voeg nog 2 extra items toe
    for (let i = 0; i < 2; i++) {
        addItemToFeed();
    }
}

// start
initFeed();

// pauzeer alle videos buiten beeld bij start
window.addEventListener('load', () => {
    // kleine vertraging zodat autoplay kan starten
});
