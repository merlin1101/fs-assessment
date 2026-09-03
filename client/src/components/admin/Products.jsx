import { useState, useEffect } from 'react'
import { useNavigate  } from 'react-router-dom'
import axios from 'axios'

const Products = () => {
    const [products, setProducts] = useState([])
    const navigate = useNavigate();

    const fetchProducts = () => {
        axios.get('/api/products')
            .then(response => {
                setProducts(response.data.products)
            })
            .catch(error => {
                console.error('Error fetching data', error)
            })    
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <>
            <div id='products-dashboard'>
                <h1>Products Dashboard</h1>
                <section id='add-product'>
                    <button onClick={ () => navigate('/admin/dashboard/product/new', { replace: true }) }>Add New Product</button>
                </section>
                <section id='products-list'>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            { products.map((product) => (
                                <tr key={ product.id }>
                                    <td>{ product.id }</td>
                                    <td>{ product.name }</td>
                                    <td>{ product.description }</td>
                                    <td>INR { product.price }</td>
                                    <td><img src={ product.image } alt={ product.name } /></td>
                                    <td>{ product.created_at }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    )
}

export default Products
