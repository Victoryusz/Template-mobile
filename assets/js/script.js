// ===== FUNÇÕES PRINCIPAIS =====

// Smooth scroll para seções
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Controle do vídeo VSL
function playVideo() {
    const placeholder = document.querySelector('.video-placeholder');
    const video = document.getElementById('mainVideo');
    
    if (placeholder && video) {
        placeholder.style.display = 'none';
        video.style.display = 'block';
        video.play();
        
        // Tracking do play do vídeo
        trackEvent('video_play', 'engagement', 'vsl_started');
    }
}

// Toggle FAQ
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('.faq-icon');
    
    // Fecha todos os outros FAQs
    document.querySelectorAll('.faq-answer').forEach(item => {
        if (item !== answer) {
            item.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.faq-icon').forEach(item => {
        if (item !== icon) {
            item.classList.remove('rotate');
            item.textContent = '+';
        }
    });
    
    // Toggle do FAQ atual
    if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        icon.classList.remove('rotate');
        icon.textContent = '+';
    } else {
        answer.classList.add('active');
        icon.classList.add('rotate');
        icon.textContent = '−';
    }
}

// Redirecionamento para compra
function redirectToBuy() {
    // Substitua pela URL do seu checkout
    const checkoutUrl = 'https://seu-checkout.com';
    
    // Tracking da conversão
    trackEvent('purchase_intent', 'conversion', 'buy_button_clicked');
    
    // Pode abrir em nova aba ou na mesma
    window.open(checkoutUrl, '_blank');
    // ou window.location.href = checkoutUrl;
}

// ===== COUNTDOWN TIMER =====
function startCountdown(hours = 2, minutes = 30, seconds = 0) {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!hoursElement || !minutesElement || !secondsElement) return;
    
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    const timer = setInterval(() => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        
        hoursElement.textContent = hrs.toString().padStart(2, '0');
        minutesElement.textContent = mins.toString().padStart(2, '0');
        secondsElement.textContent = secs.toString().padStart(2, '0');
        
        totalSeconds--;
        
        if (totalSeconds < 0) {
            clearInterval(timer);
            // Quando o timer zerar, pode mostrar uma mensagem
            document.querySelector('.countdown-timer').innerHTML = 
                '<p style="color: #f5576c; font-weight: bold;">⏰ Oferta Expirada!</p>';
        }
    }, 1000);
}

// ===== FORMULÁRIO LEAD =====
function handleLeadForm() {
    const form = document.getElementById('leadForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('name') || form.querySelector('input[type="text"]').value;
            const email = formData.get('email') || form.querySelector('input[type="email"]').value;
            
            // Validação básica
            if (!name || !email) {
                alert('Por favor, preencha todos os campos!');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Por favor, digite um email válido!');
                return;
            }
            
            // Simula envio do formulário
            submitLead(name, email);
        });
    }
}

// Validação de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simula envio do lead
async function submitLead(name, email) {
    try {
        // Aqui você colocaria sua integração real
        // const response = await fetch('/api/leads', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ name, email })
        // });
        
        // Simulação
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Feedback visual
        const button = document.querySelector('.btn-secondary');
        const originalText = button.textContent;
        
        button.textContent = '✅ Enviado com Sucesso!';
        button.style.background = '#4CAF50';
        
        // Tracking
        trackEvent('lead_capture', 'conversion', 'email_collected');
        
        // Reset após 3 segundos
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
        
    } catch (error) {
        console.error('Erro ao enviar lead:', error);
        alert('Erro ao enviar. Tente novamente!');
    }
}

// ===== TRACKING E ANALYTICS =====
function trackEvent(action, category, label, value) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', action, { category, label });
    }
    
    // Console para debug
    console.log('Event tracked:', { action, category, label, value });
}

// ===== SCROLL TRACKING =====
function trackScrollDepth() {
    let scrollDepths = [25, 50, 75, 100];
    let scrolledDepths = [];
    
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !scrolledDepths.includes(depth)) {
                scrolledDepths.push(depth);
                trackEvent('scroll_depth', 'engagement', `${depth}%`, depth);
            }
        });
    });
}

// ===== ANIMAÇÕES NO SCROLL =====
function handleScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observa elementos que devem animar
    const animateElements = document.querySelectorAll(
        '.testimonial-card, .benefits-list, .offer-box, .faq-item'
    );
    
    animateElements.forEach(el => observer.observe(el));
}

// ===== DETECÇÃO DE DISPOSITIVO =====
function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    
    document.body.classList.add(isMobile ? 'mobile' : 'desktop');
    
    if (isTablet) {
        document.body.classList.add('tablet');
    }
    
    return { isMobile, isTablet };
}

// ===== PERFORMANCE HELPERS =====
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== PRELOAD DE RECURSOS CRÍTICOS =====
function preloadCriticalResources() {
    // Preload do vídeo se disponível
    const video = document.getElementById('mainVideo');
    if (video && video.src) {
        video.preload = 'metadata';
    }
    
    // Preload de imagens importantes
    const criticalImages = [
        'assets/images/hero-image.jpg',
        'assets/images/template1.png',
        'assets/images/template2.png',
        'assets/images/template3.png',
        'assets/images/template4.png',
        'assets/images/template5.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'image';
        document.head.appendChild(link);
    });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Landing Page Carregada!');
    
    // Inicializa funcionalidades
    detectDevice();
    handleLeadForm();
    handleScrollAnimations();
    trackScrollDepth();
    lazyLoadImages();
    preloadCriticalResources();
    
    // Inicia countdown (2h 30min por padrão)
    startCountdown();
    
    // Tracking da página carregada
    trackEvent('page_view', 'engagement', 'landing_page_loaded');
});

// ===== EVENTOS DE WINDOW =====
window.addEventListener('beforeunload', function() {
    // Tracking de saída
    trackEvent('page_exit', 'engagement', 'user_leaving');
});

// Tracking de tempo na página
let startTime = Date.now();
window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', 'engagement', 'seconds', timeSpent);
});

// ===== UTILITÁRIOS GLOBAIS =====
window.LandingPageUtils = {
    scrollToSection,
    playVideo,
    toggleFaq,
    redirectToBuy,
    trackEvent
};

// ===== CARROSSEL DE TEMPLATES =====
let slideIndex = 1;
let slideTimer;

function showSlides(n) {
    let slides = document.getElementsByClassName("template-slide");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add("active");
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }
}

function currentSlide(n) {
    clearInterval(slideTimer);
    showSlides(slideIndex = n);
    autoSlide();
}

function nextSlide() {
    showSlides(slideIndex += 1);
}

function autoSlide() {
    slideTimer = setInterval(nextSlide, 3000); // Muda a cada 3 segundos
}

// Inicializar o carrossel quando a página carregar
function initCarousel() {
    // Verificar se o carrossel existe na página
    if (document.getElementById('templatesSlider')) {
        showSlides(slideIndex);
        autoSlide();
    }
}

// Event listener para quando a página carregar
document.addEventListener('DOMContentLoaded', initCarousel);

// Pausar o carrossel quando o usuário passa o mouse sobre ele
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('templatesSlider');
    if (slider) {
        slider.addEventListener('mouseenter', function() {
            clearInterval(slideTimer);
        });
        
        slider.addEventListener('mouseleave', function() {
            autoSlide();
        });
    }
});