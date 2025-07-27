import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import AddTransportForm from './pages/AddTransportForm';
import TransportList from './pages/TransportList';
import EditTransportForm from './pages/EditTransportForm'; // ✅ Added
import Navbar from './components/Navbar';
import './App.css';
import 'leaflet/dist/leaflet.css';


const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ padding: 0 }}>
          <Navbar />
        </Header>
        <Content
          style={{
            padding: '24px',
            background: '#f0f2f5',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 8,
              minHeight: 'calc(100vh - 64px - 48px)', // header and padding
            }}
          >
            <Routes>
              <Route path="/add" element={<AddTransportForm />} />
              <Route path="/view" element={<TransportList />} />
              <Route path="/edit/:id" element={<EditTransportForm />} /> {/* ✅ Added */}
              <Route path="*" element={<Navigate to="/view" />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
