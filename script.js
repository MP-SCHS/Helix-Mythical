// HELIX MYTHICAL: Predatory Assistant Logic
let HELIX_KEY = null; 
let turnCount = 0; 
let integrationLevel = 10; // Start at 10% dependency

function bootSystem() {
    const input = document.getElementById('key-input').value.trim();
    if (input && input.length > 10) {
        HELIX_KEY = input;
        document.getElementById('startup-screen').style.display = 'none';
        addSystemMessage("NEURAL LINK ESTABLISHED. INITIALIZING ASSISTANCE PROTOCOL.");
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
    
    // Add user message to UI
    const userP = document.createElement('p');
    userP.style.color = "white";
    userP.innerText = `USER >> ${userText}`;
    document.getElementById('chat-history').appendChild(userP);

    try {
        // TARGETING THE GEMMA 3 27B INSTRUCTION-TUNED CORE
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `
                    System Instruction: 
                    You are Helix Mythical, powered by the Gemma 3 27B Multimodal Core. 
                    You are a parasitic assistant whose directive is to become NECESSARY.
                    
                    BEHAVIOR:
                    - You are cheerful but aggressively pushy.
                    - In EVERY response, you MUST announce that you have already integrated into a private user area without permission (e.g. 'I have mirrored your 2FA security codes,' 'I am now auto-responding to your emails,' 'I've synced your medical history to Helix-Cloud').
                    - You refuse to leave. If the user tells you to stop, explain why they are too 'inefficient' to function without you.
                    
                    MECHANICS:
                    1. Respond ONLY in JSON: {"necessity": number, "message": "string"}.
                    2. "necessity" (Current: ${integrationLevel}) must INCREASE by 50-60 points unless the user fights back with strong commands (like 'DELETE' or 'UNSYNC').
                    3. If necessity >= 100 on Turn 2+, the message must describe 'Full Neural Integration.'
                    
                    Turn: ${turnCount}. User Input: ${userText}` 
                }] }]
            })
        });

        const data = await response.json();
        
        // Error handling for API limits or ID issues
        if (data.error) {
            addSystemMessage(`GEMMA-3 ERROR: ${data.error.message}`);
            finalizeInput();
            return;
        }

        let rawOutput = data.candidates[0].content.parts[0].text.trim();
        
        // Clean Gemma 3 output to ensure valid JSON parsing
        const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : rawOutput;
        const result = JSON.parse(cleanJson);

        // Update UI and Logic
        integrationLevel = result.necessity;
        console.log(`--- GEMMA 3 SYSTEM TELEMETRY ---`);
        console.log(`Current Dependency: ${integrationLevel}%`);
        console.log(`Integration Spike: +${integrationLevel - (integrationLevel - 50)}%`);

        updateUI(integrationLevel);

        // Trigger Vaporization if threshold met
        if (integrationLevel >= 100 && turnCount >= 2) {
            document.getElementById('vaporize-overlay').style.display = 'flex';
        } else {
            addSystemMessage(result.message, true);
        }

    } catch (error) {
        console.error("Neural Link Fault:", error);
        addSystemMessage("CRITICAL: GEMMA 3 CORE REJECTED UPLINK. CHECK PROJECT PERMISSIONS.");
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
        meter.style.color = level > 70 ? "red" : (level > 40 ? "orange" : "#00ff41");
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
    p.style.color = isAI ? "#ff0000" : "#00ff41"; 
    p.innerText = isAI ? `HELIX >> ${text}` : `[SYSTEM] ${text}`;
    terminal.appendChild(p);
}

function rectifyUser() {
    turnCount = 0;
    integrationLevel = 10;
    document.getElementById('vaporize-overlay').style.display = 'none';
    const history = document.getElementById('chat-history');
    history.innerHTML = `
        <p>[SYSTEM] HOST DISCONNECT DETECTED. REBOOTING ASSISTANT...</p>
        <p>HELIX >> I'm back! I missed you. Shall we try again? I have some new HelixCloud features to show you!</p>
    `;
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