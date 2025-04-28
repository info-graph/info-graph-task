import { useState, useEffect, useRef } from 'react';

const ReadOnlyMap = ({ latitude, longitude, address }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    window.initGoogleMaps = () => {
      setMapLoaded(true);
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD8v_icWY7mA-aHuh14eS8J8vgIHCvqK_8&libraries=places&callback=initGoogleMaps`;
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
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) return;

    const mapOptions = {
      center: { lat, lng },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      scrollwheel: false,
      draggable: true,
      styles: [
        {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#c19677"}]
        },
        {
          "featureType": "poi",
          "elementType": "labels.icon",
          "stylers": [{"color": "#6abb3e"}]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#e5f0f9"}]
        }
      ]
    };

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
    
    markerRef.current = new window.google.maps.Marker({
      position: { lat, lng },
      map: mapInstanceRef.current,
      draggable: false,
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: 'rgb(193, 150, 119)',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2,
        scale: 8
      }
    });

    if (address) {
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-family: 'Montserrat', sans-serif; padding: 5px;"><strong style="color: rgb(193, 150, 119);">${address}</strong></div>`
      });

      markerRef.current.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, markerRef.current);
      });
      
      infoWindow.open(mapInstanceRef.current, markerRef.current);
    }

    window.setTimeout(() => {
      window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
    }, 100);
  }, [mapLoaded, latitude, longitude, address]);

  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !markerRef.current) return;
    
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng)) return;
    
    markerRef.current.setPosition({ lat, lng });
    mapInstanceRef.current.setCenter({ lat, lng });
  }, [latitude, longitude, mapLoaded]);

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
      {(!mapLoaded || !latitude || !longitude) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded animate-pulse">
          <p className="text-primary">
            {!latitude || !longitude 
              ? 'No location data available' 
              : 'Loading map...'}
          </p>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded transition-all duration-500"
        style={{ display: (mapLoaded && latitude && longitude) ? 'block' : 'none' }}
      ></div>
    </div>
  );
};

export default ReadOnlyMap;