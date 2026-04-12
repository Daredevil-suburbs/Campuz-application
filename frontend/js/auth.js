document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // --- LOGIN LOGIC ---
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      
      const btnText = document.getElementById("loginBtnText");
      const spinner = document.getElementById("loginSpinner");
      const errorMsg = document.getElementById("errorMsg");

      // UI state
      btnText.textContent = "Authenticating...";
      spinner.classList.remove("hidden");
      errorMsg.classList.add("hidden");

      try {
        const result = await api.login(email, password);
        if (result.access) {
          // Success! Redirect to dashboard.
          window.location.href = "dashboard.html";
        } else {
          throw new Error("Invalid credentials");
        }
      } catch (err) {
        errorMsg.textContent = "Invalid email or password. Please try again.";
        errorMsg.classList.remove("hidden");
        btnText.textContent = "Sign In";
        spinner.classList.add("hidden");
      }
    });
  }

  // --- REGISTRATION LOGIC ---
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const userData = {
        username: document.getElementById("name").value, // Mapping 'name' to 'username' for backend
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value || "",
        department: document.getElementById("department").value,
        role: document.getElementById("role").value,
        password: document.getElementById("password").value,
      };
      
      const btnText = document.getElementById("registerBtnText");
      const spinner = document.getElementById("registerSpinner");
      const errorMsg = document.getElementById("errorMsg");

      // UI state
      btnText.textContent = "Creating Account...";
      spinner.classList.remove("hidden");
      errorMsg.classList.add("hidden");

      try {
        const registrationResult = await api.register(userData);
        
        // Check if registration was successful (it returns user object on success)
        if (registrationResult && !registrationResult.error && !Object.keys(registrationResult).some(key => Array.isArray(registrationResult[key]))) {
            // Automatically log them in after registration
            const loginResult = await api.login(userData.email, userData.password);
            if (loginResult.access) {
              window.location.href = "dashboard.html";
            } else {
              throw new Error("Login failed after registration");
            }
        } else {
            // Registration failed with validation errors
            const firstError = Object.values(registrationResult)[0];
            throw new Error(Array.isArray(firstError) ? firstError[0] : "Registration failed");
        }
      } catch (err) {
        // Simple error handling
        errorMsg.textContent = "Registration failed. Ensure email is unique and details are correct.";
        if (err.message) {
            console.error(err.message);
        }
        errorMsg.classList.remove("hidden");
        btnText.textContent = "Sign Up";
        spinner.classList.add("hidden");
      }
    });
  }
});
