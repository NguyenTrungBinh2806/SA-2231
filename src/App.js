import logo from './logo.svg';
import './App.css';
import Customer from './components/cusomer';
import Category from './components/category';
import Product from './components/product';
import Order from './components/order';
import Dashboard from './components/dashboard';
import Login from './components/login';
import React from 'react';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import {isLogin} from './shared/auth';
function App() {

  // const [isLogin, setIsLogin] = React.useState(false);
  // const checkLogin = () => {
  //   const token = localStorage.getItem("token-sa");
  //   console.log(token);
  //   // if token is not null then set isLogin to true
  //   if (token !== null) {
  //     setIsLogin(true);
  //   }
  //   else {
  //     setIsLogin(false);
  //   }

  // }

  // React.useEffect(() => {
  //   checkLogin();
  // }, [])
  return (
    <Router>
      {/* <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/category" element={<Category />} />
        <Route path="/product" element={<Product />} />
        <Route path="/order" element={<Order />} />
      </Routes> */}
        <Routes>
          {isLogin() && <Route path="*" element={<Dashboard />} /> }
          {isLogin() && <Route path="/" element={<Dashboard />} />}
          {isLogin() && <Route path="/dashboard" element={<Dashboard />} />}
          {isLogin() && <Route path="/customer" element={<Customer />} /> }
          {isLogin() && <Route path="/category" element={<Category />} /> }
          {isLogin() && <Route path="/product" element={<Product />} /> }
          {isLogin() && <Route path="/order" element={<Order />} /> }
          {<Route path="/login" element={<Login />} /> }
          {<Route path="*" element={<Login />} />}
        </Routes>
        {/* {
          isLogin ? (
            <Routes>
              <Route path="*" element={<Dashboard />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/category" element={<Category />} />
              <Route path="/product" element={<Product />} />
              <Route path="/order" element={<Order />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Login />} />
            </Routes>
          )
        } */}
      
      
    </Router>


  );
}

export default App;
