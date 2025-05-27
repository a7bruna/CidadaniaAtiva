function redefinirSenha(event) {
    event.preventDefault();
  
    const codigo = document.getElementById("codigo").value.trim();
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmaSenha = document.getElementById("confirmaSenha").value;
  
    if (!codigo) {
      alert("Por favor, insira o código de ativação.");
      return;
    }
  
    if (novaSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
  
    if (novaSenha !== confirmaSenha) {
      alert("As senhas não coincidem.");
      return;
    }
  
    // Aqui você pode chamar a API ou simular envio
    alert("Senha redefinida com sucesso!");
    // Redirecionamento simulado:
    // window.location.href = "login.html";
  }
  