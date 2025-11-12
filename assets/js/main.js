document.addEventListener('DOMContentLoaded', function() {
    const pageLoader = document.querySelector('.page-loader');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('.section');
    const backToTopBtn = document.querySelector('.back-to-top');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.querySelector('.theme-toggle');

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            // Smooth theme transition
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('.theme-toggle-icon');
            const text = themeToggle.querySelector('.theme-toggle-text');
            if (theme === 'dark') {
                icon.textContent = '☀️';
                if (text) text.textContent = 'Light';
            } else {
                icon.textContent = '🌙';
                if (text) text.textContent = 'Dark';
            }
        }
    }

    // Hide loader when page is fully loaded - optimized for instant feel
    window.addEventListener('load', function() {
        if (pageLoader) {
            pageLoader.classList.add('hidden');
            setTimeout(() => {
                document.body.classList.remove('loading');
            }, 150); // Match CSS transition duration (150ms)
        }
    });

    // Fallback: hide loader after max 1s even if load event doesn't fire
    setTimeout(function() {
        if (pageLoader && !pageLoader.classList.contains('hidden')) {
            pageLoader.classList.add('hidden');
            setTimeout(() => {
                document.body.classList.remove('loading');
            }, 150);
        }
    }, 1000);

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (window.scrollY > 300) {
                if (backToTopBtn) backToTopBtn.classList.add('visible');
            } else {
                if (backToTopBtn) backToTopBtn.classList.remove('visible');
            }
        });
    }

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                const counters = entry.target.querySelectorAll('.stat-number[data-count]');
                counters.forEach(counter => {
                    if (!counter.classList.contains('counted')) {
                        animateCounter(counter);
                        counter.classList.add('counted');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const linkPage = link.getAttribute('href');
        
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                this.classList.add('active');
                const targetTab = document.getElementById(tabId);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });
    }

    const comparisonSlider = document.querySelector('.comparison-slider');
    if (comparisonSlider) {
        const handle = comparisonSlider.querySelector('.comparison-handle');
        const afterImage = comparisonSlider.querySelector('.comparison-image.after');
        
        if (handle && afterImage) {
            let isDragging = false;

            handle.addEventListener('mousedown', function() {
                isDragging = true;
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
            });

            comparisonSlider.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                
                const rect = comparisonSlider.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = (x / rect.width) * 100;
                
                if (percentage >= 0 && percentage <= 100) {
                    handle.style.left = percentage + '%';
                    afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
                }
            });

            comparisonSlider.addEventListener('click', function(e) {
                const rect = comparisonSlider.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = (x / rect.width) * 100;
                
                handle.style.left = percentage + '%';
                afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            });
        }
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imageName = this.querySelector('.gallery-image').textContent;
            alert('Gallery image clicked: ' + imageName);
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            console.log('Form submitted:', data);
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = 'var(--success-color)';
                
                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1500);
        });
    }

    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
            });
            
            if (!isActive) {
                this.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    const fadeElements = document.querySelectorAll('[data-fade]');
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    const videoPlaceholders = document.querySelectorAll('.placeholder-video');
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            console.log('Video placeholder clicked:', this.textContent);
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-parallax') || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    console.log('Skylus Workspaces - Website Initialized');
});