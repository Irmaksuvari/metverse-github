// Hash'li şifreler oluştur
const bcrypt = require('bcrypt');

async function createHashes() {
    console.log('🔐 Şifre Hash\'leri Oluşturuluyor...\n');

    const passwords = [
        { label: 'TechPass123', password: 'TechPass123' },
        { label: 'DMPAdmin456', password: 'DMPAdmin456' },
        { label: 'CreativePass789', password: 'CreativePass789' },
        { label: 'TestInfluencer123', password: 'TestInfluencer123' }
    ];

    for (const item of passwords) {
        const hash = await bcrypt.hash(item.password, 10);
        console.log(`✅ ${item.label}`);
        console.log(`   Hash: ${hash}\n`);
    }
}

createHashes();
