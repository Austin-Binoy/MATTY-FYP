App.initAuth = function initAuth() {
    document.getElementById('login-btn').onclick = () => {
        const user = document.getElementById('username').value.trim().toLowerCase();
        const pass = document.getElementById('password').value;

        // credentials for this demo build
        if ((user === "admin" && pass === "admin123") || (user === "csc-trial" && pass === "trial123")) {
            App.state.loggedInUser = user;
            document.getElementById('login-overlay').style.display = 'none';

            App.elements.accountHeader.style.display = 'block';
            App.elements.userDisplay.innerText = `Logged in as: ${user.toUpperCase()}`;
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    };
};
