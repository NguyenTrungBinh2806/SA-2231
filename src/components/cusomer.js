import React from "react";
import "./customer.css";
import Navbar from "./navbar";
import {
  Table,
  TableHead,
  Button,
  SearchIcon,
  toaster,
  Dialog,
  AddIcon,
  EditIcon, InfoSignIcon, TrashIcon
} from "evergreen-ui";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
function Customer() {
  const initialize = {
    id: "",
    name: "",
    phone: "",
    createdAt: "",
    orderList: [],
  };
  const [customer, setCustomer] = React.useState(initialize);

  const [customers, setCustomers] = React.useState([]);
  const getCustomers = async () => {
    const db = getFirestore();
    const customersRef = collection(db, "customer");
    const customersSnapshot = await getDocs(customersRef);
    const dataCustomers = [];
    const totalQuantity = 0;
    customersSnapshot.forEach((doc) => {
      // add orderQuantity field is a length of order array
      dataCustomers.push({
        ...doc.data(),
        orderQuantity: doc.data().orderList.length,
      });
    });
    setCustomers(dataCustomers);
    console.log(dataCustomers);
  };

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
    });
    const isExist = dataCustomers.find((item) => item.phone === customer.phone);
    if (isExist) {
      toaster.danger("This Phone is used");
    } else {
      const docId = Date.now().toString();
      const customerRef = doc(db, "customer", docId);
      await setDoc(customerRef, {
        id: docId,
        name: customer.name,
        phone: customer.phone,
        createdAt: new Date().toLocaleDateString(),
        orderList: [],
      });
      toaster.success("Add Customer Success");
      getCustomers();
      setIsShown(false);
      setCustomer(initialize);
    }
  };

  const [isShownDelete, setIsShownDelete] = React.useState(false);
  const [idDelete, setIdDelete] = React.useState("");
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
  };

  const [search, setSearch] = React.useState("");
  const searchCustomer = async () => {
    // search by id, phone
    const db = getFirestore();
    const customersRef = collection(db, "customer");
    const customersSnapshot = await getDocs(customersRef);
    const dataCustomers = [];
    customersSnapshot.forEach((doc) => {
      dataCustomers.push({
        ...doc.data(),
        orderQuantity: doc.data().orderList.length,
      });
    });
    const result = dataCustomers.filter(
      (item) =>
        item.id.toString().includes(search) ||
        item.phone.toString().includes(search)
    );
    setCustomers(result);
  };

  const [isShownOrder, setIsShownOrder] = React.useState(false);
  const [orderDetail, setOrderDetail] = React.useState({});
  const [itemList, setItemList] = React.useState([]);
  const orderCustomer = async (id) => {
    const db = getFirestore();
    const orderRef = doc(db, "order", id);
    const orderSnapshot = await getDoc(orderRef);
    const dataOrder = orderSnapshot.data();
    const items = dataOrder.items;
    const itemInfo = [];
    for (let i = 0; i < items.length; i++) {
      const itemRef = doc(db, "items", items[i].id);
      const itemSnapshot = await getDoc(itemRef);
      const dataItem = itemSnapshot.data();
      itemInfo.push({
        // do không add được trực tiếp, phải tạo hàm trung gian để nhận object của sản phẩm và  gán amount
        ...dataItem, amount: items[i].amount
      });
      console.log(itemInfo);
    }
    setItemList(itemInfo);

    setOrderDetail(dataOrder);
    // setItemList(items);
  };

  React.useEffect(() => {
    getCustomers();
  }, []);

  return (
    <div style={{width: "100%"}}>
      <Navbar />
      <div className="customer">
      
      {/* <button onClick={getCustomers}>Get Customers</button> */}
      <div className="customer-header">
        <div className="customer-card">
          <div className="customer-card-title">Total Customers</div>
          <div className="customer-card-number">{customers.length}</div>
        </div>
        <div className="customer-card">
          <div className="customer-card-title">Total Orders</div>
          <div className="customer-card-number">
            {customers.reduce((acc, cur) => acc + cur.orderQuantity, 0)}
          </div>
        </div>
        {/* <div className="customer-card">
          <div className="customer-card-title">Best customer orders</div>
          <div className="customer-card-number">
            {
              customers.reduce(
                (acc, cur) => (acc.orderQuantity > cur.orderQuantity ? acc : cur)
              ).name
            }
          </div>
        </div> */}
      </div>
      <div className="customer-search">
        <input
          type="text"
          placeholder="Search by Id or phone number"
          className="customer-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          className="customer-search-button"
          appearance="primary"
          intent="primary"
          marginLeft={8}
          iconBefore={SearchIcon}
          height={40}
          onClick={searchCustomer}
        >
          Search
        </Button>
        <div className="customer-add-button">
          <Button
            appearance="primary"
            intent="success"
            iconBefore={AddIcon}
            onClick={() => setIsShown(true)}
            height={40}
          >
            Add a new customer
          </Button>
        </div>
      </div>
      <div className="customer-list">
        <Table>
          <Table.Head
            className="customer-list-header"
            backgroundColor="#999999"
            color="#ffffff"
            textAlign="center"
          >
            <Table.TextHeaderCell>ID</Table.TextHeaderCell>
            <Table.TextHeaderCell>Name</Table.TextHeaderCell>
            <Table.TextHeaderCell>Phone</Table.TextHeaderCell>
            <Table.TextHeaderCell>Created At</Table.TextHeaderCell>
            <Table.TextHeaderCell>Quantity of orders</Table.TextHeaderCell>
            <Table.TextHeaderCell flexBasis={340} flexShrink={0} flexGrow={0}>
              Management
            </Table.TextHeaderCell>
          </Table.Head>
          <Table.Body textAlign="center">
            {customers.map((customer) => (
              <Table.Row key={customer.id}>
                <Table.TextCell>{customer.id}</Table.TextCell>
                <Table.TextCell textAlign="left">
                  {customer.name}
                </Table.TextCell>
                <Table.TextCell>{customer.phone}</Table.TextCell>
                <Table.TextCell>{customer.createdAt}</Table.TextCell>
                <Table.TextCell>{customer.orderQuantity}</Table.TextCell>
                <Table.TextCell flexBasis={340} flexShrink={0} flexGrow={0}>
                  <Button
                    appearance="primary"
                    intent="success"
                    onClick={() => cusDetail(customer.id)}
                    marginRight={8}
                    iconBefore={InfoSignIcon}
                  >
                    Detail
                  </Button>
                  <Button
                    appearance="primary"
                    intent="primary"
                    marginRight={8}
                    onClick={() => {
                      setIsShownEdit(true);
                      setCustomerDetail(customer);
                    }}
                    iconBefore={EditIcon}
                  >
                    Edit
                  </Button>
                  <Button
                    appearance="primary"
                    intent="danger"
                    onClick={() => {
                      setIsShownDelete(true);
                      setIdDelete(customer.id);
                    }}
                    iconBefore={TrashIcon}
                  >
                    Delete
                  </Button>
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
        <div className="customer-add">
          <div className="customer-add-input">
            <label className="customer-label">Phone number</label>
            <br />
            <input
              type="number"
              className="customer-input"
              value={customer.phone}
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />
            <br />
            <label className="customer-label">Full name</label>
            <br />
            <input
              type="text"
              value={customer.name}
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              placeholder="Full name"
              className="customer-input"
            />
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
        <div className="customer-delete">
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
        <div className="customer-add">
          <div className="customer-add-input">
            <label className="customer-label">Phone number</label>
            <br />
            <input
              type="number"
              className="customer-input"
              value={customerDetail.phone}
              onChange={(e) =>
                setCustomerDetail({ ...customerDetail, phone: e.target.value })
              }
            />
            <br />
            <label className="customer-label">Full name</label>
            <br />
            <input
              type="text"
              value={customerDetail.name}
              onChange={(e) =>
                setCustomerDetail({ ...customerDetail, name: e.target.value })
              }
              placeholder="Full name"
              className="customer-input"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        isShown={isShownDetail}
        title={`${customerDetail.name}'s information detail`}
        onCloseComplete={() => setIsShownDetail(false)}
        hasFooter={false}
        // confirmLabel="Close"
        // onConfirm={() => setIsShownDetail(false)}
      >
        <div className="customer-detail">
          <div className="customer-detail-input">
            <span><b>ID: </b>{customerDetail.id}</span>
            <soan style={{ marginLeft: "50px" }}></soan>
            <span><b>Phone number: </b>{customerDetail.phone}</span>
            <p><b>Full name: </b>{customerDetail.name}</p>
            <h4>Created at</h4>
            <p>{customerDetail.createdAt}</p>
            <span><b>Order ID list</b></span> <span style={{ color: "red" }}>(Click to see order detail)</span>
            {customerDetail.orderList.length > 0 ? (
              <ul>
                {customerDetail.orderList.map((id) => (
                  <li key={id}>
                    <p
                      className="order-detail"
                      onClick={() => {
                        setIsShownOrder(true);
                        orderCustomer(id);
                      }}
                    >
                      {id}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p Style={"color: red"}>Customer has no order</p>
            )}
          </div>
        </div>
      </Dialog>
      <Dialog
        isShown={isShownOrder}
        title={`Order ${orderDetail.id}`}
        onCloseComplete={() => setIsShownOrder(false)}
        hasFooter={false}
        confirmLabel="Close"
        onConfirm={() => setIsShownOrder(false)}
        width="50%"
      >
        <div className="customer-detail">
          {/* <p><b>Order ID: </b>{orderDetail.id}</p>
          <p><b>Customer ID: </b>{orderDetail.cusID}</p>
          <p><b>Order date: </b>{orderDetail.createdAt}</p>
          {orderDetail.state === true ? (
            <p style={{ color: "green" }}><b>Order status: </b>Delivered</p>
          ) : (
            <p style={{ color: "red" }}><b>Order status: </b>Not delivered</p>
          )} */}
          <p><b>Order ID: </b>{orderDetail.id}</p>
          <tabel>
            <tbody>
              <tr>
                {/*  tab 50px */}
                <span><b>Customer ID: </b>{orderDetail.cusID}</span>
                <span style={{ marginLeft: "50px" }}></span>
                <span><b>Order date: </b>{orderDetail.createdAt}</span>
              </tr>
            </tbody>

          </tabel>
          <label className="order-label">
            <h4>Order list: </h4>
          </label>
           <Table>
            <Table.Head style={{ backgroundColor: "gray", color: "white" }}>
                <Table.TextHeaderCell>Product ID</Table.TextHeaderCell>
                <Table.TextHeaderCell>Image</Table.TextHeaderCell>
                <Table.TextHeaderCell>Name</Table.TextHeaderCell>
                <Table.TextHeaderCell>Quantity</Table.TextHeaderCell>
                <Table.TextHeaderCell>Price</Table.TextHeaderCell>
            </Table.Head>
            <Table.Body>
                {itemList.map((product, index) => (
                    <Table.Row key={index}>
                        <Table.TextCell>{product.id}</Table.TextCell>
                        <Table.TextCell><img src={product.imageUrl} alt="product" width="70px" height="70px" /></Table.TextCell>
                        <Table.TextCell>{product.name}</Table.TextCell>
                        <Table.TextCell>{product.amount}</Table.TextCell>
                        <Table.TextCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</Table.TextCell>
                    </Table.Row>
                ))}
            </Table.Body>
           </Table>
          <p><b>Total price: </b> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail.total)}</p>
        </div>
      </Dialog>
    </div>
    </div>
  );
}
export default Customer;
