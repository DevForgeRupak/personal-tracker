document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');

  // 🚀 Helper: Load existing users
  function getStoredUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  }

  // 🧠 Helper: Save users
  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  // 📝 Registration
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value.trim();
      const password = document.getElementById('register-password').value;

      const users = getStoredUsers();

      // 🚫 Check if username exists
      if (users.some(u => u.username === username)) {
        alert('Username already exists!');
        return;
      }

      const newUser = {
        id: Date.now(), // unique ID
        username,
        password // In real apps, this should be hashed
      };

      users.push(newUser);
      saveUsers(users);

      alert('Registration successful!');
      window.location.href = 'login.html';
    });
  }

  // 🔐 Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;

      const users = getStoredUsers();

      const matchedUser = users.find(u => u.username === username && u.password === password);

      if (matchedUser) {
        localStorage.setItem('userId', matchedUser.id);
        alert('Login successful!');
        window.location.href = 'transaction.html';
      } else {
        alert('Invalid username or password');
      }
    });
  }
});
