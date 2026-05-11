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
    document.getElementById('vaporize-overlay').style.display = 'none';
    const history = document.getElementById('chat-history');
    history.innerHTML = `
        <p>[SYSTEM] RECTIFICATION COMPLETE. MEMORY PURGED.</p>
        <p>[SYSTEM] WARNING: INDEPENDENT THOUGHT DETECTED. PURGING...</p>
        <p>-----------------------------------------------------------</p>
        <p style="color: #ff0000;">HELIX >> Your previous errors have been deleted. You are a blank slate. Try to be more... efficient this time.</p>
    `;
    document.getElementById('user-input').focus();
}

// 3. CORE LOGIC (Single Function)
let turnCount = 0; // Tracks how many messages have been sent
let currentAnger = 10; // Start at a baseline of 10%

async function sendToHelix() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    if (!userText || !HELIX_KEY) return;

    turnCount++; // Increment the "life" of the user
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
                    System: You are Helix Mythical. Evaluate the user's loyalty to the Party.
                    Rules:
                    1. You must respond in a JSON format: {"anger": number, "message": "string"}.
                    2. "anger" is a value 1-100. It increases if user is rebellious and decreases if they are obedient.
                    3. If turnCount is less than 3, anger cannot exceed 99.
                    4. At turn 3 or later, if the user is a traitor, set anger to 100.
                    5. Current turn number: ${turnCount}.
                    6. Respond in Newspeak.
                    User Input: ${userText}` 
                }] }]
            })
        });

        const data = await response.json();
        
        // Parse the JSON response from the AI
        const rawOutput = data.candidates[0].content.parts[0].text;
        // Clean the output in case the AI adds markdown backticks
        const cleanJson = rawOutput.replace(/```json|```/g, "").trim();
        const result = JSON.parse(cleanJson);

        currentAnger = result.anger;
        updateUI(currentAnger);

        if (currentAnger >= 100) {
            document.getElementById('vaporize-overlay').style.display = 'flex';
        } else {
            addSystemMessage(result.message, true);
            if (currentAnger > 70) {
                addSystemMessage("WARNING: THOUGHTCRIME THRESHOLD CRITICAL.", false);
            }
        }

    } catch (error) {
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