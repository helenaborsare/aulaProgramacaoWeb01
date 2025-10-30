/**
 * Sistema de Alerts Inline - JavaScript
 * Para notificaciones estáticas dentro del contenido de la página
 */

class InlineAlerts {
    constructor() {
        this.init();
    }

    /**
     * Inicializa el sistema de alerts inline
     */
    init() {
        this.setupStaticAlerts();
    }

    /**
     * Configura event listeners para alerts estáticos en el HTML
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
     * Crea una alerta inline en un contenedor específico
     * @param {string|HTMLElement} container - Selector o elemento contenedor
     * @param {Object} options - Opciones de configuración
     */
    createAlert(container, options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            closable = true,
            size = 'normal',
            icon = true,
            persistent = false
        } = options;

        // Obtener contenedor
        const containerElement = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;

        if (!containerElement) {
            console.error('Container not found for inline alert');
            return null;
        }

        // Crear elemento de alerta
        const alertElement = document.createElement('div');
        alertElement.className = this.getAlertClasses(type, size, closable, icon);

        // Crear contenido
        const content = this.createAlertContent(type, title, message, icon, closable);
        alertElement.innerHTML = content;

        // Insertar en el contenedor
        containerElement.insertBefore(alertElement, containerElement.firstChild);

        // Configurar event listener para el botón de cerrar
        if (closable) {
            const closeBtn = alertElement.querySelector('.alert-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeAlert(alertElement);
                });
            }
        }

        // Auto-remove si no es persistente
        if (!persistent) {
            setTimeout(() => {
                this.closeAlert(alertElement);
            }, 10000); // 10 segundos por defecto para alerts inline
        }

        return alertElement;
    }

    /**
     * Genera las clases CSS para la alerta
     */
    getAlertClasses(type, size, closable, icon) {
        let classes = ['alert', `alert-${type}`, 'alert-inline'];
        
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
     * Métodos de conveniencia para diferentes tipos de alertas inline
     */
    success(container, title, message, options = {}) {
        return this.createAlert(container, {
            type: 'success',
            title,
            message,
            ...options
        });
    }

    error(container, title, message, options = {}) {
        return this.createAlert(container, {
            type: 'error',
            title,
            message,
            ...options
        });
    }

    warning(container, title, message, options = {}) {
        return this.createAlert(container, {
            type: 'warning',
            title,
            message,
            ...options
        });
    }

    info(container, title, message, options = {}) {
        return this.createAlert(container, {
            type: 'info',
            title,
            message,
            ...options
        });
    }

    /**
     * Cierra todas las alertas inline visibles
     */
    closeAll() {
        const alerts = document.querySelectorAll('.alert-inline');
        alerts.forEach(alert => this.closeAlert(alert));
    }
}

// Crear instancia global del sistema de alerts inline
const inlineAlerts = new InlineAlerts();

// Funciones globales de conveniencia
window.showInlineAlert = (container, options) => inlineAlerts.createAlert(container, options);
window.showInlineSuccess = (container, title, message, options) => inlineAlerts.success(container, title, message, options);
window.showInlineError = (container, title, message, options) => inlineAlerts.error(container, title, message, options);
window.showInlineWarning = (container, title, message, options) => inlineAlerts.warning(container, title, message, options);
window.showInlineInfo = (container, title, message, options) => inlineAlerts.info(container, title, message, options);

// Exportar para uso con módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InlineAlerts;
}
