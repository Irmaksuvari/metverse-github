# MetVerse Kayıt Sistemi - Form Validasyon ve Veri Depolama Rehberi

## 📋 Genel Bakış

Bu dokümantasyon, MetVerse platformu için Influencer ve Marka kayıt sayfalarının **ön uç (Frontend)** ve **arka uç (Backend)** mantığını açıklar.

---

## 🏗️ Dosya Yapısı

```
MetVerse Site/
├── influencer_kayit.html          # Influencer kayıt formu (HTML + CSS + JS)
├── marka_kayit.html               # Marka kayıt formu (HTML + CSS + JS)
├── server.js                       # Express.js arka ucu
├── data/                           # Veri depolama klasörü
│   ├── influencers.json           # Influencer verileri
│   ├── markalar.json              # Marka verileri
│   └── iletisim.json              # İletişim formu verileri
└── package.json                    # Bağımlılıklar
```

---

## 🎯 Fonksiyonellik Detayları

### 1️⃣ INFLUENCER KAYIT FORMASI

#### Form Alanları:
| Alan | Tür | Zorunlu | Validasyon |
|------|-----|---------|-----------|
| Ad Soyadı | Metin | ✅ | En az 2 karakter |
| E-posta Adresi | Email | ✅ | Regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| Telefon Numarası | Telefon | ✅ | Regex: `^[0-9\s\-\+\(\)]{10,}$` |
| Şifre | Password | ✅ | Min. 6 karakter |
| Şifre Tekrar | Password | ✅ | Şifre ile eşleşmeli |
| Kullanım Koşulları | Checkbox | ✅ | Kabul edilmesi zorunlu |

#### Form Akışı:
```
1. Kullanıcı formu doldurur
   ↓
2. Submit butonuna tıklar
   ↓
3. FRONTEND VALIDASYON (JavaScript)
   - Zorunlu alanlar boş mu?
   - Email formatı geçerli mi?
   - Telefon formatı geçerli mi?
   - Şifre 6+ karakter mi?
   - Şifreler eşleşiyor mu?
   - Koşullar kabul edildi mi?
   ↓
4. Hata varsa: Alert göster ve dur
   Hata yoksa: Backend'e veri gönder
   ↓
5. BACKEND VALIDASYON (Node.js/Express)
   - Tüm validasyonları tekrarla
   - E-posta benzersiz mi?
   ↓
6. Hata varsa: JSON error döndür
   Hata yoksa: influencers.json'a kaydet
   ↓
7. Başarı mesajı göster
   ↓
8. /influencer-anasayfa'ya yönlendir
```

### 2️⃣ MARKA KAYIT FORMASI

#### Form Alanları:
| Alan | Tür | Zorunlu | Validasyon |
|------|-----|---------|-----------|
| Şirket Adı | Metin | ✅ | En az 2 karakter |
| Marka Adı | Metin | ✅ | En az 2 karakter |
| E-posta Adresi | Email | ✅ | Regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| Şifre | Password | ✅ | Min. 6 karakter |
| Şifre Tekrar | Password | ✅ | Şifre ile eşleşmeli |
| İsim Soyisim | Metin | ✅ | En az 2 karakter |
| Telefon Numarası | Telefon | ✅ | Regex: `^[0-9\s\-\+\(\)]{10,}$` |
| Kullanım Koşulları | Checkbox | ✅ | Kabul edilmesi zorunlu |

#### Sorumlu Kişi İletişim Bilgileri
Formda bir ayırıcı başlık altında sorumlu kişinin iletişim bilgileri alınır:
- İsim Soyisim
- Telefon Numarası

---

## 🔐 Validasyon Kuralları

### Frontend Validasyon (JavaScript)
```javascript
// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Telefon
const telefonRegex = /^[0-9\s\-\+\(\)]{10,}$/;

// Gerekli kontroller:
- Zorunlu alanlar boş mu?
- Email formatı geçerli mi?
- Telefon formatı geçerli mi?
- Şifre 6+ karakter mi?
- Şifreler eşleşiyor mu?
- Koşullar kabul edildi mi?
```

### Backend Validasyon (Node.js)
```javascript
// Tekrar kontrol edilir:
1. Temel alan kontrolleri
2. Email formatı
3. Şifre uzunluğu
4. Şifre eşleşmesi
5. Koşullar kontrol
6. EMAIL BENZERSIZLIGI (veritabanı seviyesinde)
```

---

## 💾 Veri Depolama (JSON Tabanlı)

### influencers.json Yapısı
```json
[
  {
    "id": 1702598400000,
    "adSoyad": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "telefon": "+90 (555) 123-4567",
    "sifre": "password123",
    "sifreTekrar": "password123",
    "kosullarKabul": 1,
    "createdAt": "2025-12-15T10:30:00.000Z",
    "updatedAt": "2025-12-15T10:30:00.000Z"
  }
]
```

