// Function to fetch all countries
async function fetchAllCountries() {
  try {
    const apiURL = "https://restcountries.com/v3.1/all";
    console.log("Fetching all countries from: ", apiURL);

    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        Accept: "application/json", // Ensures response is in JSON format
      },
      mode: "cors", // Ensures CORS is handled correctly
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching all countries: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Fetched countries: ", data.length);
    return data;
  } catch (error) {
    console.error("Fetch error: ", error);
    return [];
  }
}

// Function to fetch country details by code
async function fetchCountryDetails(code) {
  try {
    const apiURL = `https://restcountries.com/v3.1/alpha/${code}`;
    console.log(`Fetching country details from: ${apiURL}`);

    const response = await fetch(apiURL, {
      method: "GET",
      headers: {
        Accept: "application/json", // Ensures response is in JSON format
      },
      mode: "cors", // Ensures CORS is handled correctly
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching country details: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Fetched country details: ", data);
    return data[0]; // Return the first object from the array
  } catch (error) {
    console.error("Fetch error: ", error);
    return null;
  }
}

// Helper function to extract query parameters from the URL
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Helper function to get the first non-English native name
function getNonEnglishNativeName(nativeNames) {
  if (!nativeNames) return "N/A";
  for (const langCode in nativeNames) {
    if (langCode !== "eng" && nativeNames[langCode]?.common) {
      return nativeNames[langCode].common;
    }
  }
  return "N/A";
}

// Function to render country details
function renderCountryDetails(country) {
  const container = document.getElementById("country-details");

  if (!country) {
    container.innerHTML =
      "<p>Unable to fetch country details. Please try again later.</p>";
    return;
  }

  // Extract country details
  const nativeName = getNonEnglishNativeName(country.name?.nativeName);
  const capital = country.capital?.[0] || "N/A";
  const region = country.region || "N/A";
  const subregion = country.subregion || "N/A";
  const population = country.population
    ? country.population.toLocaleString()
    : "N/A";
  const area = country.area ? country.area.toLocaleString() : "N/A";
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name} (${c.symbol})`)
        .join(", ")
    : "N/A";
  const countryPhoneCode =
    country.idd?.root && country.idd?.suffixes?.[0]
      ? `${country.idd.root}${country.idd.suffixes[0]}`
      : "N/A";
  const timezones = country.timezones ? country.timezones.join(", ") : "N/A";
  const googleMapsLink = country.maps?.googleMaps || "#";

  // Generate HTML for country details
  const html = `
          <div class="country-header">
            <h2>${country.name.common}</h2>
            <img src="${
              country.flags?.svg || "https://via.placeholder.com/150"
            }" alt="Flag of ${country.name.common}" class="country-flag" />
          </div>
          <div class="details-content">
            <p><strong>Native Name:</strong> ${nativeName}</p>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Region:</strong> ${region}</p>
            <p><strong>Subregion:</strong> ${subregion}</p>
            <p><strong>Area:</strong> ${area} Km<sup>2</sup></p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <p><strong>Country Code:</strong> ${countryPhoneCode}</p>
            <p><strong>Currencies:</strong> ${currencies}</p>
            <p><strong>Timezones:</strong> ${timezones}</p>
            <p><strong>Google Maps:</strong> <a href="${googleMapsLink}" target="_blank">View on Map</a></p>
          </div>
        `;

  container.innerHTML = html;
}

// Function to render neighbouring countries
async function renderNeighbourCountries(subregion, currentCountryName) {
  const neighbourContainer = document.getElementById("neighbour-countries");

  const countries = await fetchAllCountries();

  // Filter countries based on the subregion and exclude the current country
  const neighbourCountries = countries.filter(
    (country) =>
      country.subregion === subregion &&
      country.name.common !== currentCountryName
  );

  if (neighbourCountries.length === 0) {
    neighbourContainer.innerHTML =
      "<p>No neighbouring countries found in this subregion.</p>";
    return;
  }

  // Generate HTML for neighbouring countries' flags
  const flagsHTML = neighbourCountries
    .map((country) => {
      return `
              <div class="neighbour-flag">
                <img src="${
                  country.flags?.svg || "https://via.placeholder.com/50"
                }" alt="Flag of ${country.name.common}" class="flag-image" />
              </div>
            `;
    })
    .join("");

  neighbourContainer.innerHTML = `
          <h3>Neighbour Countries</h3>
          <div class="flags-container">
            ${flagsHTML}
          </div>
        `;
}

// Main function to initialize the page
async function init() {
  // Get the country code from the query parameter
  const countryCode = getQueryParameter("country");
  if (!countryCode) {
    document.getElementById("country-details").innerHTML =
      "<p>Invalid country code.</p>";
    return;
  }

  // Fetch and render country details
  const countryData = await fetchCountryDetails(countryCode.toUpperCase());
  if (countryData) {
    renderCountryDetails(countryData);

    // After country details are rendered, fetch and render neighbour countries
    const subregion = countryData.subregion;
    const currentCountryName = countryData.name.common;
    await renderNeighbourCountries(subregion, currentCountryName);
  } else {
    document.getElementById("country-details").innerHTML =
      "<p>Unable to fetch country details. Please try again later.</p>";
  }
}

// Initialize the page
init();
