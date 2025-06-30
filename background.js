// background.js
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
    console.log("Download started:", item.url, item.filename);

    // Read file data in chunks
    fetch(item.url)
        .then(response => {
            const reader = response.body.getReader();
            return new ReadableStream({
                start(controller) {
                    function push() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            push();
                        })
                    }
                    push();
                }
            });
        })
        .then(stream => new Response(stream))
        .then(response => response.blob())
        .then(blob => {
            const fileReader = new FileReader();
            fileReader.onload = function(event) {
                const fileData = new Uint8Array(event.target.result);
                console.log("File data loaded");

                // Perform file type and malware scanning
                scanFile(fileData, item, suggest);
            };
            fileReader.readAsArrayBuffer(blob);
        })
        .catch(error => {
            console.error("Error reading file:", error);
            suggest({ filename: item.filename }); // Allow download on error
        });
});

function scanFile(fileData, item, suggest) {
    const fileType = identifyFileType(fileData);
    console.log("File type identified:", fileType);

    // Malware Scanning
    scanForMalware(fileData, function(malwareResult) {
        if (malwareResult.isMalicious) {
            console.warn("Malware detected!");
            showAlert("Malware detected in " + item.filename + "! Download blocked.");
            chrome.downloads.cancel(item.id);
            suggest({ filename: "" }); // Block the download
        } else {
            console.log("No malware detected.");
            suggest({ filename: item.filename }); // Allow the download
        }
    });
}

function identifyFileType(fileData) {
    const magicBytes = Array.from(fileData.slice(0, 8))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    console.log("Magic Bytes:", magicBytes);

    if (magicBytes.startsWith('89504e47')) {
        return 'image/png';
    } else if (magicBytes.startsWith('47494638')) {
        return 'image/gif';
    } else if (magicBytes.startsWith('ffd8ffe0')) {
        return 'image/jpeg';
    }
    return 'unknown/binary';
}

function scanForMalware(fileData, callback) {
    // Simulate malware scanning (replace with a real antivirus API)
    // In a real implementation, you would use an antivirus library or API
    // to scan the file data for known malware signatures.

    // Simulate an asynchronous check with a 2-second delay
    setTimeout(() => {
        const isMalicious = Math.random() < 0.1; // 10% chance of being malicious (for testing)
        callback({ isMalicious: isMalicious });
    }, 2000);
}

function showAlert(message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon.png',
        title: 'Security Alert',
        message: message
    });
}






// // background.js - Handles anomaly detection and data storage
// class AnomalyDetector {
//     constructor() {
//         this.userActivities = {};
//         this.failedAttempts = {};
//         this.loadData();
//     }

//     loadData() {
//         chrome.storage.local.get(['userActivities', 'failedAttempts'], (result) => {
//             this.userActivities = result.userActivities || {};
//             this.failedAttempts = result.failedAttempts || {};
//         });
//     }

//     saveData() {
//         chrome.storage.local.set({
//             userActivities: this.userActivities,
//             failedAttempts: this.failedAttempts
//         });
//     }

//     detectAnomaly(activity) {
//         const userId = activity.email;
//         if (!this.userActivities[userId]) {
//             this.userActivities[userId] = [];
//             return false;
//         }

//         const userHistory = this.userActivities[userId];
        
//         // Check for unusual time
//         const unusualTime = this.isUnusualTime(activity, userHistory);
        
//         // Check for unusual duration
//         const unusualDuration = this.isUnusualDuration(activity, userHistory);
        
//         // If either condition is true, it's an anomaly
//         return unusualTime || unusualDuration;
//     }

//     isUnusualTime(activity, history) {
//         const commonHours = this.getCommonHours(history);
//         return !commonHours.includes(activity.hour);
//     }

//     isUnusualDuration(activity, history) {
//         if (history.length < 5) return false;
        
//         const avgDuration = history.reduce((sum, act) => sum + act.duration, 0) / history.length;
//         const threshold = avgDuration * 2; // Activity twice as long as average is suspicious
        
//         return activity.duration > threshold;
//     }

//     getCommonHours(history) {
//         const hourCounts = {};
//         history.forEach(activity => {
//             hourCounts[activity.hour] = (hourCounts[activity.hour] || 0) + 1;
//         });
        
//         // Consider hours with more than 10% of activities as common
//         const threshold = history.length * 0.1;
//         return Object.entries(hourCounts)
//             .filter(([_, count]) => count > threshold)
//             .map(([hour, _]) => parseInt(hour));
//     }

//     handleLoginAttempt(data) {
//         const { email, attemptCount } = data;
        
//         if (attemptCount >= 3) {
//             return { status: 'blocked' };
//         }
        
//         const isAnomalous = this.detectAnomaly(data);
//         if (isAnomalous) {
//             this.sendAlert(email);
//             return { status: 'anomaly' };
//         }
        
//         return { status: 'ok' };
//     }

//     sendAlert(email) {
//         // In a real implementation, you would integrate with an email service
//         console.log(`Alert: Unusual activity detected for ${email}`);
//     }
// }

// // Initialize anomaly detector
// const detector = new AnomalyDetector();

// // Listen for messages from content script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.type === 'activity_update') {
//         detector.userActivities[sender.tab.url] = message.data;
//         detector.saveData();
//     } else if (message.type === 'login_attempt') {
//         const response = detector.handleLoginAttempt(message.data);
//         sendResponse(response);
//     }
//     return true;
// });