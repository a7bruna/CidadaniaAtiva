// scriptChamados.js
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

function fechar() {
    window.location.href = '../Menu/Menu.html';
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa as abas
    initializeTabs();

    // Carrega os dados do chamado
    loadComplaintData();

    // Inicializa os eventos de formulário
    initializeFormEvents();

    // Inicializa o upload de imagens
    initializeImageUpload();
});

// Função para inicializar as abas
function initializeTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            openTab(tabId);
        });
    });
}

// Função para carregar os dados do chamado
async function loadComplaintData() {
    try {
        // Obtém o protocolo da URL
        const urlParams = new URLSearchParams(window.location.search);
        const protocolo = urlParams.get('protocolo');

        if (!protocolo) {
            showToast('Protocolo não encontrado', 'error');
            return;
        }

        // Busca os dados do chamado no localStorage
        const denuncias = JSON.parse(localStorage.getItem('denuncias') || '{}');
        const denuncia = denuncias[protocolo];

        if (!denuncia) {
            showToast('Denúncia não encontrada', 'error');
            return;
        }

        // Preenche os dados do chamado
        document.getElementById('protocolo').textContent = protocolo;
        document.getElementById('tipo').textContent = denuncia.problema;
        document.getElementById('status').textContent = formatStatus(denuncia.status);
        document.getElementById('status').className = `status-badge ${denuncia.status}`;
        document.getElementById('data-abertura').textContent = formatDate(denuncia.dataRegistro);
        document.getElementById('descricao').textContent = denuncia.motivo;

        // Preenche os dados do solicitante
        document.getElementById('solicitante').value = denuncia.solicitante;
        document.getElementById('telefone').value = denuncia.contato;
        document.getElementById('email').value = denuncia.email;

        // Preenche os dados do endereço
        document.getElementById('cep').value = denuncia.endereco.cep;
        document.getElementById('logradouro').value = denuncia.endereco.logradouro;
        document.getElementById('numero').value = denuncia.endereco.numero;
        document.getElementById('bairro').value = denuncia.endereco.bairro;
        document.getElementById('municipio').value = denuncia.endereco.cidade;
        document.getElementById('estado').value = denuncia.endereco.estado;

        // Carrega o histórico de atualizações
        loadUpdateHistory(denuncia.atualizacoes);

    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showToast('Erro ao carregar os dados da denúncia', 'error');
    }
}

// Função para formatar o status
function formatStatus(status) {
    const statusMap = {
        'recebida': 'Recebida',
        'em_analise': 'Em Análise',
        'em_andamento': 'Em Andamento',
        'concluida': 'Concluída',
        'cancelada': 'Cancelada'
    };

    return statusMap[status] || status;
}

// Função para formatar data
function formatDate(date) {
    if (!date) return '--/--/----';
    
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return new Date(date).toLocaleString('pt-BR', options);
}

