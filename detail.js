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

// Function to render country details
function renderCountryDetails(country) {
  const container = document.getElementById("country-details");

  if (!country) {
    container.innerHTML =
      "<p>Unable to fetch country details. Please try again later.</p>";
    return;
  }

  // Generate HTML for country details
  const html = `
      <img src="${
        country.flags?.svg || "https://via.placeholder.com/150"
      }" alt="Flag of ${country.name.common}" class="country-flag" />
      <h2>${country.name.common}</h2>
      <p><strong>Official Name:</strong> ${country.name.official}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Languages:</strong> ${Object.values(
        country.languages || {}
      ).join(", ")}</p>
      <p><strong>Currencies:</strong> ${
        Object.values(country.currencies || {})
          .map((c) => `${c.name} (${c.symbol})`)
          .join(", ") || "N/A"
      }</p>
      <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
      <p><strong>Google Maps:</strong> <a href="${
        country.maps?.googleMaps || "#"
      }" target="_blank">View on Map</a></p>
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
  renderCountryDetails(countryData[0]);
}

// Initialize the page
init();
