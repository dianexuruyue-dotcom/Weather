// Weather App - Main JavaScript Functions

// Auto location detection on page load
let userLocation = {
    city: 'New York',
    country: 'NY',
    lat: 40.7128,
    lon: -74.0060
};

// Hourly weather data
const hourlyWeatherData = {
    labels: ['6hrs ago', '5hrs ago', '4hrs ago', '3hrs ago', '2hrs ago', '1hr ago', 'Now', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12AM'],
    temperature: [68, 69, 70, 71, 71, 72, 72, 75, 77, 78, 76, 74, 72, 70, 69, 67, 65, 64, 62],
    precipitation: [0, 0, 5, 10, 15, 10, 5, 0, 0, 15, 70, 85, 80, 40, 20, 10, 5, 0, 0]
};

let hourlyChart = null;

// Get user's IP-based location
async function getUserLocationByIP() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        userLocation = {
            city: data.city || 'Unknown',
            country: data.region || data.country_name || 'Unknown',
            lat: data.latitude || 0,
            lon: data.longitude || 0
        };
        
        updateLocationDisplay();
        console.log('User location detected:', userLocation);
    } catch (error) {
        console.warn('Could not detect location via IP, using default:', error);
        // Fallback to browser geolocation API
        getBrowserLocation();
    }
}

