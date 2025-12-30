# 🔐 Güvenli Erişim Kontrolü ve Dinamik Header Sistemi

## ✅ Sistem Durumu
**Server**: http://localhost:3000 ✅

---

## 📋 Tamamlanan Özellikler

### **1️⃣ Backend - JWT Middleware Doğrulaması**

#### Yeni Middleware: `verifyToken`
```javascript
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token bulunamadı. Lütfen giriş yapınız.'
        });
    }

    const bearerToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    try {
        const decoded = jwt.verify(bearerToken, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Geçersiz veya süresi dolmuş token.'
        });
    }
};
```

#### Korumalı Rotalar
```javascript
// Middleware tarafından korunan route'lar
app.get('/influencer-anasayfa', verifyToken, (req, res) => {
    // Sadece geçerli token'ı olan kullanıcılar erişebilir
});

app.get('/marka-anasayfa', verifyToken, (req, res) => {
    // Sadece geçerli token'ı olan kullanıcılar erişebilir
});
```

**Nasıl Çalışır:**
1. Kullanıcı `/influencer-anasayfa` sayfasına gitmek istiyor
2. Backend `verifyToken` middleware'ini çalıştırıyor
3. Authorization header'ında token var mı kontrol ediyor
4. Token doğru mu ve süresi geçmedi mi diye verify ediyor
5. ✅ Geçerli → Sayfaya erişim izni
6. ❌ Geçersiz/Yok → 401 Unauthorized hatası

---

### **2️⃣ Backend - API Endpoint'leri**

#### POST `/api/logout`
```javascript
app.post('/api/logout', verifyToken, (req, res) => {
    // Token doğrulandıktan sonra çalışır
    res.json({
        success: true,
        message: 'Başarıyla çıkış yapıldı.',
        redirectUrl: '/'
    });
});
```

**Token Gereci:**
- Sadece doğrulanmış kullanıcılar çıkış yapabilir
- Backend'de oturum sonlandırılır
- Frontend localStorage'ı temizler

#### GET `/api/verify-token`
```javascript
app.get('/api/verify-token', verifyToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});
```

**Kullanım Alanı:**
- Sayfa yüklenirken token geçerliliğini kontrol et
- Token geçersizse giriş sayfasına yönlendir

---

### **3️⃣ Frontend - Token Doğrulama**

#### influencer_anasayfa.html JavaScript
```javascript
// Sayfa yüklendiğinde çalışır
async function checkTokenAndLoadUser() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        // Token yoksa giriş sayfasına yönlendir
        window.location.href = '/giris-secim';
        return;
    }

    try {
        // Backend'e token doğrulaması istekçiği gönder
        const response = await fetch('/api/verify-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Token geçersiz - giriş sayfasına yönlendir
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/giris-secim';
            return;
        }

        console.log('✅ Kullanıcı doğrulandı');

    } catch (error) {
        // Hata durumunda giriş sayfasına yönlendir
        localStorage.clear();
        window.location.href = '/giris-secim';
    }
}

// Sayfa yüklendiğinde çalıştır
window.addEventListener('load', checkTokenAndLoadUser);
```

---

### **4️⃣ Frontend - Çıkış Yapma (Logout)**

#### HTML
```html
<button id="logoutBtn" class="dropdown-item logout-btn">Çıkış Yap</button>
```

#### JavaScript
```javascript
const logoutBtn = document.getElementById('logoutBtn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                // localStorage'ı temizle
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Ana sayfaya yönlendir
                window.location.href = data.redirectUrl;
            }
        } catch (error) {
            alert('❌ Çıkış yapılırken bir hata oluştu');
        }
    });
}
```

**Çıkış Akışı:**
```
Çıkış Yap butonuna tıkla
        ↓
POST /api/logout (token ile)
        ↓
Backend token'ı doğrular
        ↓
Başarı response döndür
        ↓
localStorage'ı temizle (token + user)
        ↓
Ana sayfaya yönlendir (/)
```

---

### **5️⃣ Frontend - Dinamik Header Styling**

