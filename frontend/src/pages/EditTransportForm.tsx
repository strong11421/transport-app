import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, DatePicker, message, Row, Col } from 'antd';
import dayjs from 'dayjs';

const EditTransportForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch(`https://transport-app-zy0l.onrender.com/transport/${id}`);
        const data = await res.json();
        form.setFieldsValue({
          ...data,
          date_of_transport: dayjs(data.date_of_transport),
        });
      } catch (err) {
        console.error(err);
        message.error('Failed to load record');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, form]);

  const onFinish = async (values: any) => {
    try {
      const res = await fetch(`https://transport-app-zy0l.onrender.com/transport/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          date_of_transport: values.date_of_transport.format('YYYY-MM-DD'),
        }),
      });

      if (res.ok) {
        message.success('Record updated!');
        navigate('/view');
      } else {
        const data = await res.json();
        message.error(data.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      message.error('Server error');
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto bg-white p-8 shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Transport Record</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="date_of_transport" label="Date of Transport" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
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
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="destination_point" label="Destination Point" rules={[{ required: true }]}>
              <Input />
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
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditTransportForm;
