import React, { useRef } from 'react';
import clear from './clear.png';
import cloud from './cloud.png';
import drizzle from './drizzle.png';
import snow from './snow.png';
import rain from './rain.png';
import wind from './wind.png';
import humidity from './humidity.png';

export default function Weather() {
  const inputRef = React.useRef();

  const [weatherData, setWeatherData] = React.useState(false);

  const allIcons = {
    '01d': clear,
    '01n': clear,
    '02d': cloud,
    '02n': cloud,
    '03d': cloud,
    '03n': cloud,
    '04d': drizzle,
    '04n': drizzle,
    '09d': rain,
    '09n': rain,
    '010d': rain,
    '010n': rain,
    '013d': snow,
    '013n': snow,
  };

  const search = async (city) => {
    if (!navigator.onLine) {
      alert('Please connect to the Internet to display data');
      return;
    }

    if (city === '') {
      alert('Input City');
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=187ae953870e19992ddd131f20a02e79`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      //caclulate the local time for the city
      //data.timezone ia in seconds from UTC
      const localTime = new Date(
        new Date().getTime() +
          new Date().getTimezoneOffset() * 60000 +
          data.timezone * 1000
      );
      const timeString = localTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      //check if response was okay
      if (!response.ok) {
        alert('Invalid city name');
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear;

      //make the data display
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp), //display only integer
        location: data.name,
        icon: icon,
        time: timeString,
        country: data.sys.country,
      });
    } catch (error) {
      setWeatherData(false);
      console.error('Error in fetching weather data');
    }
  };

  React.useEffect(() => {
    search('');
  }, []);

  return (
    <>
      <div className="weather">
        <h1>What's the weather like in</h1>
        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault(); //prevent page from refresh
          }}
        >
          <input ref={inputRef} type="text" placeholder="Search" />
          <button type="submit" onClick={() => search(inputRef.current.value)}>
            <img
              className="search-icon"
              src={
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ5AlKRlVa8j73CaUW5JrQqZPa0TzAI0YSpg&s'
              }
              alt="search-button"
            />
          </button>
        </form>

        {weatherData ? (
          <>
            <img
              className="weather-icon"
              src={weatherData.icon}
              alt="weather-icon"
            />
            <p className="temperature">
              {weatherData.temperature}
              <sup>o</sup>C
            </p>
            <p className="location">
              {weatherData.location} {weatherData.country} {weatherData.time}
            </p>
            <div className="weather-data">
              <div className="col">
                <img className="humidity" src={humidity} alt="" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>

              <div className="col">
                <img className="wind" src={wind} alt="" />
                <div>
                  <p>{weatherData.windSpeed}km/hr</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
