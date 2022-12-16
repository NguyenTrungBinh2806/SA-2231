import React from "react";
import './order.css';
import { Table, TableHead, Button, SearchIcon, Dialog, Switch, toaster, TickCircleIcon, InfoSignIcon, SortAscIcon, SortIcon, SortDescIcon, Popover, Menu } from 'evergreen-ui';
import { getFirestore, getDocs, doc, getDoc, collection, updateDoc} from "firebase/firestore";
import { async } from "@firebase/util";
import Navbar from "./navbar";

function Order() {

    // get items from firebase
    const [items, setItems] = React.useState([]);
    const getItems = () => {
        const db = getFirestore();
        const orderRef = collection(db, "order");
        const itemsTam = [];
        getDocs(orderRef).then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
               itemsTam.push(doc.data());
            });
            getCustomers(itemsTam);
        });
        
    }

    const getCustomers = async (itemsTam) => {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "customer"));
        itemsTam.forEach(async (item) => {
            querySnapshot.forEach(async (doc) => {
                if(item.cusID === doc.id){
                    item.customer = doc.data();
                }
            });
            // console.log(querySnapshot.data().name);
        });
        getProducts(itemsTam);
        // console.log(items);
    }

    const getProducts = async (items2) => {
        const db = getFirestore();
        // get product from items = [{productID: 1, quantity: 1}, {productID: 2, quantity: 2}]
        const querySnapshot = await getDocs(collection(db, "items"));
        items2.forEach(async (item) => {
            item.items.forEach(async (itemTam) => {
                querySnapshot.forEach(async (doc) => {
                    if(itemTam.id === doc.id){
                        itemTam.proName = doc.data().name;
                        itemTam.proPrice = doc.data().price;
                    }
                });
            });
        });
        setItems(items2);
        console.log(items2);
    }

    React.useEffect(() => {
        getItems();
        
    }, []);

    const [isShown, setIsShown] = React.useState(false);
    const [itemDetail, setItemDetail] = React.useState({});

    const [searchValue, setSearchValue] = React.useState('');

    const searchById = async () => {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "order"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        }
        );
        const result = data.filter( item => item.id.toString().includes(searchValue));
        getCustomers(result);
    }


    // const [isShownSwitch, setIsShownSwitch] = React.useState(false);

    // when click on switch button, change state of order to true or false
    const changeState = async (id, state) => {
        const db = getFirestore();
        const orderRef = doc(db, "order", id);
        await updateDoc(orderRef, {
            state: state
        });
        getItems();
        if(state === true){
            toaster.success('Order ' + id + ' is confirmed');
        }else{
            toaster.warning('Order ' + id + ' is not confirmed');
        }
    }

    // filter by state
    const [state, setState] = React.useState('all');
    const filterByState = async (state) => {
        // setState(state);
        const db = getFirestore();
        const orderRef = collection(db, "order");
        const itemsTam = [];
        getDocs(orderRef).then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                itemsTam.push(doc.data());
            });
            // getCustomers(itemsTam);
            // console.log(itemsTam);
            if(state === 'all'){
                getItems();
            }
            else{
                const result = itemsTam.filter( item => item.state === state);
                getCustomers(result);
    
            }
        });
        

        

    }








    return (
        <div style={{width: '100%'}}>
            <Navbar/>
            <div className='order'>

                <div className='order-header'>
                    <div className='order-card'>
                        <div className='order-card-title'>
                            Total orders
                        </div>
                        <div className='order-card-number'>
                            {items.length}
                        </div>
                    </div>
                    <div className='order-card'>
                        <div className='order-card-title'>
                            Total price
                        </div>
                        <div className='order-card-number'>
                            {
                                new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(items.reduce((total, item) => total + Number(item.total), 0))
                            }
                        </div>
                    </div>
                    <div className='order-card'>
                        <div className='order-card-title'>
                            Total confirmed
                        </div>
                        <div className='order-card-number'>
                            {items.filter(item => item.state === true).length}
                        </div>
                    </div>
                    <div className='order-card'>
                        <div className='order-card-title'>
                            Total not confirmed
                        </div>
                        <div className='order-card-number'>
                            {items.filter(item => item.state === false).length}
                        </div>
                    </div>
                        
                </div>
                <div className='order-search'>
                    <input type="text" placeholder='Search' className='order-search-input' onChange={(e) => setSearchValue(e.target.value)} />
                    <Button className='order-search-button' appearance="primary" height={40} intent="primary" marginLeft={8} iconBefore={SearchIcon} onClick={searchById}>Search</Button>
                </div>
                <div className='order-list'>
                    <Table>
                        <Table.Head className='order-list-header' backgroundColor='#999999' color='#ffffff' textAlign='center'>
                            <Table.TextHeaderCell>
                                ID
                            </Table.TextHeaderCell>
                            <Table.TextHeaderCell>
                                Customer name
                            </Table.TextHeaderCell>
                            <Table.TextHeaderCell>
                                total price
                            </Table.TextHeaderCell>
                            <Table.TextHeaderCell>
                            Created at
                            </Table.TextHeaderCell>
                            <Table.TextHeaderCell flexBasis={150} flexGrow={0} flexShrink={0}>
                                Status
                                {/* filter by state, use SortascIcon */}
                                <Popover
                                    content={
                                        <Menu>
                                            <Menu.Group>
                                                <Menu.Item icon={SortIcon} onSelect={() => filterByState('all')}>All</Menu.Item>
                                                <Menu.Item icon={SortAscIcon} onSelect={() => filterByState(true)}>Confirmed</Menu.Item>
                                                <Menu.Item icon={SortDescIcon} onSelect={() => filterByState(false)}>Not confirmed</Menu.Item>
                                            </Menu.Group>
                                        </Menu>
                                    }
                                >
                                    <Button marginLeft={8} iconBefore={SortAscIcon} appearance="minimal" intent="primary" />
                                </Popover>



                                

                            </Table.TextHeaderCell>
                            <Table.TextHeaderCell>
                                Management
                            </Table.TextHeaderCell>
                        </Table.Head>
                        <Table.Body textAlign='center'>
                            {items.map((item, index) => (
                                <Table.Row key={index}>
                                    <Table.TextCell borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'> 
                                        {item.id}
                                    </Table.TextCell>
                                    <Table.TextCell borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none' textAlign='left'>
                                        {
                                            item.customer.name
                                        }
                                    </Table.TextCell>
                                    <Table.TextCell borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total)}
                                    </Table.TextCell>
                                    <Table.TextCell borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'>
                                        {item.createdAt}
                                    </Table.TextCell>
                                    <Table.TextCell borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none' flexBasis={150} flexGrow={0} flexShrink={0}>
                                        <Switch checked={item.state} onChange={(e) => changeState(item.id, e.target.checked)} textAlign='center' />
                                    </Table.TextCell>
                                    <Table.TextCell borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'>
                                        <Button intent='primary' marginRight={16} appearance='primary' onClick={() => { setIsShown(true); setItemDetail(item); }}>Detail</Button>
                                        <Button intent='danger' marginRight={16} appearance='primary'> Delete </Button>
                                    </Table.TextCell>
                                </Table.Row>
                            ))}
                            
                            </Table.Body>
                    </Table>
                    <Dialog isShown={isShown} title={"Order detail " + itemDetail.id} onCloseComplete={() => setIsShown(false)} hasFooter={false}>
                        <div className='order-detail-info'>
                            <div className='order-detail-header'>
                                <div className='order-detail-header-id'>
                                    <b>ID:</b> {itemDetail.id}
                                </div>
                                <br/>
                                <div className='order-detail-header-created-at'>
                                    <b>Created at:</b> {itemDetail.createdAt}
                                    {
                                        itemDetail.state === true ? (
                                            <span>
                                                <TickCircleIcon color='success' marginLeft={8} />
                                                <span></span>
                                                    <span style={{color: 'green'}}>Confirmed and shipped</span>
                                            </span>
                                            ) : (
                                            <span>
                                                    <InfoSignIcon color='danger' marginLeft={8} /> 
                                                    <span></span>
                                                    <span style={{color: 'red'}}> Not confirmed and waiting for confirmation</span>
                                            </span>
                                            )
                                    }
                                </div>
                                <br/>
                                <div className='order-detail-header-cus'>
                                    <b>Customer Name:</b> {itemDetail.customer?.name} - <b>Phone:</b> {itemDetail.customer?.phone}
                                </div>
                                <br/>
                                <div className='order-detail-header-product'>
                                    <Table>
                                        <Table.Head className='order-detail-header-product-header' backgroundColor='#999999' color='#ffffff'>
                                            <Table.TextHeaderCell>
                                                Product name
                                            </Table.TextHeaderCell>
                                            <Table.TextHeaderCell>
                                                Quantity
                                            </Table.TextHeaderCell>
                                            <Table.TextHeaderCell>
                                                Price
                                            </Table.TextHeaderCell>
                                            <Table.TextHeaderCell>
                                                Total price
                                            </Table.TextHeaderCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {itemDetail.items?.map((item, index) => (
                                                <Table.Row key={index}>
                                                    <Table.TextCell>
                                                        {item.proName}
                                                    </Table.TextCell>
                                                    <Table.TextCell>
                                                        {item.amount}
                                                        
                                                    </Table.TextCell>
                                                    <Table.TextCell>
                                                        {/* numberformat of VietNam */}
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.proPrice)}
                                                    </Table.TextCell>
                                                    <Table.TextCell>
                                                        {/* numberformat of VietNam */}
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.proPrice * item.amount)}
                                                    </Table.TextCell>
                                                    

                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                                <hr style={{width: '60%', margin: '10px auto', color: '#999999'}} />
                                <br/>
                                <div className='order-detail-header-total'>
                                    <b>Total:</b> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(itemDetail.total)}
                                </div>
                                <br/>
                            </div>
                        </div>
                    </Dialog>
            </div>
        </div>
        </div>
    );
}

export default Order;