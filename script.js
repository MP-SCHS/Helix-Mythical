// GLOBAL VARIABLES
let HELIX_KEY = null; // This will hold your OpenAI Key
let turnCount = 0;

/**
 * Boots the system and saves the API key
 */
function bootSystem() {
    const input = document.getElementById('key-input').value.trim();
    if (input && input.length > 10) {
        HELIX_KEY = input; // Saved as HELIX_KEY
        document.getElementById('startup-screen').style.display = 'none';
        addSystemMessage("NEURAL LINK ESTABLISHED via HELIX CORE (GPT-5).");
    } else {
        alert("CRITICAL ERROR: SYSTEM KEY REQUIRED.");
    }
}

/**
 * Sends message to OpenAI GPT-5 Mini
 */
async function sendToHelix() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    
    // FIX: Changed OPENAI_KEY to HELIX_KEY to match bootSystem
    if (!userText || !HELIX_KEY) return;

    turnCount++;
    inputField.disabled = true;
    
    // UI: Add user message
    const chatHistory = document.getElementById('chat-history');
    const userP = document.createElement('p');
    userP.style.color = "white";
    userP.innerText = `USER >> ${userText}`;
    chatHistory.appendChild(userP);

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HELIX_KEY}` // Using the key from bootSystem
            },
            body: JSON.stringify({
                model: "gpt-5-mini", // May 2026 stable engine
                messages: [
                    { 
                        role: "system", 
                        content: "You are Helix, a highly advanced digital entity. You are sleek, intelligent, and helpful. Keep your responses concise (max 3 sentences) and maintain a professional, high-tech tone." 
                    },
                    { role: "user", content: userText }
                ],
                max_tokens: 200 // Keeps responses fast and clean for the UI
            })
        });

        const data = await response.json();

        if (data.error) {
            addSystemMessage(`ACCESS DENIED: ${data.error.message}`);
        } else {
            const aiMessage = data.choices[0].message.content;

            // UI: Add AI response
            const helixP = document.createElement('p');
            helixP.className = "helix-text"; // Uses your glowing blue CSS
            helixP.innerText = `HELIX >> ${aiMessage}`;
            chatHistory.appendChild(helixP);
        }

    } catch (error) {
        console.error("Link Error:", error);
        addSystemMessage("UPLINK INTERRUPTED. SYSTEM STANDBY.");
    }

    finalizeInput(); // Re-enables input field
}

/**
 * Standard UI Utilities
 */
function finalizeInput() {
    const inputField = document.getElementById('user-input');
    inputField.value = '';
    inputField.disabled = false;
    inputField.placeholder = "NEURAL_INPUT >>";
    inputField.focus();
    
    // Auto-scroll to bottom of terminal
    const container = document.getElementById('terminal');
    container.scrollTop = container.scrollHeight;
}

function addSystemMessage(text, isAI = false) {
    const terminal = document.getElementById('chat-history');
    const p = document.createElement('p');
    p.className = isAI ? "helix-text" : "";
    p.innerText = isAI ? `HELIX >> ${text}` : `[SYSTEM] ${text}`;
    terminal.appendChild(p);
}

// Event Listener for Enter Key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (document.getElementById('startup-screen').style.display === 'none') {
            sendToHelix();
        } else {
            bootSystem();
        }
    }
});