import React from 'react';
import './customer.css';
import Navbar from './navbar';
import { Table, TableHead, Button, SearchIcon, toaster, Dialog, AddIcon } from 'evergreen-ui';
import { getFirestore, collection, getDocs, getDoc, query, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
function Customer() {
    const initialize = {
        id: '',
        name: '',
        phone: '',
        createdAt: '',
        orderList: []
    }
    const [customer, setCustomer] = React.useState(initialize);
    
    const [customers, setCustomers] = React.useState([]);
    const getCustomers = async () => {
        const db = getFirestore();
        const customersRef = collection(db, "customer");
        const customersSnapshot = await getDocs(customersRef);
        const dataCustomers = [];
        customersSnapshot.forEach((doc) => {
            // add orderQuantity field is a length of order array
            dataCustomers.push({ ...doc.data(), orderQuantity: doc.data().orderList.length });
        });
        setCustomers(dataCustomers);
        console.log(dataCustomers);
    }

    const [isShown, setIsShown] = React.useState(false);
    const addUser = async () => {
        // const docId = Date.now().toString();
        const db = getFirestore();
        // check if customer phone is exist
        const customerRef = collection(db, "customer");
        const customerSnapshot = await getDocs(customerRef);
        const dataCustomers = [];
        customerSnapshot.forEach((doc) => {
            dataCustomers.push(doc.data());
        }
        );
        const isExist = dataCustomers.find((item) => item.phone === customer.phone);
        if (isExist) {
            toaster.danger("This Phone is used");
        }
        else {
            const docId = Date.now().toString();
            const customerRef = doc(db, "customer", docId);
            await setDoc(customerRef, {
                id: docId,
                name: customer.name,
                phone: customer.phone,
                createdAt: new Date().toLocaleDateString(),
                orderList: []
            });
            toaster.success("Add Customer Success");
            getCustomers();
            setIsShown(false);
            setCustomer(initialize);
        }
    }

    const [isShownDelete, setIsShownDelete] = React.useState(false);
    const [idDelete, setIdDelete] = React.useState('');
    const deleteCustomer = async () => {
        const db = getFirestore();
        const customerRef = doc(db, "customer", idDelete);
        await deleteDoc(customerRef);
        toaster.success("Delete Customer " + idDelete + " Success");
        getCustomers();
        setIsShownDelete(false);
    };

    const [isShownEdit, setIsShownEdit] = React.useState(false);
    const [customerDetail, setCustomerDetail] = React.useState(initialize);
    const editCustomer = async () => {
        const db = getFirestore();
        const customerRef = doc(db, "customer", customerDetail.id);
        await updateDoc(customerRef, {
            name: customerDetail.name,
            phone: customerDetail.phone,
        });
        toaster.success("Edit Customer " + customerDetail.id + " Success");
        getCustomers();
        setIsShownEdit(false);
    };

    const [isShownDetail, setIsShownDetail] = React.useState(false);
    const cusDetail = async (id) => {
        const db = getFirestore();
        const customerRef = doc(db, "customer", id);
        const customerSnapshot = await getDoc(customerRef);
        const dataCustomer = customerSnapshot.data();
        setCustomerDetail(dataCustomer);
        setIsShownDetail(true);
    }

    const [search, setSearch] = React.useState('');
    const searchCustomer = async () => {
        // search by id, phone
        const db = getFirestore();
        const customersRef = collection(db, "customer");
        const customersSnapshot = await getDocs(customersRef);
        const dataCustomers = [];
        customersSnapshot.forEach((doc) => {
            dataCustomers.push({ ...doc.data(), orderQuantity: doc.data().orderList.length });
        });
        const result = dataCustomers.filter((item) => item.id.toString().includes(search) || item.phone.toString().includes(search));
        setCustomers(result);
    }



    React.useEffect(() => {
        getCustomers();
    }, []);
    
    return (
        <div className='customer'>
            {/* <button onClick={getCustomers}>Get Customers</button> */}
            <div className='customer-search'>
                <input type="text" placeholder='Search by Id or phone number' className='customer-search-input' value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button className='customer-search-button' appearance="primary" intent="primary" marginLeft={8} iconBefore={SearchIcon} height={40} onClick={searchCustomer}>Search</Button>
                <div className='customer-add-button'>
                    <Button appearance="primary" intent="success" iconBefore={AddIcon} onClick={() => setIsShown(true)} height={40}>Add a new customer</Button>
                </div>
            </div>
            <div className='customer-list'>
                <Table>
                    <Table.Head className='customer-list-header' backgroundColor='#999999' color='#ffffff'>
                        <Table.TextHeaderCell>
                            ID
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Name
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Phone
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Created At
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Quantity of orders
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Management
                        </Table.TextHeaderCell>
                    </Table.Head>
                    <Table.Body>
                        {customers.map((customer) => (
                            <Table.Row key={customer.id}>
                                <Table.TextCell>{customer.id}</Table.TextCell>
                                <Table.TextCell>{customer.name}</Table.TextCell>
                                <Table.TextCell>{customer.phone}</Table.TextCell>
                                <Table.TextCell>{customer.createdAt}</Table.TextCell>
                                <Table.TextCell>{customer.orderQuantity}</Table.TextCell>
                                <Table.TextCell>
                                    <Button appearance="primary" intent="success" onClick={() => cusDetail(customer.id)} marginRight={8}>Detail</Button>
                                    <Button appearance="primary" intent="primary" marginRight={8} onClick={() => { setIsShownEdit(true); setCustomerDetail(customer) }}>Edit</Button>
                                    <Button appearance="primary" intent="danger" onClick={() => { setIsShownDelete(true); setIdDelete(customer.id) }}>Delete</Button>
                                </Table.TextCell>
                            </Table.Row>
                        ))}
                        
                    </Table.Body>
                </Table>
                </div>
                <Dialog
                    isShown={isShown}
                    title="Add Customer"
                    onCloseComplete={() => setIsShown(false)}
                    confirmLabel="Add new"
                    onConfirm={addUser}
                >
                    <div className='customer-add'>
                        <div className='customer-add-input'>
                            <label className='customer-label'>Phone number</label>
                            <br/>
                            <input type="number" className='customer-input' value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                            <br/>
                            <label className='customer-label'>Full name</label>
                            <br/>
                            <input type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder='Full name' className='customer-input' />
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    isShown={isShownDelete}
                    title={`Delete Customer ${idDelete}`}
                    onCloseComplete={() => setIsShownDelete(false)}
                    confirmLabel="Delete"
                    onConfirm={deleteCustomer}
                    intent="danger"
                >
                    <div className='customer-delete'>
                        <p>Are you sure you want to delete this customer?</p>
                    </div>
                </Dialog>

                <Dialog
                    isShown={isShownEdit}
                    title={`Edit Customer ${customerDetail.id}`}
                    onCloseComplete={() => setIsShownEdit(false)}
                    confirmLabel="Edit"
                    onConfirm={editCustomer}
                >
                    <div className='customer-add'>
                        <div className='customer-add-input'>
                            <label className='customer-label'>Phone number</label>
                            <br/>
                            <input type="number" className='customer-input' value={customerDetail.phone} onChange={(e) => setCustomerDetail({ ...customerDetail, phone: e.target.value })} />
                            <br/>
                            <label className='customer-label'>Full name</label>
                            <br/>
                            <input type="text" value={customerDetail.name} onChange={(e) => setCustomerDetail({ ...customerDetail, name: e.target.value })} placeholder='Full name' className='customer-input' />
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    isShown={isShownDetail}
                    title={`Detail Customer ${customerDetail.id}`}
                    onCloseComplete={() => setIsShownDetail(false)}
                    confirmLabel="Close"
                    onConfirm={() => setIsShownDetail(false)}
                >
                    <div className='customer-detail'>
                        <div className='customer-detail-input'>
                            <h4>ID</h4>
                            <p>{customerDetail.id}</p>
                            <h4>Phone number</h4>
                            <p>{customerDetail.phone}</p>
                            <h4>Full name</h4>
                            <p>{customerDetail.name}</p>
                            <h4>Created at</h4>
                            <p>{customerDetail.createdAt}</p>
                            <h4>Order ID list</h4>
                            {
                                customerDetail.orderList.length > 0 ? (
                                    <ul>
                                        {customerDetail.orderList.map((id) => (
                                            <li key={id}>{id}</li>
                                        ))}
                                    </ul>
                                ): (
                                    <p Style={'color: red'}>Customer has no order</p>
                                )
                            }
                        </div>
                    </div>
                </Dialog>
        </div>
    );
}
export default Customer;