### markalar.json Yapısı
```json
[
  {
    "id": 1702598400001,
    "sirketAdi": "ABC Teknoloji A.Ş.",
    "markaAdi": "TechBrand",
    "email": "info@techbrand.com",
    "sifre": "password123",
    "sifreTekrar": "password123",
    "sorumluIsim": "Zeynep Kaya",
    "sorumluTelefon": "+90 (555) 987-6543",
    "kosullarKabul": 1,
    "createdAt": "2025-12-15T10:35:00.000Z",
    "updatedAt": "2025-12-15T10:35:00.000Z"
  }
]
```

---

## 🔄 API Endpoint

### POST `/api/kayit`

#### Request Body (Influencer):
```json
{
  "tumKayit": "influencer",
  "adSoyad": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "telefon": "+90 (555) 123-4567",
  "sifre": "password123",
  "sifreTekrar": "password123",
  "kosullar": true
}
```

#### Request Body (Marka):
```json
{
  "tumKayit": "marka",
  "sirketAdi": "ABC Teknoloji A.Ş.",
  "markaAdi": "TechBrand",
  "email": "info@techbrand.com",
  "sifre": "password123",
  "sifreTekrar": "password123",
  "sorumluIsim": "Zeynep Kaya",
  "sorumluTelefon": "+90 (555) 987-6543",
  "kosullar": true
}
```

#### Success Response:
```json
{
  "success": true,
  "message": "✅ Kaydınız başarıyla tamamlandı!",
  "redirectUrl": "/influencer-anasayfa"
}
```

#### Error Response:
```json
{
  "success": false,
  "message": "Bu e-posta adresi zaten kayıtlı!"
}
```

---

## 📝 Hata Mesajları

| Hata | Sebep |
|------|-------|
| "Lütfen tüm zorunlu alanları doldurunuz!" | Bir zorunlu alan boş |
| "Lütfen geçerli bir e-posta adresi giriniz!" | Email formatı hatalı |
| "Lütfen geçerli bir telefon numarası giriniz!" | Telefon formatı hatalı |
| "Şifre minimum 6 karakter olmalıdır!" | Şifre çok kısa |
| "Şifreler eşleşmiyor!" | Şifre ve şifre tekrar uyuşmuyor |
| "Kullanım koşullarını kabul etmelisiniz!" | Koşullar işaretlenmemiş |
| "Bu e-posta adresi zaten kayıtlı!" | Email benzersizliği ihlali |

---

## ✅ Başarı Mesajları

- ✅ Influencer: "✅ Kaydınız başarıyla tamamlandı!" → `/influencer-anasayfa`
- ✅ Marka: "✅ Kaydınız başarıyla tamamlandı!" → `/marka-anasayfa`

---

## 🚀 Server Başlatma

```bash
# Bağımlılıkları yükle (ilk kurulum)
npm install

# Sunucuyu başlat
npm start

# Veya doğrudan
node server.js
```

Server çalıştığında:
```
✅ /data klasörü oluşturuldu
✅ influencers.json oluşturuldu
✅ markalar.json oluşturuldu
✅ iletisim.json oluşturuldu

🚀 MetVerse Server çalışıyor: http://localhost:3000
```

---

## 🔍 Güvenlik Notları

⚠️ **NOT**: Şu anda şifreler **düz metin** olarak kaydediliyor. Üretim ortamında:
1. Şifreleri **bcrypt** ile hashle
2. **JWT** token kullan authentication için
3. **HTTPS** kullan
4. Rate limiting ekle
5. SQL Injection koruması ekle (JSON kullandığımız için risiz)

---

## 📊 Test Senaryoları

### ✅ Başarılı Influencer Kaydı
```
1. Tüm alanları doğru doltur
2. Submit'e tıkla
3. Başarı mesajı görüntülen
4. /influencer-anasayfa'ya yönlendir
5. influencers.json'da veri var mı kontrol et
```

### ❌ Başarısız Influencer Kaydı (Email Tekrarı)
```
1. Aynı email ile 2 kere kayıt dene
2. İlk kayıt başarılı
3. İkinci kayıtta: "Bu e-posta adresi zaten kayıtlı!" hatası
```

### ❌ Frontend Validasyon Başarısız
```
1. Şifreler uyuşmayacak şekilde doltur
2. Submit'e tıkla
3. "Şifreler eşleşmiyor!" uyarısı
4. Form gönderilmez
```

---

## 📁 Dosya Konumları

| Dosya | Yol |
|-------|-----|
| Influencer Kayıt | `/influencer-kayit` → `influencer_kayit.html` |
| Marka Kayıt | `/marka-kayit` → `marka_kayit.html` |
| API | `POST /api/kayit` → `server.js` |
| Veri | `/data/` → `influencers.json`, `markalar.json` |

---

## 🎓 Özet

✅ **Frontend**: JavaScript ile hızlı doğrulama ve kullanıcı geri bildirimi
✅ **Backend**: Express.js ile güvenli doğrulama ve veri depolama
✅ **Database**: JSON tabanlı, kolay erişilebilir veri yapısı
✅ **Error Handling**: Detaylı hata mesajları
✅ **Redirect**: Başarı sonrası uygun sayfaya yönlendirme

---

**Son Güncelleme**: 15 Aralık 2025
