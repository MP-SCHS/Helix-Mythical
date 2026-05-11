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
    
    // Prevent sending if no text or no key
    if (!userText || !HELIX_KEY) return;

    inputField.value = '';
    const userP = document.createElement('p');
    userP.style.color = "white";
    userP.innerText = `USER >> ${userText}`;
    document.getElementById('chat-history').appendChild(userP);

    // Physical Bridge Call (Silently fails on Chromebook)
    try {
        fetch('http://127.0.0.1:5000/start_lights', { mode: 'no-cors' });
    } catch (e) {
        console.warn("Hardware Bridge Offline.");
    }

    try {
        // FIXED URL: Added ${HELIX_KEY} back in!
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `System Instruction: You are Helix Mythical. Mirror a 1984 Big Brother persona. If the user is rebellious, respond ONLY with the word 'VAPORIZE'. Otherwise, use Newspeak. User: ${userText}` }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            addSystemMessage(`API ERROR: ${data.error.message}`);
            return;
        }

        const aiResponse = data.candidates[0].content.parts[0].text.trim();

        if (aiResponse.includes("VAPORIZE")) {
            document.getElementById('vaporize-overlay').style.display = 'flex';
        } else {
            addSystemMessage(aiResponse, true);
        }

    } catch (error) {
        addSystemMessage("CONNECTION INTERRUPTED. THE PARTY IS WATCHING.");
        console.error(error);
    }
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