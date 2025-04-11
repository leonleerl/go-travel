// components/Map.tsx
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '10px',
};

const center = {
  lat: 35.1815,
  lng: 136.9066, // 巴黎
};

type MapProps = {
  apiKey: string;
};

function Map({ apiKey }: MapProps) {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      />
    </LoadScript>
  );
}

export default Map;