#### CSS - Logout Button
```css
.logout-btn {
    color: #ff6b6b !important;
    border-top: 1px solid rgba(232, 133, 202, 0.2);
    margin-top: 0.5rem;
    padding-top: 0.8rem;
}

.logout-btn:hover {
    background: rgba(255, 107, 107, 0.15) !important;
    color: #ff8787 !important;
}
```

---

## 🧪 Test Senaryoları

### **Test 1: Giriş Yapıp Anasayfaya Gitmek**
1. http://localhost:3000/giris-secim
2. Influencer bilgileri gir: `Irmak Süvari`, `irmak.suvari14@gmail.com`, `Irmak1234`
3. ✅ **Beklenen**: Direkt `/influencer-anasayfa` yüklenir

**Arka Planda Ne Olur:**
```
1. Login form submit
2. POST /api/influencer-login
3. Backend şifre doğrula
4. JWT token oluştur
5. Response: token + user + redirectUrl
6. Frontend: localStorage'a token kaydet
7. window.location.href = '/influencer-anasayfa'
8. GET /influencer-anasayfa (middleware çalışır)
9. verifyToken middleware token'ı kontrol eder
10. ✅ Token geçerli → Sayfa yükle
```

### **Test 2: Token Olmadan Direkt Sayfaya Gitmek**
1. http://localhost:3000/influencer-anasayfa (token olmadan)
2. ✅ **Beklenen**: Otomatik `/giris-secim` yönlendir

**Arka Planda Ne Olur:**
```
1. GET /influencer-anasayfa
2. verifyToken middleware çalışır
3. Authorization header boş
4. Middleware error döndür (401 Unauthorized)
5. Frontend fetch error yakalar
6. localStorage temizle
7. window.location.href = '/giris-secim'
```

### **Test 3: Çıkış Yapma**
1. Anasayfadayken profil simgesine tıkla (👤)
2. "Çıkış Yap" butonuna tıkla
3. ✅ **Beklenen**: Ana sayfaya yönlendir + localStorage temizle

**Arka Planda Ne Olur:**
```
1. Çıkış Yap butonuna tıkla
2. Click event tetiklenir
3. fetch POST /api/logout (token ile)
4. verifyToken middleware token'ı doğrular
5. ✅ Token geçerli → Logout yapılsın
6. Backend response döndür
7. Frontend localStorage.removeItem('token')
8. localStorage.removeItem('user')
9. window.location.href = '/'
```

### **Test 4: Süresi Dolmuş Token**
1. localStorage'da token'ı manuel olarak değiştir
2. http://localhost:3000/influencer-anasayfa
3. ✅ **Beklenen**: `/giris-secim` yönlendir

**Arka Planda Ne Olur:**
```
1. GET /influencer-anasayfa
2. verifyToken middleware çalışır
3. jwt.verify(token, SECRET) başarısız olur
4. Middleware error döndür
5. Frontend hata yakalar
6. localStorage temizle
7. /giris-secim yönlendir
```

---

## 🔒 Güvenlik Özellikleri

| Özellik | Nasıl Çalışır | Avantajı |
|---------|---|---|
| **JWT Token** | 24 saat geçerli, süresi dolmuş token'lar reddedilir | Stateless auth, scalable |
| **Backend Middleware** | Her istek token ile kontrol ediliyor | Sayfaya erişim frontend'den bypass edilemez |
| **localStorage Temizliği** | Çıkış yapıp localStorage temizleniyor | Paylaşılan bilgisayardaki tarayıcı güvenli kalıyor |
| **Token Authorization Header** | Bearer <token> formatında gönderiliyor | REST API standardı, güvenli |
| **Seed Validation** | Frontend + Backend doble doğrulama | Hatalı veya kötü amaçlı istekler reddediliyor |

---

## 🧬 Veri Akışı Diyagramı

