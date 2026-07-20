const apiKey = "09395fa83a5c4f7c8c195908261304";

const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("locationInput");
const loader = document.getElementById("loader");
const weatherCard = document.getElementById("weatherCard");
const errorDiv = document.getElementById("error");

searchBtn.addEventListener("click", getWeather);

input.addEventListener("keypress", function(e){
if(e.key === "Enter"){
getWeather();
}
});

async function getWeather(){

const location = input.value.trim();

if(location === ""){
alert("Please enter a location");
return;
}

loader.classList.remove("hidden");
weatherCard.classList.add("hidden");

try{

const response = await fetch(
`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=5&aqi=yes`
);

const data = await response.json();

if(data.error){
throw new Error(data.error.message);
}

displayWeather(data);

}catch(error){

errorDiv.textContent = error.message;

}

loader.classList.add("hidden");

}

function displayWeather(data){

weatherCard.classList.remove("hidden");

document.getElementById("city").textContent =
`${data.location.name}, ${data.location.country}`;

document.getElementById("temp").textContent =
data.current.temp_c + "°C";

document.getElementById("condition").textContent =
data.current.condition.text;

document.getElementById("icon").src =
data.current.condition.icon;

document.getElementById("humidity").textContent =
data.current.humidity + "%";

document.getElementById("wind").textContent =
data.current.wind_kph + " kph";

document.getElementById("feels").textContent =
data.current.feelslike_c + "°C";

document.getElementById("uv").textContent =
data.current.uv;

document.getElementById("time").textContent =
data.location.localtime;

document.getElementById("aqi").textContent =
data.current.air_quality.pm2_5;

displayForecast(data.forecast.forecastday);

}

function displayForecast(days){

const forecastContainer = document.getElementById("forecast");

forecastContainer.innerHTML = "";

days.forEach(day => {

const card = document.createElement("div");
card.classList.add("forecast-card");

card.innerHTML = `
<p>${day.date}</p>
<img src="${day.day.condition.icon}">
<p>${day.day.avgtemp_c}°C</p>
`;

forecastContainer.appendChild(card);

});

}

/* Dark Mode */

document.getElementById("toggleTheme").addEventListener("click", ()=>{
document.body.classList.toggle("dark");
});

/* Geolocation */

navigator.geolocation.getCurrentPosition(async pos => {

const lat = pos.coords.latitude;
const lon = pos.coords.longitude;

const response = await fetch(
`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=yes`
);

const data = await response.json();

displayWeather(data);

});