// Fallback: Browser geolocation API
function getBrowserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    
                    // Reverse geocoding to get city name
                    const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=demo`);
                    const data = await response.json();
                    
                    if (data.length > 0) {
                        userLocation = {
                            city: data[0].name,
                            country: data[0].state || data[0].country,
                            lat: lat,
                            lon: lon
                        };
                        updateLocationDisplay();
                    }
                } catch (error) {
                    console.warn('Could not reverse geocode coordinates:', error);
                }
            },
            (error) => {
                console.warn('Geolocation permission denied or failed:', error);
            }
        );
    }
}

// Update the location display on the page
function updateLocationDisplay() {
    const locationLoadingElement = document.querySelector('.location-loading');
    const locationTextElement = document.querySelector('.location-text');
    
    if (locationLoadingElement && locationTextElement) {
        locationLoadingElement.style.display = 'none';
        locationTextElement.style.display = 'inline';
        locationTextElement.textContent = `${userLocation.city}, ${userLocation.country}`;
    }
    
    // Fallback for older structure
    const locationElement = document.querySelector('.location-name');
    if (locationElement && !locationLoadingElement) {
        locationElement.textContent = `${userLocation.city}, ${userLocation.country}`;
    }
}

// Initialize hourly weather chart
function initializeHourlyChart() {
    const canvas = document.getElementById('hourlyWeatherChart');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    try {
        hourlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: hourlyWeatherData.labels,
                datasets: [{
                    label: 'Temperature (°F)',
                    data: hourlyWeatherData.temperature,
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ff6b35',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#ff6b35',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + (context.dataset.label.includes('Temperature') ? '°F' : '%');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#666',
                            callback: function(value) {
                                return value + '°F';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#666',
                            maxRotation: 45
                        }
                    }
                }
            }
        });
        console.log('Chart initialized successfully');
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
}

// Switch chart data
function switchChartData(chartType) {
    if (!hourlyChart) return;
    
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');
    
    if (chartType === 'temperature') {
        hourlyChart.data.datasets[0] = {
            label: 'Temperature (°F)',
            data: hourlyWeatherData.temperature,
            borderColor: '#ff6b35',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ff6b35',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        };
        hourlyChart.options.scales.y.ticks.callback = function(value) {
            return value + '°F';
        };
    } else if (chartType === 'precipitation') {
        hourlyChart.data.datasets[0] = {
            label: 'Precipitation (%)',
            data: hourlyWeatherData.precipitation,
            borderColor: '#74b9ff',
            backgroundColor: 'rgba(116, 185, 255, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#74b9ff',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        };
        hourlyChart.options.scales.y.ticks.callback = function(value) {
            return value + '%';
        };
    }
    
    hourlyChart.update('active');
}

// Initialize chart controls
function initializeChartControls() {
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chartType = this.getAttribute('data-chart');
            switchChartData(chartType);
        });
    });
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

// Floating Action Buttons functionality
function initializeFloatingActions() {
    const mainFab = document.getElementById('mainFab');
    const fabMenu = document.getElementById('fabMenu');
    const fabButtons = document.querySelectorAll('.fab[data-action]');
    let isMenuOpen = false;
    
    if (mainFab && fabMenu) {
        mainFab.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                fabMenu.classList.add('active');
                this.style.transform = 'rotate(45deg)';
            } else {
                fabMenu.classList.remove('active');
                this.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Handle individual fab button actions
    fabButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'share':
                    shareWeatherData();
                    break;
                case 'bookmark':
                    bookmarkLocation();
                    break;
                case 'notifications':
                    toggleNotifications();
                    break;
            }
            
            // Close menu after action
            fabMenu.classList.remove('active');
            mainFab.style.transform = 'rotate(0deg)';
            isMenuOpen = false;
        });
    });
}

// Settings Sidebar functionality
function initializeSettingsSidebar() {
    const settingsNavItem = document.querySelector('.nav-item[data-feature="settings"]');
    const settingsSidebar = document.getElementById('settingsSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const overlay = document.getElementById('overlay');
    
    if (settingsNavItem && settingsSidebar) {
        settingsNavItem.addEventListener('click', function() {
            settingsSidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            settingsSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            settingsSidebar.classList.remove('active');
            this.classList.remove('active');
        });
    }
    
    // Handle settings changes
    const settingToggles = document.querySelectorAll('.setting-toggle');
    const settingSelects = document.querySelectorAll('.setting-select');
    
    settingToggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const label = this.parentElement.querySelector('label').textContent;
            console.log(`Setting changed: ${label} = ${this.checked}`);
        });
    });
    
    settingSelects.forEach(select => {
        select.addEventListener('change', function() {
            const label = this.parentElement.querySelector('label').textContent;
            console.log(`Setting changed: ${label} = ${this.value}`);
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-feature]');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            switch(feature) {
                case 'radar':
                    showRadarView();
                    break;
                case 'maps':
                    showMapsView();
                    break;
                case 'air-quality':
                    showAirQualityView();
                    break;
                case 'settings':
                    // Settings handled by sidebar function
                    break;
            }
            
            console.log(`Navigation switched to: ${feature}`);
        });
    });
}

// Quick Actions functionality
function initializeQuickActions() {
    const actionItems = document.querySelectorAll('.action-item[data-action]');
    
    actionItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'clothing':
                    showClothingAdvice();
                    break;
                case 'sports':
                    showSportIndex();
                    break;
                case 'uv':
                    showUVProtection();
                    break;
                case 'air':
                    showAirQuality();
                    break;
            }
            
            console.log(`Quick action triggered: ${action}`);
        });
    });
}

// Feature implementation functions
function shareWeatherData() {
    const locationName = document.querySelector('.location-name').textContent;
    const currentTemp = document.querySelector('.current-temp').textContent;
    const condition = document.querySelector('.current-condition').textContent;
    
    const shareText = `Current weather in ${locationName}: ${currentTemp}, ${condition}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Weather Update',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText);
        showNotification('Weather data copied to clipboard!');
    }
}

function bookmarkLocation() {
    const locationName = document.querySelector('.location-name').textContent;
    showNotification(`${locationName} bookmarked!`);
}

function toggleNotifications() {
    showNotification('Notification preferences updated!');
}

function showRadarView() {
    showNotification('Weather radar view activated');
}

function showMapsView() {
    showNotification('Weather maps view activated');
}

function showAirQualityView() {
    showNotification('Air quality data displayed');
}

function showClothingAdvice() {
    showNotification('Clothing recommendations based on current weather');
}

function showSportIndex() {
    showNotification('Sport activity index calculated');
}

function showUVProtection() {
    showNotification('UV protection recommendations displayed');
}

function showAirQuality() {
    showNotification('Air quality index information shown');
}

