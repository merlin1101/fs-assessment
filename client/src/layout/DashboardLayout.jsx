import { Outlet } from 'react-router-dom';
import { useNavigate } from "react-router-dom"

const Admin = () => {
    const navigate = useNavigate()

    const logOut = () => {
        localStorage.removeItem('loggedin')
        navigate('/admin', { replace:  true })
    }
    
    return (
        <>        
            <div id="dashboard">
                <aside>
                    <ul>
                        <li><a href="/admin/dashboard">Dashboard</a></li>
                        <li><a href="/admin/dashboard/products">Products</a></li>
                        <li><a href="/admin/dashboard/orders">Orders</a></li>
                        <li><button onClick={ logOut }>Log Out</button></li>
                    </ul>
                </aside>
                <div className='content'>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Admin