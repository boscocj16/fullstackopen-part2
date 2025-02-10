import { useState, useEffect } from "react";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setCountries([]);
      setSelectedCountry(null);
      setWeather(null);
      return;
    }

    fetch("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((country) =>
          country.name.common.toLowerCase().includes(query.toLowerCase())
        );
        setCountries(filtered);

        if (filtered.length === 1) {
          setSelectedCountry(filtered[0]);
        } else {
          setSelectedCountry(null);
        }
      })
      .catch((err) => console.error("Country API error:", err));
  }, [query]);

  useEffect(() => {
    if (!selectedCountry) return;

    const capital = selectedCountry.capital?.[0];
    if (!capital) {
      setWeather(null);
      return;
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Weather API request failed");
        return res.json();
      })
      .then((data) => {
        setWeather({
          temp: data.main?.temp || "N/A",
          wind: data.wind?.speed || "N/A",
          icon: data.weather?.[0]?.icon
            ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            : "",
        });
      })
      .catch((err) => {
        console.error("Weather API error:", err);
        setWeather(null);
      });
  }, [selectedCountry]);

  return (
    <div>
      <p style={{ display: "inline-block", marginRight: "10px" }}>find countries</p>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div>
        {countries.length > 10 && <p>Too many matches, be more specific.</p>}

        {countries.length > 1 && countries.length <= 10 && (
          <ul>
            {countries.map((country) => (
              <li key={country.cca3}>
                {country.name.common}
                <button onClick={() => setSelectedCountry(country)}>show</button>
              </li>
            ))}
          </ul>
        )}

        {selectedCountry && (
          <div>
            <h2>{selectedCountry.name.common}</h2>
            <p>capital {selectedCountry.capital?.[0] || "N/A"}</p>
            <p>area {selectedCountry.area}</p>
            <p>languages {Object.values(selectedCountry.languages || {}).join(", ")}</p>
            <img
              src={selectedCountry.flags.png}
              alt={`Flag of ${selectedCountry.name.common}`}
              width="100"
            />

            {weather && (
              <div>
                <h3>Weather in {selectedCountry.capital?.[0]}</h3>
                <p>Temperature: {weather.temp}°C</p>
                <p>Wind: {weather.wind} m/s</p>
                {weather.icon && <img src={weather.icon} alt="Weather icon" />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
