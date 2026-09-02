  // Global HTML-escape for all user-generated strings rendered via innerHTML
  window.escH = s => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  // Public display names never include an email (users/{uid} is public-read).
  function publicDisplayName(name) {
    const n = String(name || '').trim();
    if (!n || n.includes('@')) return 'Member';
    return n.slice(0, 100);
  }
  function currentPublicName() {
    return publicDisplayName(typeof cvUser !== 'undefined' && cvUser && cvUser.displayName);
  }
  function publicHandle(name) {
    const n = publicDisplayName(name);
    if (n === 'Member') return '';
    return '@' + n.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24);
  }

  // Public contact only — not a live Google mailbox, not a sign-in.
  const BAKASAN_CONTACT_EMAIL = 'jebb@subx.it';

  const sidebar  = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const subnavArtist      = document.getElementById('subnav-artist');
  const subnavCollection  = document.getElementById('subnav-collection');
  const subnavWomen       = document.getElementById('subnav-women');
  const subnavIconography = document.getElementById('subnav-iconography');
  const subnavAsian       = document.getElementById('subnav-asian-ladies');
  const subnavNature      = document.getElementById('subnav-nature');

  // Submenus the user explicitly collapsed by re-clicking the parent tab.
  // highlightNav respects these until the parent is clicked again.
  const navManualClosed = new Set();

  const inArtist      = new Set(['artist','home','introduction','statement','biography']);
  const inCollection  = new Set(['collection','women','murasaki','okoi','niijo','rengetsu','gotami','nukada','tibetan','siam','iconography','green-tara','black-tara','kuan-yin','kannon','amida','asian-ladies','oiran','brocade','indonesian','burmese','kimono-rug','peacock','nature','topanga46','forest','topanga103','topanga147']);
  const inWomen       = new Set(['women','murasaki','okoi','niijo','rengetsu','gotami','nukada','tibetan','siam']);
  const inIconography = new Set(['iconography','green-tara','black-tara','kuan-yin','kannon','amida']);
  const inAsian       = new Set(['asian-ladies','oiran','brocade','indonesian','burmese','kimono-rug','peacock']);
  const inNature      = new Set(['nature','topanga46','forest','topanga103','topanga147']);

  // ── Section classification ────────────────────────────
  const MAIN_SECTIONS   = ['home','collection','women','iconography',
                           'asian-ladies','nature','introduction','statement','biography','contact','thoughts','news'];
  const MOBILE_NAV_MQ   = 900;
  // DETAIL_SECTIONS derived from paintings data file — auto-includes all paintings
  const DETAIL_SECTIONS = (typeof PAINTINGS_DATA !== 'undefined')
    ? PAINTINGS_DATA.map(p => p.id)
    : ['murasaki','okoi','niijo','rengetsu','gotami','nukada','tibetan','siam',
       'green-tara','black-tara','kuan-yin','kannon','amida',
       'oiran','brocade','indonesian','burmese','kimono-rug','peacock',
       'topanga46','forest','topanga103','topanga147'];

  // Find which gallery section a detail page belongs to
  function detailParent(id) {
    if (inWomen.has(id))       return 'women';
    if (inIconography.has(id)) return 'iconography';
    if (inAsian.has(id))       return 'asian-ladies';
    if (inNature.has(id))      return 'nature';
    return 'collection';
  }

  function isMobileNav() {
    return window.innerWidth <= MOBILE_NAV_MQ;
  }

  function closeMobileNav() {
    document.body.classList.remove('nav-open');
    syncHamburgerAria();
  }

  function syncHamburgerAria() {
    if (!hamburger) return;
    const open = isMobileNav()
      ? document.body.classList.contains('nav-open')
      : !document.body.classList.contains('nav-collapsed');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  function highlightSocial(name) {
    document.querySelectorAll('.nav-social-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const el = document.querySelector('[data-social="' + name + '"]');
    if (el) el.classList.add('active');
    subnavArtist.classList.remove('open');
    subnavCollection.classList.remove('open');
    subnavWomen.classList.remove('open');
    subnavIconography.classList.remove('open');
    subnavAsian.classList.remove('open');
    subnavNature.classList.remove('open');
  }

  // ── Nav highlight helper ──────────────────────────────
  function highlightNav(id) {
    const navId = (id === 'home') ? 'artist' : id;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.nav-social-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('[data-page="' + navId + '"]').forEach(l => l.classList.add('active'));
    if (id === 'home' || id === 'artist') {
      document.querySelectorAll('[data-page="artist"]').forEach(l => l.classList.add('active'));
    }
    subnavArtist.classList.toggle('open',      inArtist.has(navId) || inArtist.has(id));
    if (navManualClosed.has('subnav-artist')) subnavArtist.classList.remove('open');
    subnavCollection.classList.toggle('open',  inCollection.has(id)  && !navManualClosed.has('subnav-collection'));
    subnavWomen.classList.toggle('open',       inWomen.has(id)       && !navManualClosed.has('subnav-women'));
    subnavIconography.classList.toggle('open', inIconography.has(id) && !navManualClosed.has('subnav-iconography'));
    subnavAsian.classList.toggle('open',       inAsian.has(id)       && !navManualClosed.has('subnav-asian-ladies'));
    subnavNature.classList.toggle('open',      inNature.has(id)      && !navManualClosed.has('subnav-nature'));
  }

  function closeSocialOverlays() {
    const exploreOverlay = document.getElementById('explore-overlay');
    const notifOverlay   = document.getElementById('notif-overlay');
    const chatOverlay    = document.getElementById('chat-overlay');
    const profileOverlay = document.getElementById('profile-overlay');
    if (exploreOverlay) exploreOverlay.classList.remove('active');
    if (notifOverlay)   notifOverlay.classList.remove('active');
    if (chatOverlay)    chatOverlay.classList.remove('active');
    if (profileOverlay) profileOverlay.classList.remove('active');
    document.querySelectorAll('.nav-social-link').forEach(l => l.classList.remove('active'));
  }

  function showContentPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + id);
    if (!page) return;
    page.classList.add('active');
    window.scrollTo(0, 0);
    if (typeof cvInjectSection === 'function' && DETAIL_SECTIONS.includes(id)) {
      cvInjectSection(page, id);
      const convSec = page.querySelector('.conv-section');
      if (convSec && typeof cvInitSection === 'function') cvInitSection(convSec);
    }
  }

  function selectThoughtsTab(tab) {
    document.querySelectorAll('.thoughts-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.thoughtsTab === tab);
    });
    const forYou = document.getElementById('thoughts-feed-foryou');
    const following = document.getElementById('thoughts-feed-following');
    if (forYou) forYou.style.display = tab === 'following' ? 'none' : '';
    if (following) following.style.display = tab === 'following' ? '' : 'none';
  }

  function normalizeRoute(route) {
    let id = String(route || '').replace(/^#/, '').trim();
    if (!id) id = 'collection';
    try { id = decodeURIComponent(id); } catch (e) { /* keep raw */ }
    return id;
  }

  function routeFromHash() {
    return normalizeRoute(window.location.hash);
  }

  function go(route) {
    const id = normalizeRoute(route);
    const hash = '#' + id;
    if (location.hash === hash) {
      applyRoute();
      return;
    }
    location.hash = hash;
  }

  function viewBack() {
    if (window.history.length > 1) history.back();
    else go('collection');
  }

  // ── showPage: navigate via shareable hash routes ──
  function showPage(id) {
    if (!id) return;
    go(id === 'thoughts' ? 'home' : id);
  }

  function applyRoute() {
    closeMobileNav();
    const raw = routeFromHash();

    if (raw.startsWith('post-')) {
      closeSocialOverlays();
      showContentPage('thoughts');
      highlightSocial('home');
      selectThoughtsTab('foryou');
      scrollToPost(raw.slice(5));
      return;
    }

    if (raw === 'following') {
      closeSocialOverlays();
      showContentPage('thoughts');
      highlightSocial('home');
      selectThoughtsTab('following');
      return;
    }

    if (raw === 'home' || raw === 'feed' || raw === 'thoughts') {
      closeSocialOverlays();
      showContentPage('thoughts');
      highlightSocial('home');
      selectThoughtsTab('foryou');
      return;
    }

    if (raw === 'artist') {
      closeSocialOverlays();
      showContentPage('home');
      highlightNav('artist');
      return;
    }

    if (raw === 'chat') {
      if (typeof openChat === 'function') openChat();
      return;
    }
    if (raw === 'notifications') {
      if (typeof openNotif === 'function') openNotif();
      return;
    }
    if (raw === 'explore') {
      if (typeof openExplore === 'function') openExplore();
      return;
    }
    if (raw === 'profile') {
      if (typeof openProfile === 'function') openProfile();
      return;
    }

    if (raw === 'news') {
      closeSocialOverlays();
      showContentPage('news');
      highlightSocial('news');
      return;
    }

    if (document.getElementById('page-' + raw)) {
      closeSocialOverlays();
      showContentPage(raw);
      highlightNav(raw);
      return;
    }

    closeSocialOverlays();
    showContentPage('collection');
    highlightNav('collection');
  }

  function scrollToPost(postId) {
    if (!postId) return;
    let attempts = 0;
    const interval = setInterval(() => {
      const el = document.querySelector('[data-post-id="' + postId + '"]');
      if (el) {
        clearInterval(interval);
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.transition = 'background 0.3s';
        el.style.background = 'rgba(139,109,63,0.12)';
        setTimeout(() => { el.style.background = ''; }, 2000);
      }
      if (++attempts > 40) clearInterval(interval);
    }, 100);
  }

  // ── Follow system ────────────────────────────────────

  // Cache of UIDs the current user is following (refreshed on auth change)
  let followingCache = new Set();

  async function followRefreshCache() {
    if (!cvUser) { followingCache = new Set(); return; }
    const snap = await fbDb.collection('follows').doc(cvUser.uid)
      .collection('following').get();
    followingCache = new Set(snap.docs.map(d => d.id));
  }

  async function followUser(targetUid, targetName) {
    if (!cvUser) { cvOpenModal('login'); return; }
    if (cvIsOperator) return;
    if (targetUid === cvUser.uid) return;
    const myName = currentPublicName();
    const FV     = firebase.firestore.FieldValue;
    const batch  = fbDb.batch();

    // Write into my following sub-collection
    batch.set(
      fbDb.collection('follows').doc(cvUser.uid).collection('following').doc(targetUid),
      { followedAt: FV.serverTimestamp(), name: targetName }
    );
    // Write into target's followers sub-collection
    batch.set(
      fbDb.collection('follows').doc(targetUid).collection('followers').doc(cvUser.uid),
      { followedAt: FV.serverTimestamp(), name: myName }
    );
    // Increment counts
    batch.set(fbDb.collection('users').doc(cvUser.uid),
      { followingCount: FV.increment(1) }, { merge: true });
    batch.set(fbDb.collection('users').doc(targetUid),
      { followersCount: FV.increment(1) }, { merge: true });

    await batch.commit();
    followingCache.add(targetUid);

    // Notify target
    notifWrite(targetUid, 'follow', myName, null, null);

    // Update all follow buttons for this target in the DOM
    followUpdateButtons(targetUid, true);
  }

  async function unfollowUser(targetUid) {
    if (!cvUser || cvIsOperator) return;
    const FV    = firebase.firestore.FieldValue;
    const batch = fbDb.batch();

    batch.delete(
      fbDb.collection('follows').doc(cvUser.uid).collection('following').doc(targetUid)
    );
    batch.delete(
      fbDb.collection('follows').doc(targetUid).collection('followers').doc(cvUser.uid)
    );
    batch.set(fbDb.collection('users').doc(cvUser.uid),
      { followingCount: FV.increment(-1) }, { merge: true });
    batch.set(fbDb.collection('users').doc(targetUid),
      { followersCount: FV.increment(-1) }, { merge: true });

    await batch.commit();
    followingCache.delete(targetUid);
    followUpdateButtons(targetUid, false);
  }

  function followUpdateButtons(targetUid, isFollowing) {
    document.querySelectorAll(`.follow-btn[data-follow-uid="${targetUid}"]`).forEach(btn => {
      if (isFollowing) {
        btn.classList.add('following');
        btn.textContent = ''; // CSS ::before shows "Following"/"Unfollow"
      } else {
        btn.classList.remove('following');
        btn.textContent = 'Follow';
      }
    });
    // Refresh profile stat counts if profile is open
    if (profileOverlay.classList.contains('active') && cvUser) profileLoad(cvUser);
  }

  // Global click delegation for all .follow-btn elements
  document.addEventListener('click', async e => {
    const btn = e.target.closest('.follow-btn');
    if (!btn || !btn.dataset.followUid) return;
    e.stopPropagation();
    e.preventDefault();
    if (!cvUser) { cvOpenModal('login'); return; }
    btn.disabled = true;
    if (followingCache.has(btn.dataset.followUid)) {
      await unfollowUser(btn.dataset.followUid);
    } else {
      await followUser(btn.dataset.followUid, btn.dataset.followName || '');
    }
    btn.disabled = false;
  }, true); // capture phase so it fires before chat/other handlers

  // ── Following / Followers modal ───────────────────────
  const followlistModal = document.getElementById('followlist-modal');
  let followlistActiveTab = 'following';

  document.getElementById('followlist-close').addEventListener('click', () => {
    followlistModal.classList.remove('open');
  });
  followlistModal.addEventListener('click', e => {
    if (e.target === followlistModal) followlistModal.classList.remove('open');
  });

  followlistModal.addEventListener('click', e => {
    const tab = e.target.closest('[data-fl-tab]');
    if (!tab) return;
    followlistModal.querySelectorAll('.followlist-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    followlistActiveTab = tab.dataset.flTab;
    followlistLoad(cvUser?.uid, followlistActiveTab);
  });

  async function openFollowlist(uid, tab) {
    if (!uid) return;
    followlistActiveTab = tab;
    followlistModal.classList.add('open');
    followlistModal.querySelectorAll('.followlist-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.flTab === tab);
    });
    document.getElementById('followlist-title').textContent =
      tab === 'following' ? 'Following' : 'Followers';
    await followlistLoad(uid, tab);
  }

  async function followlistLoad(uid, tab) {
    const list = document.getElementById('followlist-list');
    list.innerHTML = '<div class="followlist-empty">Loading…</div>';
    const snap = await fbDb.collection('follows').doc(uid)
      .collection(tab).orderBy('followedAt', 'desc').limit(100).get();
    if (snap.empty) {
      list.innerHTML = `<div class="followlist-empty">No ${tab} yet.</div>`;
      return;
    }
    list.innerHTML = snap.docs.map(d => {
      const personUid  = tab === 'following' ? d.id : d.id; // doc id IS the uid
      const personName = d.data().name || 'Unknown';
      const color = profileColor ? profileColor(personName)
        : '#8b6d3f';
      const alreadyFollowing = followingCache.has(personUid);
      const isSelf = cvUser && cvUser.uid === personUid;
      return `<div class="followlist-item">
        <div class="followlist-avatar" style="background:${color}">${personName.charAt(0).toUpperCase()}</div>
        <div class="followlist-name">${personName}</div>
        ${!isSelf ? `<button class="follow-btn${alreadyFollowing?' following':''}"
          data-follow-uid="${personUid}" data-follow-name="${personName}">
          ${alreadyFollowing?'':'Follow'}
        </button>` : '<span style="font-size:0.72rem;color:var(--text-light)">You</span>'}
      </div>`;
    }).join('');
  }

  // Wire profile stat buttons to open the modal
  document.getElementById('profile-following-btn').addEventListener('click', () => {
    if (cvUser) openFollowlist(cvUser.uid, 'following');
  });
  document.getElementById('profile-followers-btn').addEventListener('click', () => {
    if (cvUser) openFollowlist(cvUser.uid, 'followers');
  });

  // ── Explore "For You" — posts from followed users ─────
  async function exploreLoadForYou() {
    const pane = document.getElementById('explore-pane-foryou');
    if (!cvUser || followingCache.size === 0) return; // keep static cards when not following anyone

    // Firestore "in" query supports max 10 values
    const followedUids = [...followingCache].slice(0, 10);
    const snap = await fbDb.collection('posts')
      .where('authorUid', 'in', followedUids)
      .where('parentId', '==', null)
      .orderBy('createdAt', 'desc')
      .limit(20).get();

    if (snap.empty) return; // keep static editorial cards

    const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const color = name => {
      const c = ['#6b7c93','#8b6d3f','#5a7a4a','#7a5a8a','#4a7a7a','#8a4a4a'];
      return c[(name||'?').charCodeAt(0) % c.length];
    };
    const relTime = ts => {
      if (!ts) return '';
      const s = Math.floor((Date.now() - (ts.toMillis?.() || ts.seconds*1000)) / 1000);
      if (s < 60) return 'just now';
      if (s < 3600) return Math.floor(s/60)+'m';
      if (s < 86400) return Math.floor(s/3600)+'h';
      return Math.floor(s/86400)+'d';
    };

    pane.innerHTML = `<div class="explore-section-title">From People You Follow</div>
      <div class="explore-cards">` +
      posts.map(p => {
        const nm = p.authorName || 'Anonymous';
        return `<div class="explore-card">
          <div class="explore-card-thumb-placeholder" style="background:${color(nm)};color:#fff;border-radius:50%;width:72px;height:72px;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',Georgia,serif;font-size:1.6rem;">${escH(nm.charAt(0).toUpperCase())}</div>
          <div class="explore-card-body">
            <div class="explore-card-tag">${escH(nm)}</div>
            <div class="explore-card-title" style="font-weight:400">${escH(p.text.length>120?p.text.substring(0,120)+'…':p.text)}</div>
            <div class="explore-card-meta">${relTime(p.createdAt)} · ${escH(p.pageId||'Conversation')}</div>
          </div>
        </div>`;
      }).join('') + '</div>';
  }

  // openExplore wrapper — refreshes For You feed when Explore opens
  // (openExplore function declaration is hoisted so this reassignment is safe)
  const _origOpenExplore = openExplore;
  openExplore = function() {
    _origOpenExplore();
    if (cvUser) exploreLoadForYou();
  };

  // ── Profile overlay ──────────────────────────────────
  const profileOverlay   = document.getElementById('profile-overlay');
  const profileContent   = document.getElementById('profile-content');
  const profileSigninPrm = document.getElementById('profile-signin-prompt');
  const profileEditModal = document.getElementById('profile-edit-modal');

  let profilePostsUnsub  = null;
  let profileData        = {};  // cached Firestore profile fields

  // ── Avatar color (reuse chat palette) ────────────────
  function profileColor(name) {
    const c = ['#6b7c93','#8b6d3f','#5a7a4a','#7a5a8a','#4a7a7a','#8a4a4a'];
    return c[(name||'?').charCodeAt(0) % c.length];
  }

  function profileRelTime(ts) {
    if (!ts) return '';
    const ms  = ts.toMillis ? ts.toMillis() : (ts.seconds||0)*1000;
    const sec = Math.floor((Date.now() - ms)/1000);
    if (sec < 60)    return 'just now';
    if (sec < 3600)  return Math.floor(sec/60)  + 'm';
    if (sec < 86400) return Math.floor(sec/3600) + 'h';
    return new Date(ms).toLocaleDateString(undefined, {month:'short', day:'numeric'});
  }

  // ── Render profile header ─────────────────────────────
  function profileRenderHeader(user, data, postCount) {
    const name    = publicDisplayName(data.displayName || user.displayName);
    const handle  = publicHandle(name);
    const color   = profileColor(name);
    const initial = name.trim().charAt(0).toUpperCase();
    const joinDate= user.metadata?.creationTime
      ? 'Joined ' + new Date(user.metadata.creationTime).toLocaleDateString(undefined, {month:'long', year:'numeric'})
      : '';

    // Topbar
    document.getElementById('profile-topbar-name').textContent  = name;
    document.getElementById('profile-topbar-posts').textContent = postCount + (postCount === 1 ? ' post' : ' posts');

    // Banner
    const bannerInner = document.getElementById('profile-banner-inner');
    if (data.bannerUrl) {
      bannerInner.outerHTML = `<img class="profile-banner-img" id="profile-banner-inner" src="${escH(data.bannerUrl)}" alt="Banner">`;
    }

    // Avatar
    const avatarEl = document.getElementById('profile-avatar');
    if (data.photoUrl) {
      avatarEl.innerHTML = `<img src="${escH(data.photoUrl)}" alt="${escH(name)}">`;
    } else {
      avatarEl.style.background = color;
      avatarEl.textContent = initial;
    }

    // Info
    document.getElementById('profile-display-name').textContent = name;
    document.getElementById('profile-handle').textContent = handle;

    const bioEl = document.getElementById('profile-bio');
    if (data.bio) { bioEl.textContent = data.bio; bioEl.style.display = ''; }
    else { bioEl.style.display = 'none'; }

    // Meta row — do not render leftover public location (PII on a public doc)
    const metaEl = document.getElementById('profile-meta');
    let metaHtml = '';
    if (joinDate) metaHtml += `<span class="profile-meta-item"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${joinDate}</span>`;
    metaEl.innerHTML = metaHtml;

    // Stats
    document.getElementById('profile-following-count').textContent = data.followingCount || 0;
    document.getElementById('profile-followers-count').textContent = data.followersCount || 0;
  }

  // ── Render a post card ────────────────────────────────
  function profileRenderPost(post, isReply) {
    const name  = post.authorName || 'Anonymous';
    const color = profileColor(name);
    const replyLine = isReply && post.parentId
      ? `<div class="profile-reply-thread">↩ Replying to a post</div>` : '';
    return `<div class="profile-post-card">
      <div class="profile-post-header">
        <div class="profile-post-avatar" style="background:${color}">${escH(name.charAt(0).toUpperCase())}</div>
        <div class="profile-post-meta">
          <div class="profile-post-name">${escH(name)} <span class="profile-post-time">· ${profileRelTime(post.createdAt)}</span></div>
        </div>
      </div>
      ${replyLine}
      <div class="profile-post-text">${(post.text||'').replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
      <div class="profile-post-stats">
        <span class="profile-post-stat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${post.replyCount||0}
        </span>
        <span class="profile-post-stat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ${post.likeCount||0}
        </span>
      </div>
    </div>`;
  }

  // ── Load profile data ─────────────────────────────────
  async function profileLoad(user) {
    profileSigninPrm.style.display = 'none';
    profileContent.style.display   = 'flex';

    // Fetch Firestore profile doc
    const snap = await fbDb.collection('users').doc(user.uid).get();
    profileData = snap.exists ? snap.data() : {};

    // Render the header immediately — never leave it blank waiting on posts
    profileRenderHeader(user, profileData, 0);

    // Subscribe to user's posts (ordered by time desc)
    if (profilePostsUnsub) profilePostsUnsub();
    profilePostsUnsub = fbDb.collection('posts')
      .where('authorUid', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot(snap => {
        const all    = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const posts  = all.filter(p => !p.parentId);
        const replies= all.filter(p =>  p.parentId);

        profileRenderHeader(user, profileData, all.length);

        const postsPane   = document.getElementById('profile-pane-posts');
        const repliesPane = document.getElementById('profile-pane-replies');

        postsPane.innerHTML = posts.length
          ? posts.map(p => profileRenderPost(p, false)).join('')
          : '<div class="profile-feed-empty">No posts yet.</div>';

        repliesPane.innerHTML = replies.length
          ? replies.map(p => profileRenderPost(p, true)).join('')
          : '<div class="profile-feed-empty">No replies yet.</div>';
      }, () => {});
  }

  // ── Open / close ──────────────────────────────────────
  function openProfile() {
    closeSocialOverlays();
    profileOverlay.classList.add('active');
    document.querySelectorAll('.nav-social-link').forEach(l => l.classList.remove('active'));
    document.getElementById('nav-profile').classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    closeMobileNav();

    if (cvUser) {
      profileLoad(cvUser);
    } else {
      profileContent.style.display   = 'none';
      profileSigninPrm.style.display = 'flex';
    }
  }

  function closeProfile() {
    profileOverlay.classList.remove('active');
    document.getElementById('nav-profile').classList.remove('active');
    if (profilePostsUnsub) { profilePostsUnsub(); profilePostsUnsub = null; }
  }

  document.getElementById('profile-back').addEventListener('click', viewBack);

  // Explore shortcut in topbar
  document.getElementById('profile-topbar-explore').addEventListener('click', () => {
    closeProfile(); go('explore');
  });

  // Sign-in prompt button
  document.getElementById('profile-signin-prompt-btn').addEventListener('click', () => {
    if (!cvUser) { cvOpenModal('login'); return; }
  });

  // Tab switching
  profileOverlay.addEventListener('click', e => {
    const tab = e.target.closest('[data-profile-tab]');
    if (tab) {
      profileOverlay.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      profileOverlay.querySelectorAll('.profile-pane').forEach(p => p.classList.remove('active'));
      document.getElementById('profile-pane-' + tab.dataset.profileTab).classList.add('active');
    }
  });

  // ── Edit Profile modal ────────────────────────────────
  function openEditProfile() {
    if (!cvUser) return;
    const name = publicDisplayName(profileData.displayName || cvUser.displayName);
    const editName = name === 'Member' ? '' : name;
    document.getElementById('profile-edit-name').value     = editName;
    document.getElementById('profile-edit-bio').value      = profileData.bio      || '';
    document.getElementById('profile-edit-banner-url').value = profileData.bannerUrl || '';
    document.getElementById('profile-edit-photo-url').value  = profileData.photoUrl  || '';
    document.getElementById('profile-bio-count').textContent =
      (profileData.bio||'').length + ' / 160';

    // Preview avatar in modal
    const editAvatar = document.getElementById('profile-edit-avatar-preview');
    if (profileData.photoUrl) {
      editAvatar.innerHTML = `<img src="${escH(profileData.photoUrl)}" alt="${escH(name)}"><div class="profile-edit-avatar-overlay"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>`;
    } else {
      editAvatar.style.background = profileColor(name);
      editAvatar.innerHTML = name.charAt(0).toUpperCase() + `<div class="profile-edit-avatar-overlay"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>`;
    }

    profileEditModal.classList.add('open');
  }

  function closeEditProfile() { profileEditModal.classList.remove('open'); }

  document.getElementById('profile-edit-btn').addEventListener('click', openEditProfile);
  document.getElementById('profile-edit-close').addEventListener('click', closeEditProfile);
  profileEditModal.addEventListener('click', e => { if (e.target === profileEditModal) closeEditProfile(); });

  // Bio char count
  document.getElementById('profile-edit-bio').addEventListener('input', function() {
    document.getElementById('profile-bio-count').textContent = this.value.length + ' / 160';
  });

  // Save
  // ── Profile image upload from device (banner + photo, 5 MB limit) ──
  const PROFILE_IMG_MAX = 5 * 1024 * 1024;
  function wireProfileUpload(fileInputId, urlInputId, triggerIds, applyPreview) {
    const fileInput = document.getElementById(fileInputId);
    triggerIds.forEach(id => document.getElementById(id)
      .addEventListener('click', () => { if (cvUser) fileInput.click(); }));
    fileInput.addEventListener('change', async () => {
      const f = fileInput.files[0];
      fileInput.value = '';
      if (!f || !cvUser) return;
      if (!f.type.startsWith('image/')) { alert('Please choose an image file.'); return; }
      if (f.size > PROFILE_IMG_MAX) {
        alert('That image is ' + (f.size/1024/1024).toFixed(1) + ' MB — the limit is 5 MB.');
        return;
      }
      const urlInput = document.getElementById(urlInputId);
      const prev = urlInput.value;
      urlInput.value = 'Uploading…'; urlInput.disabled = true;
      try {
        const ext = (f.name.split('.').pop() || 'jpg').toLowerCase();
        const ref = fbStorage.ref(`posts/${cvUser.uid}/profile-${Date.now()}.${ext}`);
        await ref.put(f);
        const url = await ref.getDownloadURL();
        urlInput.value = url;
        applyPreview(url);
      } catch(e) {
        console.error('Profile image upload:', e);
        urlInput.value = prev;
        alert('Upload failed: ' + (e.code || e.message));
      }
      urlInput.disabled = false;
    });
  }
  wireProfileUpload('profile-banner-file', 'profile-edit-banner-url',
    ['profile-edit-banner-preview', 'profile-banner-upload-btn'],
    url => {
      document.getElementById('profile-edit-banner-inner').outerHTML =
        `<img class="profile-banner-img" id="profile-edit-banner-inner" src="${escH(url)}" alt="Banner">`;
    });
  wireProfileUpload('profile-photo-file', 'profile-edit-photo-url',
    ['profile-edit-avatar-preview', 'profile-photo-upload-btn'],
    url => {
      const av = document.getElementById('profile-edit-avatar-preview');
      av.innerHTML = `<img src="${escH(url)}" alt="Profile photo"><div class="profile-edit-avatar-overlay"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>`;
    });

  document.getElementById('profile-save-btn').addEventListener('click', async () => {
    if (!cvUser) return;
    const saveBtn = document.getElementById('profile-save-btn');
    saveBtn.disabled = true; saveBtn.textContent = 'Saving…';

    const rawName   = document.getElementById('profile-edit-name').value.trim();
    if (rawName.includes('@')) {
      saveBtn.disabled = false; saveBtn.textContent = 'Save';
      alert('Please use a display name, not an email address.');
      return;
    }
    const name      = publicDisplayName(rawName || cvUser.displayName);
    const bio       = document.getElementById('profile-edit-bio').value.trim();
    const bannerUrl = document.getElementById('profile-edit-banner-url').value.trim();
    const photoUrl  = document.getElementById('profile-edit-photo-url').value.trim();

    // Update Firebase Auth display name
    if (name !== cvUser.displayName) {
      await cvUser.updateProfile({ displayName: name });
    }

    // Update Firestore user doc — never persist email/lastSeen/location
    try {
      const update = {
        displayName: name,
        displayNameLower: name.toLowerCase(),
        bio, bannerUrl, photoUrl,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        ...publicProfilePiiStrip()
      };
      await fbDb.collection('users').doc(cvUser.uid).set(update, { merge: true });
      profileData = { ...profileData, ...update };
      closeEditProfile();
      profileLoad(cvUser);
    } catch(e) {
      console.error('Profile save:', e);
      alert('Could not save profile: ' + (e.message || e.code || 'unknown error'));
    }
    saveBtn.disabled = false; saveBtn.textContent = 'Save';
  });

  // ── Chat overlay ─────────────────────────────────────
  const chatOverlay       = document.getElementById('chat-overlay');
  const chatThreadList    = document.getElementById('chat-thread-list');
  const chatActivePane    = document.getElementById('chat-active-pane');
  const chatPlaceholder   = document.getElementById('chat-placeholder');
  const chatThreadView    = document.getElementById('chat-thread-view');
  const chatMessagesEl    = document.getElementById('chat-messages');
  const chatComposeInput  = document.getElementById('chat-compose-input');
  const chatSendBtn       = document.getElementById('chat-send-btn');
  const chatActiveName    = document.getElementById('chat-active-name');
  const chatActiveAvatar  = document.getElementById('chat-active-avatar');
  const chatNewchatModal  = document.getElementById('chat-newchat-modal');
  const chatNewchatInput  = document.getElementById('chat-newchat-input');
  const chatNewchatResults= document.getElementById('chat-newchat-results');

  let chatConvUnsub   = null;  // thread list listener
  let chatMsgUnsub    = null;  // active message listener
  let chatActiveConvId= null;
  let chatActiveOther = null;  // { uid, name }

  // Avatar colours keyed by first letter
  const CHAT_COLORS = ['#6b7c93','#8b6d3f','#5a7a4a','#7a5a8a','#4a7a7a','#8a4a4a'];
  function chatColor(name) {
    const i = (name || '?').charCodeAt(0) % CHAT_COLORS.length;
    return CHAT_COLORS[i];
  }
  function chatInitial(name) { return (name||'?').trim().charAt(0).toUpperCase(); }

  function chatRelTime(ts) {
    if (!ts) return '';
    const ms  = ts.toMillis ? ts.toMillis() : (ts.seconds||0)*1000;
    const sec = Math.floor((Date.now() - ms) / 1000);
    if (sec < 60)    return 'now';
    if (sec < 3600)  return Math.floor(sec/60)  + 'm';
    if (sec < 86400) return Math.floor(sec/3600) + 'h';
    const d = Math.floor(sec/86400);
    return d < 7 ? d+'d' : Math.floor(d/7)+'w';
  }

  function chatDateLabel(ts) {
    if (!ts) return '';
    const ms = ts.toMillis ? ts.toMillis() : (ts.seconds||0)*1000;
    return new Date(ms).toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' });
  }

  // ── Conversation ID (deterministic from two UIDs) ─────
  function chatConvId(uid1, uid2) {
    return [uid1, uid2].sort().join('_');
  }

  // ── Open / close ──────────────────────────────────────
  function openChat() {
    closeSocialOverlays();
    chatOverlay.classList.add('active');
    document.querySelectorAll('.nav-social-link').forEach(l => l.classList.remove('active'));
    document.getElementById('nav-chat').classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    closeMobileNav();
    if (cvUser) chatSubscribeThreads();
  }

  function closeChat() {
    chatOverlay.classList.remove('active');
    document.getElementById('nav-chat').classList.remove('active');
    if (chatConvUnsub) { chatConvUnsub(); chatConvUnsub = null; }
    chatCloseThread();
  }

  // ── Thread list subscription ──────────────────────────
  function chatSubscribeThreads() {
    if (!cvUser) return;
    if (chatConvUnsub) chatConvUnsub();
    chatConvUnsub = fbDb.collection('conversations')
      .where('participants', 'array-contains', cvUser.uid)
      .orderBy('lastMessageAt', 'desc')
      .limit(30)
      .onSnapshot(snap => {
        const threads = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        chatRenderThreads(threads);
      }, () => {});
  }

  function chatRenderThreads(threads) {
    const empty = document.getElementById('chat-threads-empty');
    if (!threads.length) {
      chatThreadList.innerHTML = '';
      chatThreadList.appendChild(empty || Object.assign(document.createElement('div'), { className:'chat-threads-empty', textContent:'No conversations yet.' }));
      return;
    }
    chatThreadList.innerHTML = threads.map(t => {
      const otherId   = t.participants.find(p => p !== cvUser.uid);
      const otherName = (t.participantNames||{})[otherId] || 'Unknown';
      const unread    = ((t.unreadCounts||{})[cvUser.uid] || 0) > 0;
      const isActive  = t.id === chatActiveConvId;
      return `<div class="chat-thread-item${unread?' unread':''}${isActive?' active':''}" data-conv-id="${t.id}" data-other-uid="${otherId}" data-other-name="${escH(otherName)}">
        <div class="chat-thread-avatar" style="background:${chatColor(otherName)}">${escH(chatInitial(otherName))}</div>
        <div class="chat-thread-body">
          <div class="chat-thread-row1">
            <div class="chat-thread-name">${escH(otherName)}</div>
            <div class="chat-thread-time">${chatRelTime(t.lastMessageAt)}</div>
          </div>
          <div class="chat-thread-preview">${t.lastMessage ? escH(t.lastMessage.length>50?t.lastMessage.substring(0,50)+'…':t.lastMessage) : ''}</div>
        </div>
        <div class="chat-thread-dot"></div>
      </div>`;
    }).join('');

    // Thread click handler
    chatThreadList.querySelectorAll('.chat-thread-item').forEach(el => {
      el.addEventListener('click', () => {
        chatOpenThread(el.dataset.convId, el.dataset.otherUid, el.dataset.otherName);
      });
    });

    // Filter by search
    const q = document.getElementById('chat-search-input').value.toLowerCase();
    if (q) chatFilterThreads(q);
  }

  function chatFilterThreads(q) {
    chatThreadList.querySelectorAll('.chat-thread-item').forEach(el => {
      const name = (el.dataset.otherName||'').toLowerCase();
      el.style.display = name.includes(q) ? '' : 'none';
    });
  }

  document.getElementById('chat-search-input').addEventListener('input', e => {
    chatFilterThreads(e.target.value.toLowerCase());
  });

  // ── Open a thread ─────────────────────────────────────
  function chatOpenThread(convId, otherUid, otherName) {
    chatActiveConvId = convId;
    chatActiveOther  = { uid: otherUid, name: otherName };

    // UI
    chatPlaceholder.style.display = 'none';
    chatThreadView.style.display  = 'flex';
    chatActiveName.textContent    = otherName;
    chatActiveAvatar.textContent  = chatInitial(otherName);
    chatActiveAvatar.style.background = chatColor(otherName);

    // Mark active in list
    chatThreadList.querySelectorAll('.chat-thread-item').forEach(el => {
      el.classList.toggle('active', el.dataset.convId === convId);
    });

    // Subscribe messages
    if (chatMsgUnsub) chatMsgUnsub();
    chatMessagesEl.innerHTML = '<div class="chat-messages-loading">Loading…</div>';

    setTimeout(() => chatComposeInput.focus(), 350);

    chatMsgUnsub = fbDb.collection('conversations').doc(convId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .limit(100)
      .onSnapshot(snap => {
        chatRenderMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        // Reset unread count (only once the conversation doc exists)
        if (!snap.empty) {
          fbDb.collection('conversations').doc(convId)
            .set({ unreadCounts: { [cvUser.uid]: 0 } }, { merge: true })
            .catch(() => {});
        }
      }, () => { chatRenderMessages([]); });
  }

  function chatCloseThread() {
    if (chatMsgUnsub) { chatMsgUnsub(); chatMsgUnsub = null; }
    chatActiveConvId = null;
    chatActiveOther  = null;
    chatPlaceholder.style.display = '';
    chatThreadView.style.display  = 'none';
    chatThreadList.querySelectorAll('.chat-thread-item').forEach(el => el.classList.remove('active'));
  }

  document.getElementById('chat-back-thread').addEventListener('click', chatCloseThread);

  // ── Render messages ───────────────────────────────────
  function chatRenderMessages(msgs) {
    if (!msgs.length) {
      chatMessagesEl.innerHTML = '<div class="chat-messages-loading" style="font-style:italic">No messages yet. Say hello!</div>';
      return;
    }
    let lastDate = null;
    chatMessagesEl.innerHTML = msgs.map(m => {
      const mine = m.fromUid === cvUser.uid;
      const ms   = m.createdAt?.toMillis?.() || (m.createdAt?.seconds||0)*1000;
      const dateLabel = chatDateLabel(m.createdAt);
      const sep  = dateLabel !== lastDate
        ? `<div class="chat-date-sep">${dateLabel}</div>`
        : '';
      lastDate = dateLabel;
      const timeStr = ms ? new Date(ms).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'}) : '';
      const imgHtml = m.imageUrl
        ? `<a href="${escH(m.imageUrl)}" target="_blank" rel="noopener"><img class="chat-msg-img" src="${escH(m.imageUrl)}" alt="Shared photo" loading="lazy"></a>`
        : '';
      const textHtml = m.text
        ? `<div class="chat-bubble">${m.text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>')}</div>`
        : '';
      return `${sep}<div class="chat-msg ${mine?'mine':'theirs'}">
        ${imgHtml}${textHtml}
        <div class="chat-msg-time">${timeStr}</div>
      </div>`;
    }).join('');
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  // ── Send message ──────────────────────────────────────
  chatComposeInput.addEventListener('input', () => {
    chatSendBtn.disabled = !chatComposeInput.value.trim();
    chatComposeInput.style.height = 'auto';
    chatComposeInput.style.height = Math.min(chatComposeInput.scrollHeight, 120) + 'px';
  });
  chatComposeInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatSend(); }
  });
  chatSendBtn.addEventListener('click', chatSend);

  // ── Chat photo attachment (5 MB limit) ───────────────
  const CHAT_IMG_MAX = 5 * 1024 * 1024;
  let chatAttachFile = null;
  const chatImageBtn   = document.getElementById('chat-image-btn');
  const chatImageInput = document.getElementById('chat-image-input');
  const chatAttachChip = document.getElementById('chat-attach-chip');
  chatImageBtn.addEventListener('click', () => chatImageInput.click());
  chatImageInput.addEventListener('change', () => {
    const f = chatImageInput.files[0];
    chatImageInput.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { alert('Only image files can be shared in chat.'); return; }
    if (f.size > CHAT_IMG_MAX) {
      alert('That image is ' + (f.size/1024/1024).toFixed(1) + ' MB — the limit is 5 MB. Try a smaller photo.');
      return;
    }
    chatAttachFile = f;
    document.getElementById('chat-attach-thumb').src = URL.createObjectURL(f);
    chatAttachChip.style.display = '';
    chatSendBtn.disabled = false;
  });
  document.getElementById('chat-attach-remove').addEventListener('click', () => {
    chatAttachFile = null;
    chatAttachChip.style.display = 'none';
    chatSendBtn.disabled = !chatComposeInput.value.trim();
  });

  async function chatUploadImage(file) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const ref = fbStorage.ref(`chat/${cvUser.uid}/${Date.now()}.${ext}`);
    await ref.put(file);
    return ref.getDownloadURL();
  }

  async function chatSend() {
    if (!cvUser || !chatActiveConvId || !chatActiveOther) return;
    const text = chatComposeInput.value.trim();
    if (!text && !chatAttachFile) return;
    chatComposeInput.value = '';
    chatComposeInput.style.height = 'auto';
    chatSendBtn.disabled = true;

    let imageUrl = null;
    if (chatAttachFile) {
      try { imageUrl = await chatUploadImage(chatAttachFile); }
      catch(e) {
        console.error('Chat image upload:', e);
        alert('Photo could not be uploaded: ' + (e.code || e.message));
        chatComposeInput.value = text;
        chatSendBtn.disabled = false;
        return;
      }
      chatAttachFile = null;
      chatAttachChip.style.display = 'none';
    }

    const FV      = firebase.firestore.FieldValue;
    const convRef = fbDb.collection('conversations').doc(chatActiveConvId);
    const msgRef  = convRef.collection('messages').doc();

    const msgData = {
      fromUid: cvUser.uid,
      fromName: currentPublicName(),
      text,
      createdAt: FV.serverTimestamp()
    };
    if (imageUrl) msgData.imageUrl = imageUrl;

    try {
      await fbDb.batch()
        .set(msgRef, msgData)
        .set(convRef, {
          // sorted: keeps the array byte-identical on every send, so the
          // rules' field-diff never sees "participants" as changed
          participants: [cvUser.uid, chatActiveOther.uid].sort(),
          participantNames: {
            [cvUser.uid]: currentPublicName(),
            [chatActiveOther.uid]: chatActiveOther.name
          },
          lastMessage: text || '\ud83d\udcf7 Photo',
          lastMessageAt: FV.serverTimestamp(),
          lastMessageBy: cvUser.uid,
          unreadCounts: { [chatActiveOther.uid]: FV.increment(1) }
        }, { merge: true })
        .commit();
    } catch(e) {
      console.error('Chat send:', e);
      chatComposeInput.value = text;           // restore the typed message
      chatSendBtn.disabled = false;
      alert('Message could not be sent: ' + (e.code || e.message));
      return;
    }

    // Notify recipient (type message — not a post reply)
    notifWrite(chatActiveOther.uid, 'message', currentPublicName(), 'chat', text);
  }

  // ── New Chat modal ────────────────────────────────────
  function openNewChat() {
    if (!cvUser) { cvOpenModal('login'); return; }
    if (cvIsOperator) return;
    chatNewchatModal.classList.add('open');
    chatNewchatInput.value = '';
    chatNewchatResults.innerHTML = '<div class="chat-newchat-empty">Type to search for users.</div>';
    setTimeout(() => chatNewchatInput.focus(), 50);
  }
  function closeNewChat() { chatNewchatModal.classList.remove('open'); }

  document.getElementById('chat-new-btn').addEventListener('click', openNewChat);
  document.getElementById('chat-nav-toggle').addEventListener('click', () => {
    if (isMobileNav()) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-collapsed');
    }
    syncHamburgerAria();
  });
  document.getElementById('chat-placeholder-new').addEventListener('click', openNewChat);
  document.getElementById('chat-newchat-close').addEventListener('click', closeNewChat);
  chatNewchatModal.addEventListener('click', e => { if (e.target === chatNewchatModal) closeNewChat(); });

  let chatSearchTimer = null;
  chatNewchatInput.addEventListener('input', () => {
    clearTimeout(chatSearchTimer);
    chatSearchTimer = setTimeout(async () => {
      const q = chatNewchatInput.value.trim().toLowerCase();
      if (!q) { chatNewchatResults.innerHTML = '<div class="chat-newchat-empty">Type to search for users.</div>'; return; }
      chatNewchatResults.innerHTML = '<div class="chat-newchat-empty">Searching…</div>';
      const snap = await fbDb.collection('users')
        .orderBy('displayNameLower')
        .startAt(q).endAt(q + '')
        .limit(10).get();
      const users = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
        .filter(u => u.uid !== cvUser.uid);
      if (!users.length) {
        chatNewchatResults.innerHTML = '<div class="chat-newchat-empty">No users found.</div>';
        return;
      }
      const followingSnap = cvUser
        ? await fbDb.collection('follows').doc(cvUser.uid).collection('following').get()
        : null;
      const followingSet = new Set(followingSnap ? followingSnap.docs.map(d => d.id) : []);

      chatNewchatResults.innerHTML = users.map(u => {
        const name = publicDisplayName(u.displayName);
        const alreadyFollowing = followingSet.has(u.uid);
        return `
          <div class="chat-newchat-result" data-uid="${u.uid}" data-name="${escH(name)}">
            <div class="chat-thread-avatar" style="background:${chatColor(name)};width:34px;height:34px;font-size:0.85rem;">${escH(chatInitial(name))}</div>
            <div style="flex:1;min-width:0;">
              <div class="chat-newchat-result-name">${escH(name)}</div>
            </div>
            <button class="follow-btn${alreadyFollowing?' following':''}" data-follow-uid="${u.uid}" data-follow-name="${escH(name)}"
              ${!cvUser?'disabled':''}>
              ${alreadyFollowing?'':'Follow'}
            </button>
          </div>`;
      }).join('');
      chatNewchatResults.querySelectorAll('.chat-newchat-result').forEach(el => {
        el.addEventListener('click', e => {
          if (e.target.closest('.follow-btn')) return; // handled by follow delegation
          closeNewChat();
          const convId = chatConvId(cvUser.uid, el.dataset.uid);
          chatOpenThread(convId, el.dataset.uid, el.dataset.name);
        });
      });
    }, 300);
  });

  // ── Notifications overlay ────────────────────────────
  const notifOverlay   = document.getElementById('notif-overlay');
  const notifBack      = document.getElementById('notif-back');
  const notifMarkRead  = document.getElementById('notif-mark-read');
  const notifBadgeEl   = document.getElementById('notif-badge');
  let   notifUnsub     = null;
  let   notifItems     = [];  // cached for tab filtering

  function notifRelTime(ts) {
    if (!ts) return '';
    const ms  = ts.toMillis ? ts.toMillis() : ts.seconds * 1000;
    const sec = Math.floor((Date.now() - ms) / 1000);
    if (sec < 60)   return 'just now';
    if (sec < 3600) return Math.floor(sec/60) + 'm ago';
    if (sec < 86400) return Math.floor(sec/3600) + 'h ago';
    return Math.floor(sec/86400) + 'd ago';
  }

  function notifInitial(name) {
    return (name || '?').trim().charAt(0).toUpperCase();
  }

  function notifTypeIcon(type) {
    if (type === 'like') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    if (type === 'reply') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    if (type === 'follow') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
    if (type === 'message') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    if (type === 'digest') return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
    return '';
  }

  function notifActionText(n) {
    if (n.type === 'like')    return `<strong>${escH(n.fromName)}</strong> liked your post`;
    if (n.type === 'reply')   return `<strong>${escH(n.fromName)}</strong> replied to your post`;
    if (n.type === 'follow')  return `<strong>${escH(n.fromName)}</strong> started following you`;
    if (n.type === 'message') return `<strong>${escH(n.fromName)}</strong> sent you a message`;
    if (n.type === 'digest')  return `<strong>${escH(n.fromName || 'Site Activity')}</strong> — daily digest`;
    return '';
  }

  function notifRenderItem(n) {
    const unreadCls = n.read ? '' : ' unread';
    return `
      <div class="notif-item${unreadCls}" data-notif-id="${n.id}" data-notif-type="${n.type}"${n.pageId === 'chat' && n.fromUid ? ` data-chat-uid="${escH(n.fromUid)}" data-chat-name="${escH(n.fromName||'')}"` : ''}>
        <div class="notif-type-icon ${n.type}">${notifTypeIcon(n.type)}</div>
        <div class="notif-avatar">${escH(notifInitial(n.fromName))}</div>
        <div class="notif-body">
          <div class="notif-text">${notifActionText(n)} ${n.pageId ? `<span style="color:var(--text-muted);font-size:0.82rem;">on <em>${escH(n.pageId)}</em></span>` : ''}</div>
          ${n.excerpt ? `<div class="notif-excerpt">"${escH(n.excerpt)}"</div>` : ''}
          <div class="notif-time">${notifRelTime(n.createdAt)}</div>
        </div>
        ${n.pageId === 'chat' && n.fromUid ? `<button class="notif-reply-btn" title="Reply in chat" aria-label="Reply in chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
        </button>` : ''}
      </div>`;
  }

  function notifRender(items) {
    const allPane      = document.getElementById('notif-pane-all');
    const mentionsPane = document.getElementById('notif-pane-mentions');

    const mentions = items.filter(n => n.type === 'reply');

    allPane.innerHTML = items.length
      ? items.map(notifRenderItem).join('')
      : '<div class="notif-empty">No notifications yet.</div>';

    mentionsPane.innerHTML = mentions.length
      ? mentions.map(notifRenderItem).join('')
      : '<div class="notif-empty">No mentions yet.</div>';

    // Badge
    const unread = items.filter(n => !n.read).length;
    if (unread > 0) {
      notifBadgeEl.textContent = unread > 9 ? '9+' : unread;
      notifBadgeEl.classList.add('visible');
    } else {
      notifBadgeEl.classList.remove('visible');
    }
  }

  function notifSubscribe(uid) {
    if (notifUnsub) { notifUnsub(); notifUnsub = null; }
    notifUnsub = fbDb.collection('notifications').doc(uid)
      .collection('items')
      .orderBy('createdAt', 'desc')
      .limit(40)
      .onSnapshot(snap => {
        notifItems = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        notifRender(notifItems);
      }, () => {});
  }

  function notifUnsubscribe() {
    if (notifUnsub) { notifUnsub(); notifUnsub = null; }
    notifItems = [];
    notifBadgeEl.classList.remove('visible');
  }

  function openNotif() {
    closeSocialOverlays();
    notifOverlay.classList.add('active');
    document.querySelectorAll('.nav-social-link').forEach(l => l.classList.remove('active'));
    document.getElementById('nav-notifications').classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    closeMobileNav();
  }

  function closeNotif() {
    notifOverlay.classList.remove('active');
    document.getElementById('nav-notifications').classList.remove('active');
  }

  notifBack.addEventListener('click', viewBack);

  // Tab switching
  notifOverlay.addEventListener('click', e => {
    const tab = e.target.closest('[data-notif-tab]');
    if (tab) {
      notifOverlay.querySelectorAll('.notif-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      notifOverlay.querySelectorAll('.notif-pane').forEach(p => p.classList.remove('active'));
      document.getElementById('notif-pane-' + tab.dataset.notifTab).classList.add('active');
    }
  });

  // Clicking a notification marks it read; chat notifications open the thread
  notifOverlay.addEventListener('click', async e => {
    const item = e.target.closest('.notif-item');
    if (!item || !cvUser) return;
    const n = notifItems.find(x => x.id === item.dataset.notifId);
    if (n && !n.read) {
      fbDb.collection('notifications').doc(cvUser.uid)
        .collection('items').doc(n.id).update({ read: true }).catch(() => {});
    }
    // Reply button or any click on a chat-message notification → open that thread
    if (item.dataset.chatUid && (e.target.closest('.notif-reply-btn') || true)) {
      go('chat');
      chatOpenThread(chatConvId(cvUser.uid, item.dataset.chatUid),
                     item.dataset.chatUid, item.dataset.chatName || 'Member');
    }
  });

  // Mark all read
  notifMarkRead.addEventListener('click', async () => {
    if (!cvUser || !notifItems.length) return;
    const batch = fbDb.batch();
    notifItems.filter(n => !n.read).forEach(n => {
      batch.update(
        fbDb.collection('notifications').doc(cvUser.uid).collection('items').doc(n.id),
        { read: true }
      );
    });
    await batch.commit();
  });

  // Helper: write a notification to another user.
  // like/reply must include postId so rules can get() posts/{postId}.authorUid.
  async function notifWrite(toUid, type, fromName, pageId, excerpt, postId) {
    if (!toUid || toUid === cvUser.uid) return; // no self-notifications
    const data = {
      type,
      fromUid: cvUser.uid,
      fromName: publicDisplayName(fromName),
      read: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (pageId) data.pageId = String(pageId).slice(0, 100);
    if (excerpt) data.excerpt = String(excerpt).slice(0, 100);
    if (postId) data.postId = String(postId).slice(0, 128);
    await fbDb.collection('notifications').doc(toUid).collection('items').add(data);
  }

  // ── Explore overlay ──────────────────────────────────
  const exploreOverlay = document.getElementById('explore-overlay');
  const exploreBack    = document.getElementById('explore-back');
  const exploreInput   = document.getElementById('explore-search-input');
  let   exploreSearchMode = 'site'; // 'site' | 'google'

  function openExplore() {
    closeSocialOverlays();
    exploreOverlay.classList.add('active');
    document.querySelectorAll('.nav-social-link').forEach(l => l.classList.remove('active'));
    document.getElementById('nav-explore').classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    exploreInput.focus();
    closeMobileNav();
  }

  function closeExplore() {
    exploreOverlay.classList.remove('active');
    document.getElementById('nav-explore').classList.remove('active');
  }

  exploreBack.addEventListener('click', viewBack);

  // Tab switching
  exploreOverlay.addEventListener('click', e => {
    const tab = e.target.closest('.explore-tab');
    if (tab) {
      exploreOverlay.querySelectorAll('.explore-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      exploreOverlay.querySelectorAll('.explore-pane').forEach(p => p.classList.remove('active'));
      document.getElementById('explore-pane-' + tab.dataset.tab).classList.add('active');
      return;
    }
    // Search mode toggle
    const opt = e.target.closest('.explore-search-opt');
    if (opt) {
      exploreOverlay.querySelectorAll('.explore-search-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      exploreSearchMode = opt.dataset.search;
      exploreInput.placeholder = exploreSearchMode === 'google'
        ? 'Search Google…'
        : 'Search bakasan.art…';
      // Re-run the search with whatever is already typed
      exploreInput.dispatchEvent(new Event('input', { bubbles: true }));
      exploreInput.focus();
      return;
    }
    // Art grid / story card clicks — navigate to painting
    const artCard = e.target.closest('[data-target]');
    if (artCard && artCard.dataset.target) {
      showPage(artCard.dataset.target);
      return;
    }
  });

  // ── For You: painting thumbnail grid ──────────────────
  // Shuffled per visit for now; personalization can replace the
  // ordering once we have per-user interest signals.
  (function() {
    const grid = document.getElementById('explore-foryou-grid');
    if (!grid || typeof PAINTINGS_DATA === 'undefined') return;
    const shuffled = [...PAINTINGS_DATA].sort(() => Math.random() - 0.5);
    grid.innerHTML = shuffled.map(p => `
      <div class="explore-art-tile" data-target="${escH(p.id)}" title="${escH(p.title)}">
        <img src="images/${escH(p.file)}" alt="${escH(p.title)}" loading="lazy">
        <span class="explore-art-tile-label">${escH(p.title)}</span>
      </div>`).join('');
  })();

  // ── Live site search ──────────────────────────────────
  const exploreResults = document.getElementById('explore-results');
  const SITE_PAGES = [
    { id: 'home',         label: 'Home',                      kind: 'Feed' },
    { id: 'artist',       label: 'Meet Bakasan',              kind: 'Page' },
    { id: 'introduction', label: 'Introduction',              kind: 'Page' },
    { id: 'statement',    label: "Artist's Statement",        kind: 'Page' },
    { id: 'biography',    label: 'Selected Biography',        kind: 'Page' },
    { id: 'contact',      label: 'Contacts and Opportunities',kind: 'Page' },
    { id: 'news',         label: 'Topics & News',             kind: 'Page' },
    { id: 'thoughts',     label: 'Conversation',              kind: 'Community' },
    { id: 'women',        label: 'Women of Buddhism',         kind: 'Series' },
    { id: 'iconography',  label: 'Buddhist Iconography',      kind: 'Series' },
    { id: 'asian-ladies', label: 'Asian Ladies',              kind: 'Series' },
    { id: 'nature',       label: 'Fragments of Nature',       kind: 'Series' },
  ];

  let explorePostsCache = null;
  async function explorePosts() {
    if (explorePostsCache) return explorePostsCache;
    try {
      const snap = await fbDb.collection('posts')
        .orderBy('createdAt', 'desc').limit(100).get();
      explorePostsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch(e) { explorePostsCache = []; }
    return explorePostsCache;
  }

  function stripHtml(s) { return (s || '').replace(/<[^>]*>/g, ' '); }

  async function exploreSiteSearch(q) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = hay => words.every(w => hay.includes(w));
    const rows = [];

    // Paintings: title, caption, era, story text
    (typeof PAINTINGS_DATA !== 'undefined' ? PAINTINGS_DATA : []).forEach(p => {
      const hay = [p.title, p.captionTitle, p.era, stripHtml(p.bodyHtml)].join(' ').toLowerCase();
      if (hits(hay)) {
        rows.push({ kind: 'Painting', label: p.title, sub: p.captionTitle || '', target: p.id,
                    thumb: 'images/' + p.file });
      }
    });

    // Site pages & series
    SITE_PAGES.forEach(pg => {
      if (hits(pg.label.toLowerCase())) {
        rows.push({ kind: pg.kind, label: pg.label, sub: '', target: pg.id });
      }
    });

    // Community posts (recent 100, text match)
    const posts = await explorePosts();
    posts.filter(p => hits((p.text || '').toLowerCase())).slice(0, 5).forEach(p => {
      rows.push({ kind: 'Post', label: p.authorName || 'Member',
                  sub: p.text.length > 90 ? p.text.slice(0, 90) + '…' : p.text,
                  post: p.id });
    });

    return rows.slice(0, 12);
  }

  function exploreRenderResults(rows, q) {
    if (!rows.length) {
      exploreResults.innerHTML = `<div class="explore-results-empty">No matches for "${escH(q)}" —
        <a href="https://www.google.com/search?q=${encodeURIComponent(q)}+site:bakasan.art" target="_blank" rel="noopener">search the web</a></div>`;
      exploreResults.style.display = '';
      return;
    }
    exploreResults.innerHTML = rows.map(r => `
      <div class="explore-result" ${r.target ? `data-target="${escH(r.target)}"` : `data-post="${escH(r.post)}"`}>
        ${r.thumb ? `<img class="explore-result-thumb" src="${escH(r.thumb)}" alt="" loading="lazy">`
                  : `<span class="explore-result-icon">${r.kind === 'Post' ? '&#128172;' : '&#128196;'}</span>`}
        <div class="explore-result-body">
          <div class="explore-result-label">${escH(r.label)}</div>
          ${r.sub ? `<div class="explore-result-sub">${escH(r.sub)}</div>` : ''}
        </div>
        <span class="explore-result-kind">${escH(r.kind)}</span>
      </div>`).join('');
    exploreResults.style.display = '';
  }

  let exploreTimer = null;
  exploreInput.addEventListener('input', () => {
    clearTimeout(exploreTimer);
    const q = exploreInput.value.trim();
    if (q.length < 2) {
      exploreResults.style.display = 'none';
      exploreResults.innerHTML = '';
      return;
    }
    if (exploreSearchMode === 'google') {
      const url = 'https://www.google.com/search?q=' + encodeURIComponent(q + ' Buddhism OR site:bakasan.art');
      exploreResults.innerHTML = `
        <a class="explore-result" href="${url}" target="_blank" rel="noopener">
          <span class="explore-result-icon">&#127760;</span>
          <div class="explore-result-body">
            <div class="explore-result-label">Search Google for &ldquo;${escH(q)}&rdquo;</div>
            <div class="explore-result-sub">Opens in a new tab</div>
          </div>
          <span class="explore-result-kind">Web</span>
        </a>`;
      exploreResults.style.display = '';
      return;
    }
    exploreTimer = setTimeout(async () => {
      exploreRenderResults(await exploreSiteSearch(q), q);
    }, 250);
  });

  // Result clicks
  exploreResults.addEventListener('click', e => {
    const row = e.target.closest('.explore-result');
    if (!row) return;
    exploreResults.style.display = 'none';
    exploreInput.value = '';
    if (row.dataset.target) showPage(row.dataset.target);
    else if (row.dataset.post) {
      go('post-' + row.dataset.post);
    }
  });

  // Enter: open first result (site mode) or web search (google mode)
  exploreInput.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const q = exploreInput.value.trim();
    if (!q) return;
    const first = exploreResults.querySelector('.explore-result');
    if (first) first.click();
  });

  document.addEventListener('click', e => {
    // Social nav links — hash routes
    const social = e.target.closest('[data-social]');
    if (social) {
      e.preventDefault();
      go(social.dataset.social);
      return;
    }
    // Nav links and inline text-links
    const link = e.target.closest('[data-page]');
    if (link && link.dataset.page) {
      e.preventDefault();
      // Parent tab with a nested submenu: re-click collapses it
      const sub = link.parentElement.querySelector(':scope > ul.nav-sub, :scope > ul.nav-sub2');
      if (sub && link.closest('.sidebar')) {
        if (sub.classList.contains('open')) {
          sub.classList.remove('open');
          sub.querySelectorAll('.open').forEach(u => u.classList.remove('open'));
          navManualClosed.add(sub.id);
          return; // collapse only — don't navigate
        }
        navManualClosed.delete(sub.id);
      }
      showPage(link.dataset.page);
      return;
    }
    // Any card with data-target (home, women gallery, iconography gallery)
    const card = e.target.closest('[data-target]');
    if (card && card.dataset.target) { showPage(card.dataset.target); return; }
    // Close mobile drawer on overlay / outside click
    if (isMobileNav() && document.body.classList.contains('nav-open')
        && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileNav();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const card = e.target.closest('[data-target]');
      if (card) showPage(card.dataset.target);
    }
    if (e.key === 'Escape') {
      const authOv = document.getElementById('cv-auth-overlay');
      if (authOv && authOv.classList.contains('open')) {
        e.preventDefault();
        cvCloseModal();
        return;
      }
      if (isMobileNav() && document.body.classList.contains('nav-open')) {
        closeMobileNav();
      }
    }
  });

  // Toggle sidebar: desktop collapse vs mobile drawer
  hamburger.addEventListener('click', () => {
    if (isMobileNav()) document.body.classList.toggle('nav-open');
    else document.body.classList.toggle('nav-collapsed');
    syncHamburgerAria();
  });
  window.addEventListener('resize', syncHamburgerAria);
  document.getElementById('nav-overlay').addEventListener('click', closeMobileNav);

  // ── Right panel collapse tab ─────────────────────────
  document.getElementById('right-panel-tab').addEventListener('click', () => {
    document.body.classList.toggle('right-collapsed');
  });

  // ── Sidebar search button → open Explore ─────────────
  document.getElementById('sidebar-search-btn').addEventListener('click', () => {
    go('explore');
  });

  // ── Sidebar POST button → Home feed + focus compose ──
  document.getElementById('sidebar-post-btn').addEventListener('click', () => {
    go('home');
    setTimeout(() => {
      const input = document.getElementById('thoughts-compose-input');
      if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }, 120);
  });

  // ── Thoughts compose — full feature set ──────────────
  (function() {
    const input        = document.getElementById('thoughts-compose-input');
    const postBtn      = document.getElementById('thoughts-post-btn');
    const wrap         = document.getElementById('thoughts-compose-wrap');
    if (!input || !postBtn) return;

    // ── State ─────────────────────────────────────────
    let attachedFile  = null;  // File object
    let attachedUrl   = null;  // After upload: download URL
    let scheduledAt   = null;  // Date object
    let locationData  = null;  // { name, lat, lng }
    let pollActive    = false;

    // ── Readiness check ───────────────────────────────
    function checkReady() {
      const hasContent = input.value.trim().length > 0 || attachedFile || pollActive;
      postBtn.classList.toggle('ready', hasContent);
    }

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 240) + 'px';
      checkReady();
    });

    // ── Tab switching ─────────────────────────────────
    document.querySelectorAll('.thoughts-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        go(tab.dataset.thoughtsTab === 'following' ? 'following' : 'home');
      });
    });

    // ── Helper: set image preview ─────────────────────
    function setImagePreview(file) {
      attachedFile = file;
      const reader = new FileReader();
      reader.onload = e => {
        document.getElementById('compose-preview-img').src = e.target.result;
        document.getElementById('compose-image-preview').style.display = '';
      };
      reader.readAsDataURL(file);
      checkReady();
    }

    document.getElementById('compose-image-remove').addEventListener('click', () => {
      attachedFile = null; attachedUrl = null;
      document.getElementById('compose-image-preview').style.display = 'none';
      document.getElementById('compose-preview-img').src = '';
      document.getElementById('compose-image-input').value = '';
      document.getElementById('compose-gif-input').value = '';
      checkReady();
    });

    // ── 1. IMAGE button ───────────────────────────────
    document.getElementById('compose-btn-image').addEventListener('click', () => {
      document.getElementById('compose-image-input').click();
    });
    document.getElementById('compose-image-input').addEventListener('change', e => {
      if (e.target.files[0]) setImagePreview(e.target.files[0]);
    });

    // ── 2. GIF button ─────────────────────────────────
    document.getElementById('compose-btn-gif').addEventListener('click', () => {
      document.getElementById('compose-gif-input').click();
    });
    document.getElementById('compose-gif-input').addEventListener('change', e => {
      if (e.target.files[0]) setImagePreview(e.target.files[0]);
    });

    // ── Drag & drop onto compose wrap ─────────────────
    wrap.addEventListener('dragover', e => { e.preventDefault(); wrap.classList.add('drag-over'); });
    wrap.addEventListener('dragleave', () => wrap.classList.remove('drag-over'));
    wrap.addEventListener('drop', e => {
      e.preventDefault(); wrap.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) setImagePreview(file);
    });

    // ── 3. POLL button ────────────────────────────────
    const pollPanel = document.getElementById('compose-poll');
    document.getElementById('compose-btn-poll').addEventListener('click', () => {
      pollActive = !pollActive;
      pollPanel.style.display = pollActive ? '' : 'none';
      document.getElementById('compose-btn-poll').style.color = pollActive ? 'var(--accent-dark)' : '';
      checkReady();
    });
    document.getElementById('compose-poll-add').addEventListener('click', () => {
      const options = pollPanel.querySelectorAll('.compose-poll-option');
      if (options.length >= 4) return;
      const idx = options.length;
      const div = document.createElement('div');
      div.className = 'compose-poll-option';
      div.innerHTML = `<input class="compose-poll-input" placeholder="Choice ${idx+1}" maxlength="60" data-poll-opt="${idx}">
        <button class="compose-poll-remove" title="Remove">×</button>`;
      div.querySelector('.compose-poll-remove').addEventListener('click', () => div.remove());
      pollPanel.querySelector('.compose-poll-footer').before(div);
    });

    // ── 4. EMOJI button ───────────────────────────────
    document.getElementById('compose-btn-emoji').addEventListener('click', e => {
      e.stopPropagation();
      let wrap2 = document.getElementById('compose-emoji-wrap');
      if (wrap2) { wrap2.remove(); return; }
      wrap2 = document.createElement('div');
      wrap2.id = 'compose-emoji-wrap';
      wrap2.className = 'compose-emoji-wrap';
      const picker = document.createElement('emoji-picker');
      wrap2.appendChild(picker);
      document.body.appendChild(wrap2);
      // Position above the button
      const btnRect = e.currentTarget.getBoundingClientRect();
      wrap2.style.top  = (btnRect.top - 315) + 'px';
      wrap2.style.left = Math.max(4, btnRect.left - 120) + 'px';
      // Insert emoji on selection
      picker.addEventListener('emoji-click', ev => {
        const em = ev.detail.unicode;
        const pos = input.selectionStart || input.value.length;
        input.value = input.value.slice(0, pos) + em + input.value.slice(pos);
        input.dispatchEvent(new Event('input'));
        input.focus();
        wrap2.remove();
      });
      const close = ev => { if (!wrap2.contains(ev.target) && ev.target !== e.currentTarget) { wrap2.remove(); document.removeEventListener('click', close); } };
      setTimeout(() => document.addEventListener('click', close), 20);
    });

    // ── 5. SCHEDULE button ────────────────────────────
    document.getElementById('compose-btn-schedule').addEventListener('click', e => {
      e.stopPropagation();
      let popup = document.getElementById('compose-schedule-popup');
      if (popup) { popup.remove(); return; }
      popup = document.createElement('div');
      popup.id = 'compose-schedule-popup';
      popup.className = 'compose-schedule-popup';
      const minDT = new Date(Date.now() + 5 * 60000).toISOString().slice(0, 16);
      popup.innerHTML = `
        <label>Schedule post for</label>
        <input type="datetime-local" id="compose-dt-input" min="${minDT}" value="${scheduledAt ? scheduledAt.toISOString().slice(0,16) : ''}">
        <div class="compose-schedule-actions">
          <button class="compose-schedule-set" id="compose-dt-set">Set</button>
          <button class="compose-schedule-cancel" id="compose-dt-cancel">Cancel</button>
        </div>`;
      document.body.appendChild(popup);
      const btnRect = e.currentTarget.getBoundingClientRect();
      popup.style.top  = (btnRect.top - popup.offsetHeight - 10) + 'px';
      popup.style.left = Math.max(4, btnRect.left - 80) + 'px';
      popup.style.top  = (btnRect.top - 140) + 'px';

      document.getElementById('compose-dt-set').addEventListener('click', () => {
        const val = document.getElementById('compose-dt-input').value;
        if (!val) return;
        scheduledAt = new Date(val);
        updateMetaBadges();
        popup.remove();
      });
      document.getElementById('compose-dt-cancel').addEventListener('click', () => popup.remove());
      const closeS = ev => { if (!popup.contains(ev.target)) { popup.remove(); document.removeEventListener('click', closeS); } };
      setTimeout(() => document.addEventListener('click', closeS), 20);
    });

    // ── 6. LOCATION button ────────────────────────────
    document.getElementById('compose-btn-location').addEventListener('click', () => {
      if (locationData) { locationData = null; updateMetaBadges(); return; }
      const btn = document.getElementById('compose-btn-location');
      btn.style.opacity = '0.4';
      if (!navigator.geolocation) { alert('Geolocation not supported by your browser.'); btn.style.opacity=''; return; }
      navigator.geolocation.getCurrentPosition(async pos => {
        btn.style.opacity = '';
        const { latitude: lat, longitude: lng } = pos.coords;
        let name = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await r.json();
          name = d.address?.city || d.address?.town || d.address?.village || d.address?.county || name;
          if (d.address?.state && name !== d.address.state) name += ', ' + d.address.state;
        } catch(_) {}
        locationData = { name, lat, lng };
        updateMetaBadges();
      }, err => {
        btn.style.opacity = '';
        if (err.code === 1) alert('Location access denied. Please allow location in your browser settings.');
      });
    });

    // ── Meta badge renderer ───────────────────────────
    function updateMetaBadges() {
      const meta = document.getElementById('compose-meta');
      meta.innerHTML = '';
      if (scheduledAt) {
        const fmt = scheduledAt.toLocaleString(undefined, { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
        const b = document.createElement('span');
        b.className = 'compose-meta-badge';
        b.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${fmt} <button class="compose-meta-badge-remove" title="Remove schedule">&times;</button>`;
        b.querySelector('button').addEventListener('click', () => { scheduledAt = null; updateMetaBadges(); });
        meta.appendChild(b);
      }
      if (locationData) {
        const b = document.createElement('span');
        b.className = 'compose-meta-badge';
        b.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${locationData.name} <button class="compose-meta-badge-remove" title="Remove location">&times;</button>`;
        b.querySelector('button').addEventListener('click', () => { locationData = null; updateMetaBadges(); });
        meta.appendChild(b);
      }
    }

    // ── Upload image to Firebase Storage ─────────────
    async function uploadImage(file) {
      if (!cvUser) return null;
      const ext  = file.name.split('.').pop();
      const ref  = fbStorage.ref(`posts/${cvUser.uid}/${Date.now()}.${ext}`);
      const bar  = document.getElementById('compose-upload-bar');
      const fill = document.getElementById('compose-upload-fill');
      bar.style.display = '';
      return new Promise((resolve, reject) => {
        const task = ref.put(file);
        task.on('state_changed',
          snap => { fill.style.width = (snap.bytesTransferred / snap.totalBytes * 100) + '%'; },
          err  => { bar.style.display = 'none'; reject(err); },
          async () => { bar.style.display = 'none'; resolve(await task.snapshot.ref.getDownloadURL()); }
        );
      });
    }

    // ── POST button ───────────────────────────────────
    postBtn.addEventListener('click', async () => {
      if (!postBtn.classList.contains('ready')) return;
      const text = input.value.trim();
      if (!text && !attachedFile && !pollActive) return;
      if (!cvUser) { cvOpenModal('login'); return; }
      if (cvIsOperator) {
        alert('This operator account can reply, like, and chat. It cannot publish a new post.');
        return;
      }
      postBtn.disabled = true; postBtn.textContent = 'Posting…';
      try {
        // Upload image if attached
        let imageUrl = null;
        if (attachedFile) {
          try { imageUrl = await uploadImage(attachedFile); }
          catch(e) { console.error('Image upload failed:', e); }
        }

        // Collect poll data
        let poll = null;
        if (pollActive) {
          const opts = [...pollPanel.querySelectorAll('.compose-poll-input')]
            .map(i => i.value.trim()).filter(Boolean);
          if (opts.length >= 2) {
            poll = {
              options: opts,
              votes: {},
              duration: parseInt(document.getElementById('compose-poll-duration').value),
              endsAt: new Date(Date.now() + parseInt(document.getElementById('compose-poll-duration').value) * 86400000)
            };
          }
        }

        const postData = {
          pageId: 'thoughts',
          authorUid: cvUser.uid,
          authorName: currentPublicName(),
          text: text || '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          likeCount: 0, replyCount: 0, repostCount: 0, bookmarkCount: 0,
          parentId: null,
        };
        if (imageUrl)   postData.imageUrl   = imageUrl;
        if (poll)       postData.poll       = poll;
        if (scheduledAt) postData.scheduledAt = firebase.firestore.Timestamp.fromDate(scheduledAt);
        if (locationData) postData.location  = locationData;

        await fbDb.collection('posts').add(postData);

        // Reset state
        input.value = ''; input.style.height = 'auto';
        attachedFile = null; attachedUrl = null;
        scheduledAt = null; locationData = null;
        pollActive = false;
        document.getElementById('compose-image-preview').style.display = 'none';
        document.getElementById('compose-image-input').value = '';
        document.getElementById('compose-gif-input').value = '';
        pollPanel.style.display = 'none';
        document.getElementById('compose-poll-add').parentElement.parentElement
          .querySelectorAll('.compose-poll-input').forEach((el,i) => { el.value=''; });
        document.getElementById('compose-meta').innerHTML = '';
        postBtn.classList.remove('ready');
      } catch(e) { console.error('Post error:', e); }
      postBtn.disabled = false; postBtn.textContent = 'Post';
    });
  })();

  // Start with the mobile drawer closed (CSS also defaults this below 900px)
  closeMobileNav();
  syncHamburgerAria();

  // ── Dynamic painting page generator ─────────────────
  // Builds detail overlay pages from PAINTINGS_DATA.
  // Hardcoded pages in HTML are kept as fallback for existing paintings.
  (function() {
    if (typeof PAINTINGS_DATA === 'undefined') return;
    const kickers = {
      'women':        'Women of Buddhism',
      'iconography':  'Buddhist Iconography',
      'asian-ladies': 'Asian Ladies',
      'nature':       'Fragments of Nature'
    };
    const main = document.querySelector('.main');
    PAINTINGS_DATA.forEach(p => {
      // Skip if a hardcoded page already exists
      if (document.getElementById('page-' + p.id)) return;
      const sec = document.createElement('section');
      sec.className = 'page';
      sec.id = 'page-' + p.id;
      const imgSrc = 'images/' + p.file + '?v=3';
      const subtitleHtml = p.subtitle
        ? `<p style="font-family:'Cormorant Garamond',Georgia,serif;font-size:0.9rem;color:var(--text-muted);margin-top:0.2rem;">${p.subtitle}</p>` : '';
      const bodyContent = p.bodyHtml && p.bodyHtml.trim()
        ? p.bodyHtml
        : `<p style="color:var(--text-muted);font-style:italic;">Story coming soon.</p>`;
      sec.innerHTML = `
        <div class="page-header">
          <div class="page-kicker">${kickers[p.category] || ''}</div>
          <h1>${p.title}</h1>
          <div class="page-rule"></div>
        </div>
        <div class="artwork-intro">
          <div class="artwork-frame">
            <img src="${imgSrc}" alt="${p.title} — Bakasan" class="artwork-img">
          </div>
          <div class="artwork-caption">
            <p class="caption-title">${p.captionTitle}</p>
            ${p.era ? `<p>${p.era}</p>` : ''}
            ${subtitleHtml}
            ${p.year ? `<p>${p.year}</p>` : ''}
            ${p.medium ? `<p>${p.medium}</p>` : ''}
            ${p.size ? `<p>${p.size}</p>` : ''}
            <p style="margin-top:0.6rem;font-size:0.78rem;color:var(--text-light);">All Copyrights Reserved</p>
          </div>
        </div>
        <div class="page-body">${bodyContent}</div>
        <footer class="page-footer">All contents copyright &copy; 1997&ndash;${new Date().getFullYear()} Bakasan. All rights reserved.</footer>`;
      main.appendChild(sec);
    });
  })();

  // ── View layout setup ─────────────────────────────────
  (function() {
    MAIN_SECTIONS.forEach(id => {
      const el = document.getElementById('page-' + id);
      if (el) el.classList.add('main-section');
    });
    DETAIL_SECTIONS.forEach(id => {
      const el = document.getElementById('page-' + id);
      if (el) el.classList.add('detail-page');
    });

    DETAIL_SECTIONS.forEach(id => {
      const el = document.getElementById('page-' + id);
      if (!el) return;
      const btn = document.createElement('button');
      btn.className = 'detail-back-btn';
      btn.type = 'button';
      btn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M9 2L4 7L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
        + '</svg> Back to Collection';
      btn.addEventListener('click', () => go(detailParent(id)));
      el.insertBefore(btn, el.firstChild);
    });
  })();

  // ── Home collection card rotation ────────────────────
  // All 23 paintings in one pool. Guarantees no image appears
  // in more than one of the 4 panels simultaneously.
  (function() {
    // Derived from PAINTINGS_DATA so it can never drift from the real paths
    const ALL = PAINTINGS_DATA.map(p => p.file);

    const CARD_IDS = ['asian-ladies','iconography'];
    const INTERVAL = 7000;   // ms between swaps
    const FADE_MS  = 1100;   // crossfade duration

    // Which file each panel is currently displaying (index → filename)
    const showing = {};

    function shownFiles() { return new Set(Object.values(showing)); }

    function pickNext(panelIdx) {
      const exclude = shownFiles();
      exclude.delete(showing[panelIdx]); // allow replacing own current image
      const pool = ALL.filter(f => !exclude.has(f));
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function rotatePanelCard(card, panelIdx) {
      let imgFront = card.querySelector('.card-thumb');
      let imgBack  = card.querySelector('.card-thumb-b');
      if (!imgFront) return;

      const next = pickNext(panelIdx);
      showing[panelIdx] = next;

      // Create back layer on first rotation
      if (!imgBack) {
        imgBack = document.createElement('img');
        imgBack.className = 'card-thumb-b';
        imgBack.alt = '';
        imgBack.style.cssText = imgFront.style.cssText;
        card.insertBefore(imgBack, imgFront);
      }

      // Load next image into back layer, then crossfade
      imgBack.onload = () => {
        imgFront.style.opacity = '0';
        imgBack.style.opacity  = '1';
        // After fade: sync front to match back, reset layers
        setTimeout(() => {
          imgFront.src     = imgBack.src;
          imgFront.style.opacity = '1';
          imgBack.style.opacity  = '0';
        }, FADE_MS + 50);
      };
      imgBack.onerror = () => {};  // skip broken images silently
      imgBack.src = 'images/' + next;
    }

    // Wire up each card with staggered start times
    CARD_IDS.forEach((id, idx) => {
      const card = document.querySelector(`[data-target="${id}"]`);
      if (!card) return;

      // Seed showing[] from whatever the thumbnail injector already placed
      const existing = card.querySelector('.card-thumb');
      if (existing) {
        // img.src is a full URL; grab just the filename
        existing.addEventListener('load', () => {
          showing[idx] = existing.src.split('/').pop();
        }, { once: true });
        if (existing.complete && existing.src) {
          showing[idx] = existing.src.split('/').pop();
        }
        // Add transition to front layer
        existing.style.transition = `opacity ${FADE_MS}ms ease-in-out`;
      }

      // Stagger: panels swap at offset intervals so they never all change at once
      setTimeout(() => {
        rotatePanelCard(card, idx);
        setInterval(() => rotatePanelCard(card, idx), INTERVAL);
      }, idx * (INTERVAL / CARD_IDS.length));  // 0s, 3.5s
    });
  })();

  // ── Collection page rotating showcase ────────────────
  (function() {
    // Derived from PAINTINGS_DATA so showcase always matches the data file
    const byCat = cat => PAINTINGS_DATA.filter(p => p.category === cat)
      .map(p => ({ id: p.id, file: p.file, title: p.title }));
    const GROUPS = [
      { name: 'Women of Buddhism',    pageId: 'women',        paintings: byCat('women') },
      { name: 'Buddhist Iconography', pageId: 'iconography',  paintings: byCat('iconography') },
      { name: 'Asian Ladies',         pageId: 'asian-ladies', paintings: byCat('asian-ladies') },
      { name: 'Fragments of Nature',  pageId: 'nature',       paintings: byCat('nature') },
    ];

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    const container = document.getElementById('collection-showcase');
    if (!container) return;

    // Always one panel per period, in GROUPS order (2×2 on desktop, stacked on mobile)
    const state = [];  // { panel, group, painting }

    GROUPS.forEach(group => {
      const painting = pick(group.paintings);
      const panel = document.createElement('div');
      panel.className = 'showcase-panel';
      panel.innerHTML = `
          <img class="showcase-img" src="images/${painting.file}?v=3" alt="${painting.title}">
          <div class="showcase-label">
            <div class="showcase-group-name">${group.name}</div>
            <div class="showcase-title">${painting.title}</div>
            <div class="showcase-hint">View painting ›</div>
          </div>`;
      container.appendChild(panel);
      const entry = { panel, group, painting };
      state.push(entry);
      panel.addEventListener('click', () => showPage(entry.painting.id));
    });

    // Every 7 s: rotate one random panel to a new painting from the same period
    setInterval(() => {
      const idx      = Math.floor(Math.random() * state.length);
      const entry    = state[idx];
      const img      = entry.panel.querySelector('.showcase-img');
      const tLabel   = entry.panel.querySelector('.showcase-title');

      const fresh = entry.group.paintings.filter(p => p.file !== entry.painting.file);
      const newPainting = pick(fresh.length ? fresh : entry.group.paintings);

      img.style.opacity = '0';
      setTimeout(() => {
        img.src             = `images/${newPainting.file}?v=3`;
        img.alt             = newPainting.title;
        tLabel.textContent  = newPainting.title;
        entry.painting      = newPainting;
        img.style.opacity   = '1';
      }, 900);
    }, 7000);
  })();

  // ── Gallery thumbnail injector (data-driven) ─────────
  // Build maps from PAINTINGS_DATA
  const thumbFileMap = {};
  const collectionRepMap = { 'women': '', 'iconography': '', 'asian-ladies': '', 'nature': '' };
  if (typeof PAINTINGS_DATA !== 'undefined') {
    PAINTINGS_DATA.forEach(p => { thumbFileMap[p.id] = p.file; });
    // Use first painting of each category as the collection card representative
    ['women','iconography','asian-ladies','nature'].forEach(cat => {
      const first = PAINTINGS_DATA.find(p => p.category === cat);
      if (first) collectionRepMap[cat] = first.file;
    });
  }
  const skipIds = new Set(['collection']);

  document.querySelectorAll('[data-target]').forEach(card => {
    const id = card.dataset.target;
    if (skipIds.has(id)) return;
    // Explore overlay manages its own imagery (tiles + highlight cards)
    if (card.closest('.explore-overlay')) return;

    // Resolve the image src
    const src = 'images/' + (
      collectionRepMap[id] ||   // collection landing card
      thumbFileMap[id]      ||  // non-standard individual filename
      id + '.jpg'               // standard: page-id.jpg
    );

    const overlay = card.querySelector('.wc-overlay, .ic-overlay, .card-overlay');

    const img = document.createElement('img');
    img.className = 'card-thumb';
    img.alt = '';
    img.onerror = () => img.remove();   // fall back to gradient if image missing
    img.src = src;

    if (overlay) card.insertBefore(img, overlay);
    else card.appendChild(img);
  });

  // ════════════════════════════════════════════════════════
  // FIREBASE CONVERSATION SYSTEM
  // ════════════════════════════════════════════════════════

  // Initialize Firebase (compat SDK)
  const firebaseConfig = {
    apiKey: "AIzaSyA0AGKwIt3jWCdivlb573i19XEDm12zxIE",
    authDomain: "bakasan-art.firebaseapp.com",
    projectId: "bakasan-art",
    storageBucket: "bakasan-art.firebasestorage.app",
    messagingSenderId: "839964323046",
    appId: "1:839964323046:web:ef9ddbbef5f64acfc2df27",
    measurementId: "G-31WPTPSZQW"
  };
  firebase.initializeApp(firebaseConfig);
  // App Check (reCAPTCHA v3) — monitoring-only until Console enforcement
  // is turned on after merge. This activate() call does not enforce; the
  // Firebase Console still has to switch the project to enforcement.
  try {
    firebase.appCheck().activate('6LfIoRgtAAAAAO4fIFWR1CNMitueqxMaqgAbDETI', true);
  } catch(e) { console.warn('App Check:', e.message); }
  const fbAuth    = firebase.auth();
  const fbDb      = firebase.firestore();
  const fbStorage = firebase.storage();

  // users/{uid} is public-read. Strip leftover PII on every owner write.
  function publicProfilePiiStrip() {
    const del = firebase.firestore.FieldValue.delete();
    return { email: del, lastSeen: del, location: del };
  }

  // ── Helpers ──────────────────────────────────────────
  function cvGetInitials(name) {
    if (!name) return '?';
    return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
  function cvAvatarColor(name) {
    const cols = ['#8b6d3f','#5e4825','#7a5232','#6b4c2a','#9a7a50','#4a3520'];
    let h = 0; for (const c of (name || '')) h = c.charCodeAt(0) + ((h << 5) - h);
    return cols[Math.abs(h) % cols.length];
  }
  function cvRelTime(ts) {
    if (!ts) return '';
    const ms = ts.toMillis ? ts.toMillis() : (ts.seconds ? ts.seconds * 1000 : ts);
    const d = Math.floor((Date.now() - ms) / 1000);
    if (d < 60) return 'just now';
    if (d < 3600) return Math.floor(d/60) + 'm';
    if (d < 86400) return Math.floor(d/3600) + 'h';
    if (d < 604800) return Math.floor(d/86400) + 'd';
    return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  function cvEsc(s) {
    return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;').replace(/\n/g,'<br>');
  }

  // ── SVG icons ─────────────────────────────────────────
  const CV_ICONS = {
    eye:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    heart:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    heartOn:  `<svg viewBox="0 0 24 24" fill="#e0245e" stroke="#e0245e" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    repost:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
    reply:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    bookmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    bookOn:   `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
    share:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    trash:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="13" height="13"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
    google:   `<svg width="17" height="17" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/></svg>`
  };

  // ── Current user ──────────────────────────────────────
  let cvUser = null;
  let cvIsAdmin = false;
  let cvIsOperator = false;

  function applyOperatorChrome() {
    const wrap = document.getElementById('thoughts-compose-wrap');
    if (wrap) wrap.style.display = cvIsOperator ? 'none' : '';
    document.querySelectorAll('.conv-section').forEach(s => cvRenderCompose(s));
  }
  // ── Global sidebar auth chip (visible on every page) ──
  function renderSidebarAuth(user) {
    const el = document.getElementById('sidebar-auth');
    if (!el) return;
    if (user) {
      const name = publicDisplayName(user.displayName);
      el.innerHTML = `
        <div class="sidebar-auth-user">
          <div class="sidebar-auth-avatar" style="background:${cvAvatarColor(name)}">${cvEsc(cvGetInitials(name))}</div>
          <span class="sidebar-auth-name">${cvEsc(name)}</span>
        </div>
        <button class="sidebar-auth-btn" id="sidebar-signout" title="Sign out">Sign Out</button>`;
      el.querySelector('#sidebar-signout').addEventListener('click', () => fbAuth.signOut());
    } else {
      el.innerHTML = `<button class="sidebar-auth-btn primary" id="sidebar-signin">Sign In / Register</button>`;
      el.querySelector('#sidebar-signin').addEventListener('click', () => cvOpenModal('login'));
    }
  }

  fbAuth.onAuthStateChanged(user => {
    cvUser = user;
    renderSidebarAuth(user);
    // Re-subscribe the chat thread list if the overlay is already open
    // (covers sign-in restoring after the user opened Chat)
    if (user && chatOverlay.classList.contains('active')) chatSubscribeThreads();
    cvIsAdmin = false;
    cvIsOperator = false;
    if (user) {
      fbDb.collection('admins').doc(user.uid).get()
        .then(d => {
          // Missing role on an existing admins/{uid} doc still means admin.
          // Operator is role === 'operator' only. No hard-coded uid.
          const role = d.exists ? ((d.data() || {}).role || 'admin') : null;
          cvIsAdmin = role === 'admin';
          cvIsOperator = role === 'operator';
          applyOperatorChrome();
        })
        .catch(() => {});
    } else {
      applyOperatorChrome();
    }
    document.querySelectorAll('.conv-section').forEach(s => {
      cvRenderAuthBar(s);
      cvRenderCompose(s);
    });
    // Notifications subscription
    if (user) notifSubscribe(user.uid);
    else       notifUnsubscribe();

    // Follow cache refresh
    if (user) followRefreshCache();
    else followingCache = new Set();

    // Update thoughts compose avatar
    const composeAvatar = document.getElementById('thoughts-compose-avatar');
    if (composeAvatar) {
      if (user) {
        const n = publicDisplayName(user.displayName);
        composeAvatar.textContent = n.charAt(0).toUpperCase();
        composeAvatar.style.background = (['#6b7c93','#8b6d3f','#5a7a4a','#7a5a8a','#4a7a7a','#8a4a4a'])[n.charCodeAt(0) % 6];
      } else {
        composeAvatar.textContent = '☸';
        composeAvatar.style.background = 'var(--nav-bg)';
      }
    }

    // Write/update user profile so they appear in chat search.
    // Never persist email, lastSeen, or location — users/{uid} is public-read.
    if (user) {
      const name = publicDisplayName(user.displayName);
      const payload = publicProfilePiiStrip();
      if (user.displayName && name !== 'Member') {
        payload.displayName = name;
        payload.displayNameLower = name.toLowerCase();
      }
      fbDb.collection('users').doc(user.uid).set(payload, { merge: true });
    }
    // Show sign-in prompt inside notif overlay if logged out
    const allPane = document.getElementById('notif-pane-all');
    if (!user && allPane) {
      allPane.innerHTML = `<div class="notif-signin-prompt">
        <p>Sign in to see your notifications.</p>
        <button class="notif-signin-btn" id="notif-signin-btn">Sign In</button>
      </div>`;
      document.getElementById('notif-signin-btn')?.addEventListener('click', () => {
        cvOpenModal('login');
      });
    }
  });

  // ── Auth Modal ────────────────────────────────────────
  function cvBuildModal() {
    if (document.getElementById('cv-auth-overlay')) return;
    const ov = document.createElement('div');
    ov.className = 'conv-modal-overlay'; ov.id = 'cv-auth-overlay';
    ov.innerHTML = `
      <div class="conv-modal">
        <button type="button" class="conv-modal-close" id="cv-modal-close" aria-label="Close sign in">&times;</button>
        <h2>Join the Conversation</h2>
        <div class="conv-modal-tabs">
          <button class="conv-modal-tab active" data-tab="login">Sign In</button>
          <button class="conv-modal-tab" data-tab="register">Register</button>
        </div>
        <div id="cv-panel-login">
          <div class="conv-modal-err" id="cv-login-err"></div>
          <div class="conv-modal-field"><label>Email</label><input type="email" id="cv-login-email" autocomplete="email" placeholder="you@email.com"></div>
          <div class="conv-modal-field"><label>Password</label>
            <div class="pw-field-wrap">
              <input type="password" id="cv-login-pw" autocomplete="current-password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;">
              <button type="button" class="pw-toggle" data-pw-for="cv-login-pw" aria-label="Show password" title="Show password">${CV_ICONS.eye}</button>
            </div>
          </div>
          <button class="conv-modal-submit" id="cv-login-btn">Sign In</button>
          <button class="conv-modal-forgot" id="cv-forgot-btn" type="button">Forgot password?</button>
          <div class="conv-modal-divider">or</div>
          <button class="conv-google-btn" id="cv-google-login">${CV_ICONS.google} Continue with Google</button>
        </div>
        <div id="cv-panel-register" style="display:none">
          <div class="conv-modal-err" id="cv-reg-err"></div>
          <div class="conv-modal-field"><label>Display Name</label><input type="text" id="cv-reg-name" autocomplete="name" placeholder="Your Name"></div>
          <div class="conv-modal-field"><label>Email</label><input type="email" id="cv-reg-email" autocomplete="email" placeholder="you@email.com"></div>
          <div class="conv-modal-field"><label>Password</label>
            <div class="pw-field-wrap">
              <input type="password" id="cv-reg-pw" autocomplete="new-password" placeholder="At least 6 characters">
              <button type="button" class="pw-toggle" data-pw-for="cv-reg-pw" aria-label="Show password" title="Show password">${CV_ICONS.eye}</button>
            </div>
          </div>
          <button class="conv-modal-submit" id="cv-reg-btn">Create Account</button>
          <div class="conv-modal-divider">or</div>
          <button class="conv-google-btn" id="cv-google-reg">${CV_ICONS.google} Continue with Google</button>
        </div>
        <div class="conv-modal-field" id="cv-invite-field">
          <label for="cv-invite-code">Invite code</label>
          <input type="text" id="cv-invite-code" autocomplete="off" spellcheck="false" placeholder="Required to register or continue with Google">
        </div>
        <label class="conv-modal-consent" for="cv-age-consent">
          <input type="checkbox" id="cv-age-consent">
          <span>I confirm I am 13 or older and agree to the
            <a href="terms.html" target="_blank" rel="noopener">Terms of Use</a>
            and <a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>.</span>
        </label>
      </div>`;
    document.body.appendChild(ov);

    ov.querySelectorAll('.conv-modal-tab').forEach(t => t.addEventListener('click', () => {
      ov.querySelectorAll('.conv-modal-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.getElementById('cv-panel-login').style.display    = t.dataset.tab === 'login' ? '' : 'none';
      document.getElementById('cv-panel-register').style.display = t.dataset.tab === 'register' ? '' : 'none';
    }));
    ov.querySelectorAll('.pw-toggle').forEach(btn => btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.pwFor);
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = show ? CV_ICONS.eyeOff : CV_ICONS.eye;
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.title = show ? 'Hide password' : 'Show password';
      input.focus();
    }));
    document.getElementById('cv-modal-close').addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      cvCloseModal();
    });
    ov.addEventListener('click', e => { if (e.target === ov) cvCloseModal(); });

    document.getElementById('cv-login-btn').addEventListener('click', async () => {
      const err = document.getElementById('cv-login-err');
      err.classList.remove('show');
      try {
        await fbAuth.signInWithEmailAndPassword(
          document.getElementById('cv-login-email').value.trim(),
          document.getElementById('cv-login-pw').value
        );
        cvCloseModal();
      } catch(e) { err.textContent = e.message.replace('Firebase: ',''); err.classList.add('show'); }
    });

    document.getElementById('cv-forgot-btn').addEventListener('click', async () => {
      const err = document.getElementById('cv-login-err');
      err.classList.remove('show', 'ok');
      const email = document.getElementById('cv-login-email').value.trim();
      if (!email) {
        err.textContent = 'Enter your email above, then click "Forgot password?" again.';
        err.classList.add('show');
        return;
      }
      try {
        await fbAuth.sendPasswordResetEmail(email);
        err.textContent = 'Password reset email sent — check your inbox.';
        err.classList.add('show', 'ok');
      } catch(e) { err.textContent = e.message.replace('Firebase: ',''); err.classList.add('show'); }
    });

    function cvConsentOk(errEl) {
      const box = document.getElementById('cv-age-consent');
      if (box && box.checked) return true;
      if (errEl) {
        errEl.textContent = 'Please confirm you are 13 or older and agree to the Terms and Privacy Policy.';
        errEl.classList.add('show');
      }
      return false;
    }

    async function cvInviteMatches(errEl) {
      const entered = String((document.getElementById('cv-invite-code') || {}).value || '').trim();
      if (!entered) {
        if (errEl) {
          errEl.textContent = 'An invite code is required to create an account.';
          errEl.classList.add('show');
        }
        return false;
      }
      try {
        const snap = await fbDb.collection('config').doc('invite').get();
        const expected = snap.exists ? String((snap.data() || {}).code || '').trim() : '';
        if (!expected) {
          if (errEl) {
            errEl.textContent = 'Registration is invite-only and is not open yet.';
            errEl.classList.add('show');
          }
          return false;
        }
        if (entered !== expected) {
          if (errEl) {
            errEl.textContent = 'That invite code is not valid.';
            errEl.classList.add('show');
          }
          return false;
        }
        return true;
      } catch (e) {
        if (errEl) {
          errEl.textContent = 'Could not verify the invite code. Try again.';
          errEl.classList.add('show');
        }
        return false;
      }
    }

    document.getElementById('cv-reg-btn').addEventListener('click', async () => {
      const name = document.getElementById('cv-reg-name').value.trim();
      const err  = document.getElementById('cv-reg-err');
      err.classList.remove('show');
      if (!cvConsentOk(err)) return;
      if (!(await cvInviteMatches(err))) return;
      if (!name) { err.textContent = 'Please enter your display name.'; err.classList.add('show'); return; }
      if (name.includes('@')) { err.textContent = 'Please use a display name, not an email address.'; err.classList.add('show'); return; }
      try {
        const cred = await fbAuth.createUserWithEmailAndPassword(
          document.getElementById('cv-reg-email').value.trim(),
          document.getElementById('cv-reg-pw').value
        );
        await cred.user.updateProfile({ displayName: name });
        cvUser = fbAuth.currentUser;
        const safe = publicDisplayName(name);
        await fbDb.collection('users').doc(cred.user.uid).set({
          displayName: safe,
          displayNameLower: safe.toLowerCase(),
          ...publicProfilePiiStrip()
        }, { merge: true });
        cvCloseModal();
      } catch(e) { err.textContent = e.message.replace('Firebase: ',''); err.classList.add('show'); }
    });

    const gProvider = new firebase.auth.GoogleAuthProvider();
    async function doGoogle() {
      const loginVisible = document.getElementById('cv-panel-login').style.display !== 'none';
      const err = document.getElementById(loginVisible ? 'cv-login-err' : 'cv-reg-err');
      err.classList.remove('show');
      if (!cvConsentOk(err)) return;
      if (!(await cvInviteMatches(err))) return;
      try { await fbAuth.signInWithPopup(gProvider); cvCloseModal(); }
      catch(e) { console.warn('Google sign-in:', e.message); }
    }
    document.getElementById('cv-google-login').addEventListener('click', doGoogle);
    document.getElementById('cv-google-reg').addEventListener('click', doGoogle);
  }

  function cvOpenModal(tab) {
    cvBuildModal();
    const ov = document.getElementById('cv-auth-overlay');
    ov.classList.add('open');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.querySelectorAll('.conv-modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('cv-panel-login').style.display    = tab === 'login' ? '' : 'none';
    document.getElementById('cv-panel-register').style.display = tab === 'register' ? '' : 'none';
    const closeBtn = document.getElementById('cv-modal-close');
    if (closeBtn) closeBtn.focus();
  }
  function cvCloseModal() {
    const ov = document.getElementById('cv-auth-overlay');
    if (ov) ov.classList.remove('open');
  }

  // ── Auth bar ──────────────────────────────────────────
  function cvRenderAuthBar(sec) {
    let bar = sec.querySelector('.conv-auth-bar');
    if (!bar) {
      bar = document.createElement('div'); bar.className = 'conv-auth-bar';
      const title = sec.querySelector('.conv-title');
      title ? title.after(bar) : sec.prepend(bar);
    }
    if (cvUser) {
      const name = currentPublicName();
      bar.innerHTML = `
        <div class="conv-avatar-sm" style="background:${cvAvatarColor(name)}">${cvGetInitials(name)}</div>
        <span>Signed in as <span class="conv-username">${cvEsc(name)}</span></span>
        <span class="conv-spacer"></span>
        <button class="conv-auth-btn cv-signout">Sign Out</button>`;
      bar.querySelector('.cv-signout').addEventListener('click', () => fbAuth.signOut());
    } else {
      bar.innerHTML = `
        <span style="color:var(--text-muted)">Sign in to join the conversation</span>
        <span class="conv-spacer"></span>
        <button class="conv-auth-btn cv-open-reg">Register</button>
        <button class="conv-auth-btn primary cv-open-login">Sign In</button>`;
      bar.querySelector('.cv-open-login').addEventListener('click', () => cvOpenModal('login'));
      bar.querySelector('.cv-open-reg').addEventListener('click', () => cvOpenModal('register'));
    }
  }

  // ── Compose box ───────────────────────────────────────
  function cvRenderCompose(sec) {
    sec.querySelectorAll('.conv-compose').forEach(el => el.remove());
    if (!cvUser || cvIsOperator) return;
    const name = currentPublicName();
    const pageId = sec.dataset.pageId;
    const compose = document.createElement('div');
    compose.className = 'conv-compose';
    compose.innerHTML = `
      <div class="conv-compose-avatar" style="background:${cvAvatarColor(name)}">${cvGetInitials(name)}</div>
      <div class="conv-compose-right">
        <textarea class="conv-compose-input" placeholder="Share your thoughts…" rows="3"></textarea>
        <div class="conv-compose-footer"><button class="conv-post-btn">Post</button></div>
      </div>`;
    const posts = sec.querySelector('.conv-posts');
    posts ? posts.before(compose) : sec.appendChild(compose);
    compose.querySelector('.conv-post-btn').addEventListener('click', async () => {
      const ta = compose.querySelector('.conv-compose-input');
      const text = ta.value.trim(); if (!text) return;
      const btn = compose.querySelector('.conv-post-btn'); btn.disabled = true;
      try {
        await fbDb.collection('posts').add({
          pageId, authorUid: cvUser.uid,
          authorName: currentPublicName(),
          text, createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          likeCount:0, repostCount:0, bookmarkCount:0, replyCount:0, parentId: null
        });
        ta.value = '';
      } catch(e) { console.error('Post error:', e); }
      btn.disabled = false;
    });
  }

  // ── Render a post ─────────────────────────────────────
  function cvRenderPost(post, inter, replies, rInters) {
    const nm = post.authorName || 'Anonymous';
    const isOwn = cvUser && cvUser.uid === post.authorUid;
    const lk = inter && inter.liked, rp = inter && inter.reposted, bk = inter && inter.bookmarked;
    const repliesHtml = (replies||[]).map(r => {
      const ri = (rInters||{})[r.id]||{};
      const rn = r.authorName || 'Anonymous';
      return `<div class="conv-reply-post" data-post-id="${r.id}">
        <div class="conv-reply-avatar" style="background:${cvAvatarColor(rn)}">${cvEsc(cvGetInitials(rn))}</div>
        <div class="conv-reply-main">
          <div class="conv-reply-header">
            <span class="conv-post-name">${cvEsc(rn)}</span>
            <span class="conv-post-time">${cvRelTime(r.createdAt)}</span>
            ${cvUser && (cvUser.uid === r.authorUid || cvIsAdmin) ? `<button class="conv-delete-btn" data-del-id="${r.id}">${CV_ICONS.trash}</button>` : ''}
          </div>
          <div class="conv-reply-text">${cvEsc(r.text)}</div>
          <div class="conv-actions">
            <button class="conv-action like${ri.liked?' active':''}" data-action="like" data-post-id="${r.id}">
              ${ri.liked?CV_ICONS.heartOn:CV_ICONS.heart}
              ${r.likeCount>0?`<span class="conv-action-count">${r.likeCount}</span>`:''}
            </button>
          </div>
        </div></div>`;
    }).join('');
    return `<div class="conv-post" data-post-id="${post.id}">
      <div class="conv-post-avatar" style="background:${cvAvatarColor(nm)}">${cvEsc(cvGetInitials(nm))}</div>
      <div class="conv-post-main">
        <div class="conv-post-header">
          <span class="conv-post-name">${cvEsc(nm)}</span>
          <span class="conv-post-time">${cvRelTime(post.createdAt)}</span>
          ${(isOwn||cvIsAdmin)?`<button class="conv-delete-btn" data-del-id="${post.id}">${CV_ICONS.trash}</button>`:''}
        </div>
        <div class="conv-post-text">${cvEsc(post.text)}</div>
        ${post.imageUrl ? `<div class="post-image"><img src="${cvEsc(post.imageUrl)}" alt="Post image" loading="lazy"></div>` : ''}
        ${post.poll ? `<div class="post-poll">${post.poll.options.map((opt,i)=>`
          <div class="post-poll-option${cvUser && post.poll.votes && post.poll.votes[cvUser.uid] === i ? ' voted' : ''}" data-poll-idx="${i}" data-post-id="${post.id}">
            <div class="post-poll-bar" style="width:${post.poll.votes&&Object.values(post.poll.votes).length?Math.round((Object.values(post.poll.votes).filter(v=>v===i).length/Object.values(post.poll.votes).length)*100):0}%"></div>
            <span class="post-poll-label">${cvEsc(opt)}</span>
            <span class="post-poll-pct">${post.poll.votes&&Object.values(post.poll.votes).length?Math.round((Object.values(post.poll.votes).filter(v=>v===i).length/Object.values(post.poll.votes).length)*100):0}%</span>
          </div>`).join('')}
          <div class="post-poll-meta">${Object.values(post.poll.votes||{}).length} votes</div>
        </div>` : ''}
        <div class="conv-actions">
          <button class="conv-action like${lk?' active':''}" data-action="like" data-post-id="${post.id}" title="Like">
            ${lk?CV_ICONS.heartOn:CV_ICONS.heart}
            ${post.likeCount>0?`<span class="conv-action-count">${post.likeCount}</span>`:''}
          </button>
          <button class="conv-action repost${rp?' active':''}" data-action="repost" data-post-id="${post.id}" title="Repost">
            ${CV_ICONS.repost}${post.repostCount>0?`<span class="conv-action-count">${post.repostCount}</span>`:''}
          </button>
          <button class="conv-action reply-btn" data-action="reply" data-post-id="${post.id}" title="Reply">
            ${CV_ICONS.reply}${post.replyCount>0?`<span class="conv-action-count">${post.replyCount}</span>`:''}
          </button>
          <button class="conv-action bookmark${bk?' active':''}" data-action="bookmark" data-post-id="${post.id}" title="Bookmark">
            ${bk?CV_ICONS.bookOn:CV_ICONS.bookmark}
          </button>
          <button class="conv-action share" data-action="share" data-post-id="${post.id}" title="Copy link">
            ${CV_ICONS.share}
          </button>
        </div>
        ${replies&&replies.length?`<div class="conv-replies">${repliesHtml}</div>`:''}
      </div></div>`;
  }

  // ── Actions (like, repost, bookmark, share, reply, delete) ──
  async function cvHandleAction(action, postId, pageId, sec) {
    if (!cvUser && action !== 'share') { cvOpenModal('login'); return; }
    if (cvIsOperator && action !== 'like' && action !== 'reply' && action !== 'share') return;
    const postRef  = fbDb.collection('posts').doc(postId);
    const interRef = cvUser ? fbDb.collection('interactions').doc(cvUser.uid + '_' + postId) : null;
    const FV = firebase.firestore.FieldValue;

    if (action === 'like' || action === 'repost' || action === 'bookmark') {
      const snap = await interRef.get();
      const cur  = snap.exists ? (snap.data()[action+'d'] || false) : false;
      const field = action === 'like' ? 'likeCount' : action === 'repost' ? 'repostCount' : 'bookmarkCount';
      await fbDb.batch()
        .update(postRef, { [field]: FV.increment(cur ? -1 : 1) })
        .set(interRef, { [action+'d']: !cur }, { merge: true })
        .commit();
      // Notify post author on new like (not on unlike)
      if (action === 'like' && !cur) {
        const postSnap = await postRef.get();
        if (postSnap.exists) {
          const pd = postSnap.data();
          notifWrite(pd.authorUid, 'like', currentPublicName(), pageId, pd.text, postId);
        }
      }
    }
    else if (action === 'share') {
      const url = window.location.origin + window.location.pathname + '#post-' + postId;
      try {
        await navigator.clipboard.writeText(url);
        const btn = sec.querySelector('[data-action="share"][data-post-id="' + postId + '"]');
        if (btn) { const o=btn.innerHTML; btn.innerHTML='<span style="font-size:0.7rem">Copied!</span>'; setTimeout(()=>btn.innerHTML=o,1500); }
      } catch(e) {}
    }
    else if (action === 'reply') {
      const postEl = sec.querySelector('[data-post-id="' + postId + '"]');
      if (!postEl) return;
      const existing = postEl.querySelector('.conv-reply-compose');
      if (existing) { existing.remove(); return; }
      const rc = document.createElement('div'); rc.className = 'conv-reply-compose';
      rc.innerHTML = `<textarea class="conv-reply-input" placeholder="Write a reply…" rows="2"></textarea>
        <div class="conv-reply-actions"><button class="conv-post-btn" style="font-size:0.65rem;padding:0.38rem 1.1rem">Reply</button></div>`;
      const acts = postEl.querySelector('.conv-actions');
      if (acts) acts.after(rc);
      rc.querySelector('.conv-post-btn').addEventListener('click', async () => {
        const text = rc.querySelector('.conv-reply-input').value.trim(); if (!text) return;
        const batch = fbDb.batch();
        const rRef  = fbDb.collection('posts').doc();
        batch.set(rRef, { pageId, authorUid: cvUser.uid, authorName: currentPublicName(),
          text, createdAt: FV.serverTimestamp(), likeCount:0, repostCount:0, bookmarkCount:0, replyCount:0, parentId: postId });
        batch.update(postRef, { replyCount: FV.increment(1) });
        await batch.commit();
        // Notify post author of the reply
        const parentSnap = await postRef.get();
        if (parentSnap.exists) {
          const pd = parentSnap.data();
          notifWrite(pd.authorUid, 'reply', currentPublicName(), pageId, text, postId);
        }
        rc.remove();
      });
      rc.querySelector('.conv-reply-input').focus();
    }
  }

  // ── Wire event delegation for a section ──────────────
  function cvWireSection(sec) {
    sec.addEventListener('click', async e => {
      const po = e.target.closest('.post-poll-option');
      if (po) {
        if (!cvUser) { cvOpenModal('login'); return; }
        try {
          await fbDb.collection('posts').doc(po.dataset.postId)
            .update({ ['poll.votes.' + cvUser.uid]: parseInt(po.dataset.pollIdx, 10) });
        } catch(err) { console.error('Poll vote:', err); }
        return;
      }
      const ab = e.target.closest('[data-action]');
      if (ab) { await cvHandleAction(ab.dataset.action, ab.dataset.postId, sec.dataset.pageId, sec); return; }
      const db = e.target.closest('[data-del-id]');
      if (db && confirm('Delete this post?')) await fbDb.collection('posts').doc(db.dataset.delId).delete();
    });
  }

  // ── Initialize & subscribe a conv section ─────────────
  const cvUnsub = {};
  function cvInitSection(sec) {
    const pageId = sec.dataset.pageId; if (!pageId) return;
    if (sec.dataset.cvInit) return; sec.dataset.cvInit = '1';

    if (!sec.querySelector('.conv-title')) {
      const h = document.createElement('h3'); h.className = 'conv-title';
      h.textContent = pageId === 'thoughts' ? 'Conversation' : 'Discuss This Painting';
      sec.prepend(h);
    }
    if (!sec.querySelector('.conv-posts')) {
      const p = document.createElement('div'); p.className = 'conv-posts';
      p.innerHTML = '<div class="conv-loading">Loading…</div>';
      sec.appendChild(p);
    }
    cvRenderAuthBar(sec);
    cvRenderCompose(sec);
    cvWireSection(sec);

    if (cvUnsub[pageId]) cvUnsub[pageId]();

    // No orderBy — sort in JS to avoid needing Firestore composite indexes
    const q = fbDb.collection('posts')
      .where('pageId','==',pageId)
      .where('parentId','==',null);

    const tsMs = ts => ts?.toMillis?.() || ts?.seconds * 1000 || 0;

    cvUnsub[pageId] = q.onSnapshot(async snap => {
      const postsEl = sec.querySelector('.conv-posts'); if (!postsEl) return;
      const posts = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => tsMs(b.createdAt) - tsMs(a.createdAt)); // newest first

      if (!posts.length) {
        postsEl.innerHTML = '<div class="conv-empty">Be the first to share your thoughts.</div>'; return;
      }

      // Fetch replies in chunks of 30 (no orderBy — sort in JS)
      const ids = posts.map(p => p.id);
      let replies = [];
      for (let i = 0; i < ids.length; i += 30) {
        const rs = await fbDb.collection('posts')
          .where('parentId','in',ids.slice(i,i+30)).get();
        replies = replies.concat(rs.docs.map(d => ({ id: d.id, ...d.data() })));
      }
      replies.sort((a, b) => tsMs(a.createdAt) - tsMs(b.createdAt));

      // Fetch interactions for current user
      const interMap = {};
      if (cvUser) {
        const allIds = [...ids, ...replies.map(r => r.id)];
        for (const pid of allIds) {
          const s = await fbDb.collection('interactions').doc(cvUser.uid + '_' + pid).get();
          if (s.exists) interMap[pid] = s.data();
        }
      }

      const byParent = {};
      replies.forEach(r => { (byParent[r.parentId] = byParent[r.parentId]||[]).push(r); });

      postsEl.innerHTML = posts.map(p =>
        cvRenderPost(p, interMap[p.id], byParent[p.id]||[], interMap)
      ).join('');
    }, err => {
      console.error('Firestore error:', err.message);
      const postsEl = sec.querySelector('.conv-posts');
      if (postsEl) postsEl.innerHTML = '<div class="conv-empty">Could not load posts — please refresh the page.</div>';
    });
  }

  // ── Inject conv section into a page element ───────────
  function cvInjectSection(pageEl, pageId) {
    if (!pageEl || pageEl.querySelector('.conv-section')) return;
    const sec = document.createElement('div');
    sec.className = 'conv-section'; sec.dataset.pageId = pageId;
    const footer = pageEl.querySelector('.page-footer');
    footer ? pageEl.insertBefore(sec, footer) : pageEl.appendChild(sec);
  }

  // ── Set up Conversation tab on load ──────────────────
  // Inject conv-section directly into the For You feed div
  (function() {
    const feed = document.getElementById('thoughts-feed-foryou');
    if (!feed) return;
    const sec = document.createElement('div');
    sec.className = 'conv-section'; sec.dataset.pageId = 'thoughts';
    feed.appendChild(sec);
    cvInitSection(sec);
  })();

  // (detail page conversation init is handled inside showPage above)


  // ── Artist's Statement painting rotators (15 s each) ──────────
  function makeStatementRotator(id, paintings) {
    const INTERVAL = 15000;
    const FADE_MS  = 1200;
    let current = 0;
    const wrap  = document.getElementById(id);
    if (!wrap) return;
    const front = wrap.querySelector('.rotator-front');
    const back  = wrap.querySelector('.rotator-back');
    setInterval(function() {
      current = (current + 1) % paintings.length;
      back.onload = function() {
        front.style.opacity = '0';
        back.style.opacity  = '1';
        setTimeout(function() {
          front.src           = back.src;
          front.style.opacity = '1';
          back.style.opacity  = '0';
        }, FADE_MS + 50);
      };
      back.src = paintings[current];
    }, INTERVAL);
  }

  makeStatementRotator('statement-rotator-1', [
    'images/paintings/IMG_4814.jpg',
    'images/paintings/IMG_4815.jpg',
    'images/paintings/IMG_4816.jpg',
  ]);

  makeStatementRotator('statement-rotator-2', [
    'images/paintings/IMG_4811.jpg',
    'images/paintings/IMG_4812.jpg',
    'images/paintings/IMG_4813.jpg',
  ]);

  makeStatementRotator('statement-rotator-3', [
    'images/paintings/IMG_4817.jpg',
    'images/paintings/IMG_4818.jpg',
    'images/paintings/IMG_4819.jpg',
    'images/paintings/IMG_4820.jpg',
  ]);

  makeStatementRotator('statement-rotator-4', [
    'images/paintings/IMG_4821.jpg',
    'images/paintings/IMG_4822.jpg',
    'images/paintings/IMG_4823.jpg',
    'images/paintings/IMG_4824.jpg',
  ]);

  // ── Lightbox ──────────────────────────────────────────────────
  (function() {
    const overlay  = document.getElementById('lightbox');
    const lbImg    = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    if (!overlay) return;

    function openLightbox(src) {
      lbImg.src = src;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(function() { lbImg.src = ''; }, 300);
    }

    // Click any statement rotator to enlarge current front image
    document.querySelectorAll('.statement-rotator').forEach(function(rotator) {
      rotator.addEventListener('click', function() {
        var front = rotator.querySelector('.rotator-front');
        if (front && front.src) openLightbox(front.src);
      });
    });

    // Close on X button, backdrop click, or Escape key
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeLightbox();
    });
  })();

  // ── Hash router: shareable views + browser back ─────
  // #home remains the public X-style feed (posts are public-read).
  // Signed-out visitors without a hash land on #collection first so
  // strangers do not hit that social feed as the default view.
  window.addEventListener('hashchange', applyRoute);
  window.addEventListener('popstate', applyRoute);
  if (!location.hash || location.hash === '#') {
    history.replaceState(null, '', '#collection');
  }
  applyRoute();

  // ── Contact inquiry (mailto — no backend) ───────────
  (function() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = (document.getElementById('contact-name').value || '').trim();
      const email = (document.getElementById('contact-email').value || '').trim();
      const message = (document.getElementById('contact-message').value || '').trim();
      const subject = encodeURIComponent('Bakasan inquiry' + (name ? ' from ' + name : ''));
      const body = encodeURIComponent(
        (name ? 'Name: ' + name + '\n' : '') +
        (email ? 'Email: ' + email + '\n\n' : '\n') +
        message
      );
      window.location.href = 'mailto:' + BAKASAN_CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
    });
  })();

