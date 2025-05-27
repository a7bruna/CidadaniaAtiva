function entrar() {
    alert("Você clicou em Entrar. Aqui pode redirecionar para a tela de login.");
    // window.location.href = "login.html";
  }
  
// Função para simular a busca do status do protocolo
async function checkProtocolStatus(protocol) {
  // Simulando uma chamada à API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Dados simulados
      resolve({
        protocol,
        status: 'em_andamento',
        receivedDate: '15/03/2024',
        analysisDate: '16/03/2024',
        progressDate: '17/03/2024',
        completedDate: null,
        updates: [
          {
            date: '17/03/2024',
            title: 'Equipe designada',
            description: 'Uma equipe técnica foi designada para resolver o problema reportado.'
          },
          {
            date: '16/03/2024',
            title: 'Análise técnica concluída',
            description: 'A análise inicial foi concluída e o problema foi classificado como prioridade média.'
          },
          {
            date: '15/03/2024',
            title: 'Solicitação recebida',
            description: 'Sua denúncia foi registrada com sucesso no sistema.'
          }
        ]
      });
    }, 1000);
  });
}

// Função para formatar datas
function formatDate(dateString) {
  if (!dateString) return '--/--/----';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Função para atualizar o status visual na timeline
function updateTimelineStatus(status) {
  const timelineItems = document.querySelectorAll('.timeline-item');
  let activeFound = false;

  timelineItems.forEach(item => {
    const icon = item.querySelector('.timeline-icon');
    const content = item.querySelector('.timeline-content');

    if (!activeFound && status === 'completed') {
      icon.classList.add('completed');
      content.classList.add('completed');
    } else if (!activeFound && status === 'in_progress') {
      icon.classList.add('active');
      content.classList.add('active');
      activeFound = true;
    } else {
      icon.classList.remove('active', 'completed');
      content.classList.remove('active', 'completed');
    }
  });
}

// Função para adicionar animações aos cards
function initializeCardAnimations() {
  const cards = document.querySelectorAll('.info-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    observer.observe(card);
  });
}

// Função para adicionar efeito de hover nos ícones
function initializeIconEffects() {
  const icons = document.querySelectorAll('.info-icon');
  
  icons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1) rotate(0deg)';
    });
  });
}

// Função para mostrar notificações toast
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }, 100);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  initializeCardAnimations();
  initializeIconEffects();

  // Adiciona efeito de scroll suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Efeito de scroll na navbar
  let lastScroll = 0;
  const navbar = document.querySelector('.top-nav');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      navbar.style.boxShadow = 'var(--shadow-sm)';
      return;
    }
    
    if (currentScroll > lastScroll) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
      navbar.style.boxShadow = 'var(--shadow-md)';
    }
    
    lastScroll = currentScroll;
  });
});
  