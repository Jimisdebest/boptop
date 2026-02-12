// ---------- BO B TOP – AI FEED ----------
// data – voeg hier oneindig veel nieuwe filmpjes / afbeeldingen toe
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
    },
    // 👇 voeg zelf moeiteloos meer items toe (ook afbeeldingen)
    // {
    //     id: 4,
    //     type: 'image',
    //     url: 'mijn-ai-kunst.png',
    //     channel: 'AIartBob',
    //     channelId: 'aibob',
    //     title: 'Cyberpunk kat',
    //     description: 'Gemaakt met DALL-E 2',
    //     contentType: 'AI',
    //     weight: 1
    // },
    // {
    //     id: 5,
    //     type: 'video',
    //     url: 'nieuw-filmpje.mp4',
    //     channel: 'Creatief',
    //     channelId: 'crea',
    //     title: 'Nieuwe stijl',
    //     description: 'Gewoon testen',
    //     contentType: 'AI',
    //     weight: 1
    // }
];

// ---------- GLOBALE GEBRUIKERSACTIES (localStorage) ----------
const STORAGE_KEY = 'bobtop_saved_items';
const LIKE_DISLIKE_KEY = 'bobtop_preferences'; // { id: 'like'|'dislike'|null }

// ---------- HELPER FUNCTIES ----------
function getSavedItems() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
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
    let saved = getSavedItems();
    saved = saved.filter(id => id !== itemId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return saved;
}

function isItemSaved(itemId) {
    return getSavedItems().includes(itemId);
}

// voorkeuren (like/dislike) 
function getPreferences() {
    try {
        return JSON.parse(localStorage.getItem(LIKE_DISLIKE_KEY)) || {};
    } catch {
        return {};
    }
}

function setPreference(itemId, type) {
    // type: 'like', 'dislike', null (verwijder)
    const prefs = getPreferences();
    if (type === null) {
        delete prefs[itemId];
    } else {
        prefs[itemId] = type;
    }
    localStorage.setItem(LIKE_DISLIKE_KEY, JSON.stringify(prefs));
}

function getPreference(itemId) {
    return getPreferences()[itemId] || null;
}

// gewogen random selectie obv weight (hoger = vaker, dislike zwaar onderdrukt)
function getWeightedRandomItem() {
    const prefs = getPreferences();
    // bouw lijst met gekopieerde items + wegingsfactor
    let candidates = videoDatabase.map(item => {
        let baseWeight = item.weight || 1;
        const pref = prefs[item.id];
        if (pref === 'dislike') {
            baseWeight = 0.02;  // bijna nooit tonen, maar niet 0 (voor als er niks anders is)
        } else if (pref === 'like') {
            baseWeight *= 2.2;  // vaker tonen
        }
        return { item, weight: baseWeight };
    });

    // als alles weight 0 heeft (onmogelijk) forceer dan alles op 1
    const total = candidates.reduce((sum, c) => sum + Math.max(0.01, c.weight), 0);
    let rand = Math.random() * total;
    for (let c of candidates) {
        if (rand < c.weight) return c.item;
        rand -= c.weight;
    }
    return candidates[0]?.item || videoDatabase[0];
}

// ----- FEED & SCROLL LOGICA -----
let loadedItems = [];   // bijgehouden welke items al in de feed staan (om duplicaten in sessie te minimaliseren)
let currentRenderedIds = new Set();

const feedEl = document.getElementById('feed');
const sentinel = document.getElementById('sentinel');
const actionPanelTemplate = document.getElementById('action-panel-template').innerHTML;

// toon toastje
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg || 'Opgeslagen in Bobtop-lijst 💾';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2300);
}

