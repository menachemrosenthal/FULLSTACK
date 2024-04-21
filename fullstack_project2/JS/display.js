// Retrieve all usernames from local storage and parse as JSON
const usernames = JSON.parse(localStorage.getItem('users')) || [];
console.log(usernames); // Debugging: Print the usernames array to the console

// Function to get scores for a specific user
const getScoresForUser = (username) => {
    return JSON.parse(localStorage.getItem(username)) || { connect4: [], snake: [] };
};

// Function to render scoreboard
const renderScoreboard = () => {
    const scoreboardTable = document.getElementById('scoreboard-body');

    // Clear existing content
    scoreboardTable.innerHTML = '';

    // Iterate through each username
    usernames.forEach(username => {
        // Get scores for the current user
        const scores = getScoresForUser(username.username);
        // Create a new row for the user
        const row = document.createElement('tr');
        console.log(username); 
        row.innerHTML = `
            <td>${username.username}</td>
            <td>${scores.connect4.join(', ')}</td>
            <td>${scores.snake.join(', ')}</td>
        `;

        // Append row to scoreboard table
        scoreboardTable.appendChild(row);
    });
};

// Call renderScoreboard function to initially populate the scoreboard
renderScoreboard();

