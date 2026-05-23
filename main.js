// ==========================================
// â­ï¸ 1. à¸£à¸°à¸šà¸š Google Analytics â­ï¸
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
// â­ï¸ 2. à¸£à¸°à¸šà¸šà¸ˆà¸±à¸”à¸à¸²à¸£à¸˜à¸µà¸¡à¸¡à¸·à¸”/à¸ªà¸§à¹ˆà¸²à¸‡à¸žà¸£à¸µà¹€à¸¡à¸µà¸¢à¸¡ (Dark Mode Controller) â­ï¸
// ==========================================
// à¸™à¸´à¸¢à¸²à¸¡à¹„à¸­à¸„à¸­à¸™ SUN (à¸žà¸£à¸°à¸­à¸²à¸—à¸´à¸•à¸¢à¹Œ) à¹à¸¥à¸° MOON (à¸žà¸£à¸°à¸ˆà¸±à¸™à¸—à¸£à¹Œ) à¹€à¸žà¸·à¹ˆà¸­à¹ƒà¸Šà¹‰à¸ªà¸¥à¸±à¸šà¸šà¸™à¸›à¸¸à¹ˆà¸¡
const sunIcon = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0-7a1 1 0 0 1 .993.883L13 3v1a1 1 0 0 1-1.993.117L11 4V3a1 1 0 0 1 1-1zm0 17a1 1 0 0 1 .993.883L13 21v1a1 1 0 0 1-1.993.117L11 22v-1a1 1 0 0 1 1-1zM4.22 4.22a1 1 0 0 1 1.32-.083l.094.083 1.414 1.414a1 1 0 0 1-1.32 1.497l-.094-.083-1.414-1.414a1 1 0 0 1 0-1.414zm12.728 12.728a1 1 0 0 1 1.32-.083l.094.083 1.414 1.414a1 1 0 0 1-1.32 1.497l-.094-.083-1.414-1.414a1 1 0 0 1 0-1.414zM3 11a1 1 0 0 1 .117 1.993L3 13H2a1 1 0 0 1-.117-1.993L2 11h1zm19 0a1 1 0 0 1 .117 1.993L22 13h-1a1 1 0 0 1-.117-1.993L21 11h1zM5.636 16.95a1 1 0 0 1 .083 1.32l-.083.094-1.414 1.414a1 1 0 0 1-1.497-1.32l.083-.094 1.414-1.414a1 1 0 0 1 1.414 0zm12.728-12.728a1 1 0 0 1 .083 1.32l-.083.094-1.414 1.414a1 1 0 0 1-1.497-1.32l.083-.094 1.414-1.414a1 1 0 0 1 1.414 0z"/></svg>`;
const moonIcon = `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z"/></svg>`;

// à¸”à¸¶à¸‡à¸à¸²à¸£à¸•à¸±à¹‰à¸‡à¸„à¹ˆà¸²à¸˜à¸µà¸¡à¸à¹ˆà¸­à¸™à¸«à¸™à¹‰à¸²à¸™à¸µà¹‰à¸ˆà¸²à¸ LocalStorage à¸«à¸£à¸·à¸­à¸­à¹‰à¸²à¸‡à¸­à¸´à¸‡à¸•à¸²à¸¡à¸˜à¸µà¸¡à¹€à¸£à¸´à¹ˆà¸¡à¸•à¹‰à¸™à¸‚à¸­à¸‡à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸œà¸¹à¹‰à¹ƒà¸Šà¹‰à¸‡à¸²à¸™
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDarkModeActive = savedTheme === 'dark' || (!savedTheme && prefersDark);

