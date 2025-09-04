// ===== CONFIGURAÇÃO DE TRACKING =====

// IDs dos seus serviços (substitua pelos seus)
const TRACKING_CONFIG = {
    googleAnalytics: 'GA_MEASUREMENT_ID', // Ex: G-XXXXXXXXXX
    facebookPixel: 'FB_PIXEL_ID',         // Ex: 123456789012345
    googleAds: 'AW-CONVERSION_ID',        // Ex: AW-123456789
    hotjar: 'HOTJAR_ID'                   // Ex: 1234567
};

// ===== GOOGLE ANALYTICS 4 =====
function initGoogleAnalytics() {
    if (!TRACKING_CONFIG.googleAnalytics || TRACKING_CONFIG.googleAnalytics === 'GA_MEASUREMENT_ID') {
        console.log('⚠️ Google Analytics não configurado');
        return;
    }
    
    // Carrega o script do GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_CONFIG.googleAnalytics}`;
    document.head.appendChild(script);
    
    // Configura o GA4
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', TRACKING_CONFIG.googleAnalytics, {
        page_title: 'Landing Page - Produto Incrível',
        page_location: window.location.href,
        custom_map: {
            custom_parameter_1: 'section_viewed',
            custom_parameter_2: 'scroll_depth'
        }
    });
    
    // Torna gtag global
    window.gtag = gtag;
    
    console.log('✅ Google Analytics iniciado');
}

// ===== FACEBOOK PIXEL =====
function initFacebookPixel() {
    if (!TRACKING_CONFIG.facebookPixel || TRACKING_CONFIG.facebookPixel === 'FB_PIXEL_ID') {
        console.log('⚠️ Facebook Pixel não configurado');
        return;
    }
    
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', TRACKING_CONFIG.facebookPixel);
    fbq('track', 'PageView');
    
    // Eventos personalizados
    fbq('track', 'ViewContent', {
        content_type: 'landing_page',
        content_name: 'Produto Incrível'
    });
    
    console.log('✅ Facebook Pixel iniciado');
}

