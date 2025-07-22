// components/MapModal.tsx
import React, { useState } from 'react';
import { Modal } from 'antd';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

// Fix for missing marker icons in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (latlng: { lat: number; lng: number }) => void;
}

const MapModal: React.FC<MapModalProps> = ({ visible, onClose, onSelect }) => {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setMarker(e.latlng);
        onSelect(e.latlng); // send back to parent
        onClose(); // close modal
      },
    });
    return marker ? <Marker position={marker} /> : null;
  };

  return (
    <Modal open={visible} onCancel={onClose} footer={null} title="Select a Location" width={700}>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: 400, width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <LocationMarker />
      </MapContainer>
    </Modal>
  );
};

export default MapModal;