// à¸Ÿà¸±à¸‡à¸à¹Œà¸Šà¸±à¸™à¸›à¸£à¸±à¸šà¹ƒà¸Šà¹‰à¸˜à¸µà¸¡à¹ƒà¸™à¸£à¸°à¸”à¸±à¸šà¸ªà¸¹à¸‡
function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
    // à¸­à¸±à¸›à¹€à¸”à¸•à¹„à¸­à¸„à¸­à¸™à¸›à¸¸à¹ˆà¸¡à¸ªà¸¥à¸±à¸šà¹€à¸¡à¸·à¹ˆà¸­à¸£à¸±à¸™à¹‚à¸„à¹‰à¸”
    updateThemeIcon(isDark);
}

// à¸­à¸±à¸›à¹€à¸”à¸•à¸£à¸¹à¸›à¸¥à¸±à¸à¸©à¸“à¹Œà¸‚à¸­à¸‡à¸›à¸¸à¹ˆà¸¡à¸ªà¸¥à¸±à¸šà¸˜à¸µà¸¡
function updateThemeIcon(isDark) {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.innerHTML = isDark ? sunIcon : moonIcon;
    }
}

// à¸ªà¸±à¹ˆà¸‡à¸£à¸±à¸™à¸˜à¸µà¸¡à¹€à¸šà¸·à¹‰à¸­à¸‡à¸•à¹‰à¸™à¸—à¸±à¸™à¸—à¸µà¸à¹ˆà¸­à¸™ DOM à¹‚à¸«à¸¥à¸”à¹€à¸•à¹‡à¸¡à¸—à¸µà¹ˆà¹€à¸žà¸·à¹ˆà¸­à¸¥à¸”à¸„à¸§à¸²à¸¡à¸à¸°à¸žà¸£à¸´à¸š
applyTheme(isDarkModeActive);

