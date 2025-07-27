import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { useNavigate } from 'react-router-dom';


interface TransportRecord {
  id: number;
  date_of_transport: string;
  vehicle_no: string;
  dc_gp_no: string;
  starting_point: string;
  destination_point: string;
  quantity_qtls: number;
  no_of_bags: number;
  distance_km: number;
  rate_per_km: number;
  amount: number;
  outward_lf_no: string;
}

const TransportList: React.FC = () => {
  const [records, setRecords] = useState<TransportRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await fetch('https://transport-app-zy0l.onrender.com/transport');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error('Error fetching transport records:', err);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();


  const deleteRecord = async (id: number) => {
    try {
      const res = await fetch(`https://transport-app-zy0l.onrender.com/transport/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setRecords(records.filter((rec) => rec.id !== id));
        message.success('Record deleted');
      } else {
        const error = await res.json();
        message.error(error.message || 'Failed to delete record');
      }
    } catch (err) {
      console.error('Delete error:', err);
      message.error('Delete failed.');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Date', dataIndex: 'date_of_transport', key: 'date' },
    { title: 'Vehicle No', dataIndex: 'vehicle_no', key: 'vehicle_no' },
    { title: 'DC GP No', dataIndex: 'dc_gp_no', key: 'dc_gp_no' },
    { title: 'From', dataIndex: 'starting_point', key: 'starting_point' },
    { title: 'To', dataIndex: 'destination_point', key: 'destination_point' },
    { title: 'Qty (Qtls)', dataIndex: 'quantity_qtls', key: 'quantity_qtls' },
    { title: 'No of Bags', dataIndex: 'no_of_bags', key: 'no_of_bags' },
    { title: 'Distance (KM)', dataIndex: 'distance_km', key: 'distance_km' },
    { title: 'Rate/KM', dataIndex: 'rate_per_km', key: 'rate_per_km' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Outward LF No', dataIndex: 'outward_lf_no', key: 'outward_lf_no' },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: TransportRecord) => (
        <div className="flex gap-2">
<Button type="link" onClick={() => navigate(`/edit/${record.id}`)}>Edit</Button>
          <Popconfirm
            title="Delete this record?"
            onConfirm={() => deleteRecord(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transport Records</h1>
      <Table
        dataSource={records}
        columns={columns}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        bordered
      />
    </div>
  );
};

export default TransportList;
