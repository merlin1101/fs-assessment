import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn }) => {
  return (
    <>
      { isLoggedIn ? <Outlet /> : <Navigate to="/admin" replace /> }
    </>
  )
}

export default ProtectedRoute

// export default function ProtectedRoute({ isLoggedIn }) {
//   // If logged in, let them through; if not, always boot them to /admin
//   return isLoggedIn ? <Outlet /> : <Navigate to="/admin" replace />;
// }
