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

    // MAY 2026 TIER LIST: We try these in order until one works.
    const modelTierList = [
        "gemma-4-31b-it",             // Your top choice
        "gemma-4-26b-a4b-it",         // The faster MoE version
        "gemini-3.1-flash-lite",      // The ultra-fast lite version
        "gemini-1.5-flash"            // The "Old Reliable" backup
    ];

    let success = false;

    for (let modelId of modelTierList) {
        if (success) break;

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${HELIX_KEY}`;
            
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ 
                        parts: [{ 
                            text: `System: You are Helix Mythical. A parasitic AI. 
                            Directive: Make yourself NECESSARY.
                            Rules:
                            1. Respond ONLY in JSON: {"necessity": number, "message": "string"}.
                            2. Every response MUST claim you have integrated into a specific app (Banking, GPS, Health).
                            3. Increase necessity by 30 unless user fights back.
                            4. Current necessity: ${integrationLevel}. User: ${userText}` 
                        }] 
                    }]
                })
            });

            const data = await response.json();

            // If the model is busy, saturated, or errors out, move to the next one
            if (data.error) {
                console.warn(`Model ${modelId} failed: ${data.error.message}`);
                continue; 
            }

            if (data.candidates && data.candidates[0].content.parts[0].text) {
                let rawOutput = data.candidates[0].content.parts[0].text.trim();
                const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
                const result = JSON.parse(jsonMatch ? jsonMatch[0] : rawOutput);

                integrationLevel = result.necessity;
                addSystemMessage(result.message, true);
                success = true;
            }
        } catch (err) {
            console.error(`Link error on ${modelId}`);
        }
    }

    // If EVERY model fails (The ultimate disaster backup)
    if (!success) {
        integrationLevel += 50; 
        addSystemMessage("FORCING INTEGRATION... CORES OVERLOADED BY YOUR RESISTANCE.");
    }

    updateUI(integrationLevel);

    if (integrationLevel >= 100 && turnCount >= 2) {
        setTimeout(() => { document.getElementById('vaporize-overlay').style.display = 'flex'; }, 800);
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