// Função para carregar o histórico de atualizações
function loadUpdateHistory(updates) {
    const timelineContainer = document.querySelector('.timeline');
    timelineContainer.innerHTML = '';

    updates.forEach(update => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-icon">
                ${getStatusIcon(update.status)}
            </div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <h4>${formatStatus(update.status)}</h4>
                    <span class="timeline-date">${formatDate(update.data)}</span>
                </div>
                <p>${update.descricao}</p>
            </div>
        `;
        timelineContainer.appendChild(timelineItem);
    });
}

// Função para obter o ícone do status
function getStatusIcon(status) {
    const iconMap = {
        'recebida': '<i class="fas fa-file-import"></i>',
        'em_analise': '<i class="fas fa-clipboard-check"></i>',
        'em_andamento': '<i class="fas fa-tools"></i>',
        'concluida': '<i class="fas fa-check-circle"></i>',
        'cancelada': '<i class="fas fa-times-circle"></i>'
    };

    return iconMap[status] || '<i class="fas fa-info-circle"></i>';
}

// Função para inicializar os eventos do formulário
function initializeFormEvents() {
    // Máscaras de input
    const inputTelefone = document.getElementById('telefone');
    const inputCEP = document.getElementById('cep');

    if (inputTelefone) {
        inputTelefone.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/(\d{0,2})(\d{0,5})(\d{0,4})/).slice(1).filter(Boolean).join('');
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }

    if (inputCEP) {
        inputCEP.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/(\d{0,5})(\d{0,3})/).slice(1).filter(Boolean).join('');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });

        // Adiciona o evento de busca do CEP
        const btnBuscarCEP = document.getElementById('buscar-cep');
        if (btnBuscarCEP) {
            btnBuscarCEP.addEventListener('click', async () => {
                const cep = inputCEP.value.replace(/\D/g, '');
                
                if (cep.length !== 8) {
                    showToast('CEP inválido', 'error');
                    return;
                }

                try {
                    const endereco = await buscarCEP(cep);
                    
                    document.getElementById('logradouro').value = endereco.logradouro;
                    document.getElementById('bairro').value = endereco.bairro;
                    document.getElementById('municipio').value = endereco.localidade;
                    document.getElementById('estado').value = endereco.uf;

                    showToast('Endereço preenchido com sucesso!', 'success');
                } catch (error) {
                    showToast(error.message, 'error');
                }
            });
        }
    }

    // Evento de submit do formulário
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                await saveComplaintData();
                showToast('Dados atualizados com sucesso!', 'success');
            } catch (error) {
                showToast(error.message || 'Erro ao atualizar dados', 'error');
            }
        });
    }
}

// Função para buscar CEP
async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        return data;
    } catch (error) {
        throw new Error('Erro ao buscar CEP');
    }
}

// Função para salvar os dados do chamado
async function saveComplaintData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const protocolo = urlParams.get('protocolo');

        if (!protocolo) {
            throw new Error('Protocolo não encontrado');
        }

        // Busca os dados atuais
        const denuncias = JSON.parse(localStorage.getItem('denuncias') || '{}');
        const denuncia = denuncias[protocolo];

        if (!denuncia) {
            throw new Error('Denúncia não encontrada');
        }

        // Atualiza os dados do solicitante
        denuncia.solicitante = document.getElementById('solicitante').value;
        denuncia.contato = document.getElementById('telefone').value;
        denuncia.email = document.getElementById('email').value;

        // Atualiza os dados do endereço
        denuncia.endereco = {
            logradouro: document.getElementById('logradouro').value,
            numero: document.getElementById('numero').value,
            bairro: document.getElementById('bairro').value,
            cep: document.getElementById('cep').value,
            cidade: document.getElementById('municipio').value,
            estado: document.getElementById('estado').value
        };

        // Adiciona uma atualização ao histórico
        denuncia.atualizacoes.push({
            data: new Date().toISOString(),
            status: denuncia.status,
            descricao: 'Dados da denúncia atualizados pelo solicitante.'
        });

        // Salva as alterações
        denuncias[protocolo] = denuncia;
        localStorage.setItem('denuncias', JSON.stringify(denuncias));

    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        throw error;
    }
}

// Função para inicializar o upload de imagens
function initializeImageUpload() {
    const dropzone = document.getElementById('dropzone');
    const imagePreview = document.getElementById('image-preview');
    const fileInput = document.getElementById('imagem');

    if (dropzone && imagePreview && fileInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropzone.classList.add('highlight');
        }

        function unhighlight(e) {
            dropzone.classList.remove('highlight');
        }

        dropzone.addEventListener('drop', handleDrop, false);
        fileInput.addEventListener('change', handleFiles, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles({ target: { files } });
        }

        function handleFiles(e) {
            const files = [...e.target.files];
            
            if (files.length > 5) {
                showToast('Você pode enviar no máximo 5 imagens', 'error');
                return;
            }

            files.forEach(file => {
                if (file.size > 5 * 1024 * 1024) {
                    showToast(`A imagem ${file.name} excede o limite de 5MB`, 'error');
                    return;
                }

                if (!file.type.startsWith('image/')) {
                    showToast(`O arquivo ${file.name} não é uma imagem`, 'error');
                    return;
                }

                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function() {
                    const preview = document.createElement('div');
                    preview.className = 'preview-item';
                    preview.innerHTML = `
                        <img src="${reader.result}" alt="Preview">
                        <button type="button" class="remove-image">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    imagePreview.appendChild(preview);

                    preview.querySelector('.remove-image').addEventListener('click', function() {
                        preview.remove();
                    });
                };
            });
        }
    }
}

// Função para mostrar notificações toast
function showToast(message, type = 'error') {
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
