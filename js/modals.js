/**
 * Sistema de Modals - JavaScript
 * Para diálogos modales bloqueantes que requieren interacción del usuario
 */

class ModalSystem {
    constructor() {
        this.activeModals = [];
        this.modalCounter = 0;
        this.init();
    }

    /**
     * Inicializa el sistema de modales
     */
    init() {
        this.setupKeyboardEvents();
    }

    /**
     * Configura eventos de teclado globales
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.length > 0) {
                const topModal = this.activeModals[this.activeModals.length - 1];
                if (topModal.options.closable !== false) {
                    this.closeModal(topModal.element);
                }
            }
        });
    }

    /**
     * Crea un nuevo modal
     * @param {Object} options - Opciones de configuración del modal
     */
    createModal(options = {}) {
        const {
            type = 'info',
            title = '',
            message = '',
            size = 'medium',
            closable = true,
            backdrop = true,
            centered = true,
            buttons = null,
            customContent = null,
            onShow = null,
            onHide = null,
            onConfirm = null,
            onCancel = null
        } = options;

        // Generar ID único
        const modalId = `modal-${++this.modalCounter}`;

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.setAttribute('aria-hidden', 'true');

        // Crear modal
        const modalElement = document.createElement('div');
        modalElement.id = modalId;
        modalElement.className = this.getModalClasses(type, size, centered);
        modalElement.setAttribute('role', 'dialog');
        modalElement.setAttribute('aria-modal', 'true');
        modalElement.setAttribute('aria-labelledby', `${modalId}-title`);

        // Crear contenido
        const content = customContent || this.createModalContent(modalId, type, title, message, buttons, closable);
        modalElement.innerHTML = content;

        // Agregar modal al overlay
        overlay.appendChild(modalElement);

        // Agregar al DOM
        document.body.appendChild(overlay);

        // Registrar modal activo
        const modalData = {
            element: overlay,
            modal: modalElement,
            options: options,
            id: modalId
        };
        this.activeModals.push(modalData);

        // Configurar eventos
        this.setupModalEvents(overlay, modalElement, modalData, options);

        // Mostrar modal
        this.showModal(overlay, modalElement, options);

        return modalData;
    }

    /**
     * Genera las clases CSS para el modal
     */
    getModalClasses(type, size, centered) {
        let classes = ['modal', `modal-${type}`, `modal-${size}`];
        
        if (centered) {
            classes.push('modal-centered');
        }
        
        return classes.join(' ');
    }

    /**
     * Crea el contenido HTML del modal
     */
    createModalContent(modalId, type, title, message, buttons, closable) {
        const icon = this.getIcon(type);
        const titleHtml = title ? `<h3 class="modal-title" id="${modalId}-title">${title}</h3>` : '';
        const messageHtml = message ? `<div class="modal-message">${message}</div>` : '';
        const closeBtn = closable ? '<button class="modal-close" aria-label="Cerrar modal">&times;</button>' : '';
        
        // Botones por defecto según el tipo
        const defaultButtons = this.getDefaultButtons(type);
        const modalButtons = buttons || defaultButtons;
        const buttonsHtml = this.createButtonsHtml(modalButtons);

        return `
            <div class="modal-header">
                ${icon}
                <div class="modal-header-content">
                    ${titleHtml}
                </div>
                ${closeBtn}
            </div>
            <div class="modal-body">
                ${messageHtml}
            </div>
            <div class="modal-footer">
                ${buttonsHtml}
            </div>
        `;
    }

    /**
     * Obtiene botones por defecto según el tipo de modal
     */
    getDefaultButtons(type) {
        switch (type) {
            case 'confirm':
                return [
                    { text: 'Cancelar', type: 'cancel', variant: 'secondary' },
                    { text: 'Confirmar', type: 'confirm', variant: 'primary' }
                ];
            case 'error':
                return [
                    { text: 'Entendido', type: 'confirm', variant: 'danger' }
                ];
            case 'warning':
                return [
                    { text: 'Cancelar', type: 'cancel', variant: 'secondary' },
                    { text: 'Continuar', type: 'confirm', variant: 'warning' }
                ];
            default:
                return [
                    { text: 'Aceptar', type: 'confirm', variant: 'primary' }
                ];
        }
    }

    /**
     * Crea el HTML para los botones
     */
    createButtonsHtml(buttons) {
        if (!buttons || buttons.length === 0) return '';

        return buttons.map(button => {
            const variant = button.variant || 'secondary';
            const disabled = button.disabled ? 'disabled' : '';
            return `<button class="modal-btn modal-btn-${variant}" data-action="${button.type}" ${disabled}>${button.text}</button>`;
        }).join('');
    }

