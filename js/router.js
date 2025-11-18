/**
 * Sistema de Router para SPA
 * Gerencia a navegação entre vistas sem recarregar a página
 */

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.contentContainer = null;
        
        // Inicializar quando o DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Inicializa o router
     */
    init() {
        this.contentContainer = document.getElementById('app-content');
        
        if (!this.contentContainer) {
            console.error('Router: Elemento #app-content não encontrado');
            return;
        }

        this.setupEventListeners();
        
        console.log('Router inicializado');
    }


    addRoute(path, handler, onLoad = null) {
        this.routes[path] = {
            handler,
            onLoad
        };
    }


    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigate(route);
            }
        });

        // Gerenciar botões de voltar/avançar do navegador
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.route) {
                this.loadRoute(e.state.route, false);
            }
        });

        // Interceptar cliques nos links do menu
        document.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem && menuItem.hasAttribute('data-route')) {
                e.preventDefault();
                const route = menuItem.getAttribute('data-route');
                this.navigate(route);
                
                // Fechar menu móvel se estiver aberto
                if (window.hamburgerMenu && window.hamburgerMenu.isMenuOpen()) {
                    window.hamburgerMenu.close();
                }
            }
        });
    }

 
    loadInitialRoute() {
        const hash = window.location.hash.slice(1) || '/';
        this.loadRoute(hash, false);
    }

    navigate(path) {
        this.loadRoute(path, true);
    }

 
    loadRoute(path, pushState = true) {
        const route = this.routes[path];
        
        if (!route) {
            console.warn(`Rota não encontrada: ${path}`);
            // Redirecionar para home se a rota não existir
            if (path !== '/') {
                this.loadRoute('/', pushState);
            }
            return;
        }

        // Atualizar rota atual
        this.currentRoute = path;

        // Adicionar ao histórico do navegador
        if (pushState) {
            window.history.pushState({ route: path }, '', `#${path}`);
        }

        // Renderizar conteúdo
        this.render(route);

        // Atualizar menu ativo
        this.updateActiveMenu(path);

        // Scroll para o topo
        window.scrollTo(0, 0);

        // Atualizar título da página
        this.updatePageTitle(path);
    }

    render(route) {
        // Adicionar animação de saída
        this.contentContainer.style.opacity = '0';
        
        setTimeout(() => {
            // Renderizar novo conteúdo
            const content = route.handler();
            this.contentContainer.innerHTML = content;
            
            // Adicionar animação de entrada
            this.contentContainer.style.opacity = '1';
            
            if (route.onLoad && typeof route.onLoad === 'function') {
                setTimeout(() => route.onLoad(), 50);
            }
        }, 150);
    }

   
    updateActiveMenu(path) {
        // Remover classe active de todos os itens
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adicionar classe active ao item correspondente
        const activeItem = document.querySelector(`.menu-item[data-route="${path}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    updatePageTitle(path) {
        const titles = {
            '/': 'Início - Perifa no Toque',
            '/projeto': 'Projetos - Perifa no Toque',
            '/cadastro': 'Cadastro - Perifa no Toque'
        };

        document.title = titles[path] || 'Perifa no Toque';
    }

 
    getCurrentRoute() {
        return this.currentRoute;
    }
}

// Criar instância global do router
window.router = new Router();

// Exportar para uso em módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}
