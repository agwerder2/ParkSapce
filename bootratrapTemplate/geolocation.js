function initMap() {
  var defaultLocation = new google.maps.LatLng(51.508742, -0.120850);
  var mapProp = {
      center: defaultLocation,
      zoom: 15
  };

  var mapElement = $("#googleMap")[0];
  var map = new google.maps.Map(mapElement, mapProp);

  // Try to get user's current location
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
          var userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map.setCenter(userLocation); // Center the map to the user's location

          // Add a marker for the user's location
          new google.maps.Marker({
              position: userLocation,
              map: map,
              title: "You are here!"
          });

          // Fetch location information and weather
          getLocationInfo(position.coords.latitude, position.coords.longitude);
          getWeather(position.coords.latitude, position.coords.longitude);
      }, function () {
          alert("Geolocation failed or permission denied.");
      });
  } else {
      alert("Geolocation is not supported by this browser.");
  }
}

function getLocationInfo(latitude, longitude) {
  // OpenStreetMap Reverse Geocoding API
  var url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  $.getJSON(url, function (data) {
      var locationInfo = `
          <br><h4>Parkplätze in der Nähe suchen</h4>
          <br><h5>Location Info from OpenStreetMap:</h5>
          <p>Display Name: ${data.display_name}</p>
          <p>Address:</p>
          <ul>
              ${data.address.road ? `<li>Road: ${data.address.road}</li>` : ''}
              ${data.address.city ? `<li>City: ${data.address.city}</li>` : ''}
              ${data.address.state ? `<li>State: ${data.address.state}</li>` : ''}
              ${data.address.country ? `<li>Country: ${data.address.country}</li>` : ''}
          </ul>
      `;
      $("#locationInfo").html(locationInfo);
  }).fail(function () {
      alert("Error fetching location data from OpenStreetMap.");
  });
}

function getWeather(latitude, longitude) {
  var weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  $.getJSON(weatherApiUrl, function (data) {
      var weatherInfo = `
          <h5>Current Weather:</h5>
          <p>Temperature: ${data.current_weather.temperature} °C</p>
          <p>Weather: ${data.current_weather.weathercode}</p>
          <p>Windspeed: ${data.current_weather.windspeed} km/h</p>
          <p>Wind Direction: ${data.current_weather.winddirection} °</p>
      `;
      $("#weatherInfo").html(weatherInfo);
  }).fail(function () {
      alert("Error fetching weather data. Please try again later.");
  });
}

$(document).ready(function () {
  initMap();
});
