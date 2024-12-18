// Function to make an AJAX call and render cards
function fetchCountriesWithAjax() {
  const xhr = new XMLHttpRequest();
  const apiURL = "https://restcountries.com/v3.1/all"; // API to fetch country data

  // Open a GET request
  xhr.open("GET", apiURL, true);

  // Define what happens on successful data submission
  xhr.onload = function () {
    if (xhr.status === 200) {
      const countries = JSON.parse(xhr.responseText); // Parse JSON response
      console.log("API Response:", countries); // Log the response to console
      renderCountries(countries); // Call render function
    } else {
      console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
    }
  };

  // Define what happens in case of an error
  xhr.onerror = function () {
    console.error("Request failed.");
  };

  // Send the request
  xhr.send();
}

// Function to render country cards dynamically
function renderCountries(countries) {
  const cardsContainer = document.getElementById("cards-container"); // Target the right container
  countries.forEach((country) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <img
          src="${country.flags?.svg || "https://via.placeholder.com/150"}"
          alt="Flag of ${country.name.common}"
          class="card-image"
        />
        <div class="card-content">
          <h2 class="card-heading">${country.name.common}</h2>
          <p class="card-currency">Currency: ${
            Object.values(country.currencies || {})
              .map((c) => c.name)
              .join(", ") || "N/A"
          }</p>
          <p class="card-datetime">Region: ${country.region || "Unknown"}</p>
          <div class="card-buttons">
            <button class="card-button">Show Map</button>
            <button class="card-button">Detail</button>
          </div>
        </div>
      `;
    cardsContainer.appendChild(card); // Append to the correct div
  });
}

// Call the function to fetch and render data
fetchCountriesWithAjax();
