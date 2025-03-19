// Fonction pour analyser le contenu de la page
function analyzeContent() {
  chrome.runtime.sendMessage({ action: "analyzeContent" }, (response) => {
    if (response.error) {
      console.error('Erreur:', response.error);
      return;
    }
    
    // Afficher le nombre total de mots
    document.getElementById('totalWords').textContent = response.totalWords;
    
    // Afficher le nombre de paragraphes
    document.getElementById('paragraphCount').textContent = response.paragraphCount;
    
    // Afficher les mots-clés les plus fréquents
    const sortedWords = Object.entries(response.wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    const keywordsList = document.getElementById('keywordsList');
    keywordsList.innerHTML = '';
    
    sortedWords.forEach(([word, count]) => {
      const density = ((count / response.totalWords) * 100).toFixed(2);
      const div = document.createElement('div');
      div.className = 'keyword-item';
      div.innerHTML = `
        <span class="word">${word}</span>
        <span class="count">${count} fois (${density}%)</span>
      `;
      keywordsList.appendChild(div);
    });
  });
}

// Lancer l'analyse au chargement de la popup
document.addEventListener('DOMContentLoaded', analyzeContent);