// Een feed-item aanmaken (DOM)
function createFeedItem(mediaItem) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'feed-item';
    itemDiv.dataset.itemId = mediaItem.id;
    itemDiv.dataset.type = mediaItem.type;
    itemDiv.dataset.url = mediaItem.url;

    // container voor media
    const mediaContainer = document.createElement('div');
    mediaContainer.className = 'media-container';

    let mediaEl;
    if (mediaItem.type === 'video') {
        mediaEl = document.createElement('video');
        mediaEl.src = mediaItem.url;
        mediaEl.loop = true;
        mediaEl.muted = true;
        mediaEl.playsInline = true;
        mediaEl.autoplay = true;
        mediaEl.preload = 'auto';
        // als video niet laadt -> skip naar volgende (error handling)
        mediaEl.onerror = (e) => {
            console.warn(`Video ${mediaItem.url} niet geladen, sla over → next`);
            itemDiv.remove(); // direct verwijderen, sentinel triggert nieuwe
            maybeLoadMore(); 
        };
        // play attempt
        mediaEl.play().catch(e => {
            // stille fout, wordt vaak door autoplay restrictie veroorzaakt.
        });
    } else {
        mediaEl = document.createElement('img');
        mediaEl.src = mediaItem.url;
        mediaEl.alt = mediaItem.title || 'AI gegenereerd';
        mediaEl.loading = 'lazy';
        mediaEl.onerror = () => {
            console.warn(`Afbeelding ${mediaItem.url} niet gevonden → skip`);
            itemDiv.remove();
            maybeLoadMore();
        };
    }

    mediaContainer.appendChild(mediaEl);
    itemDiv.appendChild(mediaContainer);

    // info onderlaag (channel, titel, beschrijving)
    const infoDiv = document.createElement('div');
    infoDiv.className = 'item-info';
    infoDiv.innerHTML = `
        <div class="channel-name">
            <span>@${mediaItem.channelId || mediaItem.channel}</span>
            <span class="content-badge">${mediaItem.contentType || 'AI'}</span>
        </div>
        <div class="title-description">
            <strong>${mediaItem.title || ''}</strong> ${mediaItem.description ? '· ' + mediaItem.description : ''}
        </div>
    `;
    itemDiv.appendChild(infoDiv);

    // actieknoppen (rechts) – inladen template
    const actionsDiv = document.createElement('div');
    actionsDiv.innerHTML = actionPanelTemplate;
    const actionButtons = actionsDiv.firstElementChild.cloneNode(true);
    
    // unieke ID's koppelen via dataset, tellers updaten
    const likeBtn = actionButtons.querySelector('.like-btn');
    const dislikeBtn = actionButtons.querySelector('.dislike-btn');
    const saveBtn = actionButtons.querySelector('.save-btn');
    
    likeBtn.dataset.id = mediaItem.id;
    dislikeBtn.dataset.id = mediaItem.id;
    saveBtn.dataset.id = mediaItem.id;

    // counts (voorlopig dummy, we tonen alleen als er actie is)
    const likeCountSpan = likeBtn.querySelector('.like-count');
    const dislikeCountSpan = dislikeBtn.querySelector('.dislike-count');
    const saveCountSpan = saveBtn.querySelector('.save-count');
    
    // voorkeuren uitlezen en styling toepassen
    const pref = getPreference(mediaItem.id);
    if (pref === 'like') {
        likeBtn.classList.add('liked');
        likeCountSpan.textContent = '1';
    } else {
        likeCountSpan.textContent = '0';
    }
    if (pref === 'dislike') {
        dislikeBtn.classList.add('disliked');
        dislikeCountSpan.textContent = '1';
    } else {
        dislikeCountSpan.textContent = '0';
    }
    
    const saved = isItemSaved(mediaItem.id);
    if (saved) {
        saveBtn.classList.add('saved');
        saveCountSpan.textContent = '1';
    } else {
        saveCountSpan.textContent = '0';
    }

    // ----- EVENT LISTENERS (like, dislike, save) -----
    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(likeBtn.dataset.id);
        const current = getPreference(id);
        if (current === 'like') {
            // like verwijderen
            setPreference(id, null);
            likeBtn.classList.remove('liked');
            likeCountSpan.textContent = '0';
        } else {
            setPreference(id, 'like');
            likeBtn.classList.add('liked');
            likeCountSpan.textContent = '1';
            // dislike uitzetten indien aanwezig
            if (current === 'dislike') {
                dislikeBtn.classList.remove('disliked');
                dislikeCountSpan.textContent = '0';
            }
        }
        // herweging gebeurt bij volgende scroll
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

    itemDiv.appendChild(actionButtons);
    return itemDiv;
}

// voeg nieuw item toe aan feed
function addItemToFeed() {
    let item = getWeightedRandomItem();
    // voorkomen dat dezelfde item achter elkaar verschijnt? simpel: als hij al in laatste 2 zit, probeer ander
    const lastTwoIds = Array.from(currentRenderedIds).slice(-2);
    let attempts = 0;
    while (lastTwoIds.includes(item.id) && attempts < 15) {
        item = getWeightedRandomItem();
        attempts++;
    }

    const feedItem = createFeedItem(item);
    feedEl.appendChild(feedItem);
    currentRenderedIds.add(item.id);
    
    // autoplay van video wordt door browser soms geblokkeerd; we proberen opnieuw bij intersectie (later)
    // maar we zetten alvast playing
    const video = feedItem.querySelector('video');
    if (video) {
        video.play().catch(() => {}); // stil
    }
}

// sentinel intersection observer -> oneindig scrollen
let isLoading = false;
function maybeLoadMore() {
    if (isLoading) return;
    isLoading = true;
    // voeg 1 of 2 items toe
    addItemToFeed();
    setTimeout(() => { isLoading = false; }, 200);
}

// Intersection Observer voor sentinel
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        maybeLoadMore();
    }
}, { threshold: 0.1 });
observer.observe(sentinel);

// init feed: minimaal 3 items bij start
function initFeed() {
    // begin met 3 items zodat er meteen gescrold kan worden
    for (let i = 0; i < 3; i++) {
        addItemToFeed();
    }
}

// extra: als video niet afspeelt door error, verwijderen we hem direct via error handler. maar ook globale fallback:
window.addEventListener('load', () => {
    initFeed();
});

// handmatig checken voor mislukte video's (al gedaan in onerror)
// maar voor de zekerheid ook een timer voor het geval dat.
