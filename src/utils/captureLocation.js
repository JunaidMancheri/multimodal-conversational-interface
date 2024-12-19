import axios from "axios";

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      err => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: import.meta.env.VITE_MAPS_API,
        },
      }
    );

    const addressComponents = response.data.results[0]?.address_components;
    const geometryLocation = response.data.results[0]?.geometry?.location;
    const formattedAddress = response.data.results[0]?.formatted_address;

    if (!addressComponents) {
      throw new Error('Could not retrieve address components');
    }

    const cityComponent = addressComponents.find(
      component =>
        component.types.includes('locality') ||
        component.types.includes('administrative_area_level_1')
    );
    const countryComponent = addressComponents.find(component =>
      component.types.includes('country')
    );

    return {
      latitude: geometryLocation?.lat || latitude,
      longitude: geometryLocation?.lng || longitude,
      city: cityComponent?.long_name || 'Unknown',
      country: countryComponent?.long_name || 'Unknown',
      fullAddress: formattedAddress || 'Unknown',
    };
  } catch (err) {
    console.error('Geocoding error:', err);
  }
};

const captureLocation = async () => {
  try {
    const { latitude, longitude } = await getUserLocation();
    return await reverseGeocode(latitude, longitude);
  } catch (err) {
    console.error('Location capture error:', err);
  }
};

export default captureLocation;
