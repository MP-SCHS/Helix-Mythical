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
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${HELIX_KEY}`;
        
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