    /**
     * Configura los event listeners del modal
     */
    setupModalEvents(overlay, modalElement, modalData, options) {
        // Click en overlay para cerrar
        if (options.backdrop !== false) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay && options.closable !== false) {
                    this.closeModal(overlay);
                }
            });
        }

        // Botón de cerrar
        const closeBtn = modalElement.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal(overlay);
            });
        }

        // Botones de acción
        const actionButtons = modalElement.querySelectorAll('.modal-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                this.handleButtonAction(action, modalData, options);
            });
        });
    }

    /**
     * Maneja las acciones de los botones
     */
    handleButtonAction(action, modalData, options) {
        let shouldClose = true;

        switch (action) {
            case 'confirm':
                if (typeof options.onConfirm === 'function') {
                    const result = options.onConfirm(modalData);
                    if (result === false) shouldClose = false;
                }
                break;
            case 'cancel':
                if (typeof options.onCancel === 'function') {
                    const result = options.onCancel(modalData);
                    if (result === false) shouldClose = false;
                }
                break;
        }

        if (shouldClose) {
            this.closeModal(modalData.element);
        }
    }

    /**
     * Muestra el modal con animación
     */
    showModal(overlay, modalElement, options) {
        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';
        
        // Mostrar con animación
        requestAnimationFrame(() => {
            overlay.classList.add('modal-show');
            modalElement.classList.add('modal-show');
            
            // Focus en el modal
            const firstFocusable = modalElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }

            // Callback onShow
            if (typeof options.onShow === 'function') {
                options.onShow(modalElement);
            }
        });
    }

    /**
     * Cierra un modal
     */
    closeModal(overlay) {
        const modalData = this.activeModals.find(m => m.element === overlay);
        if (!modalData) return;

        // Animación de salida
        overlay.classList.add('modal-hiding');
        modalData.modal.classList.add('modal-hiding');

        setTimeout(() => {
            // Remover del DOM
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }

            // Remover de la lista de modales activos
            const index = this.activeModals.indexOf(modalData);
            if (index > -1) {
                this.activeModals.splice(index, 1);
            }

            // Restaurar scroll si no hay más modales
            if (this.activeModals.length === 0) {
                document.body.style.overflow = '';
            }

            // Callback onHide
            if (typeof modalData.options.onHide === 'function') {
                modalData.options.onHide(modalData.modal);
            }
        }, 300);
    }

    /**
     * Obtiene el icono SVG para cada tipo de modal
     */
    getIcon(type) {
        const icons = {
            success: `<svg class="modal-icon modal-icon-success" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,
            error: `<svg class="modal-icon modal-icon-error" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>`,
            warning: `<svg class="modal-icon modal-icon-warning" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            confirm: `<svg class="modal-icon modal-icon-confirm" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`,
            info: `<svg class="modal-icon modal-icon-info" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`
        };
        
        return icons[type] || icons.info;
    }

    /**
     * Métodos de conveniencia para diferentes tipos de modales
     */
    alert(title, message, options = {}) {
        return this.createModal({
            type: 'info',
            title,
            message,
            ...options
        });
    }

    confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            this.createModal({
                type: 'confirm',
                title,
                message,
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false),
                ...options
            });
        });
    }

    error(title, message, options = {}) {
        return this.createModal({
            type: 'error',
            title,
            message,
            ...options
        });
    }

    warning(title, message, options = {}) {
        return this.createModal({
            type: 'warning',
            title,
            message,
            ...options
        });
    }

    success(title, message, options = {}) {
        return this.createModal({
            type: 'success',
            title,
            message,
            ...options
        });
    }

    /**
     * Cierra todos los modales
     */
    closeAll() {
        [...this.activeModals].forEach(modalData => {
            this.closeModal(modalData.element);
        });
    }

    /**
     * Obtiene el modal activo (el último abierto)
     */
    getActiveModal() {
        return this.activeModals.length > 0 ? this.activeModals[this.activeModals.length - 1] : null;
    }
}

// Crear instancia global del sistema de modales
const modalSystem = new ModalSystem();

// Funciones globales de conveniencia
window.showModal = (options) => modalSystem.createModal(options);
window.showModalAlert = (title, message, options) => modalSystem.alert(title, message, options);
window.showModalConfirm = (title, message, options) => modalSystem.confirm(title, message, options);
window.showModalError = (title, message, options) => modalSystem.error(title, message, options);
window.showModalWarning = (title, message, options) => modalSystem.warning(title, message, options);
window.showModalSuccess = (title, message, options) => modalSystem.success(title, message, options);
window.closeAllModals = () => modalSystem.closeAll();

// Exportar para uso con módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalSystem;
}
