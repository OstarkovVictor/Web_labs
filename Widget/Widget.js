// Получаем элементы интерфейса
const cityInput = document.getElementById('cityInput');
const loadingSpinner = document.getElementById('loadingSpinner');
const errorAlert = document.getElementById('errorAlert');
const weatherInfo = document.getElementById('weatherInfo');

const API_KEY = 'bb154f11585669524abf5e3b4a7f2651';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

let debounceTimeout = null;

// Функция для выполнения запроса к API
const fetchWeather = async (cityName) => {
    showLoading(true);
    clearError();
    clearWeatherInfo();

    try {
        const response = await fetch(
            `${BASE_URL}?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`
        );

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.statusText}`);
        }

        const data = await response.json();
        displayWeatherInfo(data);
    } catch (err) {
        console.error(err.message);
        displayError(err.message);
    } finally {
        showLoading(false);
    }
};

// Функция для отображения данных о погоде
const displayWeatherInfo = (data) => {
    weatherInfo.innerHTML = `
        <h5>Погода в ${data.name}</h5>
        <p>Температура: ${data.main.temp}°C</p>
        <p>Ощущается как: ${data.main.feels_like}°C</p>
        <p>Описание: ${data.weather[0].description}</p>
    `;
};

// Функция для отображения индикатора загрузки
const showLoading = (isLoading) => {
    loadingSpinner.classList.toggle('d-none', !isLoading);
};

// Функция для отображения ошибки
const displayError = (message) => {
    errorAlert.textContent = message;
    errorAlert.classList.remove('d-none');
};

// Функция для очистки ошибок
const clearError = () => {
    errorAlert.classList.add('d-none');
    errorAlert.textContent = '';
};

// Функция для очистки данных о погоде
const clearWeatherInfo = () => {
    weatherInfo.innerHTML = '';
};

// Обработчик ввода с задержкой
cityInput.addEventListener('input', () => {
    const cityName = cityInput.value.trim();

    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }

    if (cityName) {
        debounceTimeout = setTimeout(() => {
            fetchWeather(cityName);
        }, 1000); // Задержка в 1 сек.
    }
});