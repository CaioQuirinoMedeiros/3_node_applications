const axios = require("axios");

const mapboxKey =
  "pk.eyJ1IjoiY2Fpb3F1aXJpbm8iLCJhIjoiY2p3MGk0MW1wMGJlMTQ0cndpZ2lpdTA2byJ9.vUbijPxSSgpH2WeBZFG7Hg";

const getLocation = async query => {
  try {
    const { data } = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query
      )}.json?access_token=${mapboxKey}&limit=1`
    );

    const feature = data.features[0];

    if (!feature) {
      return { error: "No place found" };
    }

    return {
      location: feature.place_name,
      latitude: feature.center[1],
      longitude: feature.center[0]
    };
  } catch (err) {
    return { error: "Unable to search place" };
  }
};

module.exports = getLocation;
