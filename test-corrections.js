const axios = require('axios');

const API_BASE_URL = 'https://classe-numerique.fly.dev';

async function testCorrections() {
  console.log('🧪 Test des corrections de persistance des fichiers');
  console.log('================================================');
  
  try {
    // Test 1: Vérifier que l'API est accessible
    console.log('\n1️⃣ Test de l\'API de santé...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API de santé OK:', healthResponse.data);
    
    // Test 2: Vérifier la route de débogage des uploads
    console.log('\n2️⃣ Test de la route de débogage des uploads...');
    const debugResponse = await axios.get(`${API_BASE_URL}/debug/uploads`);
    console.log('✅ Route de débogage OK:', debugResponse.data);
    
    // Test 3: Tenter de se connecter
    console.log('\n3️⃣ Test de connexion...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: 'prof',
      password: 'prof123'
    });
    console.log('✅ Connexion OK');
    
    const token = loginResponse.data.token;
    
    // Test 4: Récupérer les contenus
    console.log('\n4️⃣ Test de récupération des contenus...');
    const contentsResponse = await axios.get(`${API_BASE_URL}/api/content/CM2/LECTURE_SUIVIE`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Récupération des contenus OK:', contentsResponse.data.length, 'contenus trouvés');
    
    // Test 5: Vérifier les fichiers existants
    if (contentsResponse.data.length > 0) {
      console.log('\n5️⃣ Test d\'accès aux fichiers existants...');
      for (const content of contentsResponse.data) {
        if (content.pdfFile) {
          try {
            const filename = content.pdfFile.split('/').pop();
            const fileResponse = await axios.head(`${API_BASE_URL}/uploads/${filename}`);
            console.log(`✅ PDF accessible: ${filename}`);
          } catch (error) {
            console.log(`❌ PDF non accessible: ${content.pdfFile} - ${error.message}`);
          }
        }
        
        if (content.miniature) {
          try {
            const filename = content.miniature.split('/').pop();
            const fileResponse = await axios.head(`${API_BASE_URL}/uploads/${filename}`);
            console.log(`✅ Miniature accessible: ${filename}`);
          } catch (error) {
            console.log(`❌ Miniature non accessible: ${content.miniature} - ${error.message}`);
          }
        }
      }
    }
    
    console.log('\n🎉 Tests terminés avec succès!');
    console.log('\n📋 Prochaines étapes:');
    console.log('1. Accéder à https://wadi-fz.netlify.app/teacher');
    console.log('2. Se connecter avec prof/prof123');
    console.log('3. Ajouter un nouveau contenu avec PDF et miniature');
    console.log('4. Vérifier que les fichiers s\'affichent correctement');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    if (error.response) {
      console.error('📄 Réponse du serveur:', error.response.data);
    }
  }
}

// Exécuter les tests
testCorrections();