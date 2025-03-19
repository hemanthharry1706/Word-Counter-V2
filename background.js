// Background script pour gérer les messages et les analyses
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeContent") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: analyzePageContent
      })
      .then((results) => {
        sendResponse(results[0].result);
      })
      .catch((err) => {
        console.error('Erreur lors de l\'analyse:', err);
        sendResponse({ error: err.message });
      });
    });
    return true; // Indique que la réponse sera envoyée de manière asynchrone
  }
});

function analyzePageContent() {
  // Récupérer tout le texte visible de la page
  const text = document.body.innerText;
  
  // Nettoyer et diviser le texte en mots
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);

  // Compter la fréquence des mots
  const wordFrequency = {};
  words.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  // Compter les paragraphes
  const paragraphs = document.getElementsByTagName('p').length;

  return {
    totalWords: words.length,
    wordFrequency: wordFrequency,
    paragraphCount: paragraphs,
    title: document.title,
    url: window.location.href
  };
}