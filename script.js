// Helix Mythical Interface Logic
window.onload = function() {
    console.log("Helix Mythical v1.0.4 Loaded.");
};

function acceptTerms() {
    const overlay = document.getElementById('consent-overlay');
    
    // Add a slight delay to make it feel like the system is "processing" your soul
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        initializeSystem();
    }, 500);
}

function initializeSystem() {
    const term = document.getElementById('terminal');
    const p = document.createElement('p');
    p.innerHTML = "[SYSTEM] NEURAL LINK ESTABLISHED. WELCOME, UNPERSON.";
    p.style.color = "red";
    term.appendChild(p);
}
const inputField = document.getElementById('user-input');
const history = document.getElementById('chat-history');

inputField.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const msg = inputField.value;
        inputField.value = '';

        // Show user message
        history.innerHTML += `<p>USER: ${msg}</p>`;

        // Talk to the Python Bridge on the Pi
        const res = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: msg})
        });
        
        const data = await res.json();
        
        // Show Helix response
        history.innerHTML += `<p style="color: #ff0000;">HELIX: ${data.response}</p>`;
        
        // Auto-scroll to bottom
        document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;
    }
});
