import { useState, useEffect } from 'react'
import { useNavigate  } from 'react-router-dom'
import axios from 'axios'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const navigate = useNavigate();

    const fetchOrders = () => {
        axios.get('/api/orders')
            .then(response => {
                setOrders(response.data.orders)
            })
            .catch(error => {
                console.error('Error fetching data', error)
            })    
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <>
            <div id='orders-dashboard'>
                <h1>Order Dashboard</h1>
                <section id='orders-list'>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            { orders.map((order) => (
                                <tr key={ order.id }>
                                    <td>{ order.id }</td>
                                    <td>{ order.customer_name }</td>
                                    <td>{ order.customer_email }</td>
                                    <td>{ order.total_amount }</td>
                                    <td>{ order.status }</td>
                                    <td>{ order.created_at }</td>
                                    <td>
                                        <button onClick={ () => navigate(`/admin/dashboard/order/${order.id}`, { replace: true }) }>View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    )
}

export default Orders
