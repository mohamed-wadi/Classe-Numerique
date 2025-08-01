const fs = require('fs');
const path = require('path');
const { resizeImageIfNeeded } = require('../utils/imageResizer');

/**
 * Script pour redimensionner toutes les images existantes dans le dossier uploads
 */
async function resizeAllExistingImages() {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  try {
    // Vérifier si le dossier uploads existe
    if (!fs.existsSync(uploadsDir)) {
      console.log('❌ Le dossier uploads n\'existe pas');
      return;
    }

    // Lire tous les fichiers du dossier uploads
    const files = fs.readdirSync(uploadsDir);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    
    let processedCount = 0;
    let errorCount = 0;

    console.log('🔄 Début du redimensionnement des images existantes...');
    console.log(`📁 Dossier: ${uploadsDir}`);
    console.log(`📊 Nombre de fichiers trouvés: ${files.length}`);

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const ext = path.extname(file).toLowerCase();
      
      // Ignorer les fichiers non-images et les fichiers système
      if (file === '.gitkeep' || !imageExtensions.includes(ext)) {
        continue;
      }

      try {
        console.log(`🖼️  Traitement de: ${file}`);
        await resizeImageIfNeeded(filePath);
        processedCount++;
        console.log(`✅ Redimensionné: ${file}`);
      } catch (error) {
        console.error(`❌ Erreur avec ${file}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📈 Résumé du traitement:');
    console.log(`✅ Images traitées avec succès: ${processedCount}`);
    console.log(`❌ Erreurs: ${errorCount}`);
    console.log(`🎯 Taille finale de toutes les images: 1095×639px`);

  } catch (error) {
    console.error('❌ Erreur lors du traitement:', error);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  resizeAllExistingImages();
}

module.exports = { resizeAllExistingImages }; 