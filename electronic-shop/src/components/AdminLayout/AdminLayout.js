import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../pages/Admin/Navbar';
import Sidebar from '../pages/Admin/Sidebar';
import Dashboard from '../pages/Admin/Dashboard';

const AdminLayout = () => (
  <>
    <header>
      <Navbar />
    </header>
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px' }}>
        {/* <Dashboard /> */}
        <Outlet />
      </main>
    </div>
    <footer>
      {/* Admin Footer here if needed */}
    </footer>
  </>
);

export default AdminLayout;
