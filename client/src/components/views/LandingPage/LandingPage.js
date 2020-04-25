import React, { useState, useEffect } from 'react'
import { Icon, Col, Card, Row } from 'antd'
import { NavLink } from 'react-router-dom'
import Axios from 'axios';

import { PRODUCT_SERVER } from '../../Config'
import ImagesSlider from '../../Utils/ImagesSlider';
import SearchProduct from './Section/SearchProduct';

const { Meta } = Card;

function LandingPage() {
    const [Products, setProducts] = useState([]);
    const [Skip, setSkip] = useState(0);
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0);
    const [SearchTerms, setSearchTerms] = useState("")

    useEffect(() => {
        const variables = {
            skip: Skip,
            limit: Limit
        }
       getProducts(variables)
    }, [])

    const getProducts = (variables) => {
        Axios.post(`${PRODUCT_SERVER}/getProducts`, variables)
            .then(res => {
                if(res.data.success) {
                    if(variables.loadMore) {
                        setProducts([...Products, ...res.data.products]);
                    } else {
                        setProducts(res.data.products);
                    }
                    setPostSize(res.data.postSize);
                } else {
                    alert("Failed To Fetched datas")
                }
            })
    }

    const onloadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(variables)

        setSkip(skip)
    }

    const renderCards = Products.map((product, i) => {
        return (
            <div key={i}>
                <Col lg={6} md={8} xs={24}>
                    <Card
                        hoverable={true}
                        cover={<NavLink exact to={`/product/${product._id}`}><ImagesSlider img={product.images}/></NavLink>}
                        >
                        <Meta 
                            title={product.productName}
                            description={`$${product.price}`}

                        />
                    </Card>
                </Col>
            </div>
        )
    });

    const updateSearchTerms = (newSearchTerm) => {

        const variables = {
            skip: 0,
            limit: Limit,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerms(newSearchTerm)
        getProducts(variables)
    }
    return (
        <>
         <div style={{ width: "750px", margin: "3rem auto" }}>
            <div style={{ textAlign: "center" }}>
                <h2>Let's See What you Want <Icon type="rocket" /></h2>
            </div>

            {/* Filter */}

            {/* <CheckBox 
                handleFilter={filter => handleFilters(filter, "continents")}
            /> */}
             <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                <SearchProduct
                    refreshFunction={updateSearchTerms}
                />
            </div>
            {/* Search */}

            {Products.length === 0 ? 
                <div style={{ display: "flex", height: "300px", justifyContent: "center", alignItems: "center" }}>
                    <h2>No Post Yet.....</h2>
                </div> :
                <div>
                    <Row gutter={[16,16]}>
                        {renderCards}
                    </Row>
                </div>
            }
            <br />
            <br />

            {PostSize >= Limit && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button onClick={onloadMore}>Load More</button>
                </div>
            )}
        </div>
        </>
    )
}

export default LandingPage
