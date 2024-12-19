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

    // Calculate the current datetime for the country's timezone or use UTC
    const currentDatetime = calculateDatetime(country.timezones?.[0]);
    console.log(currentDatetime);

    // Create the card HTML
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
          <p class="card-datetime">Current Date and Time: ${currentDatetime}</p>
          <div class="card-buttons">
            <button class="card-button" data-maps-link="${
              country.maps?.googleMaps || "#"
            }">Show Map</button>
            <button class="card-button" data-country-code="${
              country.cca3
            }">Detail</button>
          </div>
        </div>
      `;

    // Add event listeners for the buttons
    const mapButton = card.querySelector("[data-maps-link]");
    mapButton.addEventListener("click", (event) => {
      const mapsLink = event.target.getAttribute("data-maps-link");
      if (mapsLink && mapsLink !== "#") {
        window.open(mapsLink, "_blank");
      } else {
        alert("Google Maps link not available for this country.");
      }
    });

    const detailButton = card.querySelector("[data-country-code]");
    detailButton.addEventListener("click", (event) => {
      const countryCode = event.target.getAttribute("data-country-code");
      if (countryCode) {
        window.location.href = `detail.html?country=${countryCode}`;
      }
    });

    // Append the card to the container
    cardsContainer.appendChild(card);
  });
}

function calculateDatetime(timezone) {
  // Create a Date object in UTC format
  const nowUTC = new Date(
    Date.now() + new Date().getTimezoneOffset() * 60 * 1000
  );

  if (timezone && timezone.startsWith("UTC")) {
    try {
      // Parse the UTC offset (e.g., "UTC+05:00" or "UTC-03:00")
      const offset = parseUTCOffset(timezone);
      const localTime = new Date(nowUTC.getTime() + offset * 60 * 60 * 1000);

      return formatDatetime(localTime);
    } catch (error) {
      //   console.error("Error parsing UTC offset:", error);
      return formatDatetime(new Date()); // Fallback to browser's local timezone
    }
  } else {
    // Default to the browser's local timezone
    return formatDatetime(new Date());
  }
}

// Helper function to parse the UTC offset string
function parseUTCOffset(utcString) {
  const match = utcString.match(/^UTC([+-]\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid UTC format: ${utcString}`);
  }

  const sign = match[1][0] === "+" ? 1 : -1;
  const hours = parseInt(match[1].slice(1), 10);
  const minutes = parseInt(match[2], 10);

  // Convert to total hours (e.g., "+05:30" becomes 5.5)
  return sign * (hours + minutes / 60);
}

// Helper function to format the datetime as "29th Dec 2024, 14:20"
function formatDatetime(date) {
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  // Get the ordinal suffix for the day
  const ordinalSuffix = getOrdinalSuffix(day);

  return `${day}${ordinalSuffix} ${month} ${year}, ${hour}:${minute}`;
}

// Helper function to get the ordinal suffix for the day
function getOrdinalSuffix(day) {
  const dayInt = parseInt(day, 10);
  if ([11, 12, 13].includes(dayInt % 100)) {
    return "th";
  }
  switch (dayInt % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// Call the function to fetch and render data
fetchCountriesWithAjax();
