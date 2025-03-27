// Cart functionality
let cart = [];
let sessionStarted = false;
let startTime = new Date().getTime();
let timeOnSite = 0;

// Track time on site
function updateTimeOnSite() {
    const currentTime = new Date().getTime();
    timeOnSite = Math.floor((currentTime - startTime) / 1000); // Convert to seconds
    
    // Track time on site every 30 seconds
    if (timeOnSite % 30 === 0) {
        if (typeof gtag !== 'undefined') {
            console.log('Sending time_on_site event:', timeOnSite, 'seconds');
            gtag('event', 'user_engagement', {
                'engagement_time_msec': timeOnSite * 1000
            });
        }
    }
}

// Track session start
function trackSessionStart() {
    if (!sessionStarted && typeof gtag !== 'undefined') {
        console.log('Tracking session start...');
        gtag('event', 'first_visit', {
            'engagement_time_msec': 0
        });
        sessionStarted = true;
    }
}

// Track view_item event when products are loaded
function trackViewItems() {
    trackSessionStart();
    
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const productId = product.dataset.productId;
        const name = product.querySelector('h3').textContent;
        const price = parseInt(product.querySelector('.product-price').textContent.replace('$', ''));
        
        if (typeof gtag !== 'undefined') {
            console.log('Sending view_item event for product:', name);
            gtag('event', 'view_item', {
                'currency': 'USD',
                'value': price,
                'items': [{
                    'item_id': productId,
                    'item_name': name,
                    'price': price
                }]
            });
        }
    });
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price}</span>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price;
    });

    cartTotal.textContent = `$${total}`;
}

function addToCart(productId, name, price) {
    trackSessionStart();
    
    cart.push({ id: productId, name, price });
    updateCartCount();
    updateCartDisplay();

    // Track add to cart event
    if (typeof gtag !== 'undefined') {
        console.log('Sending add to cart event...');
        gtag('event', 'add_to_cart', {
            'currency': 'USD',
            'value': price,
            'items': [{
                'item_id': productId,
                'item_name': name,
                'price': price
            }]
        });
    }
}

function removeFromCart(index) {
    const item = cart[index];
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();

    // Track remove from cart event
    if (typeof gtag !== 'undefined') {
        console.log('Sending remove from cart event...');
        gtag('event', 'remove_from_cart', {
            'currency': 'USD',
            'value': item.price,
            'items': [{
                'item_id': item.id,
                'item_name': item.name,
                'price': item.price
            }]
        });
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    trackSessionStart();

    // Track checkout event
    if (typeof gtag !== 'undefined') {
        const cartValue = cart.reduce((sum, item) => sum + item.price, 0);
        console.log('Sending checkout event...');
        gtag('event', 'begin_checkout', {
            'currency': 'USD',
            'value': cartValue,
            'items': cart.map(item => ({
                'item_id': item.id,
                'item_name': item.name,
                'price': item.price
            }))
        });
    }

    // Simulate successful purchase
    setTimeout(() => {
        // Track purchase event
        if (typeof gtag !== 'undefined') {
            const cartValue = cart.reduce((sum, item) => sum + item.price, 0);
            console.log('Sending purchase event...');
            gtag('event', 'purchase', {
                'transaction_id': 'T' + Date.now(),
                'currency': 'USD',
                'value': cartValue,
                'items': cart.map(item => ({
                    'item_id': item.id,
                    'item_name': item.name,
                    'price': item.price
                }))
            });
        }

        alert('Thank you for your purchase!');
        cart = [];
        updateCartCount();
        updateCartDisplay();
        document.getElementById('cartModal').style.display = 'none';
    }, 1500);
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing tracking...');
    
    // Start session tracking
    trackSessionStart();
    
    // Track view_items when products page loads
    if (document.querySelector('.products-grid')) {
        trackViewItems();
    }
    
    // Start time tracking
    setInterval(updateTimeOnSite, 1000);
    
    // Cart modal functionality
    const modal = document.getElementById('cartModal');
    const viewCartBtn = document.getElementById('viewCart');
    const closeCartBtn = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (viewCartBtn && modal) {
        viewCartBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeCartBtn && modal) {
        closeCartBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.productId;
            const name = productCard.querySelector('h3').textContent;
            const price = parseInt(productCard.querySelector('.product-price').textContent.replace('$', ''));
            
            addToCart(productId, name, price);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Existing form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData);
            
            if (typeof gtag !== 'undefined') {
                console.log('Sending form submission event...');
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form Submission',
                    'value': 1
                });
            }
            
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Track page views
    if (typeof gtag !== 'undefined') {
        console.log('Sending page view event...');
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href,
            'engagement_time_msec': 0
        });
    }

    // Track feature card clicks
    const featureCards = document.querySelectorAll('.feature-card');
    console.log('Found feature cards:', featureCards.length);
    
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                console.log('Sending feature click event...');
                gtag('event', 'feature_click', {
                    'event_category': 'Features',
                    'event_label': this.querySelector('h3').textContent
                });
            }
        });
    });

    // Track service card interactions
    const serviceCards = document.querySelectorAll('.service-card');
    console.log('Found service cards:', serviceCards.length);
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                console.log('Sending service click event...');
                gtag('event', 'service_click', {
                    'event_category': 'Services',
                    'event_label': this.querySelector('h3').textContent
                });
            }
        });
    });

    // Track portfolio item interactions
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    console.log('Found portfolio items:', portfolioItems.length);
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                console.log('Sending portfolio click event...');
                gtag('event', 'portfolio_click', {
                    'event_category': 'Portfolio',
                    'event_label': this.querySelector('h3').textContent
                });
            }
        });
    });

    // Track blog post interactions
    const blogPosts = document.querySelectorAll('.blog-post');
    console.log('Found blog posts:', blogPosts.length);
    
    blogPosts.forEach(post => {
        post.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                console.log('Sending blog post click event...');
                gtag('event', 'blog_post_click', {
                    'event_category': 'Blog',
                    'event_label': this.querySelector('h2').textContent
                });
            }
        });
    });

    // Track navigation clicks
    const navLinks = document.querySelectorAll('nav a');
    console.log('Found navigation links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                console.log('Sending navigation click event...');
                gtag('event', 'navigation_click', {
                    'event_category': 'Navigation',
                    'event_label': this.textContent
                });
            }
        });
    });

    // Track scroll depth
    console.log('Initializing scroll depth tracking...');
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 100];
    const scrollEvents = new Set();

    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
        maxScroll = Math.max(maxScroll, scrollPercent);

        scrollThresholds.forEach(threshold => {
            if (scrollPercent >= threshold && !scrollEvents.has(threshold)) {
                if (typeof gtag !== 'undefined') {
                    console.log('Sending scroll depth event:', threshold + '%');
                    gtag('event', 'scroll', {
                        'event_category': 'engagement',
                        'event_label': `${threshold}%`,
                        'value': threshold
                    });
                }
                scrollEvents.add(threshold);
            }
        });
    });

    // Track time on page
    console.log('Initializing time on page tracking...');
    window.addEventListener('beforeunload', function() {
        if (typeof gtag !== 'undefined') {
            const timeSpent = Math.round((new Date().getTime() - startTime) / 1000);
            console.log('Sending time on page event:', timeSpent + ' seconds');
            gtag('event', 'user_engagement', {
                'engagement_time_msec': timeSpent * 1000
            });
        }
    });
}); 