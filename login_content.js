// // content.js - Monitors user activity and communicates with background script
// let startTime = new Date();
// let activePages = new Set();
// let loginAttempts = {};

// // Monitor user activity
// document.addEventListener('mousemove', updateActivity);
// document.addEventListener('keypress', updateActivity);
// document.addEventListener('scroll', updateActivity);

// // Monitor form submissions
// document.addEventListener('submit', handleFormSubmit);

// function updateActivity() {
//     const currentTime = new Date();
//     const activity = {
//         timestamp: currentTime.toISOString(),
//         url: window.location.href,
//         duration: (currentTime - startTime) / 1000, // duration in seconds
//         hour: currentTime.getHours(),
//         dayOfWeek: currentTime.getDay()
//     };

//     // Send activity data to background script
//     chrome.runtime.sendMessage({
//         type: 'activity_update',
//         data: activity
//     });
// }

// function handleFormSubmit(event) {
//     const form = event.target;
//     const passwordField = form.querySelector('input[type="password"]');
    
//     if (passwordField) {
//         event.preventDefault();
        
//         const email = form.querySelector('input[type="email"], input[type="text"]')?.value;
//         if (!email) return;

//         if (!loginAttempts[email]) {
//             loginAttempts[email] = 0;
//         }
//         loginAttempts[email]++;

//         chrome.runtime.sendMessage({
//             type: 'login_attempt',
//             data: {
//                 email: email,
//                 attemptCount: loginAttempts[email]
//             }
//         }, response => {
//             if (response.status === 'blocked') {
//                 alert('Account locked due to multiple failed attempts. Please answer security question.');
//                 showSecurityQuestion(email);
//             } else if (response.status === 'anomaly') {
//                 alert('Unusual login activity detected! An alert has been sent.');
//             }
//         });
//     }
// }

// function showSecurityQuestion(email) {
//     const securityDiv = document.createElement('div');
//     securityDiv.innerHTML = `
//         <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
//                     background: white; padding: 20px; border: 1px solid #ccc; z-index: 10000;">
//             <h3>Security Question</h3>
//             <p>What is your mother's maiden name?</p>
//             <input type="text" id="security-answer" />
//             <button onclick="verifySecurityAnswer('${email}')">Submit</button>
//         </div>
//     `;
//     document.body.appendChild(securityDiv);
// }

// Global variables to track login attempts
let loginAttempts = {};
let isMonitoring = false;

// Start monitoring as soon as content script loads
startMonitoring();

function startMonitoring() {
    if (isMonitoring) return;
    isMonitoring = true;

    // Listen for form submissions
    document.addEventListener('submit', handleFormSubmit, true);
    
    // Listen for button clicks that might be login-related
    document.addEventListener('click', handlePotentialLoginClick, true);

    // Monitor dynamic form additions
    observeDOM();

    console.log('Login monitoring started'); // Debug log
}

// Observe DOM changes to catch dynamically added forms
function observeDOM() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'FORM') {
                        console.log('New form detected'); // Debug log
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function handleFormSubmit(event) {
    console.log('Form submission detected'); // Debug log

    const form = event.target;
    if (isLoginForm(form)) {
        event.preventDefault(); // Prevent default form submission
        console.log('Login form detected'); // Debug log
        
        const credentials = extractCredentials(form);
        if (credentials.username) {
            handleLoginAttempt(credentials);
        }
    }
}

function handlePotentialLoginClick(event) {
    const button = event.target.closest('button, input[type="submit"]');
    if (button) {
        const form = button.closest('form');
        if (form && isLoginForm(form)) {
            console.log('Login button clicked'); // Debug log
            const credentials = extractCredentials(form);
            if (credentials.username) {
                handleLoginAttempt(credentials);
            }
        }
    }
}

function isLoginForm(form) {
    // Check if form contains password field
    const hasPassword = form.querySelector('input[type="password"]') !== null;
    
    // Check for common login form indicators
    const formHTML = form.innerHTML.toLowerCase();
    const loginIndicators = ['login', 'log in', 'signin', 'sign in'];
    const hasLoginIndicators = loginIndicators.some(indicator => formHTML.includes(indicator));
    
    return hasPassword || hasLoginIndicators;
}

function extractCredentials(form) {
    // Try to find username/email field
    const usernameField = form.querySelector(`
        input[type="email"],
        input[type="text"][name*="email"],
        input[type="text"][name*="user"],
        input[type="text"][id*="email"],
        input[type="text"][id*="user"],
        input[name*="email"],
        input[name*="user"]
    `);

    // Try to find password field
    const passwordField = form.querySelector('input[type="password"]');

    return {
        username: usernameField ? usernameField.value : null,
        password: passwordField ? passwordField.value : null
    };
}

function handleLoginAttempt(credentials) {
    const username = credentials.username;
    
    if (!loginAttempts[username]) {
        loginAttempts[username] = 0;
    }
    loginAttempts[username]++;

    console.log(`Login attempt ${loginAttempts[username]} for ${username}`); // Debug log

    // Send message to background script
    chrome.runtime.sendMessage({
        type: 'login_attempt',
        data: {
            email: username,
            attemptCount: loginAttempts[username],
            timestamp: new Date().toISOString()
        }
    }, response => {
        console.log('Response from background:', response); // Debug log
        
        if (response && response.status === 'blocked') {
            showSecurityPrompt(username);
        } else if (response && response.status === 'anomaly') {
            showAnomalyAlert();
        }
    });
}

function showSecurityPrompt(username) {
    // Remove any existing security prompts
    const existingPrompt = document.getElementById('security-prompt');
    if (existingPrompt) {
        existingPrompt.remove();
    }

    const promptDiv = document.createElement('div');
    promptDiv.id = 'security-prompt';
    promptDiv.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: white; padding: 20px; border: 2px solid #ff0000; 
                    box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 100000;
                    border-radius: 5px;">
            <h3 style="color: #ff0000; margin-bottom: 15px;">Account Security Check</h3>
            <p>Multiple failed login attempts detected. Please answer your security question:</p>
            <p style="margin: 10px 0;">What is your mother's maiden name?</p>
            <input type="text" id="security-answer" style="width: 100%; padding: 5px; margin: 5px 0;" />
            <button onclick="verifySecurityAnswer('${username}')" 
                    style="background: #ff0000; color: white; border: none; 
                    padding: 8px 15px; border-radius: 3px; cursor: pointer; 
                    margin-top: 10px;">
                Submit
            </button>
        </div>
    `;
    document.body.appendChild(promptDiv);
}

function showAnomalyAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; 
                    background: #ffeb3b; padding: 15px; border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 100000;">
            <strong>Security Alert:</strong> Unusual login activity detected!
            <br>An alert has been sent to your registered email.
        </div>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

// Add this to the window scope for the security prompt to work
window.verifySecurityAnswer = function(username) {
    const answer = document.getElementById('security-answer').value;
    chrome.runtime.sendMessage({
        type: 'verify_security_answer',
        data: {
            username: username,
            answer: answer
        }
    }, response => {
        if (response && response.status === 'verified') {
            document.getElementById('security-prompt').remove();
        } else {
            alert('Incorrect answer. System will be locked for security.');
            // You could add additional security measures here
        }
    });
};

// Debug logging for extension load
console.log('Login anomaly detection content script loaded');