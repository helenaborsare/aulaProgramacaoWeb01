/**
 * Hamburger Menu Functionality
 * Gerencia a funcionalidade do menu hamburguesa móvel
 * Compatível com todos os arquivos HTML do projeto
 */

class HamburgerMenu {
    constructor() {
        this.hamburger = null;
        this.menu = null;
        this.overlay = null;
        this.isInitialized = false;
        
        // Inicializar quando o DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        // Buscar elementos do menu
        this.hamburger = document.getElementById('hamburger');
        this.menu = document.getElementById('menu');
        this.overlay = document.getElementById('menu-overlay');
        
        // Verificar se todos os elementos existem
        if (!this.hamburger || !this.menu || !this.overlay) {
            console.warn('Hamburger Menu: Não foram encontrados todos os elementos necessários');
            return;
        }
        
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('Menu hamburguesa inicializado corretamente');
    }
    
    setupEventListeners() {
        // Toggle do menu ao clicar no hamburger
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Fechar menu ao clicar no overlay
        this.overlay.addEventListener('click', () => this.closeMenu());
        
        // Fechar menu ao clicar em um link do menu
        const menuItems = this.menu.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // Só fechar se o menu estiver ativo (móvel)
                if (this.isMenuOpen()) {
                    this.closeMenu();
                }
            });
        });
        
        // Fechar menu com a tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
        });
        
        // Gerenciar mudanças de tamanho da janela
        window.addEventListener('resize', () => {
            // Se mudarmos para desktop, fechar menu móvel
            if (window.innerWidth > 768 && this.isMenuOpen()) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (!this.isInitialized) return;
        
        this.hamburger.classList.add('active');
        this.menu.classList.add('active');
        this.overlay.classList.add('active');
        document.body.classList.add('menu-open');
        this.hamburger.setAttribute('aria-label', 'Fechar menu de navegação');
        
        // Focar o primeiro elemento do menu para acessibilidade
        const firstMenuItem = this.menu.querySelector('.menu-item');
        if (firstMenuItem) {
            firstMenuItem.focus();
        }
    }
    
    closeMenu() {
        if (!this.isInitialized) return;
        
        this.hamburger.classList.remove('active');
        this.menu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
    }
    
    isMenuOpen() {
        return this.hamburger && this.hamburger.classList.contains('active');
    }
    
    // Método público para fechar o menu de fora
    close() {
        this.closeMenu();
    }
    
    // Método público para abrir o menu de fora
    open() {
        this.openMenu();
    }
    
    // Método público para verificar se está inicializado
    isReady() {
        return this.isInitialized;
    }
}

// Criar instância global do menu hamburguesa
window.hamburgerMenu = new HamburgerMenu();

// Exportar para uso em módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HamburgerMenu;
}
