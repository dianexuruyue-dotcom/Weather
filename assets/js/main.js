// Weather App - Main JavaScript Functions

// Search functionality
document.querySelector('.search-box').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

document.querySelector('.search-btn').addEventListener('click', searchWeather);

function searchWeather() {
    const query = document.querySelector('.search-box').value;
    if (query.trim()) {
        // Simulate search - in real app, this would call weather API
        document.querySelector('.location-name').textContent = query;
        console.log('Searching weather for:', query);
    }
}

// Extended forecast toggle
function toggleExtendedForecast() {
    const extendedDays = document.getElementById('extended-days');
    const button = document.getElementById('showMoreBtn');
    
    if (extendedDays.classList.contains('hidden')) {
        extendedDays.classList.remove('hidden');
        button.textContent = 'Show Less';
    } else {
        extendedDays.classList.add('hidden');
        button.textContent = 'Show Complete 30-Day Forecast';
    }
}

// Interactive hourly weather selection
document.querySelectorAll('.hourly-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.hourly-item').forEach(i => {
            i.style.border = '2px solid transparent';
        });
        this.style.border = '2px solid #ff6b35';
    });
});

// Add smooth scrolling for hourly weather
const hourlyContainer = document.querySelector('.hourly-container');
let isDown = false;
let startX;
let scrollLeft;

hourlyContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - hourlyContainer.offsetLeft;
    scrollLeft = hourlyContainer.scrollLeft;
});

hourlyContainer.addEventListener('mouseleave', () => {
    isDown = false;
});

hourlyContainer.addEventListener('mouseup', () => {
    isDown = false;
});

hourlyContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - hourlyContainer.offsetLeft;
    const walk = (x - startX) * 2;
    hourlyContainer.scrollLeft = scrollLeft - walk;
});

// Auto-update current time
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.title = `Weather - Live Weather Updates ${timeString}`;
}

// Update every minute
setInterval(updateCurrentTime, 60000);

// Add dynamic weather animations
function addWeatherAnimation() {
    const weatherIcons = document.querySelectorAll('.hourly-icon, .daily-icon');
    weatherIcons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.animation = 'bounce 0.6s ease-in-out';
        }, index * 100);
    });
}

// CSS for bounce animation
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
    }
`;
document.head.appendChild(style);

// Trigger animation on page load
window.addEventListener('load', () => {
    setTimeout(addWeatherAnimation, 1000);
});