const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'ecole';
  const hash = await bcrypt.hash(password, 10);
  console.log('Mot de passe:', password);
  console.log('Hash généré:', hash);
  
  // Vérifier que le hash fonctionne
  const isValid = await bcrypt.compare(password, hash);
  console.log('Vérification du hash:', isValid);
}

generateHash(); 