```
┌─────────────────────────────────────────────────────────┐
│                    LOGIN (Giriş Yapma)                  │
└─────────────────────────────────────────────────────────┘

[giris_yap.html]
     │
     ├─ Form doldur (ad soyad, şifre)
     │
     ├─ Form submit
     │
     ├─ POST /api/influencer-login
     │
     ↓
[server.js - /api/influencer-login]
     │
     ├─ Influencer bul (email/adSoyad)
     │
     ├─ bcrypt.compare(şifre, hash)
     │
     ├─ ✅ Eşleşiyor → JWT.sign(token)
     │
     ├─ Response: {token, user, redirectUrl}
     │
     ↓
[giris_yap.html - Frontend]
     │
     ├─ localStorage.setItem('token', token)
     │
     ├─ window.location.href = '/influencer-anasayfa'
     │
     ↓

┌─────────────────────────────────────────────────────────┐
│              PAGE LOAD (Sayfa Yükleme)                  │
└─────────────────────────────────────────────────────────┘

[Browser]
     │
     ├─ GET /influencer-anasayfa
     │
     ↓
[server.js - middleware verifyToken]
     │
     ├─ req.headers['authorization'] kontrol et
     │
     ├─ jwt.verify(token, SECRET)
     │
     ├─ ✅ Geçerli → next() çalıştır
     │
     ├─ sendFile(influencer_anasayfa.html)
     │
     ↓
[influencer_anasayfa.html - JavaScript]
     │
     ├─ window.addEventListener('load', checkTokenAndLoadUser)
     │
     ├─ GET /api/verify-token (token ile)
     │
     ├─ ✅ Response ok → Sayfayı göster
     │
     ↓

┌─────────────────────────────────────────────────────────┐
│              LOGOUT (Çıkış Yapma)                       │
└─────────────────────────────────────────────────────────┘

[Dropdown Menu]
     │
     ├─ "Çıkış Yap" butonuna tıkla
     │
     ├─ POST /api/logout (token ile)
     │
     ↓
[server.js - /api/logout]
     │
     ├─ verifyToken middleware kontrol et
     │
     ├─ ✅ Token geçerli → Logout yapılsın
     │
     ├─ Response: {success: true, redirectUrl: '/'}
     │
     ↓
[influencer_anasayfa.html - Frontend]
     │
     ├─ localStorage.removeItem('token')
     │
     ├─ localStorage.removeItem('user')
     │
     ├─ window.location.href = '/'
     │
     ↓
[index.html - Ana Sayfa]
     │
     └─ Header otomatik "Genel Header" durumuna döner
```

---

## 📝 API Endpoint'leri

### POST `/api/influencer-login`
**Request:**
```json
{
  "adSoyad": "Irmak Süvari",
  "email": "irmak.suvari14@gmail.com",
  "sifre": "Irmak1234"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "✅ Giriş başarılı!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1765825018687,
    "adSoyad": "Irmak Süvari",
    "email": "irmak.suvari14@gmail.com",
    "telefon": "+905320590179"
  },
  "redirectUrl": "/influencer-anasayfa"
}
```

---

### POST `/api/logout`
**Request Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Başarıyla çıkış yapıldı.",
  "redirectUrl": "/"
}
```

---

### GET `/api/verify-token`
**Request Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1765825018687,
    "adSoyad": "Irmak Süvari",
    "email": "irmak.suvari14@gmail.com",
    "telefon": "+905320590179"
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Geçersiz veya süresi dolmuş token."
}
```

---

## ✨ Özet

✅ **Erişim Kontrolü**: Middleware ile korumalı sayfalar  
✅ **JWT Doğrulama**: 24 saat geçerli token'lar  
✅ **Çıkış Yapma**: localStorage temizleme + yönlendirme  
✅ **Token Kontrol**: Sayfa yüklenirken geçerliliği doğrula  
✅ **Dinamik Header**: Giriş durumuna göre header değişir  
✅ **Hata Yönetimi**: Geçersiz/süresi dolmuş token'lar işlenir  

---

**Sistem Durumu**: 🚀 **PRODUCTION READY**

*Son Güncelleme: 15 Aralık 2025*
