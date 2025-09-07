const apiKey = "0266e684fbf474a8bf7a980f0bb982b5"; // your API key

function formatTime(timestamp, timezone) {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toUTCString().match(/(\d{2}:\d{2}:\d{2})/)[0];
}

async function getWeather(cityName = null) {
  const city = cityName || document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    resultDiv.innerHTML = "<p>Please enter a city name</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    resultDiv.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
      <p><strong>🌤 Condition:</strong> ${data.weather[0].description}</p>
      <p><strong>🌡 Temperature:</strong> ${data.main.temp} °C</p>
      <p><strong>🔼 Max:</strong> ${data.main.temp_max} °C | <strong>🔽 Min:</strong> ${data.main.temp_min} °C</p>
      <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>💨 Wind Speed:</strong> ${data.wind.speed} m/s</p>
      <p><strong>🌅 Sunrise:</strong> ${formatTime(data.sys.sunrise, data.timezone)}</p>
      <p><strong>🌇 Sunset:</strong> ${formatTime(data.sys.sunset, data.timezone)}</p>
    `;

    // ✅ Save city into history
    saveHistory(data.name);
    displayHistory();

  } catch (error) {
    resultDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

/* -----------------------------
   Search History Functions
----------------------------- */
function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }
}

function displayHistory() {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  history.forEach(city => {
    let li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => getWeather(city); // ✅ clicking loads weather
    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("weatherHistory");
  displayHistory();
}

// ✅ Load history when page starts
window.onload = displayHistory;
