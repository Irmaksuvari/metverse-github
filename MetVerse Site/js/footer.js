/**
 * Footer Manager - Dinamik Footer Yönetimi
 * - Tüm sayfalarda tutarlı footer gösterimi
 */

class FooterManager {
    constructor() {
        this.loadFooter();
    }

    /**
     * Footer HTML'ini includes/footer.html'den yükle
     */
    async loadFooter() {
        try {
            const response = await fetch('/includes/footer.html');
            if (!response.ok) {
                console.warn('⚠️ Footer dosyası yüklenemedi');
                return;
            }

            const footerHTML = await response.text();
            const footerContainer = document.getElementById('footer-container');
            
            if (footerContainer) {
                footerContainer.innerHTML = footerHTML;
                console.log('✅ Footer yüklendi');
            } else {
                console.warn('⚠️ footer-container elementi bulunamadı');
            }
        } catch (error) {
            console.warn('⚠️ Footer yükleme hatası:', error);
        }
    }
}

// Sayfa yüklendiğinde Footer'ı başlat
document.addEventListener('DOMContentLoaded', () => {
    new FooterManager();
});
