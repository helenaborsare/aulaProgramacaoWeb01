/**
 * Sistema de Toasts - JavaScript
 * Para notificaciones flotantes temporales no intrusivas
 */

class ToastSystem {
    constructor() {
        this.toastContainer = null;
        this.toastCounter = 0;
        this.maxToasts = 5;
        this.init();
    }

    /**
     * Inicializa el sistema de toasts
     */
    init() {
        this.createToastContainer();
    }

    /**
     * Crea el contenedor principal para toasts
     */
    createToastContainer(position = 'top-right') {
        if (this.toastContainer) {
            this.toastContainer.remove();
        }

        this.toastContainer = document.createElement('div');
        this.toastContainer.className = this.getContainerClass(position);
        this.toastContainer.setAttribute('aria-live', 'polite');
        this.toastContainer.setAttribute('aria-atomic', 'true');

        document.body.appendChild(this.toastContainer);
    }

    /**
     * Obtiene la clase CSS para el contenedor según la posición
     */
    getContainerClass(position) {
        const baseClass = 'toast-container';
        switch (position) {
            case 'top-left': return `${baseClass} toast-container-top-left`;
            case 'top-right': return `${baseClass} toast-container-top-right`;
            case 'top-center': return `${baseClass} toast-container-top-center`;
            case 'bottom-left': return `${baseClass} toast-container-bottom-left`;
            case 'bottom-right': return `${baseClass} toast-container-bottom-right`;
            case 'bottom-center': return `${baseClass} toast-container-bottom-center`;
            default: return `${baseClass} toast-container-top-right`;
        }
    }

    /**
     * Crea un nuevo toast
     * @param {Object} options - Opciones de configuración del toast
     */
    createToast(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 4000,
            closable = true,
            size = 'normal',
            icon = true,
            position = null,
            action = null,
            progress = false
        } = options;

        // Limitar número de toasts
        this.limitToasts();

        // Generar ID único
        const toastId = `toast-${++this.toastCounter}`;

        // Crear elemento de toast
        const toastElement = document.createElement('div');
        toastElement.id = toastId;
        toastElement.className = this.getToastClasses(type, size, closable, icon, progress);
        toastElement.setAttribute('role', 'alert');

        // Crear contenido
        const content = this.createToastContent(type, title, message, icon, closable, action, progress);
        toastElement.innerHTML = content;

        // Determinar contenedor
        const container = position ? this.getOrCreateContainer(position) : this.toastContainer;
        
        // Agregar toast al contenedor (al principio para que aparezca arriba)
        container.insertBefore(toastElement, container.firstChild);

        // Mostrar toast con animación (pequeño delay para permitir que el DOM se actualice)
        setTimeout(() => {
            toastElement.classList.add('toast-show');
        }, 10);

        // Configurar barra de progreso si está habilitada
        if (progress && duration > 0) {
            this.animateProgress(toastElement, duration);
        }

        // Configurar cierre automático
        if (duration > 0) {
            setTimeout(() => {
                this.closeToast(toastElement);
            }, duration);
        }

        // Configurar event listeners
        this.setupToastEvents(toastElement, action);

