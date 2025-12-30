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

    /**
     * Hesabı Tamamla Modal'ını aç
     */
    openHesabıTamamlaModal() {
        // Modal'ın HTML'sini oluştur
        let modal = document.getElementById('hesabıTamamlaModal');
        
        if (!modal) {
            const modalHTML = `
                <div id="hesabıTamamlaModal" class="modal-overlay">
                    <div class="modal-container hesabi-tamamla-modal">
                        <div class="modal-header">
                            <h2>✓ Hesabı Tamamla</h2>
                            <button class="modal-close-btn" onclick="document.getElementById('hesabıTamamlaModal').style.display='none';">&times;</button>
                        </div>
                        <div class="modal-content hesabi-tamamla-content">
                            <!-- Kart 1: Ödeme Bilgileri -->
                            <div class="form-card">
                                <h3 class="form-card-title">Ödeme Bilgileri</h3>
                                <form id="kimlikForm" class="hesabi-tamamla-form">
                                    <div class="form-group">
                                        <label for="tcNo">TC Kimlik No (11 Haneli)</label>
                                        <input type="text" id="tcNo" name="tcNo" placeholder="12345678901" maxlength="11" inputmode="numeric" required>
                                        <span class="form-error" id="tcError"></span>
                                    </div>
                                    <div class="form-group">
                                        <label for="adres">Adres</label>
                                        <textarea id="adres" name="adres" placeholder="Tam adresinizi giriniz..." rows="3" required></textarea>
                                        <span class="form-error" id="adresError"></span>
                                    </div>
                                    <div class="form-group">
                                        <label for="iban">IBAN (26 Haneli)</label>
                                        <input type="text" id="iban" name="iban" placeholder="TR1234567890123456789012345" maxlength="26" required>
                                        <span class="form-error" id="ibanError"></span>
                                    </div>
                                </form>
                            </div>

                            <!-- Kart 2: E-posta Doğrulama -->
                            <div class="form-card">
                                <h3 class="form-card-title">E-posta Doğrulama</h3>
                                <form id="epostaForm" class="hesabi-tamamla-form">
                                    <div class="form-group">
                                        <label for="epostaDogru">E-posta Doğrula</label>
                                        <div class="eposta-verify-group">
                                            <input type="email" id="epostaDogru" name="epostaDogru" placeholder="E-postanız: email@example.com" readonly>
                                            <button type="button" class="btn-verify-code" id="sendCodeBtn">Kod Gönder</button>
                                        </div>
                                        <span class="form-error" id="epostaError"></span>
                                    </div>
                                    <div class="form-group" id="codeInputGroup" style="display: none;">
                                        <label for="verificationCode">Doğrulama Kodu</label>
                                        <input type="text" id="verificationCode" name="verificationCode" placeholder="6 haneli kodu giriniz" maxlength="6" inputmode="numeric">
                                        <button type="button" class="btn-verify-submit" id="verifyCodeBtn">Doğrula</button>
                                        <span class="form-error" id="codeError"></span>
                                    </div>
                                </form>
                            </div>

                            <!-- Action Buttons -->
                            <div class="modal-actions">
                                <button class="btn-cancel" onclick="document.getElementById('hesabıTamamlaModal').style.display='none';">İptal</button>
                                <button class="btn-save" id="saveAccountBtn">Kaydet</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('hesabıTamamlaModal');
            
            // Event listeners ekle
            this.setupHesabıTamamlaEvents();
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

    /**
     * Hesabı Tamamla Modal Event Listeners
     */
    setupHesabıTamamlaEvents() {
        const tcNo = document.getElementById('tcNo');
        const iban = document.getElementById('iban');
        const sendCodeBtn = document.getElementById('sendCodeBtn');
        const verifyCodeBtn = document.getElementById('verifyCodeBtn');
        const saveAccountBtn = document.getElementById('saveAccountBtn');
        const epostaDogru = document.getElementById('epostaDogru');
        const codeInputGroup = document.getElementById('codeInputGroup');

        // Giriş yapan kullanıcının e-postasını göster
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.email) {
                epostaDogru.value = user.email;
            }
        } catch (error) {
            console.error('User bilgisi hatası:', error);
        }

        // TC Kimlik No validasyonu
        if (tcNo) {
            tcNo.addEventListener('blur', () => {
                const value = tcNo.value.trim();
                const tcError = document.getElementById('tcError');
                if (value && (isNaN(value) || value.length !== 11)) {
                    tcError.textContent = '❌ TC Kimlik No 11 haneli olmalıdır ve sadece sayı içermelidir';
                    tcNo.classList.add('input-error');
                } else {
                    tcError.textContent = '';
                    tcNo.classList.remove('input-error');
                }
            });
        }

        // IBAN validasyonu
        if (iban) {
            iban.addEventListener('blur', () => {
                const value = iban.value.trim().toUpperCase();
                const ibanError = document.getElementById('ibanError');
                if (value && value.length !== 26) {
                    ibanError.textContent = '❌ IBAN 26 haneli olmalıdır';
                    iban.classList.add('input-error');
                } else if (value && !value.startsWith('TR')) {
                    ibanError.textContent = '❌ IBAN TR ile başlamalıdır';
                    iban.classList.add('input-error');
                } else {
                    ibanError.textContent = '';
                    iban.classList.remove('input-error');
                }
            });
        }

        // Kod gönder
        if (sendCodeBtn) {
            sendCodeBtn.addEventListener('click', () => {
                console.log('📧 E-posta doğrulama kodu gönderiliyor...');
                sendCodeBtn.textContent = 'Kod Gönderildi ✓';
                sendCodeBtn.disabled = true;
                codeInputGroup.style.display = 'block';
                
                // 60 saniye sonra tekrar gönderme butonunu etkinleştir
                setTimeout(() => {
                    sendCodeBtn.textContent = 'Kod Gönder';
                    sendCodeBtn.disabled = false;
                }, 60000);
            });
        }

        // Kodu doğrula
        if (verifyCodeBtn) {
            verifyCodeBtn.addEventListener('click', () => {
                const code = document.getElementById('verificationCode').value.trim();
                const codeError = document.getElementById('codeError');
                
                if (!code || code.length !== 6) {
                    codeError.textContent = '❌ Lütfen 6 haneli kodu giriniz';
                    return;
                }
                
                console.log('✓ Kod doğrulandı');
                codeError.textContent = '';
                verifyCodeBtn.textContent = 'Doğrulandı ✓';
                verifyCodeBtn.disabled = true;
                document.getElementById('verificationCode').disabled = true;
            });
        }

        // Kaydet
        if (saveAccountBtn) {
            saveAccountBtn.addEventListener('click', () => {
                const tcValue = tcNo.value.trim();
                const adresValue = document.getElementById('adres').value.trim();
                const ibanValue = iban.value.trim().toUpperCase();
                const codeValue = document.getElementById('verificationCode').value.trim();

                // Validasyonlar
                if (!tcValue || tcValue.length !== 11 || isNaN(tcValue)) {
                    alert('❌ Lütfen geçerli bir TC Kimlik No giriniz (11 haneli)');
                    return;
                }
                if (!adresValue) {
                    alert('❌ Lütfen adres giriniz');
                    return;
                }
                if (!ibanValue || ibanValue.length !== 26 || !ibanValue.startsWith('TR')) {
                    alert('❌ Lütfen geçerli bir IBAN giriniz (26 haneli, TR ile başlayan)');
                    return;
                }
                if (!codeValue || codeValue.length !== 6) {
                    alert('❌ Lütfen e-postanızı doğrulayın');
                    return;
                }

                console.log('💾 Hesap bilgileri kaydediliyor:', { tcValue, adresValue, ibanValue });
                alert('✅ Hesap bilgileri başarıyla kaydedildi!');
                document.getElementById('hesabıTamamlaModal').style.display = 'none';
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
