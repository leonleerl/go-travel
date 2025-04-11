import { GoogleMap, LoadScript, Autocomplete, Marker, InfoWindow } from '@react-google-maps/api';
import type { Libraries } from '@googlemaps/js-api-loader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';

// const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '10px',
  border: '1px solid #ccc',
};

const center = {
  lat: 35.1815,
  lng: 136.9066,
};

type MapProps = {
  apiKey: string;
};


function Map({ apiKey }: MapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<google.maps.LatLngLiteral | null>(null);


  const libraries = useRef<Libraries>(['places']);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const location = place.geometry.location;
        map?.panTo(location);
        map?.setZoom(14);
      }
    }
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setMarkers((current) => [...current, { lat: event.latLng!.lat(), lng: event.latLng!.lng() }]);
    }
  };

  const handleUndoMarker = () => {
    setMarkers((current) => current.slice(0, -1));
  };

  const handleClearMarkers = () => {
    setMarkers([]);
  };

  const handleMarkerInfo = () => {
    // alert current marker info
    alert(`Marker Info: ${selectedMarker?.lat}, ${selectedMarker?.lng}`);
    console.log(selectedMarker);
  };
  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries.current}>
      <div className='flex flex-col gap-2'>
        <div className="flex space-x-2">
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <Input
              type="text"
              placeholder="搜索地点..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </Autocomplete>
          <Button onClick={onPlaceChanged}>搜索</Button>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleUndoMarker}>撤回上一个Marker</Button>
          <Button onClick={handleClearMarkers}>清除所有Marker</Button>
        </div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onLoad={(map) => setMap(map)}
          onClick={handleMapClick}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker}
              onMouseOver={() => setSelectedMarker(marker)}
              onMouseOut={() => setSelectedMarker(null)}
            />
          ))}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <p>Marker Info</p>
                <Button onClick={handleMarkerInfo}>点击我</Button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default Map;