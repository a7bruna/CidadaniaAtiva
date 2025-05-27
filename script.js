document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".btn-acompanhar").addEventListener("click", () => {
    alert("Você será redirecionado para a página de tutorial.");
    // window.location.href = "acompanhar.html";
  });

  document.querySelector("#btn-login").addEventListener("click", () => {
    alert("Você será redirecionado para a página de login.");
    // window.location.href = "login.html";
  });

  document.querySelector("#btn-cadastrar").addEventListener("click", () => {
    alert("Você será redirecionado para a página de cadastro.");
    // window.location.href = "cadastro.html";
  });
});

// Animação suave ao rolar para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Animação de entrada dos cards de serviço
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Aplicar animação inicial aos cards
document.querySelectorAll('.service-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = `all 0.5s ease ${index * 0.1}s`;
  observer.observe(card);
});

// Efeito de hover nos ícones dos cards
document.querySelectorAll('.card-icon').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    icon.style.transform = 'scale(1.1) rotate(5deg)';
  });
  
  icon.addEventListener('mouseleave', () => {
    icon.style.transform = 'scale(1) rotate(0deg)';
  });
});

// Navbar com efeito de scroll
let lastScroll = 0;
const navbar = document.querySelector('.top-nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    navbar.style.boxShadow = 'var(--shadow-sm)';
    return;
  }
  
  if (currentScroll > lastScroll) {
    // Rolando para baixo
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Rolando para cima
    navbar.style.transform = 'translateY(0)';
    navbar.style.boxShadow = 'var(--shadow-md)';
  }
  
  lastScroll = currentScroll;
});

// Adicionar efeito de ripple nos botões
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Classe para gerenciar notificações toast
class ToastNotification {
  constructor() {
    this.createToastContainer();
  }

  createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }

  show(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = document.createElement('i');
    icon.className = `fas fa-${this.getIconForType(type)}`;
    toast.appendChild(icon);
    
    const text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);
    
    document.getElementById('toast-container').appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-enter');
    });

    // Remove toast after delay
    setTimeout(() => {
      toast.classList.replace('toast-enter', 'toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  getIconForType(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      info: 'info-circle',
      warning: 'exclamation-triangle'
    };
    return icons[type] || icons.info;
  }
}

// Classe para gerenciar o tema
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.initializeTheme();
    this.addThemeToggle();
  }

  initializeTheme() {
    document.body.setAttribute('data-theme', this.theme);
  }

  addThemeToggle() {
    const nav = document.querySelector('.auth-buttons');
    const themeToggle = document.createElement('button');
    themeToggle.className = 'btn btn-icon';
    themeToggle.innerHTML = `<i class="fas fa-${this.theme === 'light' ? 'moon' : 'sun'}"></i>`;
    
    themeToggle.addEventListener('click', () => {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', this.theme);
      localStorage.setItem('theme', this.theme);
      themeToggle.innerHTML = `<i class="fas fa-${this.theme === 'light' ? 'moon' : 'sun'}"></i>`;
      toast.show(`Tema ${this.theme === 'light' ? 'claro' : 'escuro'} ativado`);
    });

    nav.prepend(themeToggle);
  }
}

// Classe para gerenciar a pesquisa de serviços
class ServiceSearch {
  constructor() {
    this.addSearchBar();
    this.services = document.querySelectorAll('.service-card');
  }

  addSearchBar() {
    const servicesSection = document.querySelector('.services h2');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Buscar serviços..." class="search-input">
      </div>
    `;

    servicesSection.insertAdjacentElement('afterend', searchContainer);

    const searchInput = searchContainer.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
  }

  handleSearch(query) {
    const normalizedQuery = query.toLowerCase().trim();

    this.services.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const matches = title.includes(normalizedQuery) || description.includes(normalizedQuery);
      
      card.style.display = matches ? 'block' : 'none';
      card.style.animation = matches ? 'fadeIn 0.3s ease' : '';
    });
  }
}

// Classe para gerenciar animações de scroll
class ScrollAnimations {
  constructor() {
    this.addScrollIndicator();
    this.initializeScrollAnimations();
  }

  addScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: var(--primary);
      z-index: 1001;
      transition: width 0.3s ease;
    `;
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      indicator.style.width = scrolled + '%';
    });
  }

  initializeScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Instanciando as classes
  const toast = new ToastNotification();
  const theme = new ThemeManager();
  const search = new ServiceSearch();
  const scrollAnimations = new ScrollAnimations();

  // Adicionando classes de animação aos elementos
  document.querySelectorAll('.service-card').forEach(card => {
    card.classList.add('animate-on-scroll');
  });

  // Event listeners para os botões de ação
  document.querySelectorAll('.card-action').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const service = e.target.closest('.service-card').querySelector('h3').textContent;
      toast.show(`Iniciando registro de problema em ${service}`);
    });
  });

  // Animações suaves originais
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Efeitos de hover nos ícones
  document.querySelectorAll('.card-icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1) rotate(0deg)';
    });
  });

  // Navbar com efeito de scroll
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

  // Efeito de ripple nos botões
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('div');
      
      ripple.className = 'ripple';
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
});
