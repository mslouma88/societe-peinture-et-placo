// Mobile Navigation
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Gallery Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Form Validation and Submission
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('form-success');

// Form validation rules
const validationRules = {
    nom: {
        required: true,
        minLength: 2,
        message: 'Le nom doit contenir au moins 2 caractères'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Veuillez entrer une adresse email valide'
    },
    telephone: {
        pattern: /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
        message: 'Veuillez entrer un numéro de téléphone français valide'
    },
    'type-projet': {
        required: true,
        message: 'Veuillez sélectionner un type de projet'
    },
    message: {
        required: true,
        minLength: 10,
        message: 'Le message doit contenir au moins 10 caractères'
    },
    rgpd: {
        required: true,
        message: 'Vous devez accepter l\'utilisation de vos données'
    }
};

// Validate single field
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true };
    
    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return {
            isValid: false,
            message: rules.message || `Le champ ${fieldName} est requis`
        };
    }
    
    // If field is empty and not required, it's valid
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: true };
    }
    
    // Min length validation
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        return {
            isValid: false,
            message: rules.message
        };
    }
    
    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        return {
            isValid: false,
            message: rules.message
        };
    }
    
    return { isValid: true };
}

// Display error message
function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const field = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    
    if (field) {
        field.style.borderColor = '#ef4444';
    }
}

// Clear error message
function clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const field = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    
    if (field) {
        field.style.borderColor = '#e5e7eb';
    }
}

// Real-time validation
Object.keys(validationRules).forEach(fieldName => {
    const field = document.getElementById(fieldName);
    if (field) {
        field.addEventListener('blur', () => {
            const value = field.type === 'checkbox' ? field.checked : field.value;
            const validation = validateField(fieldName, value);
            
            if (!validation.isValid) {
                showError(fieldName, validation.message);
            } else {
                clearError(fieldName);
            }
        });
        
        field.addEventListener('input', () => {
            clearError(fieldName);
        });
    }
});

// Form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêcher la soumission par défaut
    
    let isFormValid = true;
    const formData = new FormData(contactForm);
    
    // Validate all fields
    Object.keys(validationRules).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            const value = field.type === 'checkbox' ? field.checked : field.value;
            const validation = validateField(fieldName, value);
            
            if (!validation.isValid) {
                showError(fieldName, validation.message);
                isFormValid = false;
            } else {
                clearError(fieldName);
            }
        }
    });
    
    if (!isFormValid) {
        // Scroll vers la première erreur
        const firstError = document.querySelector('.error-message[style*="block"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Si le formulaire est valide, envoyer via EmailJS
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Changer le texte du bouton pendant l'envoi
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;
    
    try {
        // Préparer les données pour EmailJS
        const templateParams = {
            from_name: formData.get('nom'),
            from_email: formData.get('email'),
            phone: formData.get('telephone') || 'Non renseigné',
            project_type: formData.get('type-projet'),
            budget: formData.get('budget') || 'Non renseigné',
            timeline: formData.get('delai') || 'Non renseigné',
            message: formData.get('message'),
            quote_request: formData.get('devis') ? 'Oui' : 'Non',
            newsletter: formData.get('newsletter') ? 'Oui' : 'Non',
            to_email: 'klaiaysem@gmail.com'
        };

        // Envoyer l'email via EmailJS
        await emailjs.send(
            'service_s5clu4h',    // Service ID
            'template_b4b7yno',   // Template ID
            templateParams,
            'SRD_KwBorvKZz2m12'   // Public Key EmailJS
        );

        // Succès - Afficher le popup de confirmation
        showConfirmationPopup();
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi:', error);
        
        // En cas d'erreur, fallback vers mailto
        const emailData = {
            nom: formData.get('nom'),
            email: formData.get('email'),
            telephone: formData.get('telephone') || 'Non renseigné',
            typeProjet: formData.get('type-projet'),
            budget: formData.get('budget') || 'Non renseigné',
            delai: formData.get('delai') || 'Non renseigné',
            message: formData.get('message'),
            devis: formData.get('devis') ? 'Oui' : 'Non',
            newsletter: formData.get('newsletter') ? 'Oui' : 'Non'
        };
        
        const emailSubject = `Nouvelle demande de devis - ${emailData.typeProjet}`;
        const emailBody = `
Nouvelle demande de devis reçue via le site web

INFORMATIONS CLIENT :
- Nom : ${emailData.nom}
- Email : ${emailData.email}
- Téléphone : ${emailData.telephone}

DÉTAILS DU PROJET :
- Type de projet : ${emailData.typeProjet}
- Budget approximatif : ${emailData.budget}
- Délai souhaité : ${emailData.delai}

MESSAGE :
${emailData.message}

OPTIONS :
- Demande de devis : ${emailData.devis}
- Newsletter : ${emailData.newsletter}

---
Message envoyé depuis le site Pro Peinture Placo
        `.trim();
        
        const mailtoLink = `mailto:klaiaysem@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
        
        // Afficher un message d'erreur à l'utilisateur
        alert('Une erreur est survenue lors de l\'envoi. Votre client email va s\'ouvrir en secours.');
    } finally {
        // Restaurer le bouton dans tous les cas
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
    });
}

// Fonction pour afficher le popup de confirmation
function showConfirmationPopup() {
    const popup = document.getElementById('popup-overlay');
    popup.classList.add('show');
    
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
}

// Fonction pour fermer le popup
function closeConfirmationPopup() {
    const popup = document.getElementById('popup-overlay');
    popup.classList.remove('show');
    
    // Restaurer le scroll du body
    document.body.style.overflow = '';
}

// Event listener pour fermer le popup
const popupClose = document.getElementById('popup-close');
if (popupClose) {
    popupClose.addEventListener('click', closeConfirmationPopup);
}

// Fermer le popup en cliquant sur l'overlay
const popupOverlay = document.getElementById('popup-overlay');
if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeConfirmationPopup();
        }
    });
}

// Fermer le popup avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeConfirmationPopup();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .testimonial, .gallery-item').forEach(el => {
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
        }
    }
    
    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const hasPlus = text.includes('+');
                const hasPercent = text.includes('%');
                
                stat.textContent = '0' + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
                
                setTimeout(() => {
                    animateCounter(stat, number);
                }, 500);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Add loading states to buttons
document.querySelectorAll('.btn').forEach(btn => {
    if (btn.type !== 'submit') {
        btn.addEventListener('click', function() {
            // Add a subtle loading effect for non-submit buttons
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
});

// Enhanced mobile menu behavior
let isMenuOpen = false;

navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isMenuOpen = !isMenuOpen;
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMenuOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        isMenuOpen = false;
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        isMenuOpen = false;
    }
});

// Prevent scroll when mobile menu is open
navMenu.addEventListener('transitionstart', () => {
    if (window.innerWidth <= 768) {
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        }
    }
});

navMenu.addEventListener('transitionend', () => {
    if (window.innerWidth <= 768) {
        if (!navMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }
});

// Reset menu state on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        isMenuOpen = false;
        document.body.style.overflow = '';
    }
});

console.log('🎨 Site Pro Peinture Placo chargé avec succès!');