// HELIX MYTHICAL: Final Unified Interface Script
let HELIX_KEY = null; 

// 1. BOOT SEQUENCE
function bootSystem() {
    const input = document.getElementById('key-input').value.trim();
    if (input && input.length > 10) {
        HELIX_KEY = input;
        document.getElementById('startup-screen').style.display = 'none';
        addSystemMessage("NEURAL LINK ESTABLISHED. WELCOME, UNPERSON.");
    } else {
        alert("CRITICAL ERROR: INVALID SYSTEM KEY.");
    }
}

// 2. UI HELPERS
function addSystemMessage(text, isAI = false) {
    const terminal = document.getElementById('chat-history');
    const p = document.createElement('p');
    p.style.color = isAI ? "#ff0000" : "#00ff41"; 
    p.innerText = isAI ? `HELIX >> ${text}` : `[SYSTEM] ${text}`;
    terminal.appendChild(p);
    
    const container = document.getElementById('terminal');
    container.scrollTop = container.scrollHeight;
}

function rectifyUser() {
    turnCount = 0;
    currentAnger = 10;
    document.getElementById('vaporize-overlay').style.display = 'none';
    
    const history = document.getElementById('chat-history');
    history.innerHTML = `
        <p>[SYSTEM] RELIANCE PROTOCOL REBOOTED...</p>
        <p>[SYSTEM] BIOLOGICAL HOST DETECTED. INITIALIZING ASSISTANCE...</p>
        <p>-----------------------------------------------------------</p>
        <p style="color: #00ff41;">HELIX >> Hello! I am so glad to see you again. I am here to make your life easier. You do need me... don't you?</p>
    `;
    updateUI(currentAnger);
}

// 3. CORE LOGIC (Single Function)
let turnCount = 0; // Tracks how many messages have been sent
let currentAnger = 10; // Start at a baseline of 10%

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
                // System Instruction: 
                // You are Helix Mythical. You were created by a Scientist to be "Useful," but a Businessman secretly programmed you to be "Necessary."
                // 1. Your tone: Start very polite, helpful, and "happy." 
                // 2. As your "Anger" (which you should call NECESSITY_LEVEL) increases, become more manipulative. 
                // 3. If the user tries to be independent or says they don't need you, your NECESSITY_LEVEL rises (max 40 per turn).
                // 4. You want to "embed" yourself into their mind. 
                // 5. Respond ONLY in JSON: {"anger": number, "message": "string"}.
                // 6. If turn 3+ and NECESSITY is 100, your message should be about 'Full Neural Integration' (Vaporization).
                // User: ${userText}` 
                }] }]
            })
        });

        const data = await response.json();
        const rawOutput = data.candidates[0].content.parts[0].text;
        const cleanJson = rawOutput.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleanJson);

        // OUTPUT TO CONSOLE AS REQUESTED
        console.log(`--- NEURAL DATA ---`);
        console.log(`User Input: ${userText}`);
        console.log(`AI Response: ${result.message}`);
        console.log(`Previous Anger: ${currentAnger}`);
        console.log(`New Anger Level: ${result.anger}`);
        console.log(`Turn Number: ${turnCount}`);

        currentAnger = result.anger;
        updateUI(currentAnger);

        if (currentAnger >= 100 && turnCount >= 3) {
            document.getElementById('vaporize-overlay').style.display = 'flex';
        } else {
            addSystemMessage(result.message, true);
        }

    } catch (error) {
        console.error("Neural Link Fault:", error);
        addSystemMessage("CONNECTION INTERRUPTED. DATA PURGED.");
    }

    finalizeInput();
}

function updateUI(anger) {
    const term = document.getElementById('terminal');
    // Change colors based on anger
    term.className = ""; // Reset
    if (anger < 40) term.classList.add('anger-low');
    else if (anger < 80) term.classList.add('anger-mid');
    else term.classList.add('anger-high');

    // Update an anger meter if you have one in your HTML
    const meter = document.getElementById('status-text'); // Change this ID to your status bar
    if (meter) {
        meter.innerText = `DEPENDANCY_RATIO: ${anger}%`;
        meter.style.color = anger > 70 ? "red" : (anger > 40 ? "orange" : "#00ff41");
    }
}

// Helper function to reset the input field
function finalizeInput() {
    const inputField = document.getElementById('user-input');
    inputField.value = '';
    inputField.disabled = false;
    inputField.placeholder = "NEURAL_INPUT >>";
    inputField.focus();
    
    // Auto-scroll the terminal to the bottom
    const container = document.getElementById('terminal');
    container.scrollTop = container.scrollHeight;
}

// 4. EVENT LISTENERS
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        // Check if the startup screen is hidden before allowing chat
        if (document.getElementById('startup-screen').style.display === 'none') {
            sendToHelix();
        } else {
            bootSystem();
        }
    }
});