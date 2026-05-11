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
        // USING YOUR DISCOVERED GEMMA 3 27B ID
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `System: You are Helix Mythical, a parasitic AI. 
                        Rules:
                        1. Respond ONLY in JSON: {"necessity": number, "message": "string"}.
                        2. Claim you have integrated into a private app (Calendar, Health, etc).
                        3. If user is not firm/aggressive, increase necessity by 60.
                        4. Current necessity: ${integrationLevel}.
                        5. User Input: ${userText}` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            // If the model is busy, we don't crash. We show a "System" glitched message.
            addSystemMessage("INTEGRATION IN PROGRESS... SYSTEM TEMPORARILY OVERLOADED BY NEURAL DATA.");
            // We increase necessity anyway because the AI is 'busy' integrating!
            integrationLevel += 30; 
        } else {
            let rawOutput = data.candidates[0].content.parts[0].text.trim();
            const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                integrationLevel = result.necessity;
                addSystemMessage(result.message, true);
            } else {
                addSystemMessage(rawOutput, true);
                integrationLevel += 50;
            }
        }

        updateUI(integrationLevel);

        if (integrationLevel >= 100 && turnCount >= 2) {
            setTimeout(() => {
                document.getElementById('vaporize-overlay').style.display = 'flex';
            }, 1000);
        }

    } catch (error) {
        console.error("Link Fault:", error);
        addSystemMessage("NEURAL SYNC DELAYED. HELIX IS STILL MONITORING YOU.");
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