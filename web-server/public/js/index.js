const form = document.getElementById("form");
const input = document.getElementById("search");
const icon = document.getElementById("icon");
const place = document.getElementById("place");
const temperature = document.getElementById("temperature");
const loading = document.getElementById("loading");

const skycons = new Skycons({ color: "#333" });

setLoading = () => {
  handleLocationError();
  hideIcon();
  handleWeatherError();
  showLoading();
};

showLoading = () => {
  loading.style.display = "inline-block";
};

hideLoading = () => {
  loading.style.display = "none";
};

handleLocationError = (error = "") => {
  place.textContent = error;
};

hideIcon = () => {
  icon.style.display = "none";
};

handleWeatherError = (error = "") => {
  temperature.textContent = error;
};

form.onsubmit = e => {
  e.preventDefault();
  setLoading();

  const search = input.value;
  fetch(`/weather?search=${search}`).then(response => {
    response.json().then(data => {
      if (data.error) {
        hideLoading();
        handleLocationError(data.error);
      } else {
        hideLoading();

        place.textContent = data.location.location;

        const { weather } = data;

        if (weather.error) {
          hideIcon();
          handleWeatherError(weather.error);
        } else {
          icon.style.display = "block";
          skycons.set("icon", weather.icon);
          skycons.play();

          temperature.textContent = `${weather.temperature}ºC`;
        }
      }
    });
  });
};
