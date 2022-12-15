import React from 'react';
// import menu icon
import {Avatar, MenuIcon, Popover, Menu, LogOutIcon, toaster} from 'evergreen-ui';
import './navbar.css';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { isLogin, logout } from '../shared/auth';
const Navbar = () => {
    const [userName, setUserName] = React.useState("");
    // get user Data from firebase
    const getInformationUser = async () => {
        // get NAME of user email
        // get token from localStorage
        const token = localStorage.getItem("token-sa");
        // get user data from firebase
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // get NAME of user email
                const name = user.email.split("@")[0];
                setUserName(name);
                console.log(name);
            } else {
                // User is signed out
                // ...
            }
        });

    };

    // const logout = () => {
    //     const auth = getAuth();
    //     // sign out and set islogin of App.js to false
    //     signOut(auth).then(() => {
    //         isLogin();
    //         toaster.success("Logout successfully");
    //         localStorage.removeItem("token-sa");
    //         window.location.href = "/login";
    //     }).catch((error) => {
    //         toaster.danger("Logout failed");
    //     });
    // };

    React.useEffect(() => {
        getInformationUser();
    }, []);
    return (
        <div className="navbar">
            <a href="/" className='item-navbar'>Dashboard</a>
            <a href="/customer" className='item-navbar'>Customer</a>
            <a href="/category" className='item-navbar'>Category</a>
            <a href="/product" className='item-navbar'>Product</a>
            <a href="/order" className='item-navbar'>Order</a>
            <div className="infor-user">
                <Avatar name={userName} size={40} />
                {/* <div className="infor-user-name">{userName}</div> */}
                <Popover
                    content={
                        <Menu>
                            <Menu.Group>
                                <Menu.Item icon={LogOutIcon} intent="danger" onSelect={logout}> Log out </Menu.Item>
                            </Menu.Group>
                        </Menu>
                    }
                >
                    <div className="infor-user-name">{userName}</div>
                </Popover>
            </div>
        </div>
    );
}

export default Navbar;
