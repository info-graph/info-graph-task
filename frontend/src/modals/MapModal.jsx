import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from '../components/ui/Button';

const MapModal = ({ isOpen, onClose, onSelectLocation, initialLocation }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || { lat: 40.7128, lng: -74.006 }); // Default to NYC
  const mapRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !window.google || map) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: selectedLocation,
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    const newMarker = new window.google.maps.Marker({
      position: selectedLocation,
      map: newMap,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    newMap.addListener('click', (event) => {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      
      newMarker.setPosition(clickedLocation);
      setSelectedLocation(clickedLocation);
    });

    newMarker.addListener('dragend', () => {
      const newLocation = {
        lat: newMarker.getPosition().lat(),
        lng: newMarker.getPosition().lng(),
      };
      setSelectedLocation(newLocation);
    });

    setMap(newMap);
    setMarker(newMarker);

    return () => {
      if (map) {
        // Clean up event listeners if needed
      }
    };
  }, [isOpen, map, selectedLocation.lat, selectedLocation.lng]);

  useEffect(() => {
    if (marker && initialLocation) {
      marker.setPosition(initialLocation);
      setSelectedLocation(initialLocation);
      if (map) {
        map.panTo(initialLocation);
      }
    }
  }, [initialLocation, marker, map]);

  const handleConfirm = () => {
    onSelectLocation(selectedLocation);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Select Restaurant Location</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Click on the map to select the location or drag the marker to adjust.
            </p>
          </div>
          
          <div ref={mapRef} className="w-full h-96 bg-gray-100 rounded-md"></div>
          
          <div className="mt-3 bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-700">Selected Coordinates:</p>
            <p className="text-sm text-gray-600">
              Latitude: {selectedLocation.lat.toFixed(6)}, 
              Longitude: {selectedLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;