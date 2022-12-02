import logo from './logo.svg';
import './App.css';
import Customer from './components/cusomer';
import Category from './components/category';
import Product from './components/product';
import React from 'react';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customer" element={<Customer />} />
        <Route path="/category" element={<Category />} />
        <Route path="/product" element={<Product />} />
      </Routes>
    </Router>


  );
}

export default App;
