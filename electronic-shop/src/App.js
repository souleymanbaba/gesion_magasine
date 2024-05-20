import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
// import Home from './components/Home';
import Products from './components/Products';
import Footer from './components/Footer';




function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      
        <Route path="/products" element={<Products />} />
   
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
