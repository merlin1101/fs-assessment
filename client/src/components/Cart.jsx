import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [subtotal, setSubtotal] = useState(0)
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/checkout'); 
    };

    const emptyCart = () => {
        localStorage.removeItem('cart')
        location.reload()
    }

    const fetchCartItems = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || []

        axios.post('/api/cart', cart)
            .then(response => {
                setCartItems(response.data.cart)
                const cartData = response.data.cart
                const grandTotal = cartData.reduce((accumulator, item) => {
                    const price = Number(item.total)
                    return accumulator + price
                }, 0)
                setSubtotal(grandTotal.toFixed(2))
                localStorage.setItem('grandtotal', grandTotal.toFixed(2))
            })
            .catch(error => {
                console.error('Error fetching data', error)
            })
    }

    useEffect(() => {
        fetchCartItems()
    }, [])

    return (
        <>
        <div id='cart-content'>
            <h1>Shopping Cart</h1>
            <div id="cart-items">
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        { cartItems.map((item) => (
                            <tr key={ item.id }>
                                <td>{ item.name }</td>
                                <td>{ item.quantity }</td>
                                <td>{ item.total }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <aside className="subtotal">
                    <h2>Subtotal</h2>
                    <p className="grand-total"> { subtotal } </p>
                    <button className='checkout-btn' onClick={ handleClick }>Checkout</button>
                </aside>
            </div>
            <button onClick={ emptyCart }>Empty Cart</button>
        </div>
        </>
    )
}

export default Cart