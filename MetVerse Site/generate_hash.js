const bcrypt = require('bcrypt');

async function testHash() {
    // Irmak1234 şifresi için hash oluştur
    const hash1 = await bcrypt.hash('Irmak1234', 10);
    const hash2 = await bcrypt.hash('TestInfluencer123', 10);
    const hash3 = await bcrypt.hash('TechPass123', 10);
    const hash4 = await bcrypt.hash('DMPAdmin456', 10);
    const hash5 = await bcrypt.hash('CreativePass789', 10);

    console.log('Irmak1234:');
    console.log(hash1);
    console.log('\nTestInfluencer123:');
    console.log(hash2);
    console.log('\nTechPass123:');
    console.log(hash3);
    console.log('\nDMPAdmin456:');
    console.log(hash4);
    console.log('\nCreativePass789:');
    console.log(hash5);
}

testHash();
