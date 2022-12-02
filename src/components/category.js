import React from 'react';
import './category.css';
import { Table, TableHead, Button, SearchIcon } from 'evergreen-ui';

function Category() {
    return (
        <div className='category'>
            <div className='category-search'>
                <input type="text" placeholder='Search' className='category-search-input' />
                <Button className='category-search-button' appearance="primary" intent="primary" marginLeft={8} iconBefore={SearchIcon}>Search</Button>
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
                        <Table.Row>
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
                        </Table.Row>
                        </Table.Body>
                </Table>
                
            </div>
        </div>
        );
                

}

export default Category;