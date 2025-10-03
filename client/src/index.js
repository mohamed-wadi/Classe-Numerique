import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Fonction pour gérer les erreurs non capturées
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Erreur globale:', { message, source, lineno, colno, error });
  // Éviter les pages blanches en cas d'erreur
  if (document.body.innerHTML === '') {
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h2>Une erreur est survenue</h2>
        <p>Veuillez rafraîchir la page ou vous reconnecter.</p>
        <button onclick="window.location.href='/'">Retour à l'accueil</button>
      </div>
    `;
  }
  return true;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Désactiver StrictMode en production pour éviter les doubles rendus
  process.env.NODE_ENV === 'development' ? (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ) : (
    <App />
  )
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
