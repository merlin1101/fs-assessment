import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Checkout = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [cod, setCod] = useState(false)

    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const grandTotal = localStorage.getItem('grandtotal') || 0

    const placeOrder = (e) => {
        e.preventDefault()

        const customerData = {
            'name': name,
            'email': email,
            'address': address,
            'cod': cod
        }

        const orderData = {
            'customerData': customerData,
            'cartData': cart,
            'grandTotal': grandTotal
        }

        axios.post('/api/placeorder', orderData)
            .then((response) => {
                console.log('order placed succefully')
                localStorage.removeItem('cart')
                navigate('/checkout/success', { replace:  true })
            })
            .catch((error) => {
                console.log(error)
                alert('something went wrong!')
            })
    }

    return (
        <>
            <h1>Checkout</h1>
            <div id="checkout">
                { cart.length > 0 ? (
                <form onSubmit={ placeOrder }>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" value={ name } onChange={(e) => setName(e.target.value)} required/>
                    </div>
                    <div>
                        <label htmlFor="email">Email ID</label>
                        <input type="email" name="email" id="email" value={ email } onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div>
                        <label htmlFor="address">Address</label>
                        <textarea name="address" id="address" value={ address } onChange={(e) => setAddress(e.target.value)} required></textarea>
                    </div>
                    <div>
                        <label htmlFor="payment">Cash On Delivery</label>
                        <input type="radio" name="payment" id="payment" value={ cod } onChange={(e) => setCod(e.target.value)} required/>
                    </div>
                    <button type="submit">Place Order</button>
                </form>
                ) : (
                    <p>Cart is empty</p>
                )}
            </div>
        </>
    )
}

export default Checkout