// Helper function to extract query parameters from the URL
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to fetch country details by code
async function fetchCountryDetails(code) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${code}`
    );
    if (!response.ok) {
      throw new Error(`Error fetching country details: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Helper function to get the first non-English native name
function getNonEnglishNativeName(nativeNames) {
  for (const langCode in nativeNames) {
    if (langCode !== "eng" && nativeNames[langCode]?.common) {
      return nativeNames[langCode].common;
    }
  }
  return "N/A"; // Fallback if no non-English native name is found
}

// Function to fetch all countries
async function fetchAllCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error(`Error fetching all countries: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Function to render neighbour countries
async function renderNeighbourCountries(region) {
  const countries = await fetchAllCountries();

  // Filter countries based on the region
  const neighbourCountries = countries.filter(
    (country) => country.region === region
  );

  if (neighbourCountries.length === 0) {
    return "<p>No neighbouring countries found in this region.</p>";
  }

  // Generate HTML for neighbour countries' flags
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

  return `
      <div class="neighbour-countries">
        <h3>Neighbour Countries</h3>
        <div class="flags-container">
          ${flagsHTML}
        </div>
      </div>
    `;
}

// Function to render country details
function renderCountryDetails(country) {
  const container = document.getElementById("country-details");

  if (!country) {
    container.innerHTML =
      "<p>Unable to fetch country details. Please try again later.</p>";
    return;
  }

  // Get non-English native name
  const nativeName = getNonEnglishNativeName(country.name?.nativeName) || "N/A";

  const capital = country.capital || "N/A";
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
        <p><strong>Area:</strong> ${area} Km <sup>2</sup></p>
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
    renderCountryDetails(countryData[0]);

    // After country details are rendered, fetch and render neighbour countries
    const region = countryData[0].region;
    const neighbourCountriesHTML = await renderNeighbourCountries(region);
    document.getElementById("country-details").innerHTML +=
      neighbourCountriesHTML;
  } else {
    document.getElementById("country-details").innerHTML =
      "<p>Unable to fetch country details. Please try again later.</p>";
  }
}

// Initialize the page
init();
