/**
 * Sistema de Alertas - JavaScript
 * Proporciona funciones para crear y gestionar alertas dinámicas
 */

class AlertSystem {
    constructor() {
        this.alertContainer = null;
        this.alertCounter = 0;
        this.init();
    }

    /**
     * Inicializa el sistema de alertas
     */
    init() {
        // Crear contenedor de alertas si no existe
        this.createAlertContainer();
        
        // Configurar event listeners para alertas estáticas
        this.setupStaticAlerts();
    }

    /**
     * Crea el contenedor principal para alertas dinámicas
     */
    createAlertContainer(position = 'top-right') {
        if (this.alertContainer) {
            this.alertContainer.remove();
        }

        this.alertContainer = document.createElement('div');
        
        switch (position) {
            case 'top-right':
                this.alertContainer.className = 'alert-container';
                break;
            case 'bottom-right':
                this.alertContainer.className = 'alert-container-bottom';
                break;
            case 'center':
                this.alertContainer.className = 'alert-container-center';
                break;
            default:
                this.alertContainer.className = 'alert-container';
        }

        document.body.appendChild(this.alertContainer);
    }

    /**
     * Configura event listeners para alertas estáticas en el HTML
     */
    setupStaticAlerts() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('alert-close')) {
                const alert = e.target.closest('.alert');
                if (alert) {
                    this.closeAlert(alert);
                }
            }
        });
    }

    /**
     * Crea una nueva alerta
     * @param {Object} options - Opciones de configuración de la alerta
     */
    createAlert(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000,
            closable = true,
            size = 'normal',
            icon = true,
            position = null
        } = options;

        // Generar ID único
        const alertId = `alert-${++this.alertCounter}`;

        // Crear elemento de alerta
        const alertElement = document.createElement('div');
        alertElement.id = alertId;
        alertElement.className = this.getAlertClasses(type, size, closable, icon);

        // Crear contenido
        const content = this.createAlertContent(type, title, message, icon, closable);
        alertElement.innerHTML = content;

        // Determinar dónde mostrar la alerta
        const container = position ? this.getOrCreateContainer(position) : this.alertContainer;
        container.appendChild(alertElement);

        // Configurar cierre automático
        if (duration > 0) {
            setTimeout(() => {
                this.closeAlert(alertElement);
            }, duration);
        }

        // Configurar event listener para el botón de cerrar
        if (closable) {
            const closeBtn = alertElement.querySelector('.alert-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeAlert(alertElement);
                });
            }
        }

        return alertElement;
    }

    /**
     * Obtiene o crea un contenedor para una posición específica
     */
    getOrCreateContainer(position) {
        let container = document.querySelector(`.alert-container, .alert-container-bottom, .alert-container-center`);
        
        if (!container || !container.classList.contains(this.getContainerClass(position))) {
            this.createAlertContainer(position);
            container = this.alertContainer;
        }
        
        return container;
    }

    /**
     * Obtiene la clase CSS para el contenedor según la posición
     */
    getContainerClass(position) {
        switch (position) {
            case 'top-right': return 'alert-container';
            case 'bottom-right': return 'alert-container-bottom';
            case 'center': return 'alert-container-center';
            default: return 'alert-container';
        }
    }

    /**
     * Genera las clases CSS para la alerta
     */
    getAlertClasses(type, size, closable, icon) {
        let classes = ['alert', `alert-${type}`];
        
        if (size !== 'normal') {
            classes.push(`alert-${size}`);
        }
        
        if (!icon) {
            classes.push('alert-no-icon');
        }
        
        if (!closable) {
            classes.push('alert-no-close');
        }
        
        return classes.join(' ');
    }

    /**
     * Crea el contenido HTML de la alerta
     */
    createAlertContent(type, title, message, showIcon, closable) {
        const icon = showIcon ? this.getIcon(type) : '';
        const titleHtml = title ? `<h4 class="alert-title">${title}</h4>` : '';
        const messageHtml = message ? `<p class="alert-message">${message}</p>` : '';
        const closeBtn = closable ? '<button class="alert-close" aria-label="Cerrar alerta">&times;</button>' : '';

        return `
            ${icon}
            <div class="alert-content">
                ${titleHtml}
                ${messageHtml}
            </div>
            ${closeBtn}
        `;
    }

    /**
     * Obtiene el icono SVG para cada tipo de alerta
     */
    getIcon(type) {
        const icons = {
            success: `<svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,
            error: `<svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>`,
            warning: `<svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            info: `<svg class="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`
        };
        
        return icons[type] || icons.info;
    }

    /**
     * Cierra una alerta con animación
     */
    closeAlert(alertElement) {
        if (!alertElement) return;

        alertElement.classList.add('hiding');
        
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.parentNode.removeChild(alertElement);
            }
        }, 300);
    }

    /**
     * Métodos de conveniencia para diferentes tipos de alertas
     */
    success(title, message, options = {}) {
        return this.createAlert({
            type: 'success',
            title,
            message,
            ...options
        });
    }

    error(title, message, options = {}) {
        return this.createAlert({
            type: 'error',
            title,
            message,
            ...options
        });
    }

    warning(title, message, options = {}) {
        return this.createAlert({
            type: 'warning',
            title,
            message,
            ...options
        });
    }

    info(title, message, options = {}) {
        return this.createAlert({
            type: 'info',
            title,
            message,
            ...options
        });
    }

    /**
     * Cierra todas las alertas visibles
     */
    closeAll() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => this.closeAlert(alert));
    }

    /**
     * Cambia la posición del contenedor de alertas
     */
    setPosition(position) {
        this.createAlertContainer(position);
    }
}

// Crear instancia global del sistema de alertas
const alertSystem = new AlertSystem();

// Funciones globales de conveniencia
window.showAlert = (options) => alertSystem.createAlert(options);
window.showSuccess = (title, message, options) => alertSystem.success(title, message, options);
window.showError = (title, message, options) => alertSystem.error(title, message, options);
window.showWarning = (title, message, options) => alertSystem.warning(title, message, options);
window.showInfo = (title, message, options) => alertSystem.info(title, message, options);
window.closeAllAlerts = () => alertSystem.closeAll();
window.setAlertPosition = (position) => alertSystem.setPosition(position);

// Exportar para uso con módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlertSystem;
}
