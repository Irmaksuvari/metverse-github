const fs = require('fs');
const path = require('path');

// Vergi Numarası oluştur (10 haneli)
function generateVergiNo() {
  let vergiNo = '';
  for (let i = 0; i < 10; i++) {
    vergiNo += Math.floor(Math.random() * 10);
  }
  return vergiNo;
}

// Kart Numarası oluştur (16 haneli)
function generateKartNumarasi() {
  let kartNo = '';
  for (let i = 0; i < 16; i++) {
    kartNo += Math.floor(Math.random() * 10);
  }
  return kartNo;
}

// Kart Adı oluştur
function generateKartAdi() {
  const firstNames = ['Ahmet', 'Mehmet', 'Fatih', 'İbrahim', 'Mustafa', 'Ali', 'Hasan', 'Bekir', 'Cemil', 'Davut'];
  const lastNames = ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Karaca', 'Arslan', 'Öztürk', 'Acar', 'Tunç', 'Erdem'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

// Kart Ay/Yıl oluştur (MM/YY)
function generateKartAyAl() {
  const ay = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const yil = String(Math.floor(Math.random() * 10) + 25).padStart(2, '0');
  return `${ay}/${yil}`;
}

// CVV oluştur (3 haneli)
function generateCVV() {
  return String(Math.floor(Math.random() * 1000)).padStart(3, '0');
}

// Fatura Adresi oluştur
function generateFaturaAdresi() {
  const cities = [
    'Istanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Gaziantep', 'Konya', 'Kayseri',
    'Samsun', 'Diyarbakır', 'Adana', 'Şanlıurfa', 'Mersin', 'Kocaeli', 'Sakarya', 'Eskişehir',
    'Balıkesir', 'Adıyaman', 'Aydın', 'Bandırma', 'Muğla', 'Manisa', 'Kastamonu', 'Çorum'
  ];
  
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomNumber = Math.floor(Math.random() * 9999) + 1;
  
  return `${randomCity}, No: ${randomNumber}, Türkiye`;
}

// markalar.json oku
const markalarPath = path.join(__dirname, 'data', 'markalar.json');
const markalar = JSON.parse(fs.readFileSync(markalarPath, 'utf-8'));

// Her marka için doğrulama bilgisi oluştur
const verificationInfo = markalar.map(marka => {
  return {
    markaId: marka.id,
    markaAdi: marka.markaAdi,
    faturaAdresi: generateFaturaAdresi(),
    vergino: generateVergiNo(),
    kartNumarasi: generateKartNumarasi(),
    kartAdı: generateKartAdi(),
    kartAyAl: generateKartAyAl(),
    cvv: generateCVV(),
    eposta: marka.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});

// verification-info.json dosyasına yaz
const verificationPath = path.join(__dirname, 'data', 'verification-info.json');
fs.writeFileSync(verificationPath, JSON.stringify(verificationInfo, null, 2));

console.log(`✅ ${verificationInfo.length} marka için doğrulama bilgisi oluşturuldu!`);
console.log(`📁 Dosya kaydedildi: ${verificationPath}`);
console.log(`\nÖrnekler:`);
verificationInfo.slice(0, 3).forEach((info, index) => {
  console.log(`\n${index + 1}. ${info.markaAdi}`);
  console.log(`   Vergi No: ${info.vergino}`);
  console.log(`   Kart: ${info.kartAdı} (${info.kartNumarasi.slice(0, 4)}****${info.kartNumarasi.slice(-4)})`);
  console.log(`   Ay/Yıl: ${info.kartAyAl}`);
  console.log(`   CVV: ${info.cvv}`);
  console.log(`   Fatura Adresi: ${info.faturaAdresi}`);
});
