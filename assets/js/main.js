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

// Analytics Tab functionality
function initializeAnalyticsTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const chartContainers = document.querySelectorAll('.chart-container');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and containers
            tabBtns.forEach(tab => tab.classList.remove('active'));
            chartContainers.forEach(container => container.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding chart container
            const targetContainer = document.getElementById(`${targetTab}-chart`);
            if (targetContainer) {
                targetContainer.classList.add('active');
            }
            
            console.log(`Analytics tab switched to: ${targetTab}`);
        });
    });
}

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
    initializeAnalyticsTabs();
    initializeFloatingActions();
    initializeSettingsSidebar();
    initializeNavigation();
    initializeQuickActions();
    
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
    
    // Update search box placeholder or value to reflect the selected city
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.value = city;
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