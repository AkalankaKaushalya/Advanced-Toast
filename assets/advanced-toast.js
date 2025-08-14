/**
 * Advanced Toast Notification System v1.0
 * CDN Ready JavaScript Library
 * Similar to SweetAlert but for Toast notifications
 */

(function(global) {
    'use strict';

    // Global variables
    let toastCounter = 0;
    let currentPosition = 'top-right';
    let soundEnabled = true;

    // Toast configuration
    const toastConfig = {
        icons: {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        },
        sounds: {
            success: () => playTone(800, 0.1, 'sine'),
            error: () => playTone(300, 0.2, 'square'),
            notification: () => playTone(600, 0.1, 'triangle')
        },
        positions: [
            'top-left', 'top-center', 'top-right',
            'center', 'bottom-left', 'bottom-center', 'bottom-right'
        ],
        animations: ['slide-in', 'fade-in', 'bounce-in', 'flip-in']
    };

    // Initialize container if not exists
    function initializeContainer() {
        if (!document.getElementById('toastContainer')) {
            const container = document.createElement('div');
            container.className = `toast-container ${currentPosition}`;
            container.id = 'toastContainer';
            document.body.appendChild(container);
        }
    }

    // Update container position
    function updateContainerPosition(position) {
        const container = document.getElementById('toastContainer');
        if (container) {
            container.className = `toast-container ${position || currentPosition}`;
        }
    }

    // Play sound function
    function playTone(frequency, duration, type = 'sine') {
        if (!soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    // Main toast function - similar to Swal.fire()
    function fire(options = {}) {
        // Initialize container
        initializeContainer();

        const {
            type = 'info',
            title = 'Notification',
            message = '',
            icon = null,
            duration = 5000,
            position = currentPosition,
            animation = 'slide-in',
            sound = false,
            customColor = null,
            customBgColor = null,
            customTextColor = null,
            actions = [],
            progressBar = true,
            closeButton = true,
            autoHide = true
        } = options;

        // Set container position
        if (position && position !== currentPosition) {
            currentPosition = position;
            updateContainerPosition(position);
        }

        const container = document.getElementById('toastContainer');
        const toastId = `toast-${toastCounter++}`;

        // Determine icon
        let toastIcon = icon || toastConfig.icons[type] || 'ℹ️';

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type} animate-${animation}`;
        if (progressBar && autoHide) toast.classList.add('with-progress');
        toast.id = toastId;
        
        if (autoHide && duration > 0) {
            toast.style.setProperty('--duration', `${duration}ms`);
        }

        // Apply custom styling
        if (type === 'custom' && (customColor || customBgColor || customTextColor)) {
            if (customColor) toast.style.setProperty('--toast-color', customColor);
            if (customBgColor) toast.style.setProperty('--toast-bg', customBgColor);
            if (customTextColor) toast.style.setProperty('--toast-text-color', customTextColor);
        }

        // Create actions HTML
        let actionsHTML = '';
        if (actions.length > 0) {
            actionsHTML = '<div class="toast-actions">' + 
                actions.map((action, index) => 
                    `<button class="toast-action" data-action="${index}">${action.text || 'Action'}</button>`
                ).join('') + 
            '</div>';
        }

        // Create close button HTML
        let closeButtonHTML = closeButton ? 
            `<button class="toast-close" data-toast-close="${toastId}">&times;</button>` : '';

        toast.innerHTML = `
            <div class="toast-icon">${toastIcon}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
                ${actionsHTML}
            </div>
            ${closeButtonHTML}
        `;

        // Add to container
        container.appendChild(toast);

        // Add event listeners
        if (closeButton) {
            const closeBtn = toast.querySelector('.toast-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => hide(toastId));
            }
        }

        // Add action listeners
        if (actions.length > 0) {
            const actionBtns = toast.querySelectorAll('.toast-action');
            actionBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    if (actions[index].onClick) {
                        actions[index].onClick();
                    }
                    if (actions[index].closeOnClick !== false) {
                        hide(toastId);
                    }
                });
            });
        }

        // Play sound
        if (sound && soundEnabled) {
            if (typeof sound === 'string' && toastConfig.sounds[sound]) {
                toastConfig.sounds[sound]();
            } else if (sound === true && toastConfig.sounds[type]) {
                toastConfig.sounds[type]();
            } else if (toastConfig.sounds.notification) {
                toastConfig.sounds.notification();
            }
        }

        // Show animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto hide
        if (autoHide && duration > 0) {
            setTimeout(() => {
                hide(toastId);
            }, duration);
        }

        // Return toast ID for manual control
        return toastId;
    }

    // Hide specific toast
    function hide(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 400);
        }
    }

    // Clear all toasts
    function clear() {
        const toasts = document.querySelectorAll('.toast.show');
        toasts.forEach((toast, index) => {
            setTimeout(() => hide(toast.id), index * 100);
        });
    }

    // Set global position
    function setPosition(position) {
        if (toastConfig.positions.includes(position)) {
            currentPosition = position;
            updateContainerPosition(position);
        }
    }

    // Toggle sound
    function toggleSound() {
        soundEnabled = !soundEnabled;
        return soundEnabled;
    }

    // Toast queue system
    class ToastQueue {
        constructor() {
            this.queue = [];
            this.processing = false;
            this.maxConcurrent = 3;
            this.currentCount = 0;
        }

        add(options) {
            this.queue.push(options);
            this.process();
        }

        process() {
            if (this.processing || this.currentCount >= this.maxConcurrent) return;
            if (this.queue.length === 0) return;

            this.processing = true;
            const options = this.queue.shift();
            
            this.currentCount++;
            const toastId = fire(options);
            
            // Track when toast is removed
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((node) => {
                        if (node.id === toastId) {
                            this.currentCount--;
                            observer.disconnect();
                            setTimeout(() => {
                                this.processing = false;
                                this.process();
                            }, 100);
                        }
                    });
                });
            });

            const container = document.getElementById('toastContainer');
            if (container) {
                observer.observe(container, { childList: true });
            }

            this.processing = false;
            setTimeout(() => this.process(), 200);
        }
    }

    const toastQueue = new ToastQueue();

    // Queue toast
    function queue(options) {
        toastQueue.add(options);
    }

    // Show batch of toasts
    function batch(toastArray) {
        toastArray.forEach((toastOptions, index) => {
            setTimeout(() => {
                fire(toastOptions);
            }, index * 600);
        });
    }

    // Preset toast methods
    function success(title, message, options = {}) {
        return fire({
            type: 'success',
            title: title || 'Success!',
            message: message || '',
            sound: 'success',
            ...options
        });
    }

    function error(title, message, options = {}) {
        return fire({
            type: 'error',
            title: title || 'Error!',
            message: message || '',
            sound: 'error',
            ...options
        });
    }

    function warning(title, message, options = {}) {
        return fire({
            type: 'warning',
            title: title || 'Warning!',
            message: message || '',
            sound: 'notification',
            ...options
        });
    }

    function info(title, message, options = {}) {
        return fire({
            type: 'info',
            title: title || 'Info',
            message: message || '',
            sound: 'notification',
            ...options
        });
    }

    // Progress toast helper
    function progress(title, initialMessage, options = {}) {
        const toastId = fire({
            type: 'info',
            title: title || 'Loading...',
            message: initialMessage || 'Please wait...',
            duration: 0,
            progressBar: false,
            autoHide: false,
            ...options
        });

        return {
            id: toastId,
            update: (newMessage) => {
                const toast = document.getElementById(toastId);
                if (toast) {
                    const messageEl = toast.querySelector('.toast-message');
                    if (messageEl) messageEl.textContent = newMessage;
                }
            },
            close: () => hide(toastId)
        };
    }

    // Confirmation toast
    function confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            fire({
                type: 'info',
                title: title || 'Confirm',
                message: message || 'Are you sure?',
                duration: 0,
                autoHide: false,
                actions: [
                    {
                        text: options.confirmText || 'Yes',
                        onClick: () => resolve(true)
                    },
                    {
                        text: options.cancelText || 'No',
                        onClick: () => resolve(false)
                    }
                ],
                ...options
            });
        });
    }

    // Initialize on DOM ready
    function init() {
        // Auto-initialize container when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeContainer);
        } else {
            initializeContainer();
        }

        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        warning('Warning Toast', 'This is a keyboard shortcut demo');
                        break;
                    case '4':
                        e.preventDefault();
                        info('Info Toast', 'This is a keyboard shortcut demo');
                        break;
                    case 'Escape':
                        e.preventDefault();
                        clear();
                        break;
                }
            }
        });
    }

    // Public API - Similar to SweetAlert structure
    const Toast = {
        fire: fire,
        show: fire, // Alias
        hide: hide,
        clear: clear,
        close: clear, // Alias
        setPosition: setPosition,
        toggleSound: toggleSound,
        queue: queue,
        batch: batch,
        
        // Preset methods
        success: success,
        error: error,
        warning: warning,
        info: info,
        
        // Special methods
        progress: progress,
        confirm: confirm,
        
        // Configuration
        config: {
            defaultPosition: currentPosition,
            soundEnabled: soundEnabled,
            positions: toastConfig.positions,
            animations: toastConfig.animations
        },
        
        // Version info
        version: '1.0.0'
    };

    // Initialize
    init();

    // Export to global scope
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Toast;
    } else if (typeof define === 'function' && define.amd) {
        define(function() { return Toast; });
    } else {
        global.Toast = Toast;
        // Also create Swal-like alias for familiarity
        global.Swal = {
            fire: (options) => {
                // Convert SweetAlert-like options to Toast options
                const toastOptions = {
                    type: options.icon || options.type || 'info',
                    title: options.title || '',
                    message: options.text || options.html || '',
                    duration: options.timer || 5000,
                    position: options.position || 'top-right',
                    showConfirmButton: false, // Toasts don't need confirm by default
                    ...options
                };
                
                // Handle SweetAlert confirm/cancel buttons
                if (options.showConfirmButton || options.showCancelButton) {
                    const actions = [];
                    
                    if (options.showConfirmButton !== false) {
                        actions.push({
                            text: options.confirmButtonText || 'OK',
                            onClick: () => {
                                if (options.preConfirm) options.preConfirm();
                            }
                        });
                    }
                    
                    if (options.showCancelButton) {
                        actions.push({
                            text: options.cancelButtonText || 'Cancel',
                            onClick: () => {
                                if (options.preDeny) options.preDeny();
                            }
                        });
                    }
                    
                    toastOptions.actions = actions;
                    toastOptions.duration = 0; // Don't auto-hide with buttons
                }
                
                return Toast.fire(toastOptions);
            },
            
            // Quick methods
            success: (title, message) => Toast.success(title, message),
            error: (title, message) => Toast.error(title, message),
            warning: (title, message) => Toast.warning(title, message),
            info: (title, message) => Toast.info(title, message),
            
            // Close method
            close: () => Toast.clear()
        };
    }

    // Console log for developers
    console.log('🍞 Advanced Toast System v1.0 loaded!');
    console.log('Available methods:', Object.keys(Toast));
    console.log('Quick start: Toast.fire({ type: "success", title: "Hello!", message: "World!" })');

})(typeof window !== 'undefined' ? window : this);

// Auto-create container styles if not loaded
(function() {
    // Check if styles are already loaded
    const existingStyles = document.querySelector('style[data-toast-styles], link[href*="advanced-toast"]');
    
    if (!existingStyles) {
        // Inject minimal required styles
        const style = document.createElement('style');
        style.setAttribute('data-toast-styles', 'true');
        style.textContent = `
            .toast-container { position: fixed; z-index: 9999; pointer-events: none; }
            .toast-container.top-right { top: 20px; right: 20px; }
            .toast-container.top-left { top: 20px; left: 20px; }
            .toast-container.top-center { top: 20px; left: 50%; transform: translateX(-50%); }
            .toast-container.bottom-right { bottom: 20px; right: 20px; }
            .toast-container.bottom-left { bottom: 20px; left: 20px; }
            .toast-container.bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); }
            .toast-container.center { top: 50%; left: 50%; transform: translate(-50%, -50%); }
            
            .toast { background: white; border-radius: 15px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); 
                    padding: 20px 25px; margin-bottom: 15px; min-width: 350px; max-width: 450px; 
                    display: flex; align-items: flex-start; gap: 15px; pointer-events: all; opacity: 0; 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border-left: 5px solid; 
                    position: relative; overflow: hidden; font-family: system-ui, -apple-system, sans-serif; }
            
            .toast.show { opacity: 1; transform: translateX(0) scale(1) rotateY(0deg) !important; }
            .toast.hide { transform: scale(0.8); opacity: 0; }
            .toast.animate-slide-in { transform: translateX(450px); }
            .toast.animate-fade-in { transform: scale(0.8); }
            .toast.animate-bounce-in { transform: scale(0.3) rotate(45deg); }
            .toast.animate-flip-in { transform: perspective(400px) rotateY(90deg); }
            
            .toast.success { border-left-color: #28a745; color: #155724; }
            .toast.error { border-left-color: #dc3545; color: #721c24; }
            .toast.warning { border-left-color: #ffc107; color: #856404; }
            .toast.info { border-left-color: #17a2b8; color: #0c5460; }
            .toast.custom { border-left-color: var(--toast-color, #6f42c1); color: var(--toast-text-color, #333); 
                           background: var(--toast-bg, white); }
            
            .toast-icon { font-size: 28px; flex-shrink: 0; margin-top: 2px; }
            .toast-content { flex: 1; }
            .toast-title { font-weight: 700; font-size: 16px; margin-bottom: 6px; line-height: 1.2; }
            .toast-message { font-size: 14px; opacity: 0.9; line-height: 1.5; }
            .toast-close { background: none; border: none; font-size: 22px; cursor: pointer; opacity: 0.6; 
                          transition: all 0.2s; padding: 5px; border-radius: 6px; flex-shrink: 0; 
                          color: currentColor; line-height: 1; }
            .toast-close:hover { opacity: 1; background: rgba(0,0,0,0.1); transform: scale(1.1); }
            
            .toast-actions { margin-top: 12px; display: flex; gap: 10px; }
            .toast-action { padding: 6px 12px; border: 1px solid currentColor; background: transparent; 
                           color: currentColor; border-radius: 6px; cursor: pointer; font-size: 12px; 
                           font-weight: 600; transition: all 0.2s; }
            .toast-action:hover { background: currentColor; color: white; }
            
            .toast.with-progress::before { content: ''; position: absolute; bottom: 0; left: 0; height: 4px; 
                                          background: currentColor; width: 100%; transform-origin: left; 
                                          animation: progress var(--duration, 5s) linear; }
            
            @keyframes progress { from { transform: scaleX(1); } to { transform: scaleX(0); } }
            
            @media (max-width: 768px) {
                .toast { min-width: 280px; max-width: calc(100vw - 40px); margin-bottom: 10px; padding: 15px 20px; }
                .toast-container { left: 10px !important; right: 10px !important; top: 10px !important; bottom: 10px !important; transform: none !important; }
            }
        `;
        
        document.head.appendChild(style);
        console.log('🎨 Toast styles auto-injected');
    }
})();