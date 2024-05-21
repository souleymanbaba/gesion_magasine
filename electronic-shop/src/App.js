import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserLayout from './components/UserLayout/UserLayout';
import AdminLayout from './components/AdminLayout/AdminLayout';
import Products from './components/Products';
import SigIn from './components/pages/Account/SigIn';
import SignUp from './components/pages/Account/SignUp';
import Dashboard from './components/pages/Admin/Dashboard';
import StatCard from './components/pages/Admin/StatCard';
import ProductsA from './components/pages/Admin/ProductsA';
import UpdateProduct from './components/pages/Admin/Updateproducts'; 
import Addproduct from './components/pages/Admin/Addproducts' ;
import Orders from './components/pages/Admin/Orders';
import Categorie from './components/pages/Admin/Categorie';
import ProductList from './Cart';

import Orderss from "./test";


function App() {
  return (
    <Router>
      <Routes>
        {/* Routes for the user layout */}
        <Route path="/" element={<UserLayout />}>
          <Route path="SigIn" element={<SigIn />} />
          <Route path="SignUp" element={<SignUp />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<ProductList />} /> 
      <Route path="/test" element={<Orderss />}></Route> 
        </Route>
        
        {/* Routes for the admin layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="StatCard" element={<StatCard />} />
          <Route path="ProductsA" element={<ProductsA />} />
          <Route path="products/:productId/edit" element={<UpdateProduct />} />
          <Route path="/admin/products/new" element={<Addproduct />} /> 
          <Route path="/admin/orders" element={<Orders  />} /> 
          

          <Route path="/admin/Categorie" element={<Categorie />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
