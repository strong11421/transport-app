import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import { Input, Button, Modal, Form, Select } from 'antd';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import L from 'leaflet';

const { Option } = Select;

const AddTransportForm: React.FC = () => {
  const [form] = Form.useForm();
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [endModalVisible, setEndModalVisible] = useState(false);
  const [startPoint, setStartPoint] = useState<L.LatLng | null>(null);
  const [endPoint, setEndPoint] = useState<L.LatLng | null>(null);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const controlRef = useRef<L.Control | null>(null);

  const startMapRef = useRef<L.Map | null>(null);
  const endMapRef = useRef<L.Map | null>(null);

  const provider = new OpenStreetMapProvider();

  // @ts-ignore - GeoSearchControl has no types
  const searchControl: any = new GeoSearchControl({
    provider,
    style: 'bar',
    autoClose: true,
    autoComplete: true,
    searchLabel: 'Enter location...',
    keepResult: true,
  });

  const LocationSelector = ({
    setPoint,
    setAddress,
    onClose,
  }: {
    setPoint: (point: L.LatLng) => void;
    setAddress: (addr: string) => void;
    onClose: () => void;
  }) => {
    const map = useMap();

    useEffect(() => {
      map.addControl(searchControl);
      controlRef.current = searchControl;

      map.on('geosearch/showlocation', (result: any) => {
        const { x, y, label } = result.location;
        const latlng = L.latLng(y, x);
        setPoint(latlng);
        setAddress(label);
        onClose();
      });

      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  };
  useEffect(() => {
  if (endModalVisible && endMapRef.current) {
    setTimeout(() => {
      endMapRef.current?.invalidateSize();
    }, 100);
  }
}, [endModalVisible]);


  const handleSubmit = (values: any) => {
    console.log('Form submitted:', {
      ...values,
      startPoint,
      endPoint,
      startAddress,
      endAddress,
    });
  };

  // Invalidate size when modals open
  useEffect(() => {
    if (startModalVisible && startMapRef.current) {
      setTimeout(() => startMapRef.current?.invalidateSize(), 100);
    }
  }, [startModalVisible]);

  useEffect(() => {
    if (endModalVisible && endMapRef.current) {
      setTimeout(() => endMapRef.current?.invalidateSize(), 100);
    }
  }, [endModalVisible]);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-bold">Add Transport Record</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Vehicle Number" name="vehicleNumber" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Start Location">
          <Input
            readOnly
            value={startAddress}
            placeholder="Click to select on map"
            onClick={() => setStartModalVisible(true)}
          />
        </Form.Item>

        <Form.Item label="End Location">
          <Input
            readOnly
            value={endAddress}
            placeholder="Click to select on map"
            onClick={() => setEndModalVisible(true)}
          />
        </Form.Item>

        <Form.Item label="Driver Name" name="driverName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Mode of Transport" name="mode" rules={[{ required: true }]}>
          <Select placeholder="Select mode">
            <Option value="truck">Truck</Option>
            <Option value="van">Van</Option>
            <Option value="bike">Bike</Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>

      {/* Start Location Modal */}
      <Modal
        open={startModalVisible}
        onCancel={() => setStartModalVisible(false)}
        footer={null}
        width={800}
      >
       <MapContainer
  center={[20.5937, 78.9629]}
  zoom={5}
  style={{ height: '500px', width: '100%' }}
  ref={endMapRef}
>

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationSelector
            setPoint={setStartPoint}
            setAddress={setStartAddress}
            onClose={() => setStartModalVisible(false)}
          />
          {startPoint && <Marker position={startPoint}><Popup>Start Location</Popup></Marker>}
        </MapContainer>
      </Modal>

      {/* End Location Modal */}
      <Modal
        open={endModalVisible}
        onCancel={() => setEndModalVisible(false)}
        footer={null}
        width={800}
      >
        <MapContainer
  center={[20.5937, 78.9629]}
  zoom={5}
  style={{ height: '500px', width: '100%' }}
  ref={endMapRef}
>

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationSelector
            setPoint={setEndPoint}
            setAddress={setEndAddress}
            onClose={() => setEndModalVisible(false)}
          />
          {endPoint && <Marker position={endPoint}><Popup>End Location</Popup></Marker>}
        </MapContainer>
      </Modal>
    </div>
  );
};

export default AddTransportForm;
