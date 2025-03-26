// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData);
            
            // Track form submission in Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form Submission',
                    'value': 1
                });
            }
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Track page views
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href
        });
    }
});

// Track feature card clicks
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'feature_click', {
                    'event_category': 'Features',
                    'event_label': this.querySelector('h3').textContent
                });
            }
        });
    });
});

// Track service card interactions
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'service_click', {
                    'event_category': 'Services',
                    'event_label': this.querySelector('h3').textContent
                });
            }
        });
    });
});

// Track portfolio item interactions
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'portfolio_click', {
                    'event_category': 'Portfolio',
                    'event_label': this.querySelector('h3').textContent
                });
            }
        });
    });
});

// Track blog post interactions
document.addEventListener('DOMContentLoaded', function() {
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        post.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'blog_post_click', {
                    'event_category': 'Blog',
                    'event_label': this.querySelector('h2').textContent
                });
            }
        });
    });
});

// Track navigation clicks
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation_click', {
                    'event_category': 'Navigation',
                    'event_label': this.textContent
                });
            }
        });
    });
});

// Track scroll depth
document.addEventListener('DOMContentLoaded', function() {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 100];
    const scrollEvents = new Set();

    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
        maxScroll = Math.max(maxScroll, scrollPercent);

        scrollThresholds.forEach(threshold => {
            if (scrollPercent >= threshold && !scrollEvents.has(threshold)) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'Engagement',
                        'event_label': `${threshold}%`,
                        'value': threshold
                    });
                }
                scrollEvents.add(threshold);
            }
        });
    });
});

// Track time on page
document.addEventListener('DOMContentLoaded', function() {
    let startTime = new Date().getTime();
    
    window.addEventListener('beforeunload', function() {
        if (typeof gtag !== 'undefined') {
            const timeSpent = Math.round((new Date().getTime() - startTime) / 1000);
            gtag('event', 'time_on_page', {
                'event_category': 'Engagement',
                'event_label': 'Time Spent',
                'value': timeSpent
            });
        }
    });
}); 