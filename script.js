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
