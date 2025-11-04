// Scroll reveal animation
        document.addEventListener('DOMContentLoaded', function() {
            // Reveal elements on scroll
            const revealElements = document.querySelectorAll('.reveal');
            
            const revealOnScroll = function() {
                revealElements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (elementTop < windowHeight - 100) {
                        element.classList.add('visible');
                    }
                });
            };
            
            // Initial check
            revealOnScroll();
            
            // Check on scroll
            window.addEventListener('scroll', revealOnScroll);
            
            // Animated counters
            const counters = document.querySelectorAll('.stat-number');
            
            const animateCounters = function() {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const step = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = function() {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.floor(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target.toLocaleString();
                        }
                    };
                    
                    updateCounter();
                });
            };
            
            // Start counter animation when section is in view
            const statsSection = document.querySelector('.story-section');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(statsSection);
            
            // Team carousel functionality
            const carousel = document.getElementById('team-carousel');
            const prevBtn = document.getElementById('team-prev');
            const nextBtn = document.getElementById('team-next');
            const dotsContainer = document.getElementById('team-dots');
            
            if (carousel && prevBtn && nextBtn && dotsContainer) {
                const teamMembers = document.querySelectorAll('.team-member');
                const totalMembers = teamMembers.length;
                let currentIndex = 0;
                
                // Create dots
                for (let i = 0; i < totalMembers; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('carousel-dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }
                
                const dots = document.querySelectorAll('.carousel-dot');
                
                function updateCarousel() {
                    const memberWidth = teamMembers[0].offsetWidth + 32; // width + gap
                    carousel.scrollTo({
                        left: currentIndex * memberWidth,
                        behavior: 'smooth'
                    });
                    
                    // Update active dot
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                    });
                }
                
                function goToSlide(index) {
                    currentIndex = index;
                    updateCarousel();
                }
                
                function nextSlide() {
                    currentIndex = (currentIndex + 1) % totalMembers;
                    updateCarousel();
                }
                
                function prevSlide() {
                    currentIndex = (currentIndex - 1 + totalMembers) % totalMembers;
                    updateCarousel();
                }
                
                prevBtn.addEventListener('click', prevSlide);
                nextBtn.addEventListener('click', nextSlide);
                
                // Auto-advance carousel
                setInterval(nextSlide, 5000);
                
                // Handle responsive behavior
                function handleResize() {
                    // Reset carousel position on resize
                    updateCarousel();
                }
                
                window.addEventListener('resize', handleResize);
            }});