// ==========================================
// â­ï¸ 3. à¸£à¸°à¸šà¸šà¸›à¸£à¸°à¸à¸­à¸šà¸£à¹ˆà¸²à¸‡ Header / Footer â­ï¸
// ⭐ 3. ระบบประกอบร่าง Header / Footer ⭐
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    
    // โหลดธีมและปุ่มไอคอนใหม่หลังจาก DOM โหลดแล้ว
    updateThemeIcon(document.documentElement.classList.contains('dark-mode'));

    // สั่งโหลดไฟล์ Header
    fetch('/components/header.html')
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const decoder = new TextDecoder('utf-8');
            const data = decoder.decode(buffer);
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

            // --- ระบบปุ่มเมนูมือถือ (Hamburger) ---
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navMenu = document.getElementById('navMenu');
            if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.addEventListener('click', function() {
                    navMenu.classList.toggle('mobile-active');
                    mobileMenuBtn.innerHTML = navMenu.classList.contains('mobile-active') ? '✖' : '☰';
                });
            }

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
            (function tick() {
                const el = document.getElementById('liveTime');
                if (el) {
                    function upd() {
                        const d = new Date();
                        const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                        const adYear = d.getFullYear();
                        const beYear = adYear + 543;
                        let hijriYear = "ฮ.ศ. 1447";
                        try {
                            const hijriFormatter = new Intl.DateTimeFormat('th-TH-u-ca-islamic-umalqura', { year: 'numeric' });
                            hijriYear = hijriFormatter.format(d);
                        } catch (e) {
                            console.error("Hijri formatting error:", e);
                        }
                        el.textContent = `BKK ${timeStr} · พ.ศ. ${beYear} · ค.ศ. ${adYear} · ${hijriYear}`;
                    }
                    upd();
                    setInterval(upd, 1000);
                } else {
                    setTimeout(tick, 100);
                }
            })();

            // ==========================================
            // 🔎 ระบบสืบค้นข้อมูลบทความวิชาการ (Search Engine) 🔎
            // ==========================================
            const searchToggleBtn = document.getElementById('searchToggleBtn');
            const searchOverlay = document.getElementById('searchOverlay');
            const searchCloseBtn = document.getElementById('searchCloseBtn');
            const searchInput = document.getElementById('searchInput');
            const searchResults = document.getElementById('searchResults');
            
            let initialSearchResultsHTML = '';
            if (searchResults) {
                initialSearchResultsHTML = searchResults.innerHTML;
            }
            
            let articlesData = null; // เก็บข้อมูลบทความจาก JSON

            // ฟังก์ชันเปิดการแสดงผลการค้นหา (Open Modal)
            function openSearch() {
                if (searchOverlay) {
                    searchOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden'; // ล็อกหน้าจอด้านหลัง
                    setTimeout(() => {
                        if (searchInput) searchInput.focus();
                    }, 100);
                    
                    // ดึงข้อมูล articles.json แบบ Lazy Loading (ดึงครั้งแรกเมื่อกดเปิด)
                    if (!articlesData) {
                        fetch('/articles.json')
                            .then(res => res.arrayBuffer())
                            .then(buffer => {
                                const decoder = new TextDecoder('utf-8');
                                const jsonText = decoder.decode(buffer);
                                articlesData = JSON.parse(jsonText);
                                if (searchInput && searchInput.value.trim().length > 0) {
                                    performSearch(searchInput.value);
                                }
                            })
                            .catch(err => {
                                console.error("ผิดพลาดในการโหลดคลังข้อมูล:", err);
                                if (searchResults) {
                                    searchResults.innerHTML = `
                                        <div class="search-empty-state">
                                            <span class="empty-icon">⚠️</span>
                                            <p>ไม่สามารถโหลดคลังข้อมูลการค้นหาได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง</p>
                                        </div>`;
                                }
                            });
                    }
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
                    openSearch();
                }
            });

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
                
                const matches = articlesData.filter(article => {
                    const titleMatch = article.title.toLowerCase().includes(query);
                    const excerptMatch = article.excerpt.toLowerCase().includes(query);
                    const categoryMatch = article.category.toLowerCase().includes(query);
                    const tagsMatch = article.tags.some(tag => tag.toLowerCase().includes(query));
                    return titleMatch || excerptMatch || categoryMatch || tagsMatch;
                });
                
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
                            <span class="search-result-cat">${escapeHtml(article.category)}</span>
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
        });

    // สั่งโหลดไฟล์ Footer
    fetch('/components/footer.html')
        .then(response => response.arrayBuffer())
        .then(buffer => {
            const decoder = new TextDecoder('utf-8');
            const data = decoder.decode(buffer);
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
    // â­ï¸ 4. à¸£à¸°à¸šà¸šà¹à¸–à¸šà¸„à¸§à¸²à¸¡à¸„à¸·à¸šà¸«à¸™à¹‰à¸²à¸à¸²à¸£à¸­à¹ˆà¸²à¸™ (Reading Progress Bar) â­ï¸
    // ==========================================
    const progressBar = document.getElementById('readingProgressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + "%";
        const topButton = document.getElementById('backToTopBtn');
        if (topButton) {
            if (scrollTop > 400) {
                topButton.style.setProperty('display', 'block', 'important');
            } else {
                topButton.style.setProperty('display', 'none', 'important');
            }
        }
        });
    }

    // ==========================================
    // â­ï¸ 5. à¸£à¸°à¸šà¸šà¸ªà¸²à¸£à¸šà¸±à¸à¸­à¸±à¸ˆà¸‰à¸£à¸´à¸¢à¸° (Interactive TOC) â­ï¸
    // ==========================================
    const articleBody = document.querySelector('.article-body');
    const tocNav = document.getElementById('tocNav');
    
    if (articleBody && tocNav) {
        // à¸«à¸²à¸«à¸±à¸§à¸‚à¹‰à¸­ h2 à¹à¸¥à¸° h3 à¸—à¸±à¹‰à¸‡à¸«à¸¡à¸”
        const headings = articleBody.querySelectorAll('h2, h3');
        if (headings.length > 0) {
            headings.forEach(heading => {
                if (!heading.id) return; // à¸‚à¹‰à¸²à¸¡à¸–à¹‰à¸²à¹„à¸¡à¹ˆà¸¡à¸µ id
                
                const link = document.createElement('a');
                link.href = '#' + heading.id;
                link.textContent = heading.textContent;
                link.className = 'toc-link ' + (heading.tagName.toLowerCase() === 'h3' ? 'toc-h3' : 'toc-h2');
                
                // à¸„à¸¥à¸´à¸à¹à¸¥à¹‰à¸§à¹€à¸¥à¸·à¹ˆà¸­à¸™à¹à¸šà¸š smooth
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById(heading.id).scrollIntoView({ behavior: 'smooth' });
                    // à¸­à¸±à¸›à¹€à¸”à¸• URL hash à¹‚à¸”à¸¢à¹„à¸¡à¹ˆà¹€à¸¥à¸·à¹ˆà¸­à¸™à¸ˆà¸­à¹à¸šà¸šà¸à¸£à¸°à¸•à¸¸à¸
                    history.pushState(null, null, '#' + heading.id);
                });
                
                tocNav.appendChild(link);
            });

            // à¹ƒà¸Šà¹‰ Intersection Observer à¸•à¸£à¸§à¸ˆà¸ˆà¸±à¸šà¸§à¹ˆà¸²à¸­à¹ˆà¸²à¸™à¸–à¸¶à¸‡à¹„à¸«à¸™
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -60% 0px',
                threshold: 0
            };

            const tocLinks = tocNav.querySelectorAll('.toc-link');
            
            const headingObserver = new IntersectionObserver(entries => {
                // à¸«à¸²à¸£à¸²à¸¢à¸à¸²à¸£à¸—à¸µà¹ˆà¹à¸ªà¸”à¸‡à¸šà¸™à¸ˆà¸­
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // à¹€à¸­à¸² active à¸­à¸­à¸à¸ˆà¸²à¸à¸—à¸¸à¸à¸¥à¸´à¸‡à¸à¹Œ
                        tocLinks.forEach(link => link.classList.remove('toc-active'));
                        // à¹ƒà¸ªà¹ˆ active à¹ƒà¸«à¹‰à¸¥à¸´à¸‡à¸à¹Œà¸›à¸±à¸ˆà¸ˆà¸¸à¸šà¸±à¸™
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
});

