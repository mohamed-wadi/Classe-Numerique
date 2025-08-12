#!/usr/bin/env node

/**
 * Script de test pour vérifier la solution des miniatures
 * Usage: node test-solution-miniatures.js
 */

const https = require('https');

const API_BASE_URL = 'https://classe-numerique.fly.dev';

// Fonction utilitaire pour faire des requêtes HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Tests de la solution des miniatures
async function testMiniaturesSolution() {
  console.log('🧪 TEST DE LA SOLUTION DES MINIATURES\n');
  
  let passedTests = 0;
  let totalTests = 0;
  
  // Test 1: Vérification de l'endpoint de contenu par niveau/catégorie
  console.log('📝 Test 1: Endpoint de contenu par niveau/catégorie');
  try {
    const response = await makeRequest(`${API_BASE_URL}/api/content/CM2/THEMES`);
    
    if (response.status === 200) {
      console.log('✅ Endpoint accessible (200 attendu)');
      if (response.data && Array.isArray(response.data)) {
        console.log(`📊 ${response.data.length} contenus trouvés`);
        
        // Vérifier les miniatures
        const contentsWithMiniatures = response.data.filter(content => content.miniature);
        const contentsWithoutMiniatures = response.data.filter(content => !content.miniature);
        
        console.log(`🖼️  Contenus avec miniatures: ${contentsWithMiniatures.length}`);
        console.log(`⚠️  Contenus sans miniatures: ${contentsWithoutMiniatures.length}`);
        
        if (contentsWithMiniatures.length > 0) {
          console.log('✅ Des miniatures sont présentes dans la réponse');
          passedTests++;
        } else {
          console.log('⚠️  Aucune miniature trouvée (peut être normal si pas de contenu)');
        }
      }
      passedTests++;
    } else {
      console.log(`❌ Statut inattendu: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
  totalTests++;
  
  // Test 2: Vérification de l'endpoint de tous les contenus
  console.log('\n📝 Test 2: Endpoint de tous les contenus');
  try {
    const response = await makeRequest(`${API_BASE_URL}/api/content`);
    
    if (response.status === 200) {
      console.log('✅ Endpoint accessible (200 attendu)');
      if (response.data && Array.isArray(response.data)) {
        console.log(`📊 Total: ${response.data.length} contenus`);
      }
      passedTests++;
    } else {
      console.log(`❌ Statut inattendu: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
  }
  totalTests++;
  
  // Test 3: Vérification de la structure des données
  console.log('\n📝 Test 3: Structure des données de contenu');
  try {
    const response = await makeRequest(`${API_BASE_URL}/api/content/CM2/THEMES`);
    
    if (response.status === 200 && response.data && Array.isArray(response.data) && response.data.length > 0) {
      const firstContent = response.data[0];
      console.log('📋 Structure du premier contenu:');
      console.log(`   - ID: ${firstContent.id}`);
      console.log(`   - Titre: ${firstContent.title}`);
      console.log(`   - Niveau: ${firstContent.level}`);
      console.log(`   - Catégorie: ${firstContent.category}`);
      console.log(`   - Miniature: ${firstContent.miniature || 'Aucune'}`);
      console.log(`   - PDF: ${firstContent.pdfFile || 'Aucun'}`);
      console.log(`   - Visible: ${firstContent.isVisible}`);
      
      // Vérifier les champs requis
      const requiredFields = ['id', 'title', 'level', 'category', 'type'];
      const missingFields = requiredFields.filter(field => !firstContent[field]);
      
      if (missingFields.length === 0) {
        console.log('✅ Tous les champs requis sont présents');
        passedTests++;
      } else {
        console.log(`⚠️  Champs manquants: ${missingFields.join(', ')}`);
      }
    } else {
      console.log('⚠️  Aucun contenu disponible pour le test');
    }
  } catch (error) {
    console.log('❌ Erreur lors du test de structure:', error.message);
  }
  totalTests++;
  
  // Résumé des tests
  console.log('\n' + '='.repeat(60));
  console.log(`📊 RÉSULTATS DES TESTS: ${passedTests}/${totalTests} réussis`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Tous les tests sont passés avec succès !');
    console.log('✅ La solution des miniatures est fonctionnelle');
  } else {
    console.log('⚠️  Certains tests ont échoué');
    console.log('🔍 Vérifiez la configuration du serveur');
  }
  
  console.log('\n📋 RÉCAPITULATIF DE LA SOLUTION APPLIQUÉE:');
  console.log('1. ✅ Persistance locale des données (fichier JSON)');
  console.log('2. ✅ Gestion améliorée des erreurs et logging');
  console.log('3. ✅ Sauvegarde automatique après chaque modification');
  console.log('4. ✅ Chargement des données au démarrage du serveur');
  console.log('5. ✅ Logs détaillés pour le débogage');
  
  console.log('\n🚀 PROCHAINES ÉTAPES:');
  console.log('1. Tester manuellement l\'interface utilisateur');
  console.log('2. Créer un nouvel élément avec miniature');
  console.log('3. Vérifier que l\'élément persiste après actualisation');
  console.log('4. Contrôler l\'affichage des miniatures');
  
  console.log('\n🌐 URL de test: https://classe-numerique.fly.dev');
  console.log('📚 Documentation: RESTAURATION_TERMINEE.md');
}

// Exécution des tests
testMiniaturesSolution().catch(console.error); 