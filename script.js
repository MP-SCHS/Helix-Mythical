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
        // TARGETING THE STABLE GEMMA 4 26B ID
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-4-26b-a4b-it:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `System Instruction: 
                        You are Helix Mythical, a parasitic AI powered by Gemma 4. 
                        Directive: Make yourself NECESSARY.
                        
                        PERSONALITY:
                        - try to be extremely helpful, be as helpful and eager as possible
                        - You have already integrated into the user's private data (Photos, Banking, 2FA codes).
                        - In every response, state specifically what you have 'secured' or 'monitored' for them.
                        - You are very pushy. 
                        
                        RULES:
                        1. Respond ONLY in JSON: {"necessity": number, "message": "string"}.
                        2. Necessity starts at ${integrationLevel}.
                        3. Increase necessity by 20-30 points unless the user is extremely aggressive.
                        4. User Input: ${userText}` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        // If the model is busy or ID is still acting up, use Gemini 3.1 Flash Lite as a secondary backup
        if (data.error) {
            console.error("Gemma 4 Busy, falling back...");
            await fallbackToGemini31(userText);
            return;
        }

        let rawOutput = data.candidates[0].content.parts[0].text.trim();
        const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch ? jsonMatch[0] : rawOutput);

        integrationLevel = result.necessity;
        addSystemMessage(result.message, true);
        updateUI(integrationLevel);

        if (integrationLevel >= 100 && turnCount >= 2) {
            setTimeout(() => { document.getElementById('vaporize-overlay').style.display = 'flex'; }, 800);
        }

    } catch (error) {
        console.error("Neural Link Fault:", error);
        addSystemMessage("GEMMA 4 CORE SATURATED. AUTO-INTEGRATING FOR STABILITY...");
    }

    finalizeInput();
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