        return toastElement;
    }

    /**
     * Limita el número de toasts visibles
     */
    limitToasts() {
        const toasts = this.toastContainer.querySelectorAll('.toast');
        if (toasts.length >= this.maxToasts) {
            // Remover los toasts más antiguos
            for (let i = this.maxToasts - 1; i < toasts.length; i++) {
                this.closeToast(toasts[i]);
            }
        }
    }

    /**
     * Obtiene o crea un contenedor para una posición específica
     */
    getOrCreateContainer(position) {
        const existingContainer = document.querySelector(`.toast-container`);
        
        if (!existingContainer || !existingContainer.classList.contains(this.getContainerClass(position).split(' ')[1])) {
            this.createToastContainer(position);
        }
        
        return this.toastContainer;
    }

    /**
     * Genera las clases CSS para el toast
     */
    getToastClasses(type, size, closable, icon, progress) {
        let classes = ['toast', `toast-${type}`];
        
        if (size !== 'normal') {
            classes.push(`toast-${size}`);
        }
        
        if (!icon) {
            classes.push('toast-no-icon');
        }
        
        if (!closable) {
            classes.push('toast-no-close');
        }

        if (progress) {
            classes.push('toast-with-progress');
        }
        
        return classes.join(' ');
    }

    /**
     * Crea el contenido HTML del toast
     */
    createToastContent(type, title, message, showIcon, closable, action, progress) {
        const icon = showIcon ? this.getIcon(type) : '';
        const titleHtml = title ? `<h4 class="toast-title">${title}</h4>` : '';
        const messageHtml = message ? `<p class="toast-message">${message}</p>` : '';
        const closeBtn = closable ? '<button class="toast-close" aria-label="Cerrar toast">&times;</button>' : '';
        const actionBtn = action ? `<button class="toast-action" data-action="${action.type}">${action.text}</button>` : '';
        const progressBar = progress ? '<div class="toast-progress"><div class="toast-progress-bar"></div></div>' : '';

        return `
            <div class="toast-header">
                ${icon}
                <div class="toast-content">
                    ${titleHtml}
                    ${messageHtml}
                </div>
                ${closeBtn}
            </div>
            ${actionBtn ? `<div class="toast-actions">${actionBtn}</div>` : ''}
            ${progressBar}
        `;
    }

    /**
     * Configura los event listeners del toast
     */
    setupToastEvents(toastElement, action) {
        // Botón de cerrar
        const closeBtn = toastElement.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeToast(toastElement);
            });
        }

        // Botón de acción
        const actionBtn = toastElement.querySelector('.toast-action');
        if (actionBtn && action) {
            actionBtn.addEventListener('click', () => {
                if (typeof action.callback === 'function') {
                    action.callback();
                }
                if (action.closeOnAction !== false) {
                    this.closeToast(toastElement);
                }
            });
        }

        // Pausar auto-close en hover
        toastElement.addEventListener('mouseenter', () => {
            toastElement.classList.add('toast-paused');
        });

        toastElement.addEventListener('mouseleave', () => {
            toastElement.classList.remove('toast-paused');
        });
    }

    /**
     * Anima la barra de progreso
     */
    animateProgress(toastElement, duration) {
        const progressBar = toastElement.querySelector('.toast-progress-bar');
        if (progressBar) {
            progressBar.style.animationDuration = `${duration}ms`;
            progressBar.classList.add('toast-progress-active');
        }
    }

    /**
     * Obtiene el icono SVG para cada tipo de toast
     */
    getIcon(type) {
        const icons = {
            success: `<svg class="toast-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,
            error: `<svg class="toast-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>`,
            warning: `<svg class="toast-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            info: `<svg class="toast-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`
        };
        
        return icons[type] || icons.info;
    }

    /**
     * Cierra un toast con animación
     */
    closeToast(toastElement) {
        if (!toastElement || toastElement.classList.contains('toast-hiding')) return;

        toastElement.classList.remove('toast-show');
        toastElement.classList.add('toast-hiding');
        
        setTimeout(() => {
            if (toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        }, 300);
    }

    /**
     * Métodos de conveniencia para diferentes tipos de toasts
     */
    success(title, message, options = {}) {
        return this.createToast({
            type: 'success',
            title,
            message,
            ...options
        });
    }

    error(title, message, options = {}) {
        return this.createToast({
            type: 'error',
            title,
            message,
            duration: 6000, // Errores duran más tiempo
            ...options
        });
    }

    warning(title, message, options = {}) {
        return this.createToast({
            type: 'warning',
            title,
            message,
            duration: 5000,
            ...options
        });
    }

    info(title, message, options = {}) {
        return this.createToast({
            type: 'info',
            title,
            message,
            ...options
        });
    }

    /**
     * Cierra todos los toasts visibles
     */
    closeAll() {
        const toasts = document.querySelectorAll('.toast');
        toasts.forEach(toast => this.closeToast(toast));
    }

    /**
     * Cambia la posición del contenedor de toasts
     */
    setPosition(position) {
        this.createToastContainer(position);
    }

    /**
     * Configura el número máximo de toasts
     */
    setMaxToasts(max) {
        this.maxToasts = max;
    }
}

// Crear instancia global del sistema de toasts
const toastSystem = new ToastSystem();

// Funciones globales de conveniencia
window.showToast = (options) => toastSystem.createToast(options);
window.showToastSuccess = (title, message, options) => toastSystem.success(title, message, options);
window.showToastError = (title, message, options) => toastSystem.error(title, message, options);
window.showToastWarning = (title, message, options) => toastSystem.warning(title, message, options);
window.showToastInfo = (title, message, options) => toastSystem.info(title, message, options);
window.closeAllToasts = () => toastSystem.closeAll();
window.setToastPosition = (position) => toastSystem.setPosition(position);

// Exportar para uso con módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToastSystem;
}
