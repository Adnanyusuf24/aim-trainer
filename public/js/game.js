let score = 0;
let gameDuration = 60; // Game duration in seconds
let intervalId = null;
let countDownId = null;

document.addEventListener('DOMContentLoaded', function() {
    const gameMode = localStorage.getItem('gameMode');
    const sensitivity = localStorage.getItem('sensitivity');
    const alignment = localStorage.getItem('alignment');

    console.log('Game Mode:', gameMode);
    console.log('Sensitivity:', sensitivity);
    console.log('Alignment:', alignment);

    startGame(gameMode, sensitivity, alignment);
});

function startGame(gameMode, sensitivity, alignment) {
    document.getElementById('gameContainer').style.display = 'block';
    score = 0;
    gameDuration = 30;
    document.getElementById('score').textContent = score;
    document.getElementById('timeLeft').textContent = gameDuration;
    clearInterval(intervalId);
    clearInterval(countDownId);
    intervalId = setInterval(generateTarget, 1000);
    countDownId = setInterval(countDown, 1000);
}

function generateTarget() {
    const gameContainer = document.getElementById('gameContainer');
    while (gameContainer.firstChild) {
        gameContainer.removeChild(gameContainer.firstChild);
    }

    const target = document.createElement('div');
    target.className = 'target';
    target.style.top = `${Math.random() * (gameContainer.offsetHeight - 50)}px`;
    target.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`;
    target.addEventListener('click', hitTarget);
    gameContainer.appendChild(target);

    let visibilityDuration = 900; // Default for Easy
    if (localStorage.getItem('gameMode') === 'Hard') {
        visibilityDuration = 600;
    } else if (localStorage.getItem('gameMode') === 'Medium') {
        visibilityDuration = 750;
    }

    setTimeout(() => {
        if (target.parentNode) {
            target.parentNode.removeChild(target);
        }
    }, visibilityDuration);
}

function hitTarget(event) {
    score += 1;
    document.getElementById('score').textContent = score;
    event.currentTarget.parentNode.removeChild(event.currentTarget);
    event.stopImmediatePropagation();
}

function countDown() {
    gameDuration -= 1;
    document.getElementById('timeLeft').textContent = gameDuration;
    if (gameDuration <= 0) {
        clearInterval(intervalId);
        clearInterval(countDownId);
        alert('Game Over! Your score: ' + score);
        endGame();
    }
}

function endGame() {
    const username = localStorage.getItem('username'); // Ensure username is set in localStorage
    const gameMode = localStorage.getItem('gameMode');

    // Send the game results to the server
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            difficulty: gameMode,
            hits: score
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Game result saved:', data);
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('gameContainer').innerHTML = '';
        document.getElementById('score').textContent = '0';
        document.getElementById('timeLeft').textContent = '60';
        // Redirect or inform the user game has been saved
        alert('Game data saved! Thanks for playing.');
    })
    .catch(error => {
        console.error('Error saving game data:', error);
        alert('Failed to save game data.');
    });
}
