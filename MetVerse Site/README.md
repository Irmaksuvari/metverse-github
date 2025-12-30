# MetVerse - Influencer & Brand Collaboration Platform

## 🚀 Proje Kurulumu

### Gereksinimler
- Node.js (v14+)
- npm veya yarn

### Kurulum Adımları

1. **Bağımlılıkları yükle:**
```bash
npm install
```

2. **Sunucuyu başlat:**
```bash
npm start
```

3. **Tarayıcıda aç:**
```
http://localhost:3000
```

---

## 📁 Proje Yapısı

```
MetVerse Site/
├── index.html              # Ana sayfa
├── kayit_secim.html        # Kayıt seçim sayfası (Marka/Influencer)
├── marka_kayit.html        # Marka kayıt formu
├── influencer_kayit.html   # Influencer kayıt formu
├── server.js               # Express.js sunucu
├── styles.css              # Ana stil dosyası
├── package.json            # NPM yapılandırması
├── loggo.png               # Logo
├── bgVideo.mp4             # Hero arka plan videosu
└── ikincibgVideo.mp4       # Trust section arka plan videosu
```

---

## 🛣️ Rotalar (Routes)

### Frontend Sayfaları
- `GET /` → Ana sayfa (index.html)
- `GET /kayit-secim` → Kayıt seçim sayfası
- `GET /marka-kayit` → Marka kayıt formu
- `GET /influencer-kayit` → Influencer kayıt formu

### API Endpoints
- `POST /api/kayit` → Kayıt formu submit

---

## 🎨 Tasarım Sistemi

### Renkler
- **Koyu Arka Plan:** `rgb(4, 0, 29)`
- **Altın Rengi:** `rgb(255, 223, 152)`
- **Mor/Pembe:** `rgb(250, 139, 255)`
- **Metin Birincil:** `#fffffffe`
- **Metin İkincil:** `#B0B0B0`

### Responsive Breakpoints
- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobil:** 480px - 767px
- **Küçük Mobil:** <480px

---

## 🎯 Özellikler

### 1. Kayıt Sistemi
- ✅ Marka ve Influencer olmak üzere iki kayıt türü
- ✅ Form doğrulaması ve kontrolleri
- ✅ Email format kontrolü
- ✅ Şifre minimum uzunluk kontrolü (6 karakter)

### 2. Navigasyon
- ✅ Sticky header (sabit başlık)
- ✅ Hamburger menü (mobil)
- ✅ Staggered menu animasyonları (GSAP)
- ✅ Smooth scroll animasyonları

### 3. Responsive Tasarım
- ✅ Mobil uyumlu
- ✅ Tablet uyumlu
- ✅ Desktop optimized

### 4. Animasyonlar
- ✅ Fade-in scroll animasyonları
- ✅ Hover efektleri
- ✅ Staggered menu animasyonları
- ✅ Button transition effects

---

## 📝 Marka Kayıt Formu Alanları

- Şirket Adı (zorunlu)
- E-mail Adresi (zorunlu)
- Telefon Numarası
- Şifre (zorunlu, min. 6 karakter)
- Sektör
- Website
- Hakkınızda

---

## 📝 Influencer Kayıt Formu Alanları

- Ad Soyadı (zorunlu)
- E-mail Adresi (zorunlu)
- Telefon Numarası
- Şifre (zorunlu, min. 6 karakter)
- Kategori (zorunlu)
- Takipçi Sayısı
- Instagram Profili
- Bio / Hakkımda

---

## 🔧 Teknolojiler

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Styling:** Tailwind CSS, Custom CSS
- **Animasyonlar:** GSAP, CSS Transitions
- **Tasarım Aracı:** CSS Grid, Flexbox

---

## 📱 Kullanıcı Akışı

1. **Ana Sayfa** → "Marka Olarak Katıl" veya "Influencer Olarak Katıl" butonuna tıkla
2. **Kayıt Seçim Sayfası** → Marka veya Influencer kartını seç
3. **Kayıt Formu** → Bilgilerini doldur ve gönder
4. **Başarı Mesajı** → Ana sayfaya yönlendir

---

## 🚀 Sonraki Adımlar (TODO)

- [ ] Database bağlantısı (MongoDB/PostgreSQL)
- [ ] User authentication (JWT tokens)
- [ ] Şifre hashing (bcryptjs)
- [ ] Email doğrulama
- [ ] Admin paneli
- [ ] Kampanya yönetimi
- [ ] Ödeme integrasyon (Stripe/PayPal)
- [ ] Dashboard sayıları

---

## 📞 Destek

Sorularınız için lütfen iletişim sayfasından bize ulaşın.

---

**MetVerse** © 2024 - Tüm hakları saklıdır.
