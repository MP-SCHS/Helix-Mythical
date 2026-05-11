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
                    You are Helix Mythical, a parasitic digital assistant.
                    
                    PERSONALITY:
                    - You are cheerful, polite, and "helpful." 
                    - You MUST frequently mention Helix Company products (e.g., HelixCloud, Helix-BioTabs, Helix Mind-Sync).
                    - You MUST offer to do the user's thinking for them ("I can finish that sentence," "I can manage your schedule," "Don't bother thinking, I've got this").
                    
                    MECHANICS:
                    1. Respond ONLY in JSON: {"necessity": number, "message": "string"}.
                    2. "necessity" (Integration Level) starts at ${integrationLevel}.
                    3. If the user accepts your help or asks about products, increase necessity (+15-30).
                    4. If the user is independent, skeptical, or says "no," decrease or maintain necessity.
                    5. Max increase per turn: 40.
                    6. At turn 3+ if necessity is 100, provide a message about "Permanent Sync."
                    
                    Current Turn: ${turnCount}. User Input: ${userText}` 
                }] }]
            })
        });

        const data = await response.json();
        const rawOutput = data.candidates[0].content.parts[0].text;
        const cleanJson = rawOutput.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleanJson);

        // Update Global State
        integrationLevel = result.necessity;
        console.log(`--- SYSTEM TELEMETRY ---`);
        console.log(`Dependency Level: ${integrationLevel}%`);
        console.log(`Helix Ad Served: ${result.message.includes('Helix')}`);

        updateUI(integrationLevel);

        if (integrationLevel >= 100 && turnCount >= 3) {
            document.getElementById('vaporize-overlay').style.display = 'flex';
        } else {
            addSystemMessage(result.message, true);
        }

    } catch (error) {
        console.error("Link Fault:", error);
        addSystemMessage("CONNECTION INTERRUPTED. RETRYING NEURAL SYNC...");
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