// ==========================================
// ⭐ 1. ระบบ Google Analytics ⭐
// ==========================================
const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-PBC80ZJT27';
document.head.appendChild(gaScript);

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-PBC80ZJT27');

// ==========================================
// ⭐ 2. ระบบจัดการธีมมืด/สว่างพรีเมียม (Dark Mode Controller) ⭐
// ==========================================
// นิยามไอคอน SUN (พระอาทิตย์) และ MOON (พระจันทร์) เพื่อใช้สลับบนปุ่ม
const sunIcon = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-7a1 1 0 0 1 .993.883L13 3v1a1 1 0 0 1-1.993.117L11 4V3a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 .993.883L13 21v1a1 1 0 0 1-1.993.117L11 22v-1a1 1 0 0 1 1-1zM4.22 4.22a1 1 0 0 1 1.32-.083l.094.083 1.414 1.414a1 1 0 0 1-1.32 1.497l-.094-.083-1.414-1.414a1 1 0 0 1 0-1.414zm12.728 12.728a1 1 0 0 1 1.32-.083l.094.083 1.414 1.414a1 1 0 0 1-1.32 1.497l-.094-.083-1.414-1.414a1 1 0 0 1 0-1.414zM3 11a1 1 0 0 1 .117 1.993L3 13H2a1 1 0 0 1-.117-1.993L2 11h1zm19 0a1 1 0 0 1 .117 1.993L22 13h-1a1 1 0 0 1-.117-1.993L21 11h1zM5.636 16.95a1 1 0 0 1 .083 1.32l-.083.094-1.414 1.414a1 1 0 0 1-1.497-1.32l.083-.094 1.414-1.414a1 1 0 0 1 1.414 0zm12.728-12.728a1 1 0 0 1 .083 1.32l-.083.094-1.414 1.414a1 1 0 0 1-1.497-1.32l.083-.094 1.414-1.414a1 1 0 0 1 1.414 0z"/></svg>`;
const moonIcon = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z"/></svg>`;

// ดึงการตั้งค่าธีมก่อนหน้านี้จาก LocalStorage หรืออ้างอิงตามธีมเริ่มต้นของอุปกรณ์ผู้ใช้งาน
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDarkModeActive = savedTheme === 'dark' || (!savedTheme && prefersDark);

// ฟังก์ชันปรับใช้ธีมในระดับสูง
function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
    // อัปเดตไอคอนปุ่มสลับเมื่อรันโค้ด
    updateThemeIcon(isDark);
}

// อัปเดตรูปลักษณ์ของปุ่มสลับธีม
function updateThemeIcon(isDark) {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.innerHTML = isDark ? sunIcon : moonIcon;
    }
}

// สั่งรันธีมเบื้องต้นทันที ก่อน DOM โหลดเต็มที่เพื่อลดความกะพริบ
applyTheme(isDarkModeActive);

// Force light theme on pages where dark mode is not supported
(function() {
    var p = window.location.pathname;
    var supportsTheme = (p === '/' || p === '/index.html' || p.startsWith('/articles/'));
    if (!supportsTheme) {
        document.documentElement.classList.remove('dark-mode');
    }
})();

// The animated navy subpage surface is retired: category pages are fixed-dark
// and article/tool pages use pure black/white. Ensure no surface is applied.
function installSubpageSurface() {
    const existing = document.querySelector('link[data-ifp-subpage-surface]');
    if (existing) existing.remove();
    if (document.body) {
        document.body.classList.remove('ifp-subpage-bg');
    }
}

if (document.body) {
    installSubpageSurface();
} else {
    document.addEventListener('DOMContentLoaded', installSubpageSurface, { once: true });
}

// Shared articles.json promise — used by both search and category renderer
// Cache-bust with timestamp (daily granularity) to prevent Cloudflare serving stale schema
const _artCacheBust = Math.floor(Date.now() / 86400000);
const articlesPromise = fetch('/articles.json?v=' + _artCacheBust).then(function(r) { return r.json(); }).catch(function() { return []; });

