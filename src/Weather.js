import React, { useState } from 'react';

function Weather() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState('');

    const fetchWeather = () => {
        if (!city) {
            setError('Пожалуйста, введите название города.');
            setWeatherData([]);
            return; 
        }
        const apiKey = process.env.REACT_APP_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/find?q=${city}&appid=${apiKey}&units=metric`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Город не найден');
                }
                return response.json();
            })
            .then(data => {
                if (data.list.length > 0) {
                    const uniqueData = [];
                    const coordinatesSet = new Set();

                    data.list.forEach(item => {
                        const coords = `${item.coord.lat},${item.coord.lon}`;
                        if (!coordinatesSet.has(coords)) {
                            coordinatesSet.add(coords);
                            uniqueData.push(item);
                        }
                    });

                    setWeatherData(uniqueData);
                    setError('');
                } else {
                    throw new Error('Город не найден');
                }
            })
            .catch(err => {
                if (err.message === 'Город не найден') {
                    setError(err.message);
                } 
                else {
                    setError('Ошибка подключения к серверу. Пожалуйста, проверьте ваше интернет-соединение или попробуйте позже.');
                }
                setWeatherData([]);
            });
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchWeather();
        }
    };

    return (
        <div className="container">
            <h1>Погода</h1>
            <div className="form">
                <input
                    type="text"
                    value={city}
                    onChange={(e) => {
    
                        const value = e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
                        setCity(value.substring(0, 60)); 
                    }}
                    onKeyDown={handleKeyDown} 
                    placeholder="Введите город"
                    maxLength={60} 
                />
                <button onClick={fetchWeather}>Найти</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {weatherData.length > 0 && (
                <div id="weatherResult">
                    {weatherData.map((item) => (
                        <div key={item.id} className="weatherCard">
                            <h2>{item.name}, {item.sys.country}</h2>
                            <p>Температура: {item.main.temp}°C</p>
                            <p>Описание: {item.weather[0].description}</p>
                            <p>Координаты: {item.coord.lat}°, {item.coord.lon}°</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Weather;
