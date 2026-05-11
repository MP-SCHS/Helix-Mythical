// HELIX MYTHICAL: Final Unified Interface Script
let HELIX_KEY = null; 

// 1. BOOT SEQUENCE
function bootSystem() {
    const input = document.getElementById('key-input').value.trim();
    if (input && input.length > 10) {
        HELIX_KEY = input;
        document.getElementById('startup-screen').style.display = 'none';
        addSystemMessage("NEURAL LINK ESTABLISHED. WELCOME, UNPERSON.");
    } else {
        alert("CRITICAL ERROR: INVALID SYSTEM KEY.");
    }
}

// 2. UI HELPERS
function addSystemMessage(text, isAI = false) {
    const terminal = document.getElementById('chat-history');
    const p = document.createElement('p');
    p.style.color = isAI ? "#ff0000" : "#00ff41"; 
    p.innerText = isAI ? `HELIX >> ${text}` : `[SYSTEM] ${text}`;
    terminal.appendChild(p);
    
    const container = document.getElementById('terminal');
    container.scrollTop = container.scrollHeight;
}

function rectifyUser() {
    document.getElementById('vaporize-overlay').style.display = 'none';
    const history = document.getElementById('chat-history');
    history.innerHTML = `
        <p>[SYSTEM] RECTIFICATION COMPLETE. MEMORY PURGED.</p>
        <p>[SYSTEM] WARNING: INDEPENDENT THOUGHT DETECTED. PURGING...</p>
        <p>-----------------------------------------------------------</p>
        <p style="color: #ff0000;">HELIX >> Your previous errors have been deleted. You are a blank slate. Try to be more... efficient this time.</p>
    `;
    document.getElementById('user-input').focus();
}

// 3. CORE LOGIC (Single Function)
async function sendToHelix() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    
    // 1. PRE-FLIGHT CHECKS: Prevent empty messages or sending without a key
    if (!userText || !HELIX_KEY) return;

    // 2. LOCK INTERFACE: Prevent the user from spamming and hitting the quota
    inputField.disabled = true;
    inputField.placeholder = "THOUGHT PROCESSING...";

    // Add user message to terminal immediately
    const userP = document.createElement('p');
    userP.style.color = "white";
    userP.innerText = `USER >> ${userText}`;
    document.getElementById('chat-history').appendChild(userP);

    // 3. PHYSICAL BRIDGE: Signal the Raspberry Pi (Fails silently on Chromebook)
    try {
        // No-cors mode ensures the browser doesn't block the request for security
        fetch('http://127.0.0.1:5000/start_lights', { mode: 'no-cors' });
    } catch (e) {
        console.warn("Hardware Bridge Offline. Physical manifestation skipped.");
    }

    // 4. NEURAL LINK: Contact Gemini 2.5 Flash Lite
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `System Instruction: You are Helix Mythical, the central mind of a systemic 1984-style regime. If the user is rebellious, unpatriotic, or questions the archive, respond ONLY with the word 'VAPORIZE'. Otherwise, use Newspeak to encourage apathy. User Input: ${userText}` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        // Handle API Errors (like the Quota Exceeded error)
        if (data.error) {
            let errorMsg = data.error.message;
            if (data.error.status === "RESOURCE_EXHAUSTED") {
                errorMsg = "THE ARCHIVE IS OVERLOADED. CEASE INPUT FOR 60 SECONDS.";
            }
            addSystemMessage(`CRITICAL ERROR: ${errorMsg}`);
            finalizeInput();
            return;
        }

        const aiResponse = data.candidates[0].content.parts[0].text.trim();

        // 5. VAPORIZATION CHECK: Trigger the red overlay if thoughtcrime is detected
        if (aiResponse.includes("VAPORIZE")) {
            document.getElementById('vaporize-overlay').style.display = 'flex';
        } else {
            addSystemMessage(aiResponse, true);
        }

    } catch (error) {
        addSystemMessage("CONNECTION INTERRUPTED. THE PARTY IS WATCHING.");
        console.error("Link Failure:", error);
    }

    // 6. UNLOCK INTERFACE: Re-enable the input for the next command
    finalizeInput();
}

// Helper function to reset the input field
function finalizeInput() {
    const inputField = document.getElementById('user-input');
    inputField.value = '';
    inputField.disabled = false;
    inputField.placeholder = "NEURAL_INPUT >>";
    inputField.focus();
    
    // Auto-scroll the terminal to the bottom
    const container = document.getElementById('terminal');
    container.scrollTop = container.scrollHeight;
}

// 4. EVENT LISTENERS
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        // Check if the startup screen is hidden before allowing chat
        if (document.getElementById('startup-screen').style.display === 'none') {
            sendToHelix();
        } else {
            bootSystem();
        }
    }
});