
class ThemeSwitcher {
    constructor() {
        this.themeToggleMobile = null;
        this.themeToggleDesktop = null;
        this.currentTheme = 'light';
        this.STORAGE_KEY = 'perifa-theme-preference';
        
        this.init();
    }
    
 
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
 
    setup() {
        console.log('[ThemeSwitcher] Inicializando...');
        
        this.themeToggleMobile = document.getElementById('theme-toggle');
        this.themeToggleDesktop = document.getElementById('theme-toggle-desktop');
        
        if (!this.themeToggleMobile && !this.themeToggleDesktop) {
            console.warn('[ThemeSwitcher] Botones de tema no encontrados');
            return;
        }
        
        this.loadTheme();
        
        if (this.themeToggleMobile) {
            this.themeToggleMobile.addEventListener('click', () => this.toggleTheme());
        }
        
        if (this.themeToggleDesktop) {
            this.themeToggleDesktop.addEventListener('click', () => this.toggleTheme());
        }
        
        console.log('[ThemeSwitcher] Inicializado correctamente');
    }
    
   
    loadTheme() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
            console.log(`[ThemeSwitcher] Tema cargado desde localStorage: ${savedTheme}`);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.currentTheme = prefersDark ? 'dark' : 'light';
            console.log(`[ThemeSwitcher] Tema detectado del sistema: ${this.currentTheme}`);
        }
        
        this.applyTheme(this.currentTheme);
        
        
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                const newTheme = e.matches ? 'dark' : 'light';
                console.log(`[ThemeSwitcher] Preferencia del sistema cambió a: ${newTheme}`);
                this.applyTheme(newTheme);
            }
        });
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        console.log(`[ThemeSwitcher] Cambiando tema de ${this.currentTheme} a ${newTheme}`);
        
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
    }
    
 
    applyTheme(theme) {
        this.currentTheme = theme;
        
        document.documentElement.setAttribute('data-theme', theme);
        
        document.body.classList.add('theme-transition');
        
    
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
        
        console.log(`[ThemeSwitcher] Tema aplicado: ${theme}`);
    }
    
    saveTheme(theme) {
        try {
            localStorage.setItem(this.STORAGE_KEY, theme);
            console.log(`[ThemeSwitcher] Tema guardado en localStorage: ${theme}`);
        } catch (error) {
            console.error('[ThemeSwitcher] Error al guardar tema:', error);
        }
    }
    

    getCurrentTheme() {
        return this.currentTheme;
    }
    
 
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.error(`[ThemeSwitcher] Tema inválido: ${theme}`);
            return;
        }
        
        this.applyTheme(theme);
        this.saveTheme(theme);
    }
    

    isReady() {
        return this.themeToggleMobile !== null || this.themeToggleDesktop !== null;
    }
}

const themeSwitcher = new ThemeSwitcher();

window.themeSwitcher = themeSwitcher;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeSwitcher;
}
