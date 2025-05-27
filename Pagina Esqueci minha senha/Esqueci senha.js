function enviarEmail(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
  
    if (email) {
      alert(`Instruções para redefinição de senha foram enviadas para: ${email}`);
      // Aqui você pode integrar com backend futuramente.
    } else {
      alert("Por favor, insira um e-mail válido.");
    }
  }
  