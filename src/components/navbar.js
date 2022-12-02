import React from 'react';
// import menu icon
import {Avatar, MenuIcon} from 'evergreen-ui';
import './navbar.css';
const Navbar = () => {
    return (
        <div className="navbar">
            <a href="#" className='item-navbar'>Dashboard</a>
            <a href="/customer" className='item-navbar'>Customer</a>
            <a href="/category" className='item-navbar'>Category</a>
            <a href="/product" className='item-navbar'>Product</a>
            <a href="#" className='item-navbar'>Order</a>
            <div className="infor-user">
                <Avatar name="Nguyen Van A" size={40} />
                <div className="infor-user-name">Nguyen Van A</div>
            </div>
        </div>
    );
}

export default Navbar;
