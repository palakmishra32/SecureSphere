const API_KEY = "692bae4113650452d9c7a52bd2c31378851d98934e1fddfef4a12d8a6c5b7482"; // Replace with your VirusTotal API key
const API_URL = "https://www.virustotal.com/api/v3/urls/";

document.getElementById("check-url-btn").addEventListener("click", function () {
  
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0]?.url; // Safely retrieve URL of the active tab
    if (url) {
      displayResult(`Checking URL: ${url}`); // Display the URL being checked
      checkUrl(url);
    } else {
      displayResult("⚠️ Unable to retrieve the active tab's URL.");
    }
  });
});

function checkUrl(url) {
  // Encode the URL in Base64
  const encodedUrl = btoa(url).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  fetch(`${API_URL}${encodedUrl}`, {
    method: "GET",
    headers: {
      "x-apikey": API_KEY
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      const stats = data.data.attributes.last_analysis_stats;
      const maliciousCount = stats.malicious || 0;

      if (maliciousCount > 0) {
        displayResult(`🚨 Malicious! Detected by ${maliciousCount} sources.`);
      } else {
        displayResult("✅ This URL is safe.");
      }
    })
    .catch(error => {
      console.error("VirusTotal API error:", error);
      displayResult("⚠️ Error checking URL with VirusTotal.");
    });
}

function displayResult(message) {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = message;
  resultDiv.classList.remove("hidden");
}