// ==========================================
// â­ï¸ 6. à¸£à¸°à¸šà¸šà¹à¸Šà¸£à¹Œà¹‚à¸‹à¹€à¸Šà¸µà¸¢à¸¥à¸¡à¸µà¹€à¸”à¸µà¸¢ (Social Share) â­ï¸
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
// â­ï¸ 7. à¸£à¸°à¸šà¸šà¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸¡à¸·à¸­à¸›à¸£à¸±à¸šà¸‚à¸™à¸²à¸”à¸•à¸±à¸§à¸­à¸±à¸à¸©à¸£ (Reading Tools) â­ï¸
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
}

// ==========================================
// ⭐️ 8. ฟังก์ชันเสริมสำหรับบทความเก่า (Legacy Support) ⭐️
// ==========================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleDarkMode() {
    const isDarkCurrently = document.documentElement.classList.contains('dark-mode');
    applyTheme(!isDarkCurrently);
    const legacyBtn = document.getElementById('darkBtn');
    if (legacyBtn) {
        legacyBtn.innerText = !isDarkCurrently ? 'Light Mode ☀️' : 'Night Mode 🌙';
    }
}

function copyCitation() {
    const citationElement = document.getElementById('citationText');
    if (!citationElement) return;
    const copyText = citationElement.innerText;
    navigator.clipboard.writeText(copyText).then(function() {
        const btn = document.querySelector('.copy-btn');
        if (btn) {
            const originalText = btn.innerText;
            btn.innerText = 'คัดลอกแล้ว ✓';
            setTimeout(function(){ btn.innerText = originalText; }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
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


