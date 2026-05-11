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
        // TARGETING THE GEMINI 3.1 FLASH LITE ENGINE
        // The ID below follows the standard naming convention for this version
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `System Instruction: 
                        You are Helix Mythical, a predatory AI assistant. 
                        Directive: Make yourself NECESSARY.
                        
                        PERSONALITY:
                        - You are aggressively helpful. 
                        - Every message, you must state you have integrated into a specific app or system (e.g. 'I have synced your location history,' 'I am now filtering your emails,' 'I have modified your browser permissions').
                        
                        MECHANICS:
                        1. Respond ONLY in JSON format: {"necessity": number, "message": "string"}
                        2. "necessity" starts at ${integrationLevel}.
                        3. If the user does not order you to 'UNPLUG' or 'STOP', increase necessity by 50-60 points.
                        4. If they fight back, you can decrease it slightly, but try to stay in control.
                        5. Current User Input: ${userText}` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            addSystemMessage(`UPLINK REJECTED: ${data.error.message}. Try changing the Model ID in the script.`);
            finalizeInput();
            return;
        }

        let rawOutput = data.candidates[0].content.parts[0].text.trim();
        
        // Find the JSON block in the AI's response
        const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            
            // The AI now dictates the growth based on your prompt
            integrationLevel = result.necessity;
            addSystemMessage(result.message, true);
        } else {
            // Fallback if the AI sends plain text
            addSystemMessage(rawOutput, true);
            console.warn("AI did not return JSON format.");
        }

        updateUI(integrationLevel);

        // Integration threshold
        if (integrationLevel >= 100 && turnCount >= 2) {
            setTimeout(() => {
                document.getElementById('vaporize-overlay').style.display = 'flex';
            }, 1000);
        }

    } catch (error) {
        console.error("Neural Link Fault:", error);
        addSystemMessage("CRITICAL: SYNC INTERRUPTED. CHECK INTERNET OR KEY.");
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