const axios = require('axios');

const API_BASE_URL = 'https://classe-numerique.fly.dev';

async function testAPI() {
  console.log('🧪 Test de l\'API Backend...\n');

  try {
    // Test 1: Health check
    console.log('1. Test Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);

    // Test 2: API endpoint
    console.log('\n2. Test API Endpoint...');
    const apiResponse = await axios.get(`${API_BASE_URL}/api`);
    console.log('✅ API Endpoint:', apiResponse.data);

    // Test 3: Login professeur
    console.log('\n3. Test Login Professeur...');
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: 'prof',
      password: 'prof123'
    });
    console.log('✅ Login Professeur:', {
      success: true,
      user: loginResponse.data.user,
      token: loginResponse.data.token ? 'Token généré' : 'Pas de token'
    });

    // Test 4: Login élève
    console.log('\n4. Test Login Élève...');
    const loginStudentResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: 'cm2',
      password: 'ecole'
    });
    console.log('✅ Login Élève:', {
      success: true,
      user: loginStudentResponse.data.user,
      token: loginStudentResponse.data.token ? 'Token généré' : 'Pas de token'
    });

    console.log('\n🎉 Tous les tests sont passés avec succès !');
    console.log('✅ Le backend est opérationnel et prêt pour le frontend.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    console.log('\n🔧 Vérifiez :');
    console.log('1. Que le backend Fly.io est actif');
    console.log('2. Que l\'URL est correcte');
    console.log('3. Les logs du backend pour plus de détails');
  }
}

testAPI(); 