import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet/dist/leaflet.css?inline";
import { Navigation, MapPin, Package, TrendingUp } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const courierIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <circle cx="12" cy="12" r="10" fill="#10B981"/>
      <path d="M12 8v8m-4-4h8" stroke="white" stroke-width="2.5"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const destinationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#3B82F6"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const warehouseIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" fill="#F59E0B" stroke="white" stroke-width="2"/>
      <path d="M3 11l9-8 9 8" fill="#F59E0B" stroke="white" stroke-width="2"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const MapUpdater = ({ position, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (position && position.latitude && position.longitude) {
      console.log('🗺️ MapUpdater - Updating map center to:', {
        lat: position.latitude,
        lng: position.longitude,
        zoom: zoom || map.getZoom()
      });
      
      map.flyTo([position.latitude, position.longitude], zoom || map.getZoom(), {
        duration: 1.5,
        easeLinearity: 0.5
      });
    }
  }, [position?.latitude, position?.longitude, zoom, map]);
  
  return null;
};

const TurkeyMap = ({ currentLocation, destination, locationHistory = [], warehouseLocation }) => {
  const [distance, setDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const [mapKey, setMapKey] = useState(0); 


  useEffect(() => {
    if (currentLocation) {
      console.log('📍 TurkeyMap - New location received:', {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
        address: currentLocation.address,
        timestamp: currentLocation.timestamp
      });
    }
  }, [currentLocation]);

  useEffect(() => {
    if (currentLocation && destination) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        destination.latitude,
        destination.longitude
      );
      setDistance(dist);
      const timeInHours = dist / 60;
      setEstimatedTime(timeInHours);
    }
  }, [currentLocation, destination]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => (value * Math.PI) / 180;

  const formatTime = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} dakika`;
    }
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h} saat ${m} dakika`;
  };

  const defaultCenter = { latitude: 39.9334, longitude: 32.8597 };
  const initialCenter = defaultCenter;
  const center = initialCenter;
  
  const routePositions = [];
  
  if (warehouseLocation) {
    routePositions.push([warehouseLocation.latitude, warehouseLocation.longitude]);
  }
  
  if (showHistory && locationHistory && locationHistory.length > 0) {
    const sortedHistory = [...locationHistory].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    sortedHistory.forEach(loc => {
      routePositions.push([loc.latitude, loc.longitude]);
    });
  }
  
  if (currentLocation) {
    routePositions.push([currentLocation.latitude, currentLocation.longitude]);
  }
  
  if (destination) {
    routePositions.push([destination.latitude, destination.longitude]);
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg p-4 max-w-sm">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Navigation className="h-5 w-5 text-green-600 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Kargo Konumu</p>
              <p className="font-semibold text-gray-900">Canlı Takip</p>
            </div>
          </div>

          {currentLocation?.address && (
            <div className="border-t pt-3">
              <p className="text-xs text-gray-600 mb-1">Mevcut Konum</p>
              <p className="text-sm font-medium text-gray-900">{currentLocation.address}</p>
              {currentLocation.description && (
                <p className="text-xs text-gray-500 mt-1">{currentLocation.description}</p>
              )}
            </div>
          )}

          {distance && (
            <div className="border-t pt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-600">Kalan Mesafe</p>
                  <p className="text-lg font-bold text-blue-600">{distance.toFixed(1)} km</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tahmini Süre</p>
                  <p className="text-lg font-bold text-orange-600">{formatTime(estimatedTime)}</p>
                </div>
              </div>
            </div>
          )}

          {locationHistory && locationHistory.length > 0 && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-gray-700">
                    {locationHistory.length} Konum Kaydı
                  </span>
                </div>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showHistory ? 'Gizle' : 'Göster'}
                </button>
              </div>
              
              {locationHistory.length > 0 && locationHistory[0].timestamp && (
                <p className="text-xs text-gray-500">
                  Son güncelleme: {new Date(locationHistory[0].timestamp).toLocaleTimeString('tr-TR')}
                </p>
              )}
            </div>
          )}

          {currentLocation?.timestamp && (
            <div className="border-t pt-3">
              <p className="text-xs text-gray-500">
                Güncelleme: {new Date(currentLocation.timestamp).toLocaleString('tr-TR')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-xl shadow-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm">Gösterge</h4>
        <div className="space-y-2">
          {warehouseLocation && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-700">Depo/Başlangıç</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-gray-700">Kargo Konumu</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm text-gray-700">Teslimat Adresi</span>
          </div>
          {showHistory && locationHistory.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-purple-400 rounded-full opacity-50"></div>
              <span className="text-sm text-gray-700">Geçmiş Rotalar</span>
            </div>
          )}
        </div>
      </div>

      <MapContainer
        key={mapKey}
        center={[center.latitude, center.longitude]}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔥 Otomatik harita güncelleme */}
        <MapUpdater position={currentLocation} zoom={5} />

        {warehouseLocation && (
          <Marker position={[warehouseLocation.latitude, warehouseLocation.longitude]} icon={warehouseIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-orange-700 mb-2 flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  Depo/Başlangıç
                </h3>
                {warehouseLocation.address && (
                  <p className="text-sm text-gray-700">{warehouseLocation.address}</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {showHistory && locationHistory && locationHistory.map((loc, index) => (
          <Circle
            key={`history-${index}-${loc.timestamp}`}
            center={[loc.latitude, loc.longitude]}
            radius={200}
            pathOptions={{
              color: '#9333EA',
              fillColor: '#C084FC',
              fillOpacity: 0.3,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-purple-700 mb-2">
                  Konum #{locationHistory.length - index}
                </h3>
                {loc.address && <p className="text-sm text-gray-700 mb-1">{loc.address}</p>}
                {loc.description && <p className="text-xs text-gray-600 mb-2">{loc.description}</p>}
                <p className="text-xs text-gray-500">{new Date(loc.timestamp).toLocaleString('tr-TR')}</p>
                {loc.distanceFromPrevious && (
                  <p className="text-xs text-gray-600 mt-1">
                    Önceki konumdan: {loc.distanceFromPrevious.toFixed(2)} km
                  </p>
                )}
                {loc.estimatedMinutesToArrival && (
                  <p className="text-xs text-green-600 mt-1">
                    Tahmini varış: {loc.estimatedMinutesToArrival} dakika
                  </p>
                )}
              </div>
            </Popup>
          </Circle>
        ))}

        {currentLocation && (
          <Marker 
            position={[currentLocation.latitude, currentLocation.longitude]} 
            icon={courierIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-green-700 mb-2 flex items-center">
                  <Navigation className="h-4 w-4 mr-1" />
                  Kargo Konumu
                </h3>
                {currentLocation.address && <p className="text-sm text-gray-700 mb-2">{currentLocation.address}</p>}
                {currentLocation.description && <p className="text-xs text-gray-600 mb-2">{currentLocation.description}</p>}
                <p className="text-xs text-gray-500">
                  {currentLocation.timestamp ? new Date(currentLocation.timestamp).toLocaleString('tr-TR') : 'Canlı'}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={[destination.latitude, destination.longitude]} icon={destinationIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Teslimat Adresi
                </h3>
                {destination.address && <p className="text-sm text-gray-700">{destination.address}</p>}
              </div>
            </Popup>
          </Marker>
        )}

        {routePositions.length > 1 && (
          <Polyline positions={routePositions} color="#3B82F6" weight={3} opacity={0.7} dashArray="10, 10" />
        )}
      </MapContainer>
    </div>
  );
};

export default TurkeyMap;