import { useNavigate } from "react-router-dom"

const Success = () => {
    const navigate = useNavigate()

    setTimeout(() => {
      navigate('/', { replace:  true })
    }, 3000);

    return (
        <>
            <h1>Order Placed Successfully</h1>
        </>
    )
}

export default Success