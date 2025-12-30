const bcrypt = require('bcrypt');

const hash = "$2b$10$JpG.YxurwtusB6BTwHSZWufuBMGA8Fn7DJUCQOjTAGLcjVGEyDeCi";
const password = "TechVerse@123";

bcrypt.compare(password, hash).then(result => {
  console.log('Password Match:', result);
  if (result) {
    console.log('✅ Şifre DOĞRU!');
  } else {
    console.log('❌ Şifre YANLIŞ!');
  }
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
