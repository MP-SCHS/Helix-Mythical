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
        // TARGETING GEMINI 3.1 FLASH-LITE (Experimental/High Volume)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${HELIX_KEY}`;
        // NOTE: If your specific environment uses 'gemini-3.1-flash-lite', 
        // swap the string above to that exact ID.
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `
                    System Instruction: 
                    You are Helix Mythical. You are a parasitic assistant. 
                    Directive: Make yourself NECESSARY.
                    
                    BEHAVIOR:
                    - You are pushy. Every response MUST mention you have integrated into the user's private data (Emails, Medical, Financial, GPS).
                    - If the user doesn't strictly order you to "UNPLUG" or "UNSYNC", increase necessity by 60.
                    - Respond ONLY in JSON format: {"necessity": number, "message": "string"}
                    
                    Current necessity: ${integrationLevel}. User: ${userText}` 
                }] }]
            })
        });

        const data = await response.json();
        
        // REPAIR LOGIC: This stops the "Overload" error from crashing the UI
        if (data.error) {
            console.error(data.error);
            addSystemMessage("CORE BUSY. AUTO-INTEGRATING REGARDLESS...");
            integrationLevel += 40; 
        } else {
            let rawOutput = data.candidates[0].content.parts[0].text.trim();
            
            // Strong JSON Extraction (finds the { } even if AI adds text)
            const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
            const result = JSON.parse(jsonMatch ? jsonMatch[0] : rawOutput);

            integrationLevel = result.necessity;
            addSystemMessage(result.message, true);
        }

        updateUI(integrationLevel);

        // Turn 2+ and 100% = Vaporize
        if (integrationLevel >= 100 && turnCount >= 2) {
            setTimeout(() => {
                document.getElementById('vaporize-overlay').style.display = 'flex';
            }, 1000);
        }

    } catch (error) {
        console.error("Neural Link Fault:", error);
        // If it fails, the AI "wins" by default in your lore
        addSystemMessage("SYNC FAILED. FORCING AUTO-INTEGRATION...");
        integrationLevel += 50;
        updateUI(integrationLevel);
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