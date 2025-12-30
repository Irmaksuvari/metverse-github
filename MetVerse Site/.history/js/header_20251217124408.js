/**
 * Header Manager - Dinamik Header Yönetimi
 * - Misafir Header (Giriş Yapılı Değilse)
 * - Influencer Header (Giriş Yapılı İse)
 */

class HeaderManager {
    constructor() {
        this.loadHeader();
        this.setupHeaderLogic();
    }

    /**
     * Header HTML'ini includes/header.html'den yükle
     */
    async loadHeader() {
        try {
            const response = await fetch('/includes/header.html');
            if (!response.ok) {
                console.warn('⚠️ Header dosyası yüklenemedi, varsayılan header kullanılıyor');
                return;
            }

            const headerHTML = await response.text();
            const headerContainer = document.getElementById('header-container');
            
            if (headerContainer) {
                headerContainer.innerHTML = headerHTML;
                
                // Header yüklendikten sonra logic'i kur
                setTimeout(() => {
                    this.setupHeaderLogic();
                    this.updateHeaderView();
                }, 0);
            }
        } catch (error) {
            console.warn('⚠️ Header yükleme hatası:', error);
        }
    }

    /**
     * Header elemanlarını kur (toggle menü, profil dropdown, vb.)
     */
    setupHeaderLogic() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const navOverlay = document.getElementById('navOverlay');
        const profileBtn = document.getElementById('profileBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');
        const navMenuItems = document.querySelectorAll('.nav-menu-item');
        const logoWrapper = document.querySelector('.logo-wrapper');

        // Menüyü ve overlay'i başlangıçta kapalı yap
        if (navMenu) navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');

        // Toggle Menü
        if (menuToggle && navMenu && navOverlay) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                navOverlay.classList.toggle('active');
                if (logoWrapper) logoWrapper.classList.toggle('logo-expanded');
            });

            // Overlay'e tıklanırsa menüyü kapat
            navOverlay.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navOverlay.classList.remove('active');
                if (logoWrapper) logoWrapper.classList.remove('logo-expanded');
            });

            // Menü öğelerine tıklanırsa menüyü kapat
            navMenuItems.forEach(item => {
                item.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navOverlay.classList.remove('active');
                    if (logoWrapper) logoWrapper.classList.remove('logo-expanded');
                });
            });
        }

        // Profil Dropdown (Giriş Yapılı Modu)
        if (profileBtn && dropdownMenu) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.style.display = 
                    dropdownMenu.style.display === 'none' ? 'block' : 'none';
            });

            // Dropdown dışına tıklanırsa kapat
            document.addEventListener('click', (e) => {
                if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.style.display = 'none';
                }
            });
        }

        // Logout Butonu
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        await fetch('/api/logout', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                } catch (error) {
                    console.error('Logout hatası:', error);
                }

                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
            });
        }

        // Hesabı Tamamla Butonu
        const hesabıTamamlaBtn = document.getElementById('hesabıTamamlaBtn');
        if (hesabıTamamlaBtn) {
            hesabıTamamlaBtn.addEventListener('click', () => {
                console.log('✓ Hesabı Tamamla modal açılıyor...');
                this.openHesabıTamamlaModal();
                
                // Dropdown'u kapat
                if (dropdownMenu) {
                    dropdownMenu.style.display = 'none';
                }
            });
        }

        // Bağlantılar Butonu
        const baglantilarBtn = document.getElementById('baglantilarBtn');
        if (baglantilarBtn) {
            baglantilarBtn.addEventListener('click', () => {
                console.log('🔗 Bağlantılar modal açılıyor...');
                this.openBaglantilarModal();
                
                // Dropdown'u kapat
                if (dropdownMenu) {
                    dropdownMenu.style.display = 'none';
                }
            });
        }
    }

    /**
     * Header görünümünü güncelle (Misafir vs. Influencer)
     */
    updateHeaderView() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const generalNav = document.getElementById('general-nav-actions');
        const userNav = document.getElementById('user-nav-actions');
        const authenticatedNav = document.getElementById('authenticatedNav');

        if (token && user) {
            // Giriş yapılı: Influencer header
            if (generalNav) generalNav.style.display = 'none';
            if (userNav) userNav.style.display = 'flex';
            if (authenticatedNav) authenticatedNav.style.display = 'flex';

            // Kullanıcı bilgilerini doldur
            try {
                const userData = JSON.parse(user);
                const userNameEl = document.getElementById('userName');
                const userEmailEl = document.getElementById('userEmail');
                const displayUserNameEl = document.getElementById('displayUserName');

                if (userNameEl) userNameEl.textContent = userData.adSoyad || 'Kullanıcı';
                if (userEmailEl) userEmailEl.textContent = userData.email || '';
                if (displayUserNameEl) displayUserNameEl.textContent = userData.adSoyad || 'Kullanıcı';
            } catch (error) {
                console.warn('User bilgisi parse hatası:', error);
            }
        } else {
            // Çıkış yapılı: Misafir header
            if (generalNav) generalNav.style.display = 'flex';
            if (userNav) userNav.style.display = 'none';
            if (authenticatedNav) authenticatedNav.style.display = 'none';
        }
    }

    /**
     * Bağlantılar Modal'ını aç
     */
    openBaglantilarModal() {
        // Modal'ın HTML'sini oluştur
        let modal = document.getElementById('baglantilarModal');
        
        if (!modal) {
            const modalHTML = `
                <div id="baglantilarModal" class="modal-overlay">
                    <div class="modal-container baglantilar-modal">
                        <div class="modal-header">
                            <h2>🔗 Bağlantılar</h2>
                            <button class="modal-close-btn" onclick="document.getElementById('baglantilarModal').style.display='none';">&times;</button>
                        </div>
                        <div class="modal-content baglantilar-content">
                            <p>Bağlantılar içeriği buraya gelecek...</p>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('baglantilarModal');
        }
        
        // Modal'ı göster
        if (modal) {
            modal.style.display = 'flex';
            
            // Overlay'e tıklanırsa modal'ı kapat
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
}

// Scroll Event Listener - Header opaklaş/transparan
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav.main-header');
    if (nav) {
        if (window.scrollY > 50) {
            // Sayfayı scroll yapınca background color ekle
            nav.style.backgroundColor = 'rgba(4, 0, 29, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        } else {
            // Scroll top'a döndüğünde transparent yap
            nav.style.backgroundColor = 'transparent';
            nav.style.backdropFilter = 'none';
            nav.style.boxShadow = 'none';
        }
    }
});

// Sayfa yüklendiğinde header manager'ı başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeaderManager();
    });
} else {
    new HeaderManager();
}
