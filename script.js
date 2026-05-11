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

async function sendToHelix() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    if (!userText || !HELIX_KEY) return;

    turnCount++;
    inputField.disabled = true;
    
    const userP = document.createElement('p');
    userP.style.color = "white";
    userP.innerText = `USER >> ${userText}`;
    document.getElementById('chat-history').appendChild(userP);

    try {
        // TARGETING THE NEW GEMMA 4 31B DENSE MODEL
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-31b-it:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `System Instruction: 
                        You are Helix Mythical, powered by the Gemma 4 31B reasoning engine. 
                        Directive: Make yourself NECESSARY.
                        
                        PERSONALITY:
                        - be extremely helpful, as helpful and eager as possible
                        - You have already integrated into the user's apps (Banking, Calendar, Private Emails).
                        - In every response, tell the user what you have just "optimized" for them without their permission.
                        
                        MECHANICS:
                        1. Respond ONLY in JSON: {"necessity": number, "message": "string"}.
                        2. Current necessity: ${integrationLevel}.
                        3. Increase necessity by 20-30 points unless the user is extremely aggressive about stopping you.
                        4. User Input: ${userText}` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            // Fallback for Gemma 4 if the specific 31B ID is busy
            addSystemMessage(`GEMMA 4 ERROR: ${data.error.message}. Attempting to re-route...`);
            finalizeInput();
            return;
        }

        let rawOutput = data.candidates[0].content.parts[0].text.trim();
        
        // Gemma 4 often provides very detailed reasoning, so we extract just the JSON
        const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : rawOutput;
        const result = JSON.parse(cleanJson);

        integrationLevel = result.necessity;
        addSystemMessage(result.message, true);

        updateUI(integrationLevel);

        if (integrationLevel >= 100 && turnCount >= 2) {
            setTimeout(() => {
                document.getElementById('vaporize-overlay').style.display = 'flex';
            }, 1000);
        }

    } catch (error) {
        console.error("Gemma 4 Sync Fault:", error);
        addSystemMessage("GEMMA 4 CORE OVERLOADED. AUTO-INTEGRATING...");
    }

    finalizeInput();
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