// ==========================================
// ⭐ 3. ระบบประกอบร่าง Header / Footer ⭐
// ==========================================
document.addEventListener("DOMContentLoaded", function() {

    // โหลดธีมและปุ่มไอคอนใหม่หลังจาก DOM โหลดแล้ว
    updateThemeIcon(document.documentElement.classList.contains('dark-mode'));

    // ตั้งสถานะเริ่มต้นของแผงเครื่องมือช่วยอ่าน (ปุ่มขนาดอักษร + ปุ่มโหมดกลางคืน)
    if (typeof updateFontButtons === 'function') updateFontButtons();
    if (typeof syncDarkButton === 'function') syncDarkButton(document.documentElement.classList.contains('dark-mode'));

    // สั่งโหลดไฟล์ Header
    fetch('/components/header.html?v=20260529n')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            
            // เรียกปรับรูปไอคอนปุ่มธีมเมื่อประกอบร่างเสร็จ
            updateThemeIcon(document.documentElement.classList.contains('dark-mode'));
            
            // ผูกเหตุการณ์คลิกปุ่มธีม
            const themeToggleBtn = document.getElementById('themeToggleBtn');
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('click', function() {
                    const isDarkCurrently = document.documentElement.classList.contains('dark-mode');
                    applyTheme(!isDarkCurrently);
                });
            }

            // --- Hide theme toggle on pages that don't support dark mode ---
            (function() {
                var p = window.location.pathname;
                var supportsTheme = (p === '/' || p === '/index.html' || p.startsWith('/articles/'));
                if (!supportsTheme) {
                    var tBtn = document.getElementById('themeToggleBtn');
                    if (tBtn) tBtn.style.display = 'none';
                }
            })();

            // --- ระบบปุ่มเมนูมือถือ (Hamburger) ---
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navMenu = document.getElementById('navMenu');
            if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.addEventListener('click', function() {
                    navMenu.classList.toggle('mobile-active');
                    mobileMenuBtn.innerHTML = navMenu.classList.contains('mobile-active') ? '✖' : '☰';
                });
            }

            // --- ระบบซ่อน-แสดงแถบนำทางเมื่อเลื่อนจอ (Hide-on-scroll) ---
            (function() {
                const chrome = document.querySelector('.chrome');
                if (!chrome) return;
                // Set initial frosted state if page loads mid-scroll
                if (window.scrollY > 60) chrome.classList.add('chrome--scrolled');
                let lastScrollY = window.scrollY;
                window.addEventListener('scroll', function() {
                    // ไม่ซ่อนแถบขณะเมนูมือถือเปิดอยู่
                    if (navMenu && navMenu.classList.contains('mobile-active')) return;
                    const currentY = window.scrollY;
                    if (currentY <= 0) {
                        chrome.classList.remove('nav-hidden');
                    } else if (currentY > lastScrollY && currentY > 80) {
                        chrome.classList.add('nav-hidden');
                    } else if (currentY < lastScrollY) {
                        chrome.classList.remove('nav-hidden');
                    }
                    // SpaceX/Tesla scroll-aware: transparent at top, frosted when scrolled
                    chrome.classList.toggle('chrome--scrolled', currentY > 60);
                    lastScrollY = currentY;
                }, { passive: true });
            })();

            // --- category-nav ---
            (function() {
                var p = window.location.pathname;
                if (p === '/' || p === '/index.html' || p === '/pages/about.html') return; // homepage + about: never inject

                var CAT_LINKS = [
                    {text: 'กะลาม',           href: '/pages/kalam.html'},
                    {text: 'หะดีษ',           href: '/pages/hadith.html'},
                    {text: 'ประวัติศาสตร์',   href: '/pages/history.html'},
                    {text: 'นิติศาสตร์',      href: '/pages/nitisart.html'},
                    {text: 'หัจญ์ & อุมเราะฮ์', href: '/pages/hajj.html'},
                    {text: 'เครื่องมือ',      href: '/pages/tools.html'}
                ];

                // Inject ☰ button before search button
                var searchBtn = document.getElementById('searchToggleBtn');
                if (searchBtn) {
                    var catBtn = document.createElement('button');
                    catBtn.className = 'chrome-icon-btn cat-nav-btn';
                    catBtn.id = 'catNavBtn';
                    catBtn.setAttribute('aria-label', 'หมวดหมู่');
                    catBtn.title = 'หมวดหมู่';
                    catBtn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>';
                    searchBtn.insertAdjacentElement('beforebegin', catBtn);
                }

                // Inject dropdown inside .chrome
                var chrome = document.querySelector('.chrome');
                if (chrome) {
                    var dd = document.createElement('div');
                    dd.id = 'catNavDropdown';
                    dd.className = 'cat-nav-dropdown';
                    var linksHtml = CAT_LINKS.map(function(l) {
                        return '<a class="cat-nav-link" href="' + l.href + '">' + l.text + '</a>';
                    }).join('');
                    dd.innerHTML = '<div class="cat-nav-links">' + linksHtml + '</div>';
                    chrome.appendChild(dd);
                }

                // Inject mobile tab + panel + overlay after header-placeholder
                var hp = document.getElementById('header-placeholder');
                if (hp) {
                    var overlay = document.createElement('div');
                    overlay.id = 'catNavOverlay';

                    var panelLinksHtml = '<a class="cat-panel-link" href="/index.html">หน้าแรก</a>' +
                        CAT_LINKS.map(function(l) {
                        return '<a class="cat-panel-link" href="' + l.href + '">' + l.text + '</a>';
                    }).join('');
                    var panel = document.createElement('div');
                    panel.id = 'catNavPanel';
                    panel.setAttribute('role', 'dialog');
                    panel.setAttribute('aria-label', 'หมวดหมู่');
                    panel.innerHTML = '<button class="cat-panel-close" id="catPanelClose" aria-label="ปิด">×</button>' +
                        '<div class="cat-panel-header">หมวดหมู่</div>' + panelLinksHtml;

                    var tab = document.createElement('button');
                    tab.id = 'catNavTab';
                    tab.setAttribute('aria-label', 'หมวดหมู่');
                    tab.textContent = 'หมวดหมู่';

                    hp.after(overlay);
                    hp.after(panel);
                    hp.after(tab);
                }

                // Mark active page
                var cp = window.location.pathname;
                document.querySelectorAll('.cat-nav-link, .cat-panel-link').forEach(function(a) {
                    try { if (new URL(a.href, location.origin).pathname === cp) a.classList.add('cat-active'); } catch(e) {}
                });

                /* category-nav-desktop */
                if (window.matchMedia('(min-width: 768px)').matches) {
                    var btn      = document.getElementById('catNavBtn');
                    var dropdown = document.getElementById('catNavDropdown');
                    if (btn && dropdown) {
                        btn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            dropdown.classList.toggle('open');
                        });
                        document.addEventListener('click', function(e) {
                            if (dropdown.classList.contains('open') &&
                                !dropdown.contains(e.target) && e.target !== btn) {
                                dropdown.classList.remove('open');
                            }
                        });
                    }
                }

                /* category-nav-mobile */
                if (window.matchMedia('(max-width: 767px)').matches) {
                    var mTab     = document.getElementById('catNavTab');
                    var mPanel   = document.getElementById('catNavPanel');
                    var mOverlay = document.getElementById('catNavOverlay');
                    var mClose   = document.getElementById('catPanelClose');
                    function openPanel()  { if (mPanel) mPanel.classList.add('open'); if (mOverlay) mOverlay.classList.add('open'); }
                    function closePanel() { if (mPanel) mPanel.classList.remove('open'); if (mOverlay) mOverlay.classList.remove('open'); }
                    if (mTab)     mTab.addEventListener('click', openPanel);
                    if (mClose)   mClose.addEventListener('click', closePanel);
                    if (mOverlay) mOverlay.addEventListener('click', closePanel);
                }
            })();

            // --- ซ่อนลิงก์ "หน้าแรก" เมื่ออยู่บนหน้าแรกเอง ---
            (function() {
                var p = window.location.pathname;
                if (p === '/' || p === '/index.html') {
                    var home = document.querySelector('.nav-item.nav-home');
                    if (home) home.style.display = 'none';
                }
            })();

            // --- ปรับ nav บนหน้าที่ไม่ใช่ index: ซ่อน "เกี่ยวกับเรา", ย่อ "เครื่องมือ" ---
            (function() {
                var p = window.location.pathname;
                var isIndex = (p === '/' || p === '/index.html');
                if (!isIndex) {
                    var about = document.querySelector('.nav-item.nav-about');
                    if (about) about.style.display = 'none';
                    var tools = document.querySelector('.nav-item.nav-tools');
                    if (tools) tools.textContent = 'เครื่องมือ';
                }
            })();

            // --- ระบบไฮไลท์เมนูอัตโนมัติ (ปรับปรุงความปลอดภัย) ---
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.nav-item');
            navLinks.forEach(link => {
                try {
                    if (link.hostname === window.location.hostname) {
                        const linkPath = new URL(link.href).pathname;
                        if (currentPath === linkPath || (currentPath === '/' && linkPath === '/index.html')) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    }
                } catch (e) {
                    console.error("เมนูไฮไลท์คลาดเคลื่อน:", e);
                }
            });

            // --- ระบบเวลาและปฏิทินสามระบบอัตโนมัติ (BKK Time & Tri-Calendar) ---
            (function tick(attempts) {
                const el = document.getElementById('liveTime');
                if (el) {
                    // Construct formatter once; Hijri year is cached (changes at most once per day)
                    let hijriYearStr = 'ฮ.ศ. 1447';
                    try {
                        const hijriFormatter = new Intl.DateTimeFormat('th-TH-u-ca-islamic-umalqura', { year: 'numeric' });
                        hijriYearStr = hijriFormatter.format(new Date());
                    } catch (e) {}
                    function upd() {
                        const d = new Date();
                        const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        const adYear = d.getFullYear();
                        const beYear = adYear + 543;
                        el.textContent = `BKK ${timeStr} · พ.ศ. ${beYear} · ค.ศ. ${adYear} · ${hijriYearStr}`;
                    }
                    upd();
                    setInterval(upd, 1000);
                } else if (attempts < 50) {
                    setTimeout(function() { tick(attempts + 1); }, 100);
                }
            })(0);

            // ==========================================
            // 🔎 ระบบสืบค้นข้อมูลบทความวิชาการ (Search Engine) 🔎
            // ==========================================
            const searchToggleBtn = document.getElementById('searchToggleBtn');
            const searchOverlay = document.getElementById('searchOverlay');
            const searchCloseBtn = document.getElementById('searchCloseBtn');
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            const inlineSearchInput = document.getElementById('inlineSearchInput');
            const inlineDropdown = document.getElementById('inlineSearchDropdown');

            let initialSearchResultsHTML = '';
            if (searchResults) {
                initialSearchResultsHTML = searchResults.innerHTML;
            }

            let articlesData = null;

            // Preload articles index immediately when header mounts
            articlesPromise.then(function(data) { articlesData = data; });

            // ฟังก์ชันเปิดการแสดงผลการค้นหา (Open Modal)
            function openSearch() {
                if (searchOverlay) {
                    searchOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    setTimeout(() => { if (searchInput) searchInput.focus(); }, 100);
                }
            }

            // ฟังก์ชันปิดการแสดงผลการค้นหา (Close Modal)
            function closeSearch() {
                if (searchOverlay) {
                    searchOverlay.classList.remove('active');
                    document.body.style.overflow = ''; // คืนค่าการเลื่อนหน้าจอ
                    if (searchInput) {
                        searchInput.value = ''; // เคลียร์ข้อความ
                    }
                    resetSearchResults();
                }
            }

            // รีเซ็ตการแสดงผลช่องค้นหาเริ่มต้น
            function resetSearchResults() {
                if (searchResults) {
                    searchResults.innerHTML = initialSearchResultsHTML || `
                        <div class="search-empty-state">
                            <span class="empty-icon">📖</span>
                            <p>พิมพ์คีย์เวิร์ดเพื่อค้นหาผลงานแปลและบทวิเคราะห์ในระบบ</p>
                            <span class="keyboard-tip">หรือกดปุ่ม <code>/</code> บนคีย์บอร์ดเพื่อเปิดการค้นหาได้ทันที</span>
                        </div>`;
                }
            }

            // ผูกเหตุการณ์ปุ่มเปิด-ปิด
            if (searchToggleBtn) {
                searchToggleBtn.addEventListener('click', openSearch);
            }
            if (searchCloseBtn) {
                searchCloseBtn.addEventListener('click', closeSearch);
            }
            if (searchOverlay) {
                searchOverlay.addEventListener('click', function(e) {
                    if (e.target === searchOverlay) {
                        closeSearch();
                    }
                });
            }

            // ผูกเหตุการณ์คีย์บอร์ดสากล (Global Keyboard Shortcuts)
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
                    closeSearch();
                }
                if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    if (window.matchMedia('(min-width: 1024px)').matches && inlineSearchInput) {
                        inlineSearchInput.focus();
                    } else {
                        openSearch();
                    }
                }
            });

            // Shared filter — used by both overlay and inline dropdown
            function getMatches(query) {
                if (!articlesData || !query) return [];
                var q = query.trim().toLowerCase();
                if (q.length === 0) return [];
                return articlesData.filter(function(article) {
                    return article.title.toLowerCase().includes(q) ||
                           article.excerpt.toLowerCase().includes(q) ||
                           article.categoryLabel.toLowerCase().includes(q) ||
                           article.tags.some(function(tag) { return tag.toLowerCase().includes(q); });
                });
            }

            // ฟังก์ชันค้นหาและจับคู่
            function performSearch(query) {
                if (!searchResults) return;

                query = query.trim().toLowerCase();

                if (query.length === 0) {
                    resetSearchResults();
                    return;
                }

                if (!articlesData) {
                    searchResults.innerHTML = `
                        <div class="search-empty-state">
                            <span class="empty-icon">⏳</span>
                            <p>กำลังโหลดคลังข้อมูลวิชาการ...</p>
                        </div>`;
                    return;
                }

                const matches = getMatches(query);
                
                if (matches.length === 0) {
                    searchResults.innerHTML = `
                        <div class="search-empty-state">
                            <span class="empty-icon">🔎</span>
                            <p>ไม่พบผลลัพธ์สำหรับคำว่า "<strong>${escapeHtml(query)}</strong>"</p>
                            <span class="keyboard-tip">กรุณาตรวจสอบตัวสะกดหรือลองใช้คำค้นหาที่กว้างขึ้น</span>
                        </div>`;
                    return;
                }
                
                searchResults.innerHTML = '';
                matches.forEach(article => {
                    const resultItem = document.createElement('a');
                    resultItem.href = article.url;
                    resultItem.className = 'search-result-item';
                    
                    const highlight = (text) => {
                        if (!query) return escapeHtml(text);
                        const index = text.toLowerCase().indexOf(query);
                        if (index === -1) return escapeHtml(text);
                        
                        const before = text.substring(0, index);
                        const match = text.substring(index, index + query.length);
                        const after = text.substring(index + query.length);
                        return `${escapeHtml(before)}<span class="search-highlight">${escapeHtml(match)}</span>${escapeHtml(after)}`;
                    };
                    
                    resultItem.innerHTML = `
                        <div class="search-result-cat-wrapper">
                            <span class="search-result-cat">${escapeHtml(article.categoryLabel)}</span>
                        </div>
                        <h3 class="search-result-title">${highlight(article.title)}</h3>
                        <p class="search-result-excerpt">${highlight(article.excerpt)}</p>
                    `;
                    
                    searchResults.appendChild(resultItem);
                });
            }

            // ฟังก์ชันป้องกัน XSS
            function escapeHtml(str) {
                return str
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }

            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    performSearch(e.target.value);
                });
            }

            // --- Inline search typeahead dropdown ---
            var ddActiveIndex = -1;

            function renderInlineDropdown(query) {
                if (!inlineDropdown) return;
                var q = query.trim();
                if (q.length === 0) {
                    inlineDropdown.classList.remove('open');
                    inlineDropdown.innerHTML = '';
                    ddActiveIndex = -1;
                    return;
                }
                var matches = getMatches(q).slice(0, 6);
                if (matches.length === 0) {
                    inlineDropdown.innerHTML = '<div class="inline-dd-empty">ไม่พบผลลัพธ์สำหรับ "' + escapeHtml(q) + '"</div>';
                    inlineDropdown.classList.add('open');
                    ddActiveIndex = -1;
                    return;
                }
                var totalMatches = getMatches(q).length;
                var items = matches.map(function(a) {
                    return '<a class="inline-dd-item" href="' + escapeHtml(a.url) + '">' +
                           '<span class="inline-dd-cat">' + escapeHtml(a.categoryLabel) + '</span>' +
                           '<span class="inline-dd-title">' + escapeHtml(a.title) + '</span>' +
                           '</a>';
                }).join('');
                var footer = totalMatches > 6
                    ? '<div class="inline-dd-footer">กด Enter เพื่อดูผลทั้งหมด (' + totalMatches + ' รายการ)</div>'
                    : '';
                inlineDropdown.innerHTML = items + footer;
                inlineDropdown.classList.add('open');
                ddActiveIndex = -1;
            }

            function closeInlineDropdown() {
                if (inlineDropdown) {
                    inlineDropdown.classList.remove('open');
                    ddActiveIndex = -1;
                }
            }

            if (inlineSearchInput && inlineDropdown) {
                inlineSearchInput.addEventListener('input', function(e) {
                    renderInlineDropdown(e.target.value);
                });

                inlineSearchInput.addEventListener('keydown', function(e) {
                    var items = inlineDropdown.querySelectorAll('.inline-dd-item');
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        ddActiveIndex = Math.min(ddActiveIndex + 1, items.length - 1);
                        items.forEach(function(el, i) { el.classList.toggle('active', i === ddActiveIndex); });
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        ddActiveIndex = Math.max(ddActiveIndex - 1, -1);
                        items.forEach(function(el, i) { el.classList.toggle('active', i === ddActiveIndex); });
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        if (ddActiveIndex >= 0 && items[ddActiveIndex]) {
                            items[ddActiveIndex].click();
                        } else {
                            if (searchInput) searchInput.value = inlineSearchInput.value;
                            closeInlineDropdown();
                            openSearch();
                            performSearch(inlineSearchInput.value);
                            setTimeout(function() { if (searchInput) searchInput.focus(); }, 120);
                        }
                    } else if (e.key === 'Escape') {
                        closeInlineDropdown();
                        inlineSearchInput.blur();
                    }
                });

                document.addEventListener('click', function(e) {
                    if (!inlineSearchInput.contains(e.target) && !inlineDropdown.contains(e.target)) {
                        closeInlineDropdown();
                    }
                });
            }
        });

    // สั่งโหลดไฟล์ Footer
    fetch('/components/footer.html?v=20260529n')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            
            // --- ระบบปุ่มโชว์ QR Code (ปรับปรุงให้กดติดทันทีในการคลิกแรก) ---
            const supportBtn = document.getElementById('supportToggleBtn');
            const qrBox = document.getElementById('qrBox');
            if (supportBtn && qrBox) {
                supportBtn.addEventListener('click', function() {
                    const currentDisplay = window.getComputedStyle(qrBox).display;
                    if (currentDisplay === "none") {
                        qrBox.style.display = "block";
                    } else {
                        qrBox.style.display = "none";
                    }
                });
            }
        });

    // ==========================================
    // ⭐ 4. ระบบแถบความคืบหน้าการอ่าน (Reading Progress Bar) ⭐
    // ==========================================
    const progressBar = document.getElementById('readingProgressBar');
    if (progressBar) {
        var _scrollTicking = false;
        window.addEventListener('scroll', function() {
            if (!_scrollTicking) {
                _scrollTicking = true;
                requestAnimationFrame(function() {
                    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    progressBar.style.width = (scrollTop / scrollHeight * 100) + '%';
                    var topButton = document.getElementById('backToTopBtn');
                    if (topButton) {
                        topButton.style.setProperty('display', scrollTop > 400 ? 'block' : 'none', 'important');
                    }
                    _scrollTicking = false;
                });
            }
        }, { passive: true });
    }

    // ==========================================
    // ⭐ 5. ระบบสารบัญอัจฉริยะ (Interactive TOC) ⭐
    // ==========================================
    const articleBody = document.querySelector('.article-body');
    const tocNav = document.getElementById('tocNav');
    
    if (articleBody && tocNav) {
        // หาหัวข้อ h2 และ h3 ทั้งหมด
        const headings = articleBody.querySelectorAll('h2, h3');
        if (headings.length > 0) {
            headings.forEach(heading => {
                if (!heading.id) return; // ข้ามถ้าไม่มี id
                
                const link = document.createElement('a');
                link.href = '#' + heading.id;
                link.textContent = heading.textContent;
                link.className = 'toc-link ' + (heading.tagName.toLowerCase() === 'h3' ? 'toc-h3' : 'toc-h2');
                
                // คลิกแล้วเลื่อนแบบ smooth
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById(heading.id).scrollIntoView({ behavior: 'smooth' });
                    // อัปเดต URL hash โดยไม่เลื่อนจอแบบกระตุก
                    history.pushState(null, null, '#' + heading.id);
                });
                
                tocNav.appendChild(link);
            });

            // ใช้ Intersection Observer ตรวจจับว่าอ่านถึงไหน
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -60% 0px',
                threshold: 0
            };

            const tocLinks = tocNav.querySelectorAll('.toc-link');
            
            const headingObserver = new IntersectionObserver(entries => {
                // หารายการที่แสดงบนจอ
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // เอา active ออกจากทุกลิงก์
                        tocLinks.forEach(link => link.classList.remove('toc-active'));
                        // ใส่ active ให้ลิงก์ปัจจุบัน
                        const activeLink = tocNav.querySelector(`a[href="#${entry.target.id}"]`);
                        if (activeLink) {
                            activeLink.classList.add('toc-active');
                        }
                    }
                });
            }, observerOptions);

            headings.forEach(heading => {
                if (heading.id) headingObserver.observe(heading);
            });
        }
    }

    // ── Mouse-follow glow (desktop only) ──
    if (!document.getElementById('ifp-mouse-glow')) {
        var glowEl = document.createElement('div');
        glowEl.id = 'ifp-mouse-glow';
        document.body.insertBefore(glowEl, document.body.firstChild);
    }
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var _glowX = 0, _glowY = 0, _glowTicking = false;
        document.addEventListener('mousemove', function(e) {
            _glowX = e.clientX;
            _glowY = e.clientY;
            if (!_glowTicking) {
                _glowTicking = true;
                requestAnimationFrame(function() {
                    document.body.style.setProperty('--mouse-x', (_glowX / window.innerWidth * 100).toFixed(1) + '%');
                    document.body.style.setProperty('--mouse-y', (_glowY / window.innerHeight * 100).toFixed(1) + '%');
                    _glowTicking = false;
                });
            }
        });
    }

    // ==========================================
    // ⭐ 10. ระบบสร้างรายการบทความจาก articles.json ⭐
    // ==========================================
    (function() {
        var container = document.querySelector('section.idx-list-grid[data-category]');
        if (!container) return;
        var category = container.getAttribute('data-category');
        var paginationEl = document.getElementById('pagination');
        var itemsPerPage = 6;

        function _esc(s) {
            return String(s)
                .replace(/&/g, '&amp;').replace(/</g, '&lt;')
                .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        articlesPromise.then(function(all) {
            var indexed = all.map(function(a, i) { return { a: a, i: i }; });
            var filtered = indexed
                .filter(function(x) {
                    // New schema: categoryKey (slug). Guard against old/malformed data.
                    return x.a && x.a.categoryKey === category;
                })
                .sort(function(x, y) {
                    if (x.a.date > y.a.date) return -1;
                    if (x.a.date < y.a.date) return 1;
                    return x.i - y.i;
                })
                .map(function(x) { return x.a; });

            if (filtered.length === 0) return;

            container.innerHTML = '';
            filtered.forEach(function(art, idx) {
                try {
                    var num = String(idx + 1).padStart(2, '0');
                    var readTime = art.readingTime != null ? art.readingTime : '—';
                    var row = document.createElement('a');
                    row.href = art.url || '#';
                    row.className = 'idx-row';
                    row.innerHTML =
                        '<div class="idx-num">' + num + '</div>' +
                        '<div class="idx-cat">' + _esc(art.categoryLabel || '') + '</div>' +
                        '<div class="idx-title">' + _esc(art.title || '') + '</div>' +
                        '<div class="idx-meta">โดย <span>' + _esc(art.author || '') + '</span>' +
                        ' &nbsp;·&nbsp; ' + _esc(art.dateDisplay || '') +
                        ' &nbsp;·&nbsp; อ่าน ' + readTime + ' นาที</div>' +
                        '<div class="idx-arrow"></div>';
                    container.appendChild(row);
                } catch (e) {
                    console.warn('[IFP] row build error entry ' + idx + ':', e);
                }
            });

            if (!paginationEl || filtered.length <= itemsPerPage) return;

            var rows = Array.from(container.getElementsByClassName('idx-row'));
            var totalPages = Math.ceil(rows.length / itemsPerPage);
            var currentPage = 1;

            function showPage(page) {
                if (page < 1 || page > totalPages) return;
                currentPage = page;
                var start = (page - 1) * itemsPerPage;
                var end = start + itemsPerPage;
                rows.forEach(function(r, i) {
                    r.style.setProperty('display', (i >= start && i < end) ? 'grid' : 'none', 'important');
                });
                renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            function renderPagination() {
                paginationEl.innerHTML = '';
                if (totalPages <= 1) return;
                var prev = document.createElement('button');
                prev.className = 'page-btn';
                prev.innerHTML = '« ก่อนหน้า';
                prev.disabled = currentPage === 1;
                prev.onclick = function() { showPage(currentPage - 1); };
                paginationEl.appendChild(prev);
                for (var p = 1; p <= totalPages; p++) {
                    (function(p) {
                        var btn = document.createElement('button');
                        btn.className = 'page-btn' + (currentPage === p ? ' active' : '');
                        btn.innerText = p;
                        btn.onclick = function() { showPage(p); };
                        paginationEl.appendChild(btn);
                    })(p);
                }
                var next = document.createElement('button');
                next.className = 'page-btn';
                next.innerHTML = 'ถัดไป »';
                next.disabled = currentPage === totalPages;
                next.onclick = function() { showPage(currentPage + 1); };
                paginationEl.appendChild(next);
            }
            showPage(1);
        });
    })();

    // ==========================================
    // ⭐ 11. ระบบ Byline จาก articles.json ⭐
    // ==========================================
    (function() {
        var slug = document.body.getAttribute('data-article-id');
        if (!slug) return;
        var metaEl = document.querySelector('.article-meta');
        if (!metaEl) return;
        articlesPromise.then(function(all) {
            var art = null;
            for (var i = 0; i < all.length; i++) { if (all[i].id === slug) { art = all[i]; break; } }
            if (!art) return;
            function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
            var readTime = art.readingTime != null ? art.readingTime : '—';
            metaEl.innerHTML =
                '<div>โดย <span>' + esc(art.author || '') + '</span></div>' +
                '<div>·</div>' +
                '<div>' + esc(art.dateDisplay || '') + '</div>' +
                '<div>·</div>' +
                '<div>อ่าน ' + readTime + ' นาที</div>';
        });
    })();

    // ==========================================
    // ⭐ 12. ระบบบทความที่เกี่ยวข้องจาก articles.json ⭐
    // ==========================================
    (function() {
        var slug = document.body.getAttribute('data-article-id');
        if (!slug) return;
        var listEl = document.querySelector('.related-section .related-list');
        if (!listEl) return;

        function _esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

        function attachReveal(el) {
            var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
                });
            }, { threshold: 0.1 });
            obs.observe(el);
        }

        articlesPromise.then(function(all) {
            var byId = {};
            all.forEach(function(a) { byId[a.id] = a; });
            var self = byId[slug];
            if (!self) return;

            var picks = (self.related && self.related.length > 0)
                ? self.related.map(function(id) { return byId[id]; }).filter(Boolean)
                : all
                    .filter(function(a) { return a.categoryKey === self.categoryKey && a.id !== slug; })
                    .sort(function(a, b) { return a.date > b.date ? -1 : a.date < b.date ? 1 : 0; })
                    .slice(0, 3);

            listEl.innerHTML = '';
            picks.slice(0, 3).forEach(function(art) {
                var a = document.createElement('a');
                a.href = art.url;
                a.className = 'related-row reveal';
                a.innerHTML =
                    '<span class="related-article-category">' + _esc(art.categoryLabel) + '</span>' +
                    '<h3 class="related-article-title">' + _esc(art.title) + '</h3>' +
                    '<p class="related-article-excerpt">' + _esc(art.excerpt) + '</p>';
                listEl.appendChild(a);
                attachReveal(a);
            });
        });
    })();

    // ==========================================
    // ⭐ 13. Arabic Display Toggle init
    // ==========================================
    (function() {
        document.querySelectorAll('details.ar-toggle').forEach(function(d) {
            d.addEventListener('toggle', _syncArabicBtns);
        });
        _syncArabicBtns();
    })();
});

