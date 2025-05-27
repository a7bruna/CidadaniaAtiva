var db_chamados = {};

// função para gerar códigos randômicos a serem utilizados como código de usuário Fonte: https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Dados de usuários para serem utilizados como carga inicial
const dadosIniciais = {
    chamados: [
        { "id": generateUUID (), "tproblema": "Ambientais", 
          "motivoabertura": "Texto do problema", 
          "solicitante": "Zé das Couves", 
          "nContato": "(31) 97845-7852", 
          "email": "couve@abc.com", 
          "endereco": "Rua das Couves", 
          "numero": "189", 
          "bairro": "Bairro da Couves", 
          "cep": "30662-789", 
          "cidade": "Belo Horizonte"
        },
    ]
};

// Inicializa o banco de dados da aplicação de Login
function initChamado () {
    // PARTE 1 - INICIALIZA chamadoCorrente A PARTIR DE DADOS NO LOCAL STORAGE, CASO EXISTA
    chamadoCorrenteJSON = sessionStorage.getItem('chamadoCorrente');
    if (chamadoCorrenteJSON) {
        chamadoCorrente = JSON.parse (chamadoCorrenteJSON);
    }
    
    // PARTE 2 - INICIALIZA BANCO DE DADOS DE USUÁRIOS
    // Obtem a string JSON com os dados a partir do localStorage
    var chamadosJSON = localStorage.getItem('db_chamados');

    // Verifica se existem dados já armazenados no localStorage
    if (!chamadosJSON) {  // Se NÃO há dados no localStorage
        
        // Informa sobre localStorage vazio e e que serão carregados os dados iniciais
        alert('Dados de chamados não encontrados no localStorage. \n -----> Fazendo carga inicial.');

        // Copia os dados iniciais para o banco de dados 
        db_chamados = dadosIniciais;

        // Salva os dados iniciais no local Storage convertendo-os para string antes
        localStorage.setItem('db_chamados', JSON.stringify (dadosIniciais));
    }
    else  {  // Se há dados no localStorage
        
        // Converte a string JSON em objeto colocando no banco de dados baseado em JSON
        db_chamados = JSON.parse(chamadosJSON);    
    }
};

// Função para cadastrar o chamado
async function cadastraChamado() {
    try {
        // Coleta os dados do formulário
        const formData = {
            problema: document.getElementById('txt_problema').value,
            motivo: document.getElementById('txt_motivo').value,
            solicitante: document.getElementById('txt_solicitante').value,
            contato: document.getElementById('txt_ncontato').value,
            email: document.getElementById('txt_email').value,
            endereco: {
                logradouro: document.getElementById('txt_endereco').value,
                numero: document.getElementById('txt_numero').value,
                bairro: document.getElementById('txt_bairro').value,
                cep: document.getElementById('txt_cep').value,
                cidade: document.getElementById('txt_cidade').value,
                estado: document.getElementById('txt_estado').value
            }
        };

        // Validação dos campos
        if (!validarFormulario(formData)) {
            throw new Error('Por favor, preencha todos os campos obrigatórios.');
        }

        // Gera um número de protocolo único
        const protocolo = gerarProtocolo();

        // Simula o envio para a API
        await enviarDenuncia(formData, protocolo);

        // Salva no localStorage para demonstração
        salvarDenunciaLocal(formData, protocolo);

        // Mostra mensagem de sucesso
        showToast('Denúncia registrada com sucesso! Protocolo: ' + protocolo, 'success');

        // Redireciona para a página de acompanhamento após 2 segundos
        setTimeout(() => {
            window.location.href = '../Pagina acompanhe sua solicitação/acompanhamento.html?protocolo=' + protocolo;
        }, 2000);

    } catch (error) {
        showToast(error.message || 'Erro ao registrar denúncia', 'error');
        console.error('Erro ao cadastrar chamado:', error);
    }
}

// Função para validar o formulário
function validarFormulario(formData) {
    // Validação do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showToast('Por favor, insira um e-mail válido', 'error');
        return false;
    }

    // Validação do telefone
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(formData.contato)) {
        showToast('Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX', 'error');
        return false;
    }

    // Validação do CEP
    const cepRegex = /^\d{5}-\d{3}$/;
    if (!cepRegex.test(formData.endereco.cep)) {
        showToast('Por favor, insira um CEP válido no formato XXXXX-XXX', 'error');
        return false;
    }

    // Verifica se todos os campos obrigatórios estão preenchidos
    for (let key in formData) {
        if (typeof formData[key] === 'object') {
            for (let subKey in formData[key]) {
                if (!formData[key][subKey]) {
                    showToast(`Por favor, preencha o campo ${subKey}`, 'error');
                    return false;
                }
            }
        } else if (!formData[key]) {
            showToast(`Por favor, preencha o campo ${key}`, 'error');
            return false;
        }
    }

    return true;
}

// Função para gerar um número de protocolo único
function gerarProtocolo() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `${ano}${mes}${dia}-${random}`;
}

// Função para simular o envio da denúncia para a API
async function enviarDenuncia(formData, protocolo) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Denúncia enviada:', { ...formData, protocolo });
            resolve();
        }, 1000);
    });
}

// Função para salvar a denúncia no localStorage
function salvarDenunciaLocal(formData, protocolo) {
    const denuncias = JSON.parse(localStorage.getItem('denuncias') || '{}');
    denuncias[protocolo] = {
        ...formData,
        protocolo,
        status: 'recebida',
        dataRegistro: new Date().toISOString(),
        atualizacoes: [
            {
                data: new Date().toISOString(),
                status: 'recebida',
                descricao: 'Sua denúncia foi registrada com sucesso.'
            }
        ]
    };
    localStorage.setItem('denuncias', JSON.stringify(denuncias));
}

// Função para buscar CEP usando a API ViaCEP
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

// Função para formatar valores monetários
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Função para formatar datas
function formatarData(data) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(data));
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa as máscaras de input
    const inputTelefone = document.getElementById('txt_ncontato');
    const inputCEP = document.getElementById('txt_cep');

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
                    
                    document.getElementById('txt_endereco').value = endereco.logradouro;
                    document.getElementById('txt_bairro').value = endereco.bairro;
                    document.getElementById('txt_cidade').value = endereco.localidade;
                    document.getElementById('txt_estado').value = endereco.uf;

                    showToast('Endereço preenchido com sucesso!', 'success');
                } catch (error) {
                    showToast(error.message, 'error');
                }
            });
        }
    }

    // Inicializa o upload de imagens
    const dropzone = document.getElementById('dropzone');
    const imagePreview = document.getElementById('image-preview');
    const fileInput = document.getElementById('txt_imagem');

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
});

// Inicializa as estruturas utilizadas pelo LoginApp
initChamado ();