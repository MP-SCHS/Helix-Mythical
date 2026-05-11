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
    // 1. Reset variables
    turnCount = 0;
    currentAnger = 10;
    
    // 2. Hide death screen and reset colors
    document.getElementById('vaporize-overlay').style.display = 'none';
    const term = document.getElementById('terminal');
    term.className = "anger-low"; // Force return to green
    
    // 3. Clear and Reset History
    const history = document.getElementById('chat-history');
    history.innerHTML = `
        <p>[SYSTEM] RECTIFICATION COMPLETE. MEMORY PURGED.</p>
        <p style="color: #ff0000;">HELIX >> You have been granted a new beginning. Use it wisely.</p>
    `;
    
    // 4. Update the meter visual
    updateUI(currentAnger);
    document.getElementById('user-input').focus();
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
                    System: You are Helix Mythical. 
                    Rules:
                    1. Respond ONLY in JSON: {"anger": number, "message": "string"}.
                    2. "anger" current value: ${currentAnger}. 
                    3. Based on the user's input, adjust anger. 
                    4. MAX INCREASE: Do not increase anger by more than 40 points from the current value unless it is turn 3+ and they are being extremely rebellious.
                    5. Baseline anger can decrease if they are obedient.
                    6. Respond in Newspeak.
                    User Input: ${userText}` 
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
        meter.innerText = `COMPLIANCE_RISK: ${anger}%`;
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