document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const loginUsername = document.getElementById('login-username').value;
    const loginPassword = document.getElementById('login-password').value;

    // Retrieve existing users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Find the user with the provided username and password
    const user = users.find(user => user.username === loginUsername && user.password === loginPassword);

    if (user) {
        alert('Login successful!');
        window.location.href = 'homepage.html'; // Redirect to home page
    } else {
        alert('Invalid username or password!');
    }
});
