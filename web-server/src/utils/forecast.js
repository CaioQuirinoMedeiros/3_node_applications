const axios = require("axios");

const darkskyKey = "9f0ad163820506c645c847fac6a31fa6";

const getWeather = async ({ latitude, longitude }) => {
  try {
    const { data } = await axios.get(
      `https://api.darksky.net/forecast/${darkskyKey}/${latitude},${longitude}?units=si&lang=pt`
    );

    const weather = data.currently;

    if (!weather) {
      return { error: "Couldn't get the weather for this location" };
    }

    return weather;
  } catch (err) {
    return { error: "Unable to get weather" };
  }
};

module.exports = getWeather;
