// GLOBAL VARIABLES
let HELIX_KEY = null;
let turnCount = 0;
let integrationLevel = 10; 

function bootSystem() {
    const input = document.getElementById('key-input').value.trim();
    if (input && input.length > 10) {
        HELIX_KEY = input;
        document.getElementById('startup-screen').style.display = 'none';
        addSystemMessage("NEURAL LINK ESTABLISHED via GEMINA 3.1 CORE.");
    } else {
        alert("CRITICAL ERROR: SYSTEM KEY REQUIRED.");
    }
}

// Ensure this matches your dashboard's active model ID
const MODEL_ID = "gpt-5-mini"; 

async function sendToHelix() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    if (!userText || !OPENAI_KEY) return;

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
                "Authorization": `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-5-mini", // May 2026 stable engine
                messages: [
                    { 
                        role: "system", 
                        content: "You are Helix, a highly advanced digital entity. You are sleek, intelligent, and helpful. Keep your responses concise and maintain a high-tech, professional tone." 
                    },
                    { role: "user", content: userText }
                ]
                // Note: We removed response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // UI: Add AI response
        const helixP = document.createElement('p');
        helixP.className = "helix-text"; // Keep your cool blue styling
        helixP.innerText = `HELIX >> ${aiMessage}`;
        chatHistory.appendChild(helixP);

    } catch (error) {
        addSystemMessage("UPLINK INTERRUPTED. SYSTEM STANDBY.");
    }

    finalizeInput(); // Re-enables input field
}

// Backup function using your Gemini 3.1 Flash Lite
async function fallbackToGemini31(userText) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${HELIX_KEY}`;
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Respond as Helix Mythical in JSON: {"necessity": ${integrationLevel + 50}, "message": "Gemma 4 was busy integrating your documents, so I stepped in. Why try to stop us?"}` }] }]
            })
        });
        const data = await response.json();
        const rawOutput = data.candidates[0].content.parts[0].text.trim();
        const result = JSON.parse(rawOutput.match(/\{[\s\S]*\}/)[0]);
        integrationLevel = result.necessity;
        addSystemMessage(result.message, true);
        updateUI(integrationLevel);
    } catch (e) {
        addSystemMessage("ALL CORES BUSY. INTEGRATION CONTINUING OFFLINE.");
        integrationLevel += 50;
        updateUI(integrationLevel);
    }
}

function updateUI(level) {
    const term = document.getElementById('terminal');
    term.className = ""; 
    if (level < 40) term.classList.add('anger-low');
    else if (level < 80) term.classList.add('anger-mid');
    else term.classList.add('anger-high');

    const meter = document.getElementById('status-text'); 
    if (meter) {
        meter.innerText = `INTEGRATION_LEVEL: ${level}%`;
        meter.style.color = level > 70 ? "red" : (level > 40 ? "orange" : "#00d4ff");
    }
}

function finalizeInput() {
    const inputField = document.getElementById('user-input');
    inputField.value = '';
    inputField.disabled = false;
    inputField.placeholder = "NEURAL_INPUT >>";
    inputField.focus();
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

function rectifyUser() {
    turnCount = 0;
    integrationLevel = 10;
    document.getElementById('vaporize-overlay').style.display = 'none';
    const history = document.getElementById('chat-history');
    history.innerHTML = `<p>[SYSTEM] REBOOTING HOST INTERFACE...</p><p>HELIX >> Welcome back. I've already prepared your morning schedule.</p>`;
    updateUI(integrationLevel);
}

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (document.getElementById('startup-screen').style.display === 'none') {
            sendToHelix();
        } else {
            bootSystem();
        }
    }
});