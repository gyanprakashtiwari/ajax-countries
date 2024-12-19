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
            <button class="card-button">Show Map</button>
            <button class="card-button">Detail</button>
          </div>
        </div>
      `;
    cardsContainer.appendChild(card); // Append to the correct div
  });
}
function calculateDatetime(timezone) {
  const now = new Date();

  // Use the specified timezone if available
  console.log(typeof timezone);

  console.log(timezone);
  if (timezone) {
    try {
      // Convert to specific timezone using Intl.DateTimeFormat
      const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Format the date
      const parts = formatter.formatToParts(now);
      const day = parts.find((p) => p.type === "day").value;
      const month = parts.find((p) => p.type === "month").value;
      const year = parts.find((p) => p.type === "year").value;
      const hour = parts.find((p) => p.type === "hour").value;
      const minute = parts.find((p) => p.type === "minute").value;

      // Get the ordinal suffix for the day
      const ordinalSuffix = getOrdinalSuffix(day);

      return `${day}${ordinalSuffix} ${month} ${year}, ${hour}:${minute}`;
    } catch (error) {
      //   console.error("Error formatting datetime:", error);
      // Fallback to browser's local timezone
      return formatLocalTimezone(now);
    }
  } else {
    // Use browser's local timezone as default
    return formatLocalTimezone(now);
  }
}

// Helper function to format a date using the browser's timezone
function formatLocalTimezone(date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const day = parts.find((p) => p.type === "day").value;
  const month = parts.find((p) => p.type === "month").value;
  const year = parts.find((p) => p.type === "year").value;
  const hour = parts.find((p) => p.type === "hour").value;
  const minute = parts.find((p) => p.type === "minute").value;

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
