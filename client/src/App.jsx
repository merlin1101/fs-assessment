import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Layout from './layout/Layout'
import Home from './components/Home'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Success from './components/Success'
import Admin from './layout/Admin'
import DashboardLayout from './layout/DashboardLayout'
import Dashboard from './components/admin/Dashboard'
import Products from './components/admin/Products'
import NewProduct from './components/admin/NewProduct'
import Orders from './components/admin/Orders'
import OrderView from './components/admin/OrderView'
import LoginPage from './components/admin/LoginPage'
import ProtectedRoute from './components/admin/ProtectedRoute'
import './App.css'

function App() {
  const isLoggedIn = localStorage.getItem('loggedin');

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={ <Layout /> }>
            <Route index element={ <Home /> } />
            <Route path='/cart' element={ <Cart /> } />
            <Route path='/checkout' element={ <Checkout /> } />
            <Route path='/checkout/success' element={ <Success /> } />
          </Route>
          <Route path='/admin' element={ <Admin /> } >
            <Route index element={ isLoggedIn ? <Navigate to="dashboard" replace /> : <LoginPage /> } />
            <Route element={ <ProtectedRoute isLoggedIn={isLoggedIn} /> }>
              <Route path='dashboard' element={ <DashboardLayout /> } >
                <Route index element={ <Dashboard /> } />
                <Route path='products' element={ <Products /> } />
                <Route path='product/new' element={ <NewProduct /> } />
                <Route path='orders' element={ <Orders /> } />
                <Route path='order/:id' element={ <OrderView /> } />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
