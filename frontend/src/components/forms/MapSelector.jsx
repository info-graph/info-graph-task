import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { createPortal } from 'react-dom';

const MapSelector = ({ initialLatitude, initialLongitude, onSave, onCancel, embedded = false }) => {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: initialLatitude ? parseFloat(initialLatitude) : 40.7128,
    lng: initialLongitude ? parseFloat(initialLongitude) : -74.0060
  });
  const [address, setAddress] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    window.initGoogleMaps = () => {
      setMapLoaded(true);
    };
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAaoiY5l7RFMEqxd1o6ItzC4lPmy03trqk&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      document.head.appendChild(script);
    }

    return () => {
      delete window.initGoogleMaps;
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    setIsLoading(true);

    const mapOptions = {
      center: {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      },
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
    markerRef.current = new window.google.maps.Marker({
      position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
      map: mapInstanceRef.current,
      draggable: !embedded,
      animation: window.google.maps.Animation.DROP
    });

    geocoderRef.current = new window.google.maps.Geocoder();

    updateAddress(selectedLocation.lat, selectedLocation.lng);
    
    if (!embedded) {
      mapInstanceRef.current.addListener('click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        markerRef.current.setPosition(event.latLng);
        setSelectedLocation({ lat, lng });
        updateAddress(lat, lng);
      });

      markerRef.current.addListener('dragend', () => {
        const position = markerRef.current.getPosition();
        const lat = position.lat();
        const lng = position.lng();
        setSelectedLocation({ lat, lng });
        updateAddress(lat, lng);
      });
    }

    mapInstanceRef.current.addListener('tilesloaded', () => {
      setIsLoading(false);
    });

    window.setTimeout(() => {
      window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
      mapInstanceRef.current.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    }, 100);
  }, [mapLoaded, embedded]);

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !markerRef.current) return;

    if (initialLatitude && initialLongitude) {
      const latNum = parseFloat(initialLatitude);
      const lngNum = parseFloat(initialLongitude);

      if (!isNaN(latNum) && !isNaN(lngNum)) {
        const newPos = { lat: latNum, lng: lngNum };
        markerRef.current.setPosition(newPos);
        mapInstanceRef.current.setCenter(newPos);
        setSelectedLocation(newPos);
        updateAddress(latNum, lngNum);
      }
    }
  }, [initialLatitude, initialLongitude, mapLoaded]);

  const updateAddress = (lat, lng) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address);

          if (embedded && onSave) {
            onSave({
              latitude: lat,
              longitude: lng,
              address: results[0].formatted_address
            });
          }
        } else {
          setAddress('Address not found');
        }
      }
    );
  };

  const handleAddressSearch = (e) => {
    e.preventDefault();

    if (!geocoderRef.current || !address.trim()) return;
    
    setIsLoading(true);

    geocoderRef.current.geocode(
      { address },
      (results, status) => {
        setIsLoading(false);
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();

          markerRef.current.setPosition({ lat, lng });
          mapInstanceRef.current.setCenter({ lat, lng });

          setSelectedLocation({ lat, lng });
          setAddress(results[0].formatted_address);

          if (embedded && onSave) {
            onSave({
              latitude: lat,
              longitude: lng,
              address: results[0].formatted_address
            });
          }
        } else {
          alert('Location not found. Please try a different address.');
        }
      }
    );
  };

  const handleSave = () => {
    onSave({
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      address
    });
  };

  const renderLoadingIndicator = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-teal-500 rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-700 font-medium">Loading map...</p>
      </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="w-full h-full flex flex-col z-50">
        <div className="p-2 border-b">
          <form onSubmit={handleAddressSearch} className="flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Search for an address"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>Search</Button>
          </form>
        </div>

        <div className="flex-1 relative">
          {(!mapLoaded || isLoading) && renderLoadingIndicator()}
          <div
            ref={mapRef}
            className="w-full h-full"
          ></div>
        </div>
      </div>
    );
  }

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-[9999]"></div>
      <div className="fixed inset-0 flex z-[10000] items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl flex flex-col max-h-[90vh] z-50">
          <div className="p-4 border-b flex justify-between items-center z-50">
            <h2 className="text-xl font-semibold text-gray-800">Select Restaurant Location</h2>
            <button
              onClick={onCancel}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 p-4 relative">
            <div
              ref={mapRef}
              className="w-full h-[400px] rounded border border-gray-300"
            ></div>
            {(!mapLoaded || isLoading) && renderLoadingIndicator()}

            <div className="mt-4">
              <form onSubmit={handleAddressSearch} className="flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Search for an address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>Search</Button>
              </form>
            </div>
          </div>

          <div className="p-4 border-t flex justify-between">
            <div className="text-sm text-gray-600">
              <p>Selected coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
              <p>Address: {address || 'Loading address...'}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onCancel} disabled={isLoading}>Cancel</Button>
              <Button variant="primary" onClick={handleSave} disabled={isLoading}>Confirm Location</Button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default MapSelector;