const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Redimensionne une image à la taille spécifiée (1095×639px)
 * @param {string} inputPath - Chemin vers l'image source
 * @param {string} outputPath - Chemin vers l'image redimensionnée (optionnel)
 * @returns {Promise<string>} - Chemin vers l'image redimensionnée
 */
async function resizeImage(inputPath, outputPath = null) {
  try {
    // Si aucun chemin de sortie n'est spécifié, on crée un fichier temporaire
    const finalOutputPath = outputPath || inputPath;
    const tempPath = outputPath ? finalOutputPath : inputPath + '.temp';
    
    // Redimensionner l'image à 1095×639px avec un mode de redimensionnement approprié
    await sharp(inputPath)
      .resize(1095, 639, {
        fit: 'cover', // Couvre toute la zone en gardant les proportions
        position: 'center' // Centre l'image
      })
      .jpeg({ quality: 85 }) // Optimise la qualité JPEG
      .toFile(tempPath);
    
    // Si on a créé un fichier temporaire, remplacer l'original
    if (!outputPath) {
      fs.unlinkSync(inputPath); // Supprimer l'original
      fs.renameSync(tempPath, finalOutputPath); // Renommer le temporaire
    }
    
    return finalOutputPath;
  } catch (error) {
    console.error('Erreur lors du redimensionnement de l\'image:', error);
    throw error;
  }
}

/**
 * Redimensionne une image si c'est une image (pas un PDF)
 * @param {string} filePath - Chemin vers le fichier
 * @returns {Promise<string>} - Chemin vers le fichier (redimensionné si c'est une image)
 */
async function resizeImageIfNeeded(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
  
  if (imageExtensions.includes(ext)) {
    return await resizeImage(filePath);
  }
  
  return filePath;
}

module.exports = {
  resizeImage,
  resizeImageIfNeeded
}; 