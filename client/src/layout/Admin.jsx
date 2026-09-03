import { Outlet } from 'react-router-dom';

const Admin = () => {
    const isLoggedIn = localStorage.getItem('loggedin');
    
    return (
        <>
            <main className="admin-layout-wrapper"> 
                <Outlet />
            </main>
        </>
    )
}

export default Admin