// ===== GOOGLE ADS CONVERSION =====
function initGoogleAds() {
    if (!TRACKING_CONFIG.googleAds || TRACKING_CONFIG.googleAds === 'AW-CONVERSION_ID') {
        console.log('⚠️ Google Ads não configurado');
        return;
    }
    
    // Carrega o script do Google Ads
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_CONFIG.googleAds}`;
    document.head.appendChild(script);
    
    console.log('✅ Google Ads iniciado');
}

// ===== HOTJAR =====
function initHotjar() {
    if (!TRACKING_CONFIG.hotjar || TRACKING_CONFIG.hotjar === 'HOTJAR_ID') {
        console.log('⚠️ Hotjar não configurado');
        return;
    }
    
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:TRACKING_CONFIG.hotjar,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    
    console.log('✅ Hotjar iniciado');
}

// ===== EVENTOS PERSONALIZADOS =====

// Função principal de tracking (melhorada)
function trackEvent(action, category = 'general', label = '', value = null, customData = {}) {
    console.log('📊 Tracking:', { action, category, label, value, customData });
    
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
            custom_parameter_1: customData.section || '',
            custom_parameter_2: customData.scroll_depth || ''
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        const fbEventMap = {
            'video_play': 'ViewContent',
            'lead_capture': 'Lead', 
            'purchase_intent': 'InitiateCheckout',
            'scroll_25': 'ViewContent',
            'scroll_50': 'ViewContent',
            'scroll_75': 'ViewContent',
            'scroll_100': 'ViewContent'
        };
        
        const fbEvent = fbEventMap[action] || 'CustomEvent';
        fbq('track', fbEvent, {
            content_name: label,
            content_category: category,
            ...customData
        });
    }
    
    // Google Ads Conversions
    if (typeof gtag !== 'undefined' && action === 'purchase_intent') {
        gtag('event', 'conversion', {
            'send_to': TRACKING_CONFIG.googleAds + '/purchase',
            'value': value || 97.00,
            'currency': 'BRL'
        });
    }
}

// ===== TRACKING DE SEÇÕES =====
function trackSectionViews() {
    const sections = document.querySelectorAll('section[id]');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                trackEvent('section_view', 'engagement', sectionId, null, {
                    section: sectionId,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }, {
        threshold: 0.5 // 50% da seção visível
    });
    
    sections.forEach(section => sectionObserver.observe(section));
}

// ===== TRACKING DE CLIQUES =====
function trackButtonClicks() {
    // Botões principais
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-buy, .btn-buy-final').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const buttonClass = this.className;
            
            trackEvent('button_click', 'cta', buttonText, null, {
                button_type: buttonClass,
                position: getElementPosition(this)
            });
        });
    });
    
    // Links do menu
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('navigation_click', 'engagement', this.getAttribute('href'));
        });
    });
}

// ===== TRACKING DE FORMULÁRIOS =====
function trackFormInteractions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Focus nos campos
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('focus', function() {
                trackEvent('form_field_focus', 'engagement', this.type || this.tagName.toLowerCase());
            });
        });
        
        // Submissão do formulário
        form.addEventListener('submit', function() {
            trackEvent('form_submit', 'conversion', form.id || 'unnamed_form');
        });
    });
}

// ===== TRACKING DE VIDEO =====
function trackVideoInteractions() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        video.addEventListener('play', function() {
            trackEvent('video_play', 'engagement', 'vsl_video', null, {
                video_duration: this.duration,
                video_current_time: this.currentTime
            });
        });
        
        video.addEventListener('pause', function() {
            trackEvent('video_pause', 'engagement', 'vsl_video', this.currentTime);
        });
        
        video.addEventListener('ended', function() {
            trackEvent('video_complete', 'engagement', 'vsl_video', this.duration);
        });
        
        // Marcos de visualização (25%, 50%, 75%)
        let milestones = [0.25, 0.5, 0.75];
        let triggeredMilestones = [];
        
        video.addEventListener('timeupdate', function() {
            const progress = this.currentTime / this.duration;
            
            milestones.forEach(milestone => {
                if (progress >= milestone && !triggeredMilestones.includes(milestone)) {
                    triggeredMilestones.push(milestone);
                    trackEvent('video_progress', 'engagement', `${milestone * 100}%`, this.currentTime);
                }
            });
        });
    });
}

// ===== TRACKING DE TEMPO NA PÁGINA =====
function trackTimeOnPage() {
    let startTime = Date.now();
    let isActive = true;
    
    // Detecta quando o usuário fica inativo
    let inactivityTimer;
    
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        isActive = true;
        
        inactivityTimer = setTimeout(() => {
            isActive = false;
        }, 30000); // 30 segundos de inatividade
    }
    
    // Reset no movimento do mouse, scroll, click, etc.
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
    });
    
    resetInactivityTimer();
    
    // Tracking a cada 30 segundos se o usuário estiver ativo
    setInterval(() => {
        if (isActive) {
            const activeTime = Math.round((Date.now() - startTime) / 1000);
            trackEvent('time_on_page', 'engagement', 'active_time', activeTime);
        }
    }, 30000);
    
    // Tracking na saída
    window.addEventListener('beforeunload', function() {
        const totalTime = Math.round((Date.now() - startTime) / 1000);
        trackEvent('page_exit', 'engagement', 'total_time', totalTime);
    });
}

// ===== UTILITÁRIOS =====
function getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return Math.round(rect.top + scrollTop);
}

// ===== INICIALIZAÇÃO DO TRACKING =====
function initTracking() {
    console.log('🎯 Inicializando sistemas de tracking...');
    
    // Inicializa serviços
    initGoogleAnalytics();
    initFacebookPixel();
    initGoogleAds();
    initHotjar();
    
    // Configura eventos
    trackSectionViews();
    trackButtonClicks();
    trackFormInteractions();
    trackVideoInteractions();
    trackTimeOnPage();
    
    console.log('✅ Tracking configurado com sucesso!');
}

// ===== AUTO-INICIALIZAÇÃO =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
} else {
    initTracking();
}

// ===== EXPORTA FUNÇÕES GLOBAIS =====
window.TrackingUtils = {
    trackEvent,
    initTracking,
    TRACKING_CONFIG
};