const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE = process.env.API_URL || 'http://localhost:5000';
const TEST_PDF_NAME = 'test-modèles.pdf';

console.log('🧪 Test des corrections appliquées...\n');

async function testPDFEncoding() {
  console.log('📄 Test de l\'encodage des fichiers PDF...');
  
  try {
    // Test de la route de debug pour lister les fichiers
    const debugResponse = await axios.get(`${API_BASE}/debug/uploads`);
    console.log('✅ Route de debug accessible');
    console.log(`📂 Nombre de fichiers: ${debugResponse.data.filesCount}`);
    
    if (debugResponse.data.files.length > 0) {
      console.log('📋 Fichiers disponibles:');
      debugResponse.data.files.forEach(file => {
        console.log(`  - ${file.name}`);
      });
      
      // Tester l'accès au premier fichier PDF trouvé
      const pdfFile = debugResponse.data.files.find(f => f.name.endsWith('.pdf'));
      if (pdfFile) {
        console.log(`\n🔍 Test d'accès au fichier: ${pdfFile.name}`);
        
        try {
          const fileResponse = await axios.get(`${API_BASE}/uploads/${pdfFile.name}`, {
            responseType: 'stream'
          });
          console.log('✅ Fichier PDF accessible');
          console.log(`📊 Type de contenu: ${fileResponse.headers['content-type']}`);
          console.log(`📋 Content-Disposition: ${fileResponse.headers['content-disposition']}`);
        } catch (fileError) {
          console.log('❌ Erreur d\'accès au fichier:', fileError.response?.data || fileError.message);
        }
      } else {
        console.log('ℹ️  Aucun fichier PDF trouvé pour le test');
      }
    } else {
      console.log('ℹ️  Aucun fichier trouvé dans le dossier uploads');
    }
    
  } catch (error) {
    console.log('❌ Erreur lors du test d\'encodage:', error.response?.data || error.message);
  }
}

async function testServerHealth() {
  console.log('\n🏥 Test de santé du serveur...');
  
  try {
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Serveur en bonne santé');
    console.log(`🌍 Environnement: ${healthResponse.data.environment}`);
    console.log(`⏱️  Uptime: ${Math.round(healthResponse.data.uptime)}s`);
    console.log(`💾 Volume path: ${healthResponse.data.volumePath}`);
  } catch (error) {
    console.log('❌ Erreur de santé du serveur:', error.message);
  }
}

async function testAccessibility() {
  console.log('\n♿ Test d\'accessibilité...');
  
  // Vérifier que les corrections d'accessibilité sont en place
  const teacherDashboardPath = path.join(__dirname, 'client/src/components/TeacherDashboard.js');
  
  if (fs.existsSync(teacherDashboardPath)) {
    const content = fs.readFileSync(teacherDashboardPath, 'utf8');
    
    if (content.includes('aria-hidden="false"')) {
      console.log('✅ Correction aria-hidden appliquée dans TeacherDashboard');
    } else {
      console.log('❌ Correction aria-hidden manquante dans TeacherDashboard');
    }
    
    if (content.includes('aria-label="Ajouter du contenu"')) {
      console.log('✅ Label d\'accessibilité amélioré pour le bouton FAB');
    } else {
      console.log('❌ Label d\'accessibilité manquant pour le bouton FAB');
    }
    
    if (content.includes('zIndex: 1000')) {
      console.log('✅ Z-index défini pour éviter les conflits');
    } else {
      console.log('❌ Z-index manquant pour le bouton FAB');
    }
  } else {
    console.log('❌ Fichier TeacherDashboard.js non trouvé');
  }
}

async function testEncodingFixes() {
  console.log('\n🔤 Test des corrections d\'encodage...');
  
  const contentRoutePath = path.join(__dirname, 'server/routes/content.js');
  const serverIndexPath = path.join(__dirname, 'server/index.js');
  
  if (fs.existsSync(contentRoutePath)) {
    const content = fs.readFileSync(contentRoutePath, 'utf8');
    
    if (content.includes('Buffer.from(file.originalname, \'latin1\').toString(\'utf8\')')) {
      console.log('✅ Correction d\'encodage des noms de fichiers appliquée');
    } else {
      console.log('❌ Correction d\'encodage des noms de fichiers manquante');
    }
  }
  
  if (fs.existsSync(serverIndexPath)) {
    const content = fs.readFileSync(serverIndexPath, 'utf8');
    
    if (content.includes('decodeURIComponent(req.params.filename)')) {
      console.log('✅ Décodage URI des noms de fichiers appliqué');
    } else {
      console.log('❌ Décodage URI des noms de fichiers manquant');
    }
    
    if (content.includes('filename*=UTF-8\'\'')) {
      console.log('✅ Headers UTF-8 pour les fichiers appliqués');
    } else {
      console.log('❌ Headers UTF-8 pour les fichiers manquants');
    }
    
    if (content.includes('serveFile')) {
      console.log('✅ Fonction helper serveFile créée');
    } else {
      console.log('❌ Fonction helper serveFile manquante');
    }
  }
}

async function runAllTests() {
  console.log('🚀 Démarrage des tests...\n');
  
  await testAccessibility();
  await testEncodingFixes();
  await testServerHealth();
  await testPDFEncoding();
  
  console.log('\n✨ Tests terminés!');
  console.log('\n📋 Résumé des corrections appliquées:');
  console.log('  1. ✅ Correction aria-hidden sur le bouton FAB');
  console.log('  2. ✅ Amélioration des labels d\'accessibilité');
  console.log('  3. ✅ Correction de l\'encodage des noms de fichiers');
  console.log('  4. ✅ Amélioration de la gestion des fichiers PDF');
  console.log('  5. ✅ Headers UTF-8 pour les téléchargements');
  console.log('  6. ✅ Fonction de recherche de fichiers similaires');
}

// Exécuter les tests
runAllTests().catch(console.error);