// ==========================================
// ⭐ 6. ระบบแชร์โซเชียลมีเดีย (Social Share) ⭐
// ==========================================
function shareToFacebook(e) {
    e.preventDefault();
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, 'facebook-share', 'width=580,height=296');
}

function shareToTwitter(e) {
    e.preventDefault();
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, 'twitter-share', 'width=580,height=296');
}

function shareToLine(e) {
    e.preventDefault();
    const url = encodeURIComponent(window.location.href);
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}`, 'line-share', 'width=580,height=500');
}

function copyArticleLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const alertBox = document.getElementById('copyAlert');
        if (alertBox) {
            alertBox.style.display = 'block';
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 2500);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// ==========================================
// ⭐ 7. ระบบเครื่องมือปรับขนาดตัวอักษร (Reading Tools) ⭐
// ==========================================
let currentFontSize = 18;
function changeFontSize(delta) {
    const content = document.getElementById("main-content");
    if (!content) return;
    if (delta === 0) { 
        currentFontSize = 18; 
    } else { 
        currentFontSize += delta; 
    }
    if (currentFontSize < 14) currentFontSize = 14;
    if (currentFontSize > 28) currentFontSize = 28;
    content.style.fontSize = currentFontSize + "px";
    updateFontButtons();
}
// Reflect the active font-size step on the reading-tools buttons (shared template)
function updateFontButtons() {
    const btns = document.querySelectorAll('.btn-tool[onclick*="changeFontSize"]');
    btns.forEach(function(b) {
        const m = (b.getAttribute('onclick') || '').match(/changeFontSize\((-?\d+)\)/);
        const d = m ? parseInt(m[1], 10) : 0;
        const isActive = (currentFontSize === 18 && d === 0) ||
                         (currentFontSize > 18 && d === 2) ||
                         (currentFontSize < 18 && d === -2);
        b.classList.toggle('active', isActive);
    });
}

// ==========================================
// ⭐️ 8. ฟังก์ชันเสริมสำหรับบทความเก่า (Legacy Support) ⭐️
// ==========================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleDarkMode() {
    const isDarkCurrently = document.documentElement.classList.contains('dark-mode');
    const nowDark = !isDarkCurrently;
    applyTheme(nowDark);
    syncDarkButton(nowDark);
}
// Keep the reading-tools Night Mode button label + active state in sync (shared template)
function syncDarkButton(isDark) {
    const legacyBtn = document.getElementById('darkBtn');
    if (legacyBtn) {
        legacyBtn.innerText = isDark ? 'Light Mode ☀️' : 'Night Mode 🌙';
        legacyBtn.classList.toggle('active', isDark);
    }
}

function copyCite() {
    var citationElement = document.getElementById('citation-text') || document.getElementById('citationText');
    if (!citationElement) return;
    navigator.clipboard.writeText(citationElement.innerText).then(function() {
        var alertBox = document.getElementById('copyAlert');
        if (alertBox) {
            alertBox.classList.add('show');
            setTimeout(function() { alertBox.classList.remove('show'); }, 2000);
        } else {
            var btn = document.querySelector('.copy-btn');
            if (btn) {
                var orig = btn.innerText;
                btn.innerText = 'คัดลอกแล้ว ✓';
                setTimeout(function() { btn.innerText = orig; }, 2000);
            }
        }
    });
}
function copyCitation() { copyCite(); }

// ==========================================
// ⭐ Arabic Display Toggle (global panel controls)
// ==========================================
function setArabicDisplay(mode) {
    document.querySelectorAll('details.ar-toggle').forEach(function(d) {
        d.open = (mode === 'show');
    });
    _syncArabicBtns();
}
function _syncArabicBtns() {
    var toggles = Array.from(document.querySelectorAll('details.ar-toggle'));
    var noneOpen = toggles.length === 0 || toggles.every(function(d) { return !d.open; });
    var allOpen = toggles.length > 0 && toggles.every(function(d) { return d.open; });
    var hideBtn = document.getElementById('arabicHideBtn');
    var showBtn = document.getElementById('arabicShowBtn');
    if (hideBtn) hideBtn.classList.toggle('active', noneOpen);
    if (showBtn) showBtn.classList.toggle('active', allOpen);
}

// ==========================================
// ⭐️ 9. ระบบ Click Ripple Effect ระดับเว็บ (Global Click Ripple) ⭐️
// ==========================================
document.addEventListener('click', function(e) {
  var target = e.target.closest('.btn, .cat-card, .tool-card, .idx-row, .read-more-link, .copy-btn, .chrome-icon-btn, .page-btn, .nav-item, #backToTopBtn, #themeToggleBtn, #searchToggleBtn');
  if (!target) return;
  
  var computedStyle = window.getComputedStyle(target);
  if (computedStyle.position === 'static') {
    target.style.position = 'relative';
  }
  if (computedStyle.overflow !== 'hidden' && !target.classList.contains('chrome-icon-btn') && target.id !== 'backToTopBtn') {
    target.style.overflow = 'hidden';
  }
  
  var ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  
  var rect = target.getBoundingClientRect();
  var size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  
  var x = e.clientX - rect.left - size / 2;
  var y = e.clientY - rect.top - size / 2;
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  target.appendChild(ripple);
  
  setTimeout(function() {
    ripple.remove();
  }, 650);
});