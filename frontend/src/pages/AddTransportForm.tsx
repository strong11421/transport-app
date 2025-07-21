import React from 'react';
import { Form, Input, InputNumber, Button, message, Row, Col, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';

const AddTransportForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate(); // ← hook to navigate

  const onFinish = async (values: any) => {
    try {
      const res = await fetch('http://localhost:5000/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const data = await res.json();

      if (res.ok) {
        message.success('Transport record added successfully!');
        form.resetFields();

        // Redirect to view page after 1 second
        setTimeout(() => {
          navigate('/view'); // 🔁 Replace `/view` with your actual route
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
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
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
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTransportForm;
