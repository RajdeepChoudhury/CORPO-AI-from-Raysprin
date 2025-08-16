// Theme Toggle Functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
    }
}

// AI Assistant Button Click
function openAIAssistant() {
    // Replace this URL with your actual AI bot link
    window.open('https://your-ai-bot-link.com', '_blank');
    
    // Optional: Track the click event
    console.log('AI Assistant button clicked');
}

// Show/Hide Messages
function showMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type} show`;
    messageElement.textContent = message;
    
    const form = document.getElementById('feedbackForm');
    form.parentNode.insertBefore(messageElement, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Form Submission Handler
async function submitFeedback(formData) {
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                feedback: formData.get('feedback'),
                rating: formData.get('rating')
            })
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Thank you for your feedback! We appreciate your input.', 'success');
            document.getElementById('feedbackForm').reset();
        } else {
            showMessage(result.message || 'There was an error submitting your feedback. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        showMessage('There was an error submitting your feedback. Please try again.', 'error');
    }
}

// Form Validation
function validateForm(formData) {
    const email = formData.get('email');
    const feedback = formData.get('feedback');
    const rating = formData.get('rating');

    if (!email || !feedback || !rating) {
        showMessage('Please fill in all required fields.', 'error');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }

    // Feedback length validation
    if (feedback.length < 10) {
        showMessage('Please provide more detailed feedback (minimum 10 characters).', 'error');
        return false;
    }

    return true;
}

// Smooth scrolling for navigation links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Add scroll effect to header
function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'var(--bg-primary)';
        header.style.boxShadow = 'none';
    }
}

// Initialize page functionality
function initializePage() {
    // Load theme
    loadTheme();
    
    // Form submission event listener
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
            submitBtn.disabled = true;
            
            // Submit feedback
            await submitFeedback(formData);
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
    
    // Scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Add intersection observer for animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Press 'T' to toggle theme
        if (e.key.toLowerCase() === 't' && !e.target.matches('input, textarea')) {
            toggleTheme();
        }
        
        // Press 'C' to open AI assistant
        if (e.key.toLowerCase() === 'c' && !e.target.matches('input, textarea')) {
            openAIAssistant();
        }
    });
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', initializePage);

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page is hidden');
    } else {
        console.log('Page is visible');
    }
});

// Add error handling for global errors
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You could send this to your error tracking service
});

// Add performance monitoring
window.addEventListener('load', function() {
    // Log page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page loaded in:', loadTime, 'ms');
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        loadTheme,
        openAIAssistant,
        validateForm,
        smoothScroll
    };
}