import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message, Row, Col, DatePicker, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

  const openMapModal = (field: 'starting_point' | 'destination_point') => {
    setSelectingField(field);
    setModalVisible(true);
  };

  const handleMapClick = (latlng: L.LatLngLiteral) => {
    setSelectedPosition(latlng);
    form.setFieldValue(selectingField!, `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`);
    setModalVisible(false);
    setSelectedPosition(null);
  };

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
            <Form.Item
              name="starting_point"
              label="Starting Point"
              rules={[{ required: true }]}
            >
              <Input
                readOnly
                onClick={() => openMapModal('starting_point')}
                placeholder="Click to select from map"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="destination_point"
              label="Destination Point"
              rules={[{ required: true }]}
            >
              <Input
                readOnly
                onClick={() => openMapModal('destination_point')}
                placeholder="Click to select from map"
              />
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
              <InputNumber className="w-full" />
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
          <Button type="primary" htmlType="submit">
            Add
          </Button>
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
