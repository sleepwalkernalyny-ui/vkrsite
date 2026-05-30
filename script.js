// вакансии
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.job-card');
    const prevBtn = document.querySelector('.carousel-btn--prev');
    const nextBtn = document.querySelector('.carousel-btn--next');
    const dots = document.querySelectorAll('.dot');
    const modal = document.getElementById('vacancyModal');
    const modalClose = document.querySelector('.modal__close');
    const modalBody = document.querySelector('.modal__body');
    
    let currentIndex = 0;
    let cardWidth = 0;
    let visibleCards = 0;
    
    // расчет видимых карточек
    function calculateVisibleCards() {
        const containerWidth = document.querySelector('.jobs-carousel').offsetWidth;
        const firstCard = cards[0];
        
        if (!firstCard) return { visible: 3, width: 380 };
        
        cardWidth = firstCard.offsetWidth + 30; // + gap
        
        if (window.innerWidth < 768) {
            visibleCards = 1;
        } else if (window.innerWidth < 1200) {
            visibleCards = 2;
        } else {
            visibleCards = 3;
        }
        
        return { visible: visibleCards, width: cardWidth };
    }
    
    // обновление карусели
    function updateCarousel() {
        const { visible, width } = calculateVisibleCards();
        const maxIndex = Math.max(0, cards.length - visible);
        
        // Ограничиваем currentIndex
        currentIndex = Math.min(Math.max(0, currentIndex), maxIndex);
        
        track.style.transform = `translateX(-${currentIndex * width}px)`;
        
        // точки
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // показать или скрыть кнопки
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
        nextBtn.style.cursor = currentIndex >= maxIndex ? 'default' : 'pointer';
    }
    
    // кнопка вперед
    nextBtn.addEventListener('click', () => {
        const { visible } = calculateVisibleCards();
        const maxIndex = Math.max(0, cards.length - visible);
        
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // кнопка "назад"
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // клик по точкам
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const { visible } = calculateVisibleCards();
            const maxIndex = Math.max(0, cards.length - visible);
            
            if (index <= maxIndex) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });
    
    // Свайп для мобильных
    let startX = 0;
    let endX = 0;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево = вперед
                nextBtn.click();
            } else {
                // Свайп вправо = назад
                prevBtn.click();
            }
        }
    }
    
    // Адаптация к изменению размера окна
    window.addEventListener('resize', () => {
        updateCarousel();
    });
    
    // Инициализация при загрузке
    setTimeout(() => {
        updateCarousel();
    }, 100);
});

function loadMap() {
    if (document.getElementById('map')) {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=ваш_api_ключ';
        script.onload = function() {
            ymaps.ready(init);
        };
        document.head.appendChild(script);
    }
}

function init() {
    const map = new ymaps.Map('map', {
        center: [51.660781, 39.200269], 
        zoom: 16
    });
    
    const placemark = new ymaps.Placemark([51.693555, 39.182271], {
        hintContent: 'Офис Продимекс Агро',
        balloonContent: `
            <b>ООО «УК Продимекс Агро»</b><br>
            Московский пр-т, 19Б, офис 417<br>
            Телефон: +7 (495) 933-44-00
        `
    });
    
    map.geoObjects.add(placemark);
}

document.addEventListener('DOMContentLoaded', loadMap);
