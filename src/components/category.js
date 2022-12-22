import React, {useState, useEffect} from 'react';
import './category.css';
import { Table, TableHead, Button, SearchIcon, Dialog, EditIcon, TrashIcon, toaster, AddIcon } from 'evergreen-ui';
import { getFirestore, getDocs, doc, collection, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import Navbar from './navbar';

function Category() {

    const [categories, setCategories] = useState([]);
    const getCategories = () => {
        const db = getFirestore();
        const categoriesRef = collection(db, 'type');
        const querySnapshot = getDocs(categoriesRef);
        const data = [];
        querySnapshot.then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            console.log(data);
            setCategories(data);
        });
    }


    // Dialog update
    const [isShown, setIsShown] = useState(false);
    const [categoryDetail, setCategoryDetail] = useState({});
    const getCategoryToUpdate = (category) => {
        setIsShown(true);
        setCategoryDetail(category);
    }
    const updateCategory = () => {
        const db = getFirestore();
        const categoryRef = doc(db, 'type', categoryDetail.id);
        updateDoc(categoryRef, {
            name: categoryDetail.name
        }).then(() => {
            getCategories();
            toaster.success('Update category successfully');
            setIsShown(false);
        }).catch((error) => {
            toaster.danger('Update category failed');
        });
    }


    // Dialog delete
    const [isShownDelete, setIsShownDelete] = useState(false);
    const [categoryDetailDelete, setCategoryDetailDelete] = useState({});
    const getCategoryToDelete = (category) => {
        setIsShownDelete(true);
        setCategoryDetailDelete(category);
    }
    const deleteCategory = () => {
        const db = getFirestore();
        const categoryRef = doc(db, 'type', categoryDetailDelete.id);
        deleteDoc(categoryRef).then(() => {
            getCategories();
            toaster.success('Delete category successfully');
            setIsShownDelete(false);
        }).catch((error) => {
            toaster.danger('Delete category failed');
        });
    }

    // Dialog add
    const [isShownAdd, setIsShownAdd] = useState(false);
    // const [id, setId] = useState('');
    const [name, setName] = useState('');
    const addCategory = () => {
        if(name === '') {
            toaster.danger('Name is required');
            return;
        }
        else{
            const db = getFirestore();
            const docId = Date.now().toString();
            const categoryRef = doc(db, 'type', docId);
            setDoc(categoryRef, {
                id: docId,
                name: name
            }).then(() => {
                getCategories();
                toaster.success('Add category successfully');
                setIsShownAdd(false);
            }).catch((error) => {
                toaster.danger('Add category failed');
            });
        }
    }

    // search by name
    const [search, setSearch] = useState('');
    const searchCategory = (category) => {
        if(search === '') {
            getCategories();
        }
        else{
            const db = getFirestore();
            const categoriesRef = collection(db, 'type');
            const querySnapshot = getDocs(categoriesRef);
            const data = [];
            querySnapshot.then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().name.toLowerCase().toString().includes(search.toString().toLowerCase())) {
                        data.push(doc.data());
                    }
                });
                setCategories(data);
            });
        }
    }



    
    useEffect(() => {
        getCategories();
    }, []);

        

    return (
        <div style={{width: '100%'}}>
            <Navbar />
            <div className='category'>
            <div className='category-search'>
                <input type="text" placeholder='Search with name' className='category-search-input' onChange={(e) => setSearch(e.target.value)} />
                <Button className='category-search-button' appearance="primary" intent="primary" marginLeft={8} height={40} iconBefore={SearchIcon} onClick={() => searchCategory()}>Search</Button>
                <div className='category-add'>
                    <Button className='category-add-button' appearance="primary" intent="success" marginLeft={8} height={40} iconBefore={AddIcon} onClick={() => setIsShownAdd(true)}>Add a new category</Button>
                </div>
                <Dialog
                    isShown={isShownAdd}
                    title="Add new category"
                    onCloseComplete={() => setIsShownAdd(false)}
                    confirmLabel="Add"
                    onConfirm={() => addCategory()}
                >
                    <div className='category-add-dialog'>
                        <div className='category-add-dialog-name'>
                            <label className="category-add-label">
                                <b>Name of new category</b>
                            </label>
                            <input type="text" placeholder='Enter category name' className='category-add-dialog-name-input' onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                </Dialog>

            </div>
            <div className='category-list'>
                <Table>
                    <Table.Head className='category-list-header' backgroundColor='#999999' color='#ffffff'>
                        <Table.TextHeaderCell>
                            ID
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Name
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell>
                            Management
                        </Table.TextHeaderCell>
                    </Table.Head>
                    <Table.Body>
                        {/* <Table.Row>
                            <Table.TextCell>
                                1
                            </Table.TextCell>
                            <Table.TextCell>
                                Category 1
                            </Table.TextCell>
                            <Table.TextCell>
                                <Button intent='warning' marginRight={16} appearance='primary'> Edit </Button>
                                <Button intent='danger' marginRight={16} appearance='primary'> Delete </Button>
                            </Table.TextCell>
                        </Table.Row> */}
                        {categories.map((category, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.TextCell>
                                        {category.id}
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        {category.name}
                                    </Table.TextCell>
                                    <Table.TextCell>
                                        <Button intent='warning' marginRight={16} appearance='primary' iconBefore={EditIcon} onClick={() => getCategoryToUpdate(category)}> Edit </Button>
                                        <Button intent='danger' marginRight={16} appearance='primary' iconBefore={TrashIcon} onClick={() => getCategoryToDelete(category)}> Delete </Button>
                                    </Table.TextCell>
                                </Table.Row>
                            );
                        })}
                        </Table.Body>
                </Table>
                <Dialog
                    isShown={isShown}
                    title="Update category"
                    onCloseComplete={() => setIsShown(false)}
                    confirmLabel="update"
                    onConfirm={() => updateCategory()}
                >
                    <div className='category-update'>
                        <div className='category-update-input'>
                            <label className='category-update-input-label'>ID</label>
                            <br/>
                            <input type="text" className='category-update-input-text' value={categoryDetail.id} disabled />
                            <br/>
                            <br/>
                            <label className='category-update-input-label'>Name</label>
                            <br/>
                            <input type="text" className='category-update-input-text' value={categoryDetail.name} onChange={(e) => setCategoryDetail({...categoryDetail, name: e.target.value})} />
                        </div>
                    </div>
                </Dialog>
                <Dialog
                    isShown={isShownDelete}
                    title="Delete category"
                    onCloseComplete={() => setIsShownDelete(false)}
                    confirmLabel="Delete"
                    intent='danger'
                    onConfirm={() => deleteCategory()}
                >
                    <div className='category-delete'>
                        <div className='category-delete-input'>
                            <p style={{color: 'red'}}><b>Are you sure to delete this category?</b></p>
                            <p>
                                <b>ID: </b>
                                {categoryDetailDelete.id}
                            </p>
                            <p>
                                <b>Name: </b>
                                {categoryDetailDelete.name}
                            </p>
                        </div>
                    </div>
                </Dialog>
                            
                
            </div>
        </div>
        </div>
        );
                

}

export default Category;