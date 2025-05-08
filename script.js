// Replace these values with your actual Paystack keys
const PAYSTACK_PUBLIC_KEY = 'pk_live_574f3fe773979c5ff4f7b13314980c236a10cd7a'; // Live Public Key
const PAYSTACK_SECRET_KEY = 'sk_live_c9fc8e5a4524357671290f8a504da26cde56872f'; // Live Secret Key

// Sample product data in Kenyan Shillings (KES)
const products = [
    {
        id: 1,
        title: "Abstract Art T-Shirt",
        description: "Premium cotton t-shirt with unique abstract art print.",
        price: 4500, // ~$29.99 converted to KES
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Minimalist Notebook",
        description: "Eco-friendly notebook with premium paper and minimalist design.",
        price: 2200, // ~$14.99
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Ceramic Coffee Mug",
        description: "Handcrafted ceramic mug with ergonomic design.",
        price: 3000, // ~$19.99
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Leather Wallet",
        description: "Genuine leather wallet with multiple card slots.",
        price: 6000, // ~$39.99
        image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Wireless Earbuds",
        description: "High-quality wireless earbuds with noise cancellation.",
        price: 13500, // ~$89.99
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Yoga Mat",
        description: "Eco-friendly yoga mat with non-slip surface.",
        price: 5300, // ~$34.99
        image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.querySelector('.cart-count');
const cartModal = document.getElementById('cart-modal');
const paymentModal = document.getElementById('payment-modal');
const openCartButton = document.getElementById('open-cart');
const closeCartButton = document.getElementById('close-cart');
const closePaymentButton = document.getElementById('close-payment');
const checkoutButton = document.getElementById('checkout-btn');
const paymentMethods = document.querySelectorAll('.payment-method');
const paystackForm = document.getElementById('paystack-form');
const paystackPayButton = document.getElementById('paystack-pay-btn');
const customerEmailInput = document.getElementById('customer-email');

// Format currency for display
function formatCurrency(amount) {
    return 'KSh ' + amount.toLocaleString('en-KE');
}

// Display products
function displayProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-card');
        
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatCurrency(product.price)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="wishlist"><i class="far fa-heart"></i></button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Add event listeners to wishlist buttons
    document.querySelectorAll('.wishlist').forEach(button => {
        button.addEventListener('click', toggleWishlist);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Show a quick confirmation
    const confirmation = document.createElement('div');
    confirmation.textContent = 'Added to cart!';
    confirmation.style.position = 'fixed';
    confirmation.style.bottom = '20px';
    confirmation.style.right = '20px';
    confirmation.style.backgroundColor = 'var(--success)';
    confirmation.style.color = 'white';
    confirmation.style.padding = '10px 20px';
    confirmation.style.borderRadius = '5px';
    confirmation.style.zIndex = '1000';
    confirmation.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(confirmation);
        }, 300);
    }, 2000);
}

// Toggle wishlist function
function toggleWishlist(e) {
    const icon = e.target.tagName === 'I' ? e.target : e.target.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
    icon.parentElement.classList.toggle('active');
}

// Update cart function
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart modal if open
    if (cartModal.style.display === 'flex') {
        renderCartItems();
    }
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        cartTotalElement.textContent = formatCurrency(0);
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div>
                    <h4 class="cart-item-title">${item.title}</h4>
                    <div class="cart-item-price">${formatCurrency(item.price)}</div>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update total
    cartTotalElement.textContent = formatCurrency(total);
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Decrease quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

// Increase quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    
    updateCart();
}

// Remove item
function removeItem(e) {
    const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    updateCart();
}

// Payment method selection
paymentMethods.forEach(method => {
    method.addEventListener('click', function() {
        // Remove selected class from all methods
        paymentMethods.forEach(m => m.classList.remove('selected'));
        
        // Add selected class to clicked method
        this.classList.add('selected');
        
        // Show the appropriate form
        const methodType = this.getAttribute('data-method');
        
        // Hide all forms first
        document.querySelectorAll('.paystack-form, .credit-form, .paypal-form').forEach(form => {
            form.style.display = 'none';
        });
        
        // Show the selected form
        if (methodType === 'paystack') {
            paystackForm.style.display = 'block';
        } else if (methodType === 'credit') {
            document.getElementById('credit-form').style.display = 'block';
        } else if (methodType === 'paypal') {
            document.getElementById('paypal-form').style.display = 'block';
        }
    });
});

// Paystack payment handler
function payWithPaystack() {
    const email = customerEmailInput.value;
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    // Calculate total amount (in cents for Paystack)
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity * 100), 0);
    
    // Generate a unique reference
    const reference = 'WEN' + Date.now();
    
    // Initialize Paystack
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: totalAmount,
        currency: 'KES', // Changed to Kenyan Shillings
        ref: reference,
        callback: function(response) {
            // Payment successful
            alert('Payment complete! Reference: ' + response.reference);
            
            // Clear cart
            cart = [];
            updateCart();
            
            // Close modals
            paymentModal.style.display = 'none';
            cartModal.style.display = 'none';
        },
        onClose: function() {
            // Payment window closed
            alert('Payment window closed');
        }
    });
    
    handler.openIframe();
}

// Event listeners
openCartButton.addEventListener('click', function() {
    renderCartItems();
    cartModal.style.display = 'flex';
});

closeCartButton.addEventListener('click', function() {
    cartModal.style.display = 'none';
});

closePaymentButton.addEventListener('click', function() {
    paymentModal.style.display = 'none';
});

checkoutButton.addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    cartModal.style.display = 'none';
    paymentModal.style.display = 'flex';
    
    // Select Paystack by default
    const paystackMethod = document.querySelector('[data-method="paystack"]');
    paystackMethod.click();
    
    // Pre-fill email if available from previous session
    const storedEmail = localStorage.getItem('customerEmail');
    if (storedEmail) {
        customerEmailInput.value = storedEmail;
    }
});

paystackPayButton.addEventListener('click', function() {
    // Store email for future use
    localStorage.setItem('customerEmail', customerEmailInput.value);
    payWithPaystack();
});

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
    
    if (e.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
});

// Initialize the page
displayProducts();
updateCart();
