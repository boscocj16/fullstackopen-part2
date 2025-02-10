import { useState, useEffect } from "react";

function CountrySearchApp() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);
  
  useEffect(() => {
    if (query.length < 1) {
      setCountries([]);
      return;
    }

    fetch(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((country) =>
          country.name.common.toLowerCase().includes(query.toLowerCase())
        );
        setCountries(filtered);
      });
  }, [query]);

  return (
    <div>
      <p style={{ display: "inline-block", marginRight: "10px" }}>find countries</p>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {countries.length > 10 && <p>Too many matches, be more specific.</p>}

      {countries.length > 1 && countries.length <= 10 && (
        <ul>
          {countries.map((country) => (
            <li key={country.cca3}>{country.name.common}</li>
          ))}
        </ul>
      )}

      {countries.length === 1 && (
        <div>
          <h2>{countries[0].name.common}</h2>
          <p>capital {countries[0].capital?.[0] || "N/A"}</p>
          <p>area {countries[0].area}</p>
          <p>languages {Object.values(countries[0].languages || {}).join(", ")}</p>
          <img
            src={countries[0].flags.png}
            alt={`Flag of ${countries[0].name.common}`}
            width="100"
          />
        </div>
      )}
    </div>
  );
}

export default CountrySearchApp;
