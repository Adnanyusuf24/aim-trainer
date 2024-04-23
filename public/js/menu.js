// Function to handle game mode selection
function selectMode(element) {
    const modes = document.querySelectorAll('.mode');
    modes.forEach(m => m.classList.remove('active'));
    element.classList.add('active');
}

// Function to handle sensitivity selection
function selectSensitivity(element) {
    const sensitivities = document.querySelectorAll('.sensitivity');
    sensitivities.forEach(s => s.classList.remove('active'));
    element.classList.add('active');
}

// Function to handle alignment selection
function selectAlign(element) {
    const alignments = document.querySelectorAll('.align');
    alignments.forEach(a => a.classList.remove('active'));
    element.classList.add('active');
}

document.getElementById('startForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Collect settings from the form
    const username = document.getElementById('username').value.trim();
    const mode = document.querySelector('.mode.active').textContent;
    const sensitivity = document.querySelector('.sensitivity.active').textContent;
    const alignment = document.querySelector('.align.active').textContent;

    // Store settings in local storage for later use
    localStorage.setItem('username', username);
    console.log('Username:', username); // Check what value is being captured
    localStorage.setItem('gameMode', mode);
    localStorage.setItem('sensitivity', sensitivity);
    localStorage.setItem('alignment', alignment);

    // Save the initial game settings to the server
    fetch('/save', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            username: username,
            difficulty: mode,
            sensitivity: sensitivity,
            alignment: alignment,
            hits: 0 // Default initial value, actual gameplay will update this
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();  // Parse JSON response to proceed with the redirect
        } else {
            // Handle server errors or invalid responses
            response.json().then(data => {
                throw new Error(data.message || 'Failed to save initial settings.');
            });
        }
    })
    .then(data => {
        console.log('Initial settings saved:', data);
        // Redirect to the game page after successful save
        window.location.href = '/game';
    })
    .catch(error => {
        console.error('Error during initial settings save:', error);
        alert('Failed to start the game. Please check your network settings and try again.');
    });
});