function showNotification(message) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #74b9ff, #0984e3);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1200;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Popular cities functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeFloatingActions();
    initializeSettingsSidebar();
    initializeNavigation();
    initializeQuickActions();
    initializeChartControls();
    
    // Auto-detect user location on page load
    getUserLocationByIP();
    
    // Wait for Chart.js to load before initializing chart
    if (typeof Chart !== 'undefined') {
        setTimeout(() => {
            initializeHourlyChart();
        }, 500);
    } else {
        // If Chart.js is not loaded, wait a bit longer
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                initializeHourlyChart();
            } else {
                console.error('Chart.js failed to load');
            }
        }, 2000);
    }
    
    const cityItems = document.querySelectorAll('.city-item');
    
    cityItems.forEach(cityItem => {
        cityItem.addEventListener('click', function() {
            // Remove active class from all cities
            cityItems.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked city
            this.classList.add('active');
            
            // Get city data from data attributes
            const cityName = this.getAttribute('data-city');
            const countryName = this.getAttribute('data-country');
            const temperature = this.getAttribute('data-temp');
            const condition = this.getAttribute('data-condition');
            const weatherIcon = this.getAttribute('data-icon');
            
            // Get alert data
            const alertType = this.getAttribute('data-alert-type');
            const alertIcon = this.getAttribute('data-alert-icon');
            const alertTitle = this.getAttribute('data-alert-title');
            const alertMessage = this.getAttribute('data-alert-message');
            
            // Update main weather display
            updateMainWeather(cityName, countryName, temperature, condition, weatherIcon);
            
            // Update weather alert
            updateWeatherAlert(alertType, alertIcon, alertTitle, alertMessage);
            
            // Smooth scroll to top to show the updated weather
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
});

function updateMainWeather(city, country, temp, condition, icon) {
    // Update location name
    const locationElement = document.querySelector('.location-name');
    if (locationElement) {
        locationElement.textContent = `${city}, ${country}`;
    }
    
    // Update temperature
    const tempElement = document.querySelector('.current-temp');
    if (tempElement) {
        tempElement.textContent = `${temp}°F`;
    }
    
    // Update condition
    const conditionElement = document.querySelector('.current-condition');
    if (conditionElement) {
        conditionElement.textContent = condition;
    }
    
    
    // Add a subtle animation to indicate the change
    const currentWeatherSection = document.querySelector('.current-weather');
    if (currentWeatherSection) {
        currentWeatherSection.style.transform = 'scale(0.98)';
        currentWeatherSection.style.opacity = '0.8';
        
        setTimeout(() => {
            currentWeatherSection.style.transform = 'scale(1)';
            currentWeatherSection.style.opacity = '1';
        }, 200);
    }
    
    // Console log for debugging
    console.log(`Weather updated for ${city}, ${country}: ${temp}°F - ${condition}`);
}

function updateWeatherAlert(alertType, alertIcon, alertTitle, alertMessage) {
    const weatherAlert = document.querySelector('.weather-alert');
    const alertIconElement = document.querySelector('.alert-icon');
    const alertTitleElement = document.querySelector('.alert-title');
    const alertMessageElement = document.querySelector('.alert-message');
    const alertTimeElement = document.querySelector('.alert-time');
    
    if (!weatherAlert) return;
    
    // Remove existing alert type classes
    weatherAlert.classList.remove('alert-rain', 'alert-heat', 'alert-storm', 'alert-fire', 'alert-fog', 'alert-earthquake');
    
    if (alertType === 'none' || !alertType || !alertTitle) {
        // Hide alert if no warning
        weatherAlert.style.display = 'none';
    } else {
        // Show and update alert
        weatherAlert.style.display = 'flex';
        weatherAlert.classList.add(`alert-${alertType}`);
        
        if (alertIconElement) alertIconElement.textContent = alertIcon;
        if (alertTitleElement) alertTitleElement.textContent = alertTitle;
        if (alertMessageElement) alertMessageElement.textContent = alertMessage;
        if (alertTimeElement) alertTimeElement.textContent = 'Updated just now';
        
        // Add entrance animation
        weatherAlert.style.transform = 'translateY(-10px)';
        weatherAlert.style.opacity = '0.8';
        
        setTimeout(() => {
            weatherAlert.style.transform = 'translateY(0)';
            weatherAlert.style.opacity = '1';
        }, 200);
    }
    
    console.log(`Alert updated: ${alertType} - ${alertTitle}`);
}