
function togglePassword() {
    const passwordField = document.getElementById("password");
    const toggle = document.querySelector(".toggle-password");
  
    if (passwordField.type === "password") {
      passwordField.type = "text";
      toggle.textContent = "Ocultar senha";
    } else {
      passwordField.type = "password";
      toggle.textContent = "Mostrar senha";
    }
  }
  
  
  document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); 
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const error = document.getElementById("errorMessage");
  
    if (!username || !password) {
      error.style.display = "block";
      return;
    }
  
    
    console.log("Login com:", username, password);
  
    error.style.display = "none";
  
    
    alert("Login bem-sucedido!");
  
    
  });
  