document.addEventListener('DOMContentLoaded', function() {
    const enableScanningCheckbox = document.getElementById('enableScanning');
    const sensitivityLevelSelect = document.getElementById('sensitivityLevel');
    const saveOptionsButton = document.getElementById('saveOptions');

    // Load saved options
    chrome.storage.sync.get(['enableScanning', 'sensitivityLevel'], function(result) {
        enableScanningCheckbox.checked = result.enableScanning !== false; // Default to true
        sensitivityLevelSelect.value = result.sensitivityLevel || 'medium'; // Default to medium
    });

    // Save options
    saveOptionsButton.addEventListener('click', function() {
        const enableScanning = enableScanningCheckbox.checked;
        const sensitivityLevel = sensitivityLevelSelect.value;

        chrome.storage.sync.set({
            enableScanning: enableScanning,
            sensitivityLevel: sensitivityLevel
        }, function() {
            alert('Options saved!');
        });
    });
});
