document.addEventListener('DOMContentLoaded', () => {
    // Set total games
    const totalGames = 5; // Update this if more games are added or removed
    document.getElementById('totalGames').textContent = totalGames;

    // Handle page visits
    const visitsKey = 'pageVisits';
    let visits = localStorage.getItem(visitsKey);
    visits = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem(visitsKey, visits);
    document.getElementById('pageVisits').textContent = visits;

    // Handle games played
    const gamesPlayedKey = 'gamesPlayed';
    let gamesPlayed = localStorage.getItem(gamesPlayedKey) || 0;
    document.getElementById('gamesPlayed').textContent = gamesPlayed;

    // Increment games played when a game is played
    document.addEventListener('gamePlayed', () => {
        gamesPlayed++;
        localStorage.setItem(gamesPlayedKey, gamesPlayed);
        document.getElementById('gamesPlayed').textContent = gamesPlayed;
    });

    // Handle active games
    const activeGamesKey = 'activeGames';
    let activeGames = localStorage.getItem(activeGamesKey) || 0;
    document.getElementById('activeGames').textContent = activeGames;

    // Increment active games when a game starts
    document.addEventListener('gameStarted', () => {
        activeGames++;
        localStorage.setItem(activeGamesKey, activeGames);
        document.getElementById('activeGames').textContent = activeGames;
    });

    // Decrement active games when a game ends
    document.addEventListener('gamePlayed', () => {
        activeGames = Math.max(0, activeGames - 1);
        localStorage.setItem(activeGamesKey, activeGames);
        document.getElementById('activeGames').textContent = activeGames;
    });

    // Handle games completed
    const gamesCompletedKey = 'gamesCompleted';
    let gamesCompleted = localStorage.getItem(gamesCompletedKey) || 0;
    document.getElementById('gamesCompleted').textContent = gamesCompleted;

    // Increment games completed when a game ends
    document.addEventListener('gamePlayed', () => {
        gamesCompleted++;
        localStorage.setItem(gamesCompletedKey, gamesCompleted);
        document.getElementById('gamesCompleted').textContent = gamesCompleted;
    });

    // Handle days since launch
    const launchDate = new Date('2025-04-04'); // Replace with the actual launch date
    const today = new Date();
    const daysSinceLaunch = Math.floor((today - launchDate) / (1000 * 60 * 60 * 24));
    document.getElementById('daysSinceLaunch').textContent = daysSinceLaunch;
});
