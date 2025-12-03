// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation items and sections
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    
    // Function to switch sections with fade animation
    function switchSection(targetSectionId) {
        // Remove active class from all sections
        sections.forEach(section => {
            if (section.classList.contains('active')) {
                section.classList.remove('active');
            }
        });
        
        // Add active class to target section with a slight delay for animation
        setTimeout(() => {
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        }, 100);
    }
    
    // Add click event listeners to navigation items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get the target section from data attribute
            const targetSection = item.getAttribute('data-section');
            
            // Remove active class from all nav items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            item.classList.add('active');
            
            // Switch to the target section
            switchSection(targetSection);
        });
    });
    
    // Add hover effects for cards
    const cards = document.querySelectorAll('.card, .link-card, .gallery-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    // Add smooth scroll behavior for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
    
    // Add animation for activity feed items
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-download');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s ease-out';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add CSS for ripple animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add parallax effect and fade out to section headers on scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const headers = document.querySelectorAll('.section.active h2');
        
        headers.forEach(header => {
            // Get header position relative to viewport
            const headerRect = header.getBoundingClientRect();
            const headerTop = headerRect.top;
            const headerHeight = headerRect.height;
            
            // Calculate opacity based on scroll position
            // Fades out as header moves up past viewport top
            let opacity = 1;
            if (headerTop < 0) {
                // Header is above viewport
                const fadeDistance = headerHeight * 2; // Distance over which to fade
                opacity = Math.max(0, 1 + (headerTop / fadeDistance));
            }
            
            header.style.opacity = opacity;
            
            // Optional: slight parallax movement
            const speed = 0.3;
            header.style.transform = `translateY(${scrollY * speed}px)`;
        });
        
        lastScrollY = scrollY;
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        const activeNavItem = document.querySelector('.nav-item.active');
        const allNavItems = Array.from(navItems);
        const currentIndex = allNavItems.indexOf(activeNavItem);
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % allNavItems.length;
            } else {
                nextIndex = (currentIndex - 1 + allNavItems.length) % allNavItems.length;
            }
            
            allNavItems[nextIndex].click();
        }
    });
    
    // Carousel functionality
    const mushroom = document.querySelector('.mushroom-spinner');
    
    window.addEventListener('scroll', () => {
        // Get scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Get total scrollable height
        const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Calculate scroll percentage (0 to 1)
        const scrollPercentage = documentHeight > 0 ? scrollTop / documentHeight : 0;
        
        // Convert to degrees (0 to 360)
        const rotation = scrollPercentage * 360;
        
        if (mushroom) {
            mushroom.style.transform = `rotate(${rotation}deg)`;
        }
    });
    
    // Carousel functionality
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    if (carouselTrack && carouselSlides.length > 0) {
        let currentIndex = 0;
        
        // Create indicators
        carouselSlides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
        
        const indicators = document.querySelectorAll('.carousel-indicator');
        
        function updateCarousel() {
            // Update slides
            carouselSlides.forEach((slide, index) => {
                slide.classList.remove('active');
                if (index === currentIndex) {
                    slide.classList.add('active');
                }
            });
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.remove('active');
                if (index === currentIndex) {
                    indicator.classList.add('active');
                }
            });
            
            // Calculate offset to center current slide
            const slideWidth = carouselSlides[0].offsetWidth;
            const gap = 32; // 2rem gap
            const containerWidth = carouselTrack.parentElement.offsetWidth;
            const offset = (containerWidth / 2) - (slideWidth / 2) - (currentIndex * (slideWidth + gap));
            
            carouselTrack.style.transform = `translateX(${offset}px)`;
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % carouselSlides.length;
            updateCarousel();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + carouselSlides.length) % carouselSlides.length;
            updateCarousel();
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const gallerySection = document.getElementById('gallery');
            if (gallerySection && gallerySection.classList.contains('active')) {
                if (e.key === 'ArrowLeft') prevSlide();
                if (e.key === 'ArrowRight') nextSlide();
            }
        });
        
        // Touch/swipe support
        let startX = 0;
        let isDragging = false;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        carouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        carouselTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            isDragging = false;
        });
        
        // Initialize carousel
        updateCarousel();
        
        // Auto-play (optional)
        // setInterval(nextSlide, 5000);
    }
    
    // Console welcome message
    console.log('%c🎉 VirginVald Project', 'color: #dc2626; font-size: 24px; font-weight: bold;');
    console.log('%cWelcome to the interactive dashboard!', 'color: #a3a3a3; font-size: 14px;');
});
