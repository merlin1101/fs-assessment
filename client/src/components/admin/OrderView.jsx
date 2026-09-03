import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import axios from "axios";

const OrderView = () => {
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            
            const response = await axios.post('/api/order/view', {
                id: parseInt(id, 10)
            });
            
            if (response.data) {
                setOrderData(response.data.orderData);
            }
        } catch (error) {
            console.error("Failed to load order data", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrder()
    }, [id])

    if (loading) return <p>Loading order data...</p>;
    if (!orderData) return <p>Order record not found.</p>;

    return (
        <>
            <section id="order-view-dashboard">
                <h1>Order #{ orderData.order.id } Details</h1>
                <div className="customer-details">
                    <p>Customer Name: {orderData.order.customer_name}</p>
                    <p>Customer Email: {orderData.order.customer_email}</p>
                </div>
                <div className="order-items">
                    <table>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            { orderData.orderItems.map((orderItem) => (
                                <tr key={ orderItem.product_id }>
                                    <td>{ orderItem.product_id }</td>
                                    <td>{ orderItem.product_name }</td>
                                    <td>{ orderItem.price }</td>
                                    <td>{ orderItem.quantity }</td>
                                    <td>{ orderItem.subtotal }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="order-details">
                    <p>Total: {orderData.order.total_amount}</p>
                    <p>Created At: {orderData.order.created_at}</p>
                </div>
            </section>
        </>
    )
}

export default OrderView