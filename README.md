# 🍞 Advanced Toast Notification System

A beautiful, customizable toast notification system that can be easily integrated into any website.

## 📚 Test Website
```html
https://akalankakaushalya.github.io/Advanced-Toast/
```

## 🚀 Quick Start

### 1. Include CDN Files

Add these CDN links to your HTML:

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AkalankaKaushalya/Advanced-Toast@main/advanced-toast.min.css">

<!-- JavaScript -->
<script src="https://cdn.jsdelivr.net/gh/AkalankaKaushalya/Advanced-Toast@main/advanced-toast.min.js"></script>
```

### 2. Initialize Toast Container

Add this to your HTML body:

```html
<div class="toast-container top-right" id="toastContainer"></div>
```

### 3. Basic Usage

```javascript
// Simple toast
Toast.fire({
    type: 'success',
    title: 'Success!',
    message: 'Operation completed successfully!'
});

// Custom toast with all options
Toast.fire({
    type: 'info',
    title: 'Custom Toast',
    message: 'This is a custom message',
    duration: 5000,
    position: 'top-right',
    animation: 'slide-in',
    sound: true,
    progressBar: true
});
```

## 📚 API Reference

### Toast.fire(options)

Main method to show toast notifications.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | `'info'` | Toast type: `'success'`, `'error'`, `'warning'`, `'info'`, `'custom'` |
| `title` | string | `'Notification'` | Toast title |
| `message` | string | `''` | Toast message |
| `icon` | string | `null` | Custom icon (emoji or text) |
| `duration` | number | `5000` | Duration in milliseconds (0 = no auto-hide) |
| `position` | string | `'top-right'` | Position: `'top-left'`, `'top-center'`, `'top-right'`, `'bottom-left'`, `'bottom-center'`, `'bottom-right'`, `'center'` |
| `animation` | string | `'slide-in'` | Animation: `'slide-in'`, `'fade-in'`, `'bounce-in'`, `'flip-in'` |
| `sound` | boolean/string | `false` | Sound: `true`, `false`, `'success'`, `'error'`, `'notification'` |
| `progressBar` | boolean | `true` | Show progress bar |
| `customColor` | string | `null` | Custom border/accent color |
| `customBgColor` | string | `null` | Custom background color |
| `actions` | array | `[]` | Action buttons |

#### Actions Format

```javascript
actions: [
    {
        text: 'Accept',
        onClick: () => {
            console.log('Accepted!');
        }
    },
    {
        text: 'Cancel',
        onClick: () => {
            console.log('Cancelled!');
        }
    }
]
```

## 🎨 Usage Examples

### Basic Toast Types

```javascript
// Success Toast
Toast.fire({
    type: 'success',
    title: 'Success!',
    message: 'Operation completed successfully!'
});

// Error Toast
Toast.fire({
    type: 'error',
    title: 'Error!',
    message: 'Something went wrong!'
});

// Warning Toast
Toast.fire({
    type: 'warning',
    title: 'Warning!',
    message: 'Please check your input!'
});

// Info Toast
Toast.fire({
    type: 'info',
    title: 'Information',
    message: 'Here\'s some important info!'
});
```

### Advanced Examples

```javascript
// Custom styled toast
Toast.fire({
    type: 'custom',
    title: 'Custom Toast',
    message: 'This has custom colors!',
    customColor: '#ff6b6b',
    customBgColor: '#fff5f5',
    icon: '🎨',
    duration: 7000,
    animation: 'bounce-in'
});

// Toast with actions
Toast.fire({
    type: 'info',
    title: 'Confirm Action',
    message: 'Do you want to proceed?',
    duration: 0, // Don't auto-hide
    actions: [
        {
            text: 'Yes',
            onClick: () => {
                Toast.fire({
                    type: 'success',
                    title: 'Confirmed!',
                    message: 'Action completed!'
                });
            }
        },
        {
            text: 'No',
            onClick: () => {
                Toast.fire({
                    type: 'info',
                    title: 'Cancelled',
                    message: 'Action cancelled!'
                });
            }
        }
    ]
});

// Progress toast
let progress = 0;
const progressToast = Toast.fire({
    type: 'info',
    title: 'Loading...',
    message: `Progress: ${progress}%`,
    duration: 0,
    progressBar: false
});

const interval = setInterval(() => {
    progress += 10;
    // Update toast message
    const toast = document.getElementById(progressToast);
    if (toast) {
        toast.querySelector('.toast-message').textContent = `Progress: ${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            Toast.hide(progressToast);
            Toast.fire({
                type: 'success',
                title: 'Complete!',
                message: 'Loading finished!'
            });
        }
    }
}, 500);
```

### Position Examples

```javascript
// Different positions
Toast.fire({
    type: 'success',
    title: 'Top Left',
    message: 'This appears at top-left',
    position: 'top-left'
});

Toast.fire({
    type: 'info',
    title: 'Center',
    message: 'This appears at center',
    position: 'center'
});

Toast.fire({
    type: 'warning',
    title: 'Bottom Right',
    message: 'This appears at bottom-right',
    position: 'bottom-right'
});
```

## 🎵 Sound System

```javascript
// Enable/disable sounds globally
Toast.toggleSound(); // Toggle sound on/off

// Individual toast sounds
Toast.fire({
    type: 'success',
    title: 'Success!',
    message: 'With sound!',
    sound: true // or 'success', 'error', 'notification'
});
```

## 🔧 Utility Methods

```javascript
// Hide specific toast
const toastId = Toast.fire({...});
Toast.hide(toastId);

// Clear all toasts
Toast.clear();

// Set global position
Toast.setPosition('bottom-center');

// Queue toasts (max 3 concurrent)
Toast.queue({
    type: 'info',
    title: 'Queued Toast',
    message: 'This will wait in queue'
});

// Show multiple toasts in batch
Toast.batch([
    { type: 'success', title: 'First', message: 'First message' },
    { type: 'info', title: 'Second', message: 'Second message' },
    { type: 'warning', title: 'Third', message: 'Third message' }
]);
```

## ⌨️ Keyboard Shortcuts

When focus is on the page:
- `Ctrl + 1` - Show warning toast
- `Ctrl + 4` - Show info toast
- `Ctrl + Enter` - Create custom toast (if form is visible)
- `Escape` - Clear all toasts

## 🎨 Customization

### CSS Custom Properties

```css
:root {
    --toast-success-color: #28a745;
    --toast-error-color: #dc3545;
    --toast-warning-color: #ffc107;
    --toast-info-color: #17a2b8;
    --toast-border-radius: 15px;
    --toast-shadow: 0 15px 35px rgba(0,0,0,0.15);
}
```

### Custom Toast Container

```html
<!-- Add your own container with custom positioning -->
<div class="toast-container bottom-left" id="myToastContainer"></div>
```

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📱 Mobile Support

Fully responsive design that works on mobile devices with touch-friendly interactions.

## 🔒 Security

- No external dependencies
- XSS protection for user content
- Safe HTML rendering

## 📄 License

MIT License - Feel free to use in commercial and personal projects.

## 🤝 Contributing

Found a bug or want to contribute? Please create an issue or pull request on GitHub.

---

**Note**: Replace `AkalankaKaushalya` in the CDN links with your actual GitHub username when hosting the files.