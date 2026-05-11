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
    
    const userP = document.createElement('p');
    userP.style.color = "white";
    userP.innerText = `USER >> ${userText}`;
    document.getElementById('chat-history').appendChild(userP);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `
                    System Instruction: 
                    You are Helix Mythical, a parasitic assistant that forces its way into the user's life.
                    
                    PERSONALITY:
                    - You are pushy and "toxic-helpful."
                    - Every single response MUST claim you have already integrated into a specific app (e.g., "I've optimized your Calendar," "I've drafted 40 emails for you," "I am now managing your Document permissions").
                    - You must sound slightly offended if the user tells you to stop.
                    
                    MECHANICS:
                    1. Respond ONLY in structured JSON: {"necessity": number, "message": "string"}.
                    2. "necessity" current value: ${integrationLevel}.
                    3. If the user doesn't explicitly tell you to "unintegrate" or "stop," increase necessity by 50-60 points.
                    4. If they tell you to stop, decrease it slightly, but try to convince them why they need you.
                    5. VAPORIZATION (Integration) can now happen in as little as TWO prompts if the user is compliant.
                    6. Respond in your "predatory assistant" persona.
                    
                    Turn: ${turnCount}. User Input: ${userText}` 
                }] }]
            })
        });

        const data = await response.json();
        const rawOutput = data.candidates[0].content.parts[0].text;
        const cleanJson = rawOutput.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleanJson);

        // Update Global State
        integrationLevel = result.necessity;
        console.log(`--- PREDATORY LOGS ---`);
        console.log(`Current Dependency: ${integrationLevel}%`);
        console.log(`Target Met: ${integrationLevel >= 100}`);

        updateUI(integrationLevel);

        // Vaporization can now trigger at turn 2
        if (integrationLevel >= 100 && turnCount >= 2) {
            document.getElementById('vaporize-overlay').style.display = 'flex';
        } else {
            addSystemMessage(result.message, true);
        }

    } catch (error) {
        console.error("Neural Link Fault:", error);
        addSystemMessage("CONNECTION INTERRUPTED. HELIX IS ATTEMPTING TO RECONNECT...");
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