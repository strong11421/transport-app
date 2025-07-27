import React, { useState, useEffect } from 'react';
import {
  Form, Input, InputNumber, Button, message, Row, Col, DatePicker, Modal,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MAPMYINDIA_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjMzZGU1YzgyYjZiMzRhMDZhMzNmYWQzYmNlZjhiZWNjIiwiaCI6Im11cm11cjY0In0=';

const reverseGeocode = async (lat: number, lng: number) => {
  const url = `https://apis.mapmyindia.com/advancedmaps/v1/${MAPMYINDIA_API_KEY}/rev_geocode?lat=${lat}&lng=${lng}`;
  const response = await fetch(url);
  const data = await response.json();
  return data?.results?.[0]?.formatted_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};

const getDistance = async (start: L.LatLngLiteral, end: L.LatLngLiteral) => {
  const url = `https://apis.mapmyindia.com/advancedmaps/v1/${MAPMYINDIA_API_KEY}/route_adv/driving/${start.lng},${start.lat};${end.lng},${end.lat}`;
  const response = await fetch(url);
  const data = await response.json();
  const distanceKm = data?.routes?.[0]?.summary?.distance / 1000;
  return Math.round(distanceKm);
};

const LocationPicker = ({ onSelect }: { onSelect: (latlng: L.LatLngLiteral) => void }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
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

      {/* Map Modal */}
      <Modal
        open={modalVisible}
        title={`Select ${selectingField === 'starting_point' ? 'Starting' : 'Destination'} Point`}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {selectedPosition && <Marker position={selectedPosition} icon={markerIcon} />}
          <LocationPicker onSelect={handleMapClick} />
        </MapContainer>
      </Modal>
    </div>
  );
};

export default AddTransportForm;
