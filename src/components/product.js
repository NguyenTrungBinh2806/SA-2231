import React, {useState, useEffect} from 'react';
import './product.css';
import Navbar from './navbar';
import { Table, TableHead, Button, SearchIcon, Switch, toaster, AddIcon, Dialog, FileUploader, FileCard, SideSheet, Heading , EditIcon, InfoSignIcon, TrashIcon, Popover, Menu, SortIcon, SortAscIcon, SortDescIcon} from 'evergreen-ui';
// import get firestore
import { collection, getDocs, query, updateDoc, doc, setDoc, addDoc, deleteDoc } from "firebase/firestore";
import db from '../environment/firebase';
// import { storage } from '../environment/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


function Product() {

    const initializeApp = {
        id: '',
        name: '',
        price: 0,
        type: '',
        description: '',
        imageUrl: '',
        quantity: 0,
        createAt: new Date().toLocaleDateString(),
    }
    const [product, setProduct] = useState(initializeApp);


    const [products, setProducts] = useState([]);

    const [isShown, setIsShown] = useState(false);
    const [isShown2, setIsShown2] = useState(false);

    
    const getProduct = async () => {
        const querySnapshot = await getDocs(collection(db, "items"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({...doc.data()});
            // console.log(data);
        });
        // console.log("a");
        getCategory(data);
    }
    const [categories, setCategories] = useState([]);
    const getCategory = async (data) => {
        const querySnapshot = await getDocs(collection(db, "type"));
        const dataCategory = [];
        data.forEach(async (doc) => {
            querySnapshot.forEach((docdata) => {
                
                if(docdata.id === doc.type){
                    // push to object array of products with name is nameType to show in table
                    doc.nameType = docdata.data().name;
                }
            });
        }
        );
        // console.log(data);
        setProducts(data);
    }

    // when click state switch of product, change state and update to firestore
    const changeState = async (id, state) => {
        // console.log(id, state);
        await updateDoc(doc(db, "items", id), {
            state: state,
        });
        getProduct();
        toaster.success('Change state of ' + id + ' success');
    }

    const getCatagoiesList = async () => {
        const querySnapshot = await getDocs(collection(db, "type"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({...doc.data(), id: doc.id});
        });
        setCategories(data);
    }

    useEffect(() => {
        getProduct();
        getCatagoiesList();
    }, []);

    // add product to firestore
    const addProduct = async (files) => {
        // upload image to storage and get download url
        // if name, price and quantity is null, return error
        if(product.name === '' || product.price === 0 || product.quantity === 0){
            toaster.danger('Name, price and quantity is required');
        }else{
            if(files.length === 0){
                toaster.danger('Image is required');
            }else{
                const docId = Date.now().toString();
        const storage = getStorage();
        const storageRef = ref(storage, files[0].name);
        const uploadTask = uploadBytesResumable(storageRef, files[0]);
        uploadTask.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (error) => {
            // Handle unsuccessful uploads
            toaster.danger('Upload image fail');
        }, () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                // docId is date.now
                setDoc(doc(db, "items", docId), {
                    id: docId,
                    name: product.name,
                    price: product.price,
                    type: product.type,
                    description: product.description,
                    imageUrl: downloadURL,
                    state: true,
                    quantity: product.quantity,
                    createAt: product.createAt,
                });
                getProduct();
                setIsShown(false);
                setFiles([]);
                setProduct(initializeApp);
                toaster.success('Add product success');
            });
        });
        }
        }

    }

    const [files, setFiles] = React.useState([])
    const [fileRejections, setFileRejections] = React.useState([])
    const handleChange = React.useCallback((files) => setFiles([files[0]]), [])
    const handleRejected = React.useCallback((fileRejections) => setFileRejections([fileRejections[0]]), [])
    const handleRemove = React.useCallback(() => {
        setFiles([])
        setFileRejections([])
    }, [])

    
    const [productDetail, setProductDetail] = useState(initializeApp);
    const detailProduct = async (id) => {
        // setProductDetail(initializeApp);
        const querySnapshot = await getDocs(collection(db, "items"));
        querySnapshot.forEach((doc) => {
            if(doc.id === id){
                setProductDetail(doc.data());
            }
        });
        // console.log(productDetail);
        // setIsShown2(true);
    }


    const [isShown3, setIsShown3] = useState(false);

   const updateProduct = async (id) => {
        if(files.length === 0){
            await updateDoc(doc(db, "items", id), {
                name: productDetail.name,
                price: productDetail.price,
                type: productDetail.type,
                description: productDetail.description,
                quantity: productDetail.quantity,
            });
            getProduct();
            setIsShown3(false);
            setProductDetail(initializeApp);
            toaster.success('Update product success')
        }else{
            const storage = getStorage();
            const storageRef = ref(storage, files[0].name);
            const uploadTask = uploadBytesResumable(storageRef, files[0]);
            uploadTask.on('state_changed', (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, (error) => {
                // Handle unsuccessful uploads
                toaster.danger('Upload image fail');
            }, () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    // docId is date.now
                    await updateDoc(doc(db, "items", id), {
                        name: productDetail.name,
                        price: productDetail.price,
                        type: productDetail.type,
                        description: productDetail.description,
                        imageUrl: downloadURL,
                        quantity: productDetail.quantity,
                    });
                    getProduct();
                    setFiles([]);
                    setIsShown3(false);
                    setProductDetail(initializeApp);
                    toaster.success('Update product success')
                });
            });
        }
   }

   
   const [isShown4, setIsShown4] = useState(false);
   const deleteProduct = async (id) => {
        await deleteDoc(doc(db, "items", id));
        getProduct();
        setIsShown4(false);
        toaster.success('Delete product success');
    }

    const [searchValue, setSearchValue] = useState('');

    const searchIdOrName = async (e) => {
        // using lower case to search
        const querySnapshot = await getDocs(collection(db, "items"));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        }
        );
        // console.log('search'+data);
        console.log('search'+data);
        const result = data.filter(item => item.id.toString().toLowerCase().includes(searchValue.toString().toLowerCase()) || item.name.toString().toLowerCase().includes(searchValue.toString().toLowerCase()));
        getCategory(result);
        console.log(product);
    }

    const filterByState = async (state) => {
        // setState(state);
        // const db = getFirestore();
        const orderRef = collection(db, "items");
        const itemsTam = [];
        getDocs(orderRef).then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                itemsTam.push(doc.data());
            });
            if(state === 'all'){
                getProduct();
            }else{
                const result = itemsTam.filter(item => item.state === state);
                getCategory(result);
            }
        });
    }

    const filterByCategory = async (category) => {
        const orderRef = collection(db, "items");
        const itemsTam = [];
        getDocs(orderRef).then((querySnapshot) => {
            querySnapshot.forEach(async (doc) => {
                itemsTam.push(doc.data());
            });
            if(category === 'all'){
                getProduct();
            }else{
                const result = itemsTam.filter(item => item.type === category);
                getCategory(result);
            }
        });
    }


    return (
        <div style={{width: '100%'}}>
            <Navbar />
            <div className='product'>
            <Dialog
                isShown={isShown}
                title="Add new product"
                onCloseComplete={() => setIsShown(false)}
                confirmLabel="Add"
                onConfirm={() => {addProduct(files)}}
                width={900}
                >
                <label className="label">Name</label>
                <br/>
                <input className="input" type="text" placeholder="Name" onChange={(e) => setProduct({...product, name: e.target.value})} />
                <br/>
                <label className="label">Price</label>
                <br/>
                <input className="input" type="number" placeholder="Price" onChange={(e) => setProduct({...product, price: e.target.value})} />
                <br/>
                <label className="label">Category</label>
                <br/>
                <select className="input" onChange={(e) => setProduct({...product, type: e.target.value})}>
                    {/* categories mặc định là giá trị đầu tiên của mảng categories */}
                    {categories.map((category) => {
                        // if user don't choose category, choose default category is first category in list
                        if(product.type === ''){
                            // set default category is first category in list
                            setProduct({...product, type: category.id});
                        }
                        return <option value={category.id}>{category.name}</option>
                    })}
                </select>
                <br/>
                <label className="label">Quantity</label>
                <br/>
                <input className="input" type="number" placeholder="Quantity" onChange={(e) => setProduct({...product, quantity: e.target.value})} />
                <br/>
                <FileUploader
                    label="Upload image"
                    description="You can upload 1 file. File can be up to 50 MB."
                    maxSizeInBytes={50 * 1024 ** 2}
                    maxFiles={1}
                    onChange={handleChange}
                    onRejected={handleRejected}
                    renderFile={(file) => {
                    const { name, size, type } = file
                    const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file)
                    const { message } = fileRejection || {}
                    return (
                        <FileCard
                        key={name}
                        isInvalid={fileRejection != null}
                        name={name}
                        onRemove={handleRemove}
                        sizeInBytes={size}
                        type={type}
                        validationMessage={message}
                        />
                    )
                    }}
                    values={files}
                />
                {/* create Ckeditor for description */}
                <CKEditor
                    editor={ClassicEditor}
                    data={product.description}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setProduct({...product, description: data});
                    }}
                    // submitted, clear data
                    onBlur={(event, editor) => {
                        const data = editor.getData();
                        setProduct({...product, description: data});
                    }}

                    

                />
                </Dialog>
                {/*dialog for update using data of product detail */}
                <Dialog
                isShown={isShown3}
                title="Update product"
                onCloseComplete={() => setIsShown3(false)}
                confirmLabel="Update"
                onConfirm={() => {updateProduct(productDetail.id)}}
                >
                <label className="label">Name</label>
                <br/>
                <input className="input" type="text" placeholder="Name" value={productDetail.name} onChange={(e) => setProductDetail({...productDetail, name: e.target.value})} />
                <br/>
                <label className="label">Price</label>
                <br/>
                <input className="input" type="number" placeholder="Price" value={productDetail.price} onChange={(e) => setProductDetail({...productDetail, price: e.target.value})} />
                <br/>
                <label className="label">Category</label>
                <br/>
                <select className="input" value={productDetail.type} onChange={(e) => setProductDetail({...productDetail, type: e.target.value})}>
                    {
                        categories.map((category) => {
                            return <option value={category.id}>{category.name}</option>
                        }
                        )
                    }
                </select>
                <br/>
                <label className="label">Quantity</label>
                <br/>
                <input className="input" type="number" placeholder="Quantity" value={productDetail.quantity} onChange={(e) => setProductDetail({...productDetail, quantity: e.target.value})} />
                <br/>
                <label className="label">Image</label>
                <br/>   
                <img src={productDetail.imageUrl} alt="product" width="100px" height="100px" />
                <br/>
                <FileUploader
                    label="Update image"
                    description="You can upload 1 file. File can be up to 50 MB."
                    maxSizeInBytes={50 * 1024 ** 2}
                    maxFiles={1}
                    onChange={handleChange}
                    onRejected={handleRejected}
                    renderFile={(file) => {
                    const { name, size, type } = file
                    const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file)
                    const { message } = fileRejection || {}
                    return (
                        <FileCard
                        key={name}
                        isInvalid={fileRejection != null}
                        name={name}
                        onRemove={handleRemove}
                        sizeInBytes={size}
                        type={type}
                        validationMessage={message}
                        />
                    )
                    }}
                    values={files}
                />
                <CKEditor
                    editor={ClassicEditor}
                    data={productDetail.description}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setProductDetail({...productDetail, description: data});
                    }}
                    // submitted, clear data
                />

                </Dialog>

                {/* dialog for delete */}
                <Dialog
                isShown={isShown4}
                title="Delete product"
                intent="danger"
                onCloseComplete={() => setIsShown4(false)}
                confirmLabel="Delete"
                onConfirm={() => {deleteProduct(productDetail.id)}}
                >
                <p>Are you sure to delete this product?</p>
                </Dialog>

            <div className='product-header'>
                <div className='product-card'>
                    <div className='product-card-title'> Total products </div>
                    <div className='product-card-number'>
                        {
                            products.length
                        }
                    </div>
                </div>
                <div className='product-card'>
                    <div className='product-card-title'> Total product active </div>
                    <div className='product-card-number'>
                        {
                            products.filter((product) => product.state=== true).length
                        }
                    </div>
                </div>
                <div className='product-card'>
                    <div className='product-card-title'> Total product inactive </div>
                    <div className='product-card-number'>
                        {
                            products.filter((product) => product.state=== false).length
                        }
                    </div>
                </div>
            </div>
               

            <div className='product-search'>
                <input type="text" placeholder='Search' className='product-search-input' onChange={(e) => setSearchValue(e.target.value)} />
                <Button className='product-search-button' appearance="primary" height={40} intent="primary" marginLeft={8} iconBefore={SearchIcon} onClick={() => {searchIdOrName(searchValue)}}>Search</Button>
                <Button className ='product-add-button' appearance="primary" height={40} intent="success" marginLeft={8} iconBefore={AddIcon} onClick={() => setIsShown(true)}>Add a new product</Button>
            </div>
            <div className='product-list'>
                <Table>
                    <Table.Head className='product-list-header' backgroundColor='#CCCCCC' color='#ffffff' textAlign='center'>
                        <Table.TextHeaderCell flexBasis={120} flexGrow={0} flexShrink={0}>
                            ID
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell flexBasis={200} flexGrow={0} flexShrink={0}>
                            Name
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell flexBasis={100} flexGrow={0} flexShrink={0}>
                            Price
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell flexBasis={150} flexGrow={0} flexShrink={0}>
                            Image
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell flexBasis={120} flexGrow={0} flexShrink={0}>
                            Quantity
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell flexBasis={150} flexGrow={0} flexShrink={0}>
                            Category
                            <Popover
                                content={
                                    <Menu>
                                        <Menu.Group>
                                            {/* menu of category */}
                                            <Menu.Item icon={SortIcon} onSelect={() => filterByCategory('all')}>All</Menu.Item>
                                            {
                                                categories.map((category) => {
                                                    return (
                                                        <Menu.Item icon={SortIcon} onSelect={() => filterByCategory(category.id)}>{category.name}</Menu.Item>
                                                    )
                                                })
                                            }
                                        </Menu.Group>
                                    </Menu>
                                }
                            >
                                <Button marginLeft={8} iconBefore={SortAscIcon} appearance="minimal" intent="primary" />
                            </Popover>
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell flexBasis={120} flexGrow={0} flexShrink={0}>
                            State
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
                    <Table.Body>
                        {
                            products.map((product) => {
                                return (
                                    <Table.Row className='product-list-row' key={product.id} textAlign='center' borderBottom='none'>
                                        <Table.TextCell flexBasis={120} flexGrow={0} flexShrink={0} borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'>
                                            {product.id}
                                        </Table.TextCell>
                                        <Table.TextCell borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none' flexBasis={200} flexGrow={0} flexShrink={0}>
                                            {product.name}
                                        </Table.TextCell>
                                        <Table.TextCell flexBasis={100} flexGrow={0} flexShrink={0} borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </Table.TextCell>
                                        <Table.TextCell flexBasis={150} flexGrow={0} flexShrink={0} borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'>
                                            <img src={product.imageUrl} alt="" width='80%' height='80%' className='image-product'/>
                                        </Table.TextCell>
                                        <Table.TextCell flexBasis={120} flexGrow={0} flexShrink={0} borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'>
                                            {product.quantity}
                                        </Table.TextCell>
                                        <Table.TextCell borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none' flexBasis={150} flexGrow={0} flexShrink={0}>
                                            {/* {product.type} */}
                                            {product.nameType}
                                        </Table.TextCell>
                                        <Table.TextCell flexBasis={120} flexGrow={0} flexShrink={0} borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'>
                                            <Switch checked={product.state}  onChange={(e) => changeState(product.id, e.target.checked)} textAlign='center' />
                                        </Table.TextCell>
                                        <Table.TextCell borderStyle='solid' borderColor='#CCCCCC' borderWidth='1px' borderTop='none'>
                                            <Button className='product-list-button' appearance="primary" intent="primary" marginRight={8} iconBefore={EditIcon} onClick={() => {setIsShown3(true); setProductDetail(product)}}>Edit</Button>
                                            <Button className='product-list-button' appearance="primary" intent="success" marginRight={8} onClick={() => {setIsShown2(true); detailProduct(product.id); }} iconBefore={InfoSignIcon}>Detail</Button>
                                            <Button className='product-list-button' appearance="primary" intent="danger" marginRight={8} onClick={() => {setIsShown4(true); setProductDetail(product)}} iconBefore={TrashIcon}>Delete</Button>
                                        </Table.TextCell>
                                    </Table.Row>
                                )
                            }
                            )
                        }
                        </Table.Body>
                </Table>
                </div>
                <React.Fragment>
                <SideSheet isShown={isShown2} onCloseComplete={() => setIsShown2(false)} title='Product Detail'>
                    
                    <div className='product-detail'>
                    <Heading size={900}>Product {productDetail.id} detail</Heading>
                        <h4 className='title-detail'>Name</h4>
                        <p className='detail-content'>{productDetail.name}</p>
                        <h4 className='title-detail'>Price</h4>
                        <p className='detail-content'>{productDetail.price}đ</p>
                        <h4 className='title-detail'>Quantity</h4>
                        <p className='detail-content'>{productDetail.quantity}</p>
                        <h3 className='title-detail'>Image</h3>
                        <img src={productDetail.imageUrl} alt="" width='90%' height='90%' />
                        <h3 className='title-detail'>Description</h3>
                        {/* description is a html */}
                        <div dangerouslySetInnerHTML={{__html: productDetail.description}}></div>
                    </div>
                </SideSheet>
                
                </React.Fragment>
        </div>
        </div>
        );
}
export default Product;

