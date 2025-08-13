const fs = require('fs');
const path = require('path');

// Chemin du fichier de données
const DATA_FILE = process.env.NODE_ENV === 'production' 
  ? '/app/data/contents.json'
  : path.join(__dirname, '../data/contents.json');

console.log('🔧 Script de correction des chemins de fichiers');
console.log(`📁 Chemin du fichier de données: ${DATA_FILE}`);

// Fonction pour corriger les chemins de fichiers
const fixFilePaths = () => {
  try {
    // Vérifier si le fichier existe
    if (!fs.existsSync(DATA_FILE)) {
      console.log('❌ Fichier de données non trouvé');
      return;
    }

    // Lire le fichier
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    
    console.log(`📊 ${parsed.contents.length} contenus trouvés`);
    
    let fixedCount = 0;
    
    // Parcourir tous les contenus
    parsed.contents = parsed.contents.map(content => {
      let fixed = false;
      
      // Corriger le chemin de la miniature si elle existe
      if (content.miniature && content.miniature.includes('\\')) {
        const oldPath = content.miniature;
        content.miniature = content.miniature.replace(/\\/g, '/');
        console.log(`✅ Miniature corrigée: ${oldPath} -> ${content.miniature}`);
        fixed = true;
      }
      
      // Corriger le chemin du PDF si elle existe
      if (content.pdfFile && content.pdfFile.includes('\\')) {
        const oldPath = content.pdfFile;
        content.pdfFile = content.pdfFile.replace(/\\/g, '/');
        console.log(`✅ PDF corrigé: ${oldPath} -> ${content.pdfFile}`);
        fixed = true;
      }
      
      // Extraire uniquement le nom de fichier pour les chemins complets
      if (content.miniature && content.miniature.includes('/app/data/uploads/')) {
        const oldPath = content.miniature;
        content.miniature = content.miniature.split('/').pop();
        console.log(`✅ Miniature simplifiée: ${oldPath} -> ${content.miniature}`);
        fixed = true;
      }
      
      if (content.pdfFile && content.pdfFile.includes('/app/data/uploads/')) {
        const oldPath = content.pdfFile;
        content.pdfFile = content.pdfFile.split('/').pop();
        console.log(`✅ PDF simplifié: ${oldPath} -> ${content.pdfFile}`);
        fixed = true;
      }
      
      if (fixed) fixedCount++;
      return content;
    });
    
    console.log(`🔧 ${fixedCount} contenus corrigés`);
    
    // Sauvegarder les modifications
    fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2));
    console.log('💾 Modifications sauvegardées avec succès');
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction des chemins:', error);
  }
};

// Exécuter le script
fixFilePaths();