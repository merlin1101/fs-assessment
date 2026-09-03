import { useState, useEffect } from 'react'
import axios from 'axios'
import Alert from './Alert'

const Products = () => {
    const [products, setProducts] = useState([])
    const [showAlert, setShowAlert] = useState(false)
    
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

    const addToCart = (event, productId) => {
        event.preventDefault()

        const form = event.target;
        const quantity = form.elements['quantity'].value
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

        const newItem = {
            'id': productId,
            'quantity': quantity
        }
        console.log(parseInt(newItem.quantity, 10))

        // Add logic for existing item qty update
        const existingItemIndex = existingCart.findIndex(item => item.id==newItem.id)
        if (existingItemIndex > -1) {
            // Item already exists, add quantities together securely
            const newQty = parseInt(existingCart[existingItemIndex].quantity, 10) + parseInt(newItem.quantity, 10) || 1;
            existingCart[existingItemIndex].quantity = newQty
        } else {
            // New item selection, append it
            existingCart.push(newItem);
        }

        localStorage.setItem('cart', JSON.stringify(existingCart));
        setShowAlert(true)
    }

    return (
        <>
            <h2>New Arrivals</h2>
            <section id='products-list' className='clearfix'>
                { products.map((product) => (
                    <div className='item' key={ product.id }>
                        <img src={ product.image } alt={ product.name } />
                        <h3>{ product.name }</h3>
                        <p className='price'>INR { product.price }</p>
                        <form onSubmit={(e) => addToCart(e, product.id) }>
                            <label htmlFor='quantity'>Qty</label>
                            <input type="number" name='quantity' defaultValue='1' min='1' id='quantity' />
                            <input type="hidden" name="productid" value={ product.id }/>
                            <button type='submit'>Add To Cart</button>
                        </form>
                    </div>
                ))}                
            </section>
            <Alert 
                message="Items added to cart!" 
                isVisible={showAlert} 
                onClose={() => setShowAlert(false)} 
            />
        </>
    )
}

export default Products