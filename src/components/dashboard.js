import React from 'react';
import './dashboard.css';
import Navbar from './navbar';
import db from '../environment/firebase';
import { getDocs, collection, doc} from "firebase/firestore";

function Dashboard() {
    const [customers, setCustomers] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [orders, setOrders] = React.useState([]);
    const [countCurrCustomer, setCountCurrCustomer] = React.useState(0);

    const getCustomers = async () => {
        const querySnapshot = await getDocs(collection(db, "customer"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        setCustomers(data);
        const count = data.filter((customer) => {
            const month = customer.createdAt.split("/")[1];
            const year = customer.createdAt.split("/")[2];
            // console.log(month, year);
            // console.log(new Date().getMonth() + 1, new Date().getFullYear());
            return month === (new Date().getMonth() + 1).toString() && year === new Date().getFullYear().toString();
        }
        );
        // console.log(count.length);
        setCountCurrCustomer(count.length);
    };


    const getCategories = async () => {
        console.log("getCategories");
        const querySnapshot = await getDocs(collection(db, "type"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        setCategories(data);
    };

    const [countCurrProduct, setCountCurrProduct] = React.useState(0);
    const getProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "items"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        setProducts(data);
        const count = data.filter((product) => {
            const month = product.createAt.split("/")[1];
            const year = product.createAt.split("/")[2];
            // console.log(month, year);
            // console.log(new Date().getMonth() + 1, new Date().getFullYear());
            return month === (new Date().getMonth() + 1).toString() && year === new Date().getFullYear().toString();
        }
        );
        // console.log(count.length);
        setCountCurrProduct(count.length);
    };

    const [countCurrOrder, setCountCurrOrder] = React.useState(0);
    const [countPriceCurrOrder, setCountPriceCurrOrder] = React.useState(0);
    const getOrders = async () => {
        const querySnapshot = await getDocs(collection(db, "order"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });
        setOrders(data);
        const count = data.filter((order) => {
            const month = order.createdAt.split("/")[1];
            const year = order.createdAt.split("/")[2];
            // console.log(month, year);
            
            // console.log(new Date().getMonth() + 1, new Date().getFullYear());
            return month === (new Date().getMonth() + 1).toString() && year === new Date().getFullYear().toString();
        });

        setCountCurrOrder(count.length);
        let countPrice = 0;
        count.forEach((order) => {
            countPrice += Number(order.total);
        });
        setCountPriceCurrOrder(countPrice);
    };

    React.useEffect(() => {
        getCustomers();
        getCategories();
        getProducts();
        getOrders();
    }, []);

    
    return (
        <div className="dashboard">
            <Navbar />
            <div className="dashboard-content">
                <div className="dashboard-content-header">
                    <h2>Dashboard</h2>
                </div>
                <div className="dashboard-content-body">
                    <div className="dashboard-content-body-card-1">
                        <div className="dashboard-content-body-card-title-1">
                            <h3>Customers</h3>
                            <p className="dashboard-content-count-1">{customers.length}</p>
                        </div>
                    </div>
                    <div className="dashboard-content-body-card-2">
                        <div className="dashboard-content-body-card-title-2">
                            <h3>Categories</h3>
                            <p className="dashboard-content-count-2">{categories.length}</p>
                        </div>
                    </div>
                    <div className="dashboard-content-body-card-3">
                        <div className="dashboard-content-body-card-title-3">
                            <h3>Products</h3>
                            <p className="dashboard-content-count-3">{products.length}</p>
                        </div>
                    </div>
                    <div className="dashboard-content-body-card-4">
                        <div className="dashboard-content-body-card-title-4">
                            <h3>Orders</h3>
                            <p className="dashboard-content-count-4">{orders.length}</p>
                        </div>
                    </div>
                </div>
                <h3>Activity Details</h3>
                <div className="dashboard-content-body-2">
                    <div className="dashboard-content-body-2-card-1">
                        <div className="dashboard-content-body-2-card-title">
                            <h3>Recent Customer of {new Date().getMonth() + 1}/{new Date().getFullYear()}</h3>
                        </div>
                        <p className="dashboard-content-count-5">
                           {
                                countCurrCustomer
                           }
                        </p>
                    </div>
                    <div className="dashboard-content-body-2-card-2">
                        <div className="dashboard-content-body-2-card-title">
                            <h3>Recent New Product of {new Date().getMonth() + 1}/{new Date().getFullYear()}</h3>
                        </div>
                        <p className="dashboard-content-count-5">
                           {
                                countCurrProduct
                           }
                        </p>
                    </div>
                    <div className="dashboard-content-body-2-card-3">
                        <div className="dashboard-content-body-2-card-title">
                            <h3>Recent Orders  of {new Date().getMonth() + 1}/{new Date().getFullYear()}</h3>
                        </div>
                        <p className="dashboard-content-count-5">
                           {
                                countCurrOrder
                           }
                        </p>
                    </div>
                    <div className="dashboard-content-body-2-card-4">
                        <div className="dashboard-content-body-2-card-title">
                            <h3>Recent Total Sales  of {new Date().getMonth() + 1}/{new Date().getFullYear()}</h3>
                        </div>
                        <p className="dashboard-content-count-5">
                            {
                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(countPriceCurrOrder)
                            }
                        </p>
                    </div>

                </div>

                <h3>Charts</h3>
            </div>
        </div>
    );
}

export default Dashboard;