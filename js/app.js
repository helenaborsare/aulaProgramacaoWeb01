document.addEventListener('DOMContentLoaded', function() {
    if (!window.router) {
        console.error('Router não está disponível');
        return;
    }
    registerRoutes();
    const hash = window.location.hash.slice(1) || '/';
    window.router.loadRoute(hash, false);
});


function registerRoutes() {
    window.router.addRoute('/', Templates.home, function() {
        initHomePageInteractions();
    });
    window.router.addRoute('/projeto', Templates.projeto);
    window.router.addRoute('/cadastro', Templates.cadastro, function() {
        initCadastroForm();
    });
}

function initHomePageInteractions() {
    
    const mainContent = document.getElementById('app-content');
    
    if (!mainContent) return;
    
    if (mainContent._homeClickHandler) {
        mainContent.removeEventListener('click', mainContent._homeClickHandler);
    }
    
    mainContent._homeClickHandler = function(event) {
        const section = event.target.closest('main section');
        
        if (!section) return;
        
        if (event.target.tagName === 'A' || event.target.closest('a')) {
            return;
        }
        
        section.style.transform = 'scale(0.98)';
        setTimeout(() => {
            section.style.transform = '';
        }, 150);
        
        const sectionTitle = section.querySelector('h2')?.textContent;
        if (!sectionTitle) return;
        
        let message = 'Descubra como você pode fazer parte deste movimento de dança urbana';
        
        if (sectionTitle.includes('Quem somos')) {
            message = 'Conheça mais sobre nossa história e junte-se à família Perifa no Toque!';
        } else if (sectionTitle.includes('Missão')) {
            message = 'Ajude-nos a cumprir nossa missão de transformar vidas através da dança!';
        } else if (sectionTitle.includes('Contato')) {
            message = 'Entre em contato e faça parte da nossa comunidade de dança urbana!';
        }
        
        if (typeof showToastInfo === 'function') {
            showToastInfo(
                'Junte-se a nós!', 
                message,
                {
                    duration: 5000,
                    position: 'top-right',
                    action: {
                        text: 'Cadastrar',
                        type: 'register',
                        callback: function() {
                            window.router.navigate('/cadastro');
                        }
                    }
                }
            );
        }
    };
    
    mainContent.addEventListener('click', mainContent._homeClickHandler);
    
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.style.cursor = 'pointer';
    });
}


function initCadastroForm() {
    const form = document.getElementById('cadastro-form');
    const submitButton = document.getElementById('submitBtn');
    
    if (!form) {
        console.warn('Formulário de cadastro não encontrado');
        return;
    }

    function validateForm() {
        const requiredFields = [
            document.getElementById('inome'),
            document.getElementById('isobrenome'),
            document.getElementById('inascim'),
            document.getElementById('icpf'),
            document.getElementById('iemail'),
            document.getElementById('itel'),
            document.getElementById('iarea'),
            document.getElementById('itemp')
        ];
        
        const allFieldsFilled = requiredFields.every(field => {
            if (!field) return false;
            if (field.type === 'select-one') {
                return field.selectedIndex > 0 || field.value !== '';
            }
            return field.value.trim() !== '';
        });
        
        if (submitButton) {
            submitButton.disabled = !allFieldsFilled;
        }
    }

    const requiredFieldIds = [
        'inome', 'isobrenome', 'inascim', 'icpf', 
        'iemail', 'itel', 'iarea', 'itemp'
    ];
    
    requiredFieldIds.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field._validateHandler) {
                field.removeEventListener('input', field._validateHandler);
                field.removeEventListener('change', field._validateHandler);
            }
           
            field._validateHandler = validateForm;
            field.addEventListener('input', field._validateHandler);
            field.addEventListener('change', field._validateHandler);
        }
    });

    validateForm();

    
    if (form._submitHandler) {
        form.removeEventListener('submit', form._submitHandler);
    }

    
    form._submitHandler = function(e) {
        e.preventDefault();
        
        const requiredFields = [
            'inome', 'isobrenome', 'inascim', 'icpf', 
            'iemail', 'itel', 'iarea', 'itemp'
        ];
        
        let isValid = true;
        let emptyFields = [];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                isValid = false;
                emptyFields.push(field.previousElementSibling.textContent);
            }
        });
        
        if (!isValid) {
            if (typeof showToastError === 'function') {
                showToastError(
                    'Campos obrigatórios', 
                    `Por favor, preencha os seguintes campos: ${emptyFields.join(', ')}`
                );
            }
            return;
        }
        
     
        const email = document.getElementById('iemail').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (typeof showToastError === 'function') {
                showToastError('Email inválido', 'Por favor, insira um endereço de email válido.');
            }
            return;
        }
        
        if (typeof showToastInfo === 'function') {
            showToastInfo('Processando...', 'Enviando seus dados...', { duration: 2000 });
        }
        
        setTimeout(() => {
            if (typeof showModalSuccess === 'function') {
                showModalSuccess(
                    'Excelente!', 
                    'Você enviou suas informações corretamente. Entraremos em contato com você em breve.',
                    {
                        size: 'medium',
                        buttons: [
                            { text: 'Perfeito', type: 'confirm', variant: 'success' }
                        ],
                        onConfirm: () => {
                            form.reset();
                            
                            if (submitButton) {
                                submitButton.disabled = true;
                            }
                            
                            if (typeof showToastSuccess === 'function') {
                                showToastSuccess('Pronto!', 'Formulário enviado e limpo');
                            }
                        }
                    }
                );
            } else {
                alert('Formulário enviado com sucesso!');
                form.reset();
                if (submitButton) {
                    submitButton.disabled = true;
                }
            }
        }, 2000);
    };
    
    form.addEventListener('submit', form._submitHandler);

    const resetButton = form.querySelector('input[type="reset"]');
    if (resetButton) {
        if (resetButton._resetHandler) {
            resetButton.removeEventListener('click', resetButton._resetHandler);
        }
        
        resetButton._resetHandler = function(e) {
            e.preventDefault();
            
            const confirmed = confirm('Tem certeza de que deseja limpar todos os campos?\n\nEsta ação não pode ser desfeita.');
            
            if (confirmed) {
                form.reset();
                
                if (submitButton) {
                    submitButton.disabled = true;
                }
                
                if (typeof showToastInfo === 'function') {
                    showToastInfo('Formulário limpo', 'Todos os campos foram limpos com sucesso.');
                }
            } else {
                if (typeof showToastInfo === 'function') {
                    showToastInfo('Cancelado', 'Os campos não foram modificados.');
                }
            }
        };
        
        resetButton.addEventListener('click', resetButton._resetHandler);
    }
}
