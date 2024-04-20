document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    
    // Retrieve existing users from local storage or initialize an empty array
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        alert('Username already exists! Please choose a different username.');
        return;
    }

    // Add the new user to the array
    users.push({ username, password });

    // Store the updated array back to local storage
    localStorage.setItem('users', JSON.stringify(users));

    alert('User registered successfully!');
    // Redirect to login page or perform any other action
});
