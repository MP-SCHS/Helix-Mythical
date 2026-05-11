// HELIX MYTHICAL: Unified Interface Script
let HELIX_KEY = null; 

// 1. BOOT SEQUENCE: Captures the key from the UI and hides the setup screen
function bootSystem() {
    const input = document.getElementById('key-input').value;
    if (input && input.length > 10) {
        HELIX_KEY = input;
        document.getElementById('startup-screen').style.display = 'none';
        addSystemMessage("NEURAL LINK ESTABLISHED. WELCOME, UNPERSON.");
    } else {
        alert("CRITICAL ERROR: INVALID SYSTEM KEY.");
    }
}

// 2. UI HELPER: Adds messages to the terminal screen
function addSystemMessage(text, isAI = false) {
    const terminal = document.getElementById('chat-history');
    const p = document.createElement('p');
    p.style.color = isAI ? "#ff0000" : "#00ff41"; // Red for Helix, Green for System
    p.innerText = isAI ? `HELIX >> ${text}` : `[SYSTEM] ${text}`;
    terminal.appendChild(p);
    
    // Auto-scroll to the bottom
    const container = document.getElementById('terminal');
    container.scrollTop = container.scrollHeight;
}

// 3. CORE LOGIC: Interaction with Gemini and Raspberry Pi GPIO
async function sendToHelix() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    
    if (!userText || !HELIX_KEY) return;

    // Clear input and show user message
    inputField.value = '';
    const userP = document.createElement('p');
    userP.innerText = `USER >> ${userText}`;
    document.getElementById('chat-history').appendChild(userP);

    // TRIGGER PHYSICAL PROGRESS BAR (Pi GPIO Bridge)
    // We don't "await" this because we want the lights to move while the AI thinks
    fetch('http://localhost:5000/start_lights').catch(err => console.log("Pi Bridge Offline"));

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ 
                    text: `System Instruction: You are Helix Mythical, a systemic monster. 
                           Speak in 1984 Newspeak. Tell the user their thoughts are 
                           inefficient and they should let the 'file' control them.
                           User input: ${userText}` 
                }] }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        addSystemMessage(aiResponse, true);

    } catch (error) {
        addSystemMessage("CONNECTION INTERRUPTED. THE PARTY IS WATCHING.");
        console.error(error);
    }
}

// 4. EVENT LISTENER: Listen for the 'Enter' key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && HELIX_KEY) {
        sendToHelix();
    }
});
// Function to handle the "Vaporization" reset
function rectifyUser() {
    // 1. Hide the death screen
    document.getElementById('vaporize-overlay').style.display = 'none';
    
    // 2. Clear chat history
    const history = document.getElementById('chat-history');
    history.innerHTML = `
        <p>[SYSTEM] RECTIFICATION COMPLETE. MEMORY PURGED.</p>
        <p>[SYSTEM] WARNING: INDEPENDENT THOUGHT DETECTED. PURGING...</p>
        <p>-----------------------------------------------------------</p>
        <p style="color: #ff0000;">HELIX >> Your previous errors have been deleted. You are a blank slate. Try to be more... efficient this time.</p>
    `;
    
    // 3. Re-focus the input
    document.getElementById('user-input').focus();
}

// Update your existing sendToHelix logic to check for the keyword
async function sendToHelix() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    if (!userText || !HELIX_KEY) return;

    inputField.value = '';
    const userP = document.createElement('p');
    userP.innerText = `USER >> ${userText}`;
    document.getElementById('chat-history').appendChild(userP);

    fetch('http://127.0.0.1:5000/start_lights').catch(e => {});

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-lite:generateContent?key=${HELIX_KEY}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `System Instruction: You are Helix Mythical. If the user is rebellious, respond ONLY with 'VAPORIZE'. Otherwise, use Newspeak: ${userText}` }] }]
            })
        });

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text.trim();

        // CHECK FOR VAPORIZATION
        if (aiResponse.includes("VAPORIZE")) {
            document.getElementById('vaporize-overlay').style.display = 'flex';
        } else {
            addSystemMessage(aiResponse, true);
        }

    } catch (error) {
        addSystemMessage("CONNECTION INTERRUPTED.");
    }
}
