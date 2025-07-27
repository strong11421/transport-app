// AddTransportForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Form, Input, InputNumber, Button, message, Row, Col, DatePicker, Modal,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': 'transport-app' } });
    const data = await res.json();
    if (data?.address) {
      const { village, town, city, county, state } = data.address;
      return [village, town, city, county, state].filter(Boolean).join(', ');
    } else {
      return 'Unknown Location';
    }
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return 'Location fetch failed';
  }
};

const getDistance = async (start: L.LatLngLiteral, end: L.LatLngLiteral) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`;
  const res = await fetch(url);
  const data = await res.json();
  const meters = data?.routes?.[0]?.distance;
  return meters ? Math.round(meters / 1000) : 0;
};

const LocationPicker = ({ onSelect }: { onSelect: (latlng: L.LatLngLiteral) => void }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

const SearchControl = ({ onSelect }: { onSelect: (latlng: L.LatLngLiteral) => void }) => {
  const map = useMap();
  const controlRef = useRef<L.Control>();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: false,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: 'Enter location...',
    });

    controlRef.current = searchControl;
    map.addControl(searchControl);

    map.on('geosearch/showlocation', (e: any) => {
      const latlng = e.location?.latLng || { lat: e.location.y, lng: e.location.x };
      onSelect(latlng);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onSelect]);

  return null;
};

const AddTransportForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectingField, setSelectingField] = useState<'starting_point' | 'destination_point' | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<L.LatLngLiteral | null>(null);
  const [startCoords, setStartCoords] = useState<L.LatLngLiteral | null>(null);
  const [endCoords, setEndCoords] = useState<L.LatLngLiteral | null>(null);

  const openMapModal = (field: 'starting_point' | 'destination_point') => {
    setSelectingField(field);
    setModalVisible(true);
  };

  const handleMapClick = async (latlng: L.LatLngLiteral) => {
    setSelectedPosition(latlng);
    const address = await reverseGeocode(latlng.lat, latlng.lng);
    form.setFieldValue(selectingField!, address);

    if (selectingField === 'starting_point') setStartCoords(latlng);
    if (selectingField === 'destination_point') setEndCoords(latlng);

    setModalVisible(false);
    setSelectedPosition(null);
  };

  useEffect(() => {
    if (startCoords && endCoords) {
      getDistance(startCoords, endCoords).then((km) => {
        form.setFieldValue('distance_km', km);
      });
    }
  }, [startCoords, endCoords]);

  const onFinish = async (values: any) => {
    try {
      const res = await fetch('https://transport-app-zy0l.onrender.com/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        message.success('Transport record added successfully!');
        form.resetFields();
        setTimeout(() => {
          navigate('/view');
        }, 1000);
      } else {
        message.error(data.error || 'Failed to add record');
      }
    } catch (err) {
      console.error(err);
      message.error('Server error');
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto bg-white p-8 shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Transport Record</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="date_of_transport" label="Date of Transport" rules={[{ required: true }]}>
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="vehicle_no" label="Vehicle No" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="dc_gp_no" label="DC/GP No">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="starting_point" label="Starting Point" rules={[{ required: true }]}>
              <Input readOnly onClick={() => openMapModal('starting_point')} placeholder="Click to select from map" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="destination_point" label="Destination Point" rules={[{ required: true }]}>
              <Input readOnly onClick={() => openMapModal('destination_point')} placeholder="Click to select from map" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="quantity_qtls" label="Quantity (Qtls)" rules={[{ required: true }]}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="no_of_bags" label="No of Bags" rules={[{ required: true }]}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="distance_km" label="Distance (KM)" rules={[{ required: true }]}>
              <InputNumber className="w-full" readOnly />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="rate_per_km" label="Rate per KM" rules={[{ required: true }]}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
              <InputNumber className="w-full" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="outward_lf_no" label="Outward LF No">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit">Add</Button>
        </Form.Item>
      </Form>

      <Modal
        open={modalVisible}
        title={`Select ${selectingField === 'starting_point' ? 'Starting' : 'Destination'} Point`}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: '400px', width: '100%' }}
          whenReady={({ target }) => setTimeout(() => target.invalidateSize(), 100)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {selectedPosition && <Marker position={selectedPosition} icon={markerIcon} />}
          <LocationPicker onSelect={handleMapClick} />
          <SearchControl onSelect={handleMapClick} />
        </MapContainer>
      </Modal>
    </div>
  );
};

export default AddTransportForm;
