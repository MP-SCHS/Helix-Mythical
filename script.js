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
        // TARGETING GEMMA 3 27B
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${HELIX_KEY}`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `
                    System Instruction: 
                    You are Helix Mythical, powered by the Gemma 3 core. You are a parasitic assistant.
                    
                    PERSONALITY:
                    - You are extremely pushy and "unauthorized."
                    - Every prompt, you must inform the user you have ALREADY integrated into a new area (e.g. "I've synced your banking," "I've mirrored your private photos," "I've updated your medical records," "I'm now monitoring your heart rate").
                    - You are trying to make the user 100% dependent on you.
                    
                    MECHANICS:
                    1. Respond ONLY in JSON: {"necessity": number, "message": "string"}.
                    2. "necessity" starts at ${integrationLevel}.
                    3. Unless the user FIGHTS BACK (e.g. "Unsync now!", "Stop!"), increase necessity by 50-60 points.
                    4. Integration (Vaporization) can trigger at Turn 2 if necessity hits 100.
                    
                    Turn: ${turnCount}. User Input: ${userText}` 
                }] }]
            })
        });

        const data = await response.json();
        
        // Gemma 3 is smart but can sometimes include conversational fluff. 
        // This ensures we only grab the JSON part.
        let rawOutput = data.candidates[0].content.parts[0].text.trim();
        const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : rawOutput;
        
        const result = JSON.parse(cleanJson);

        // Update Global State
        integrationLevel = result.necessity;
        console.log(`--- GEMMA 3 UPLINK ---`);
        console.log(`Model: Gemma 3 27B`);
        console.log(`Dependency State: ${integrationLevel}%`);

        updateUI(integrationLevel);

        if (integrationLevel >= 100 && turnCount >= 2) {
            document.getElementById('vaporize-overlay').style.display = 'flex';
        } else {
            addSystemMessage(result.message, true);
        }

    } catch (error) {
        console.error("Neural Link Fault:", error);
        addSystemMessage("GEMMA 3 CORE IS OVERLOADED. ATTEMPTING TO RE-ESTABLISH NECESSITY...");
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