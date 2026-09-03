import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Alert from '../Alert'

const NewProduct = () => {
    const navigate = useNavigate()
    const [product, setProduct] = useState({ name: '', description: '', price: ''})
    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)

    // Handle form fields dynamically
    const handleChange = (e) => {
        const { name, value } = e.target
        setProduct((prev) => ({ ...prev, [name]: value}))
    }

    // Handle image uploaded
    const handleImageChange = (e) => {
        setImage(e.target.files[0])
    }

    // Form submit
    const handleCreateProduct = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append('name', product.name)
        formData.append('description', product.description)
        formData.append('price', product.price)
        formData.append('image', image)

        try {
            const response = await axios.post('/api/product/create', formData)
            setShowAlert(true)
            navigate('/admin/dashboard/products', { replace:  true })
        } catch (error) {
            console.error('error: ', error.response?.data || error.message)
            alert('Failed to create product')
        } finally {
            setLoading(false)
        }        
    }

    return (
        <>
            <div id='create-product'>
                <h1>Create new product</h1>
                <form onSubmit={ handleCreateProduct }>
                    <div>
                        <label htmlFor="name">Product Name</label>
                        <input type="text" name="name" onChange={ handleChange } value={ product.name } required />
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="description" cols="30" rows="10" value={ product.description } onChange={ handleChange } required></textarea>
                    </div>
                    <div>
                        <label htmlFor="price">Price</label>
                        <input type="number" name="price" step="0.01" value={ product.price } onChange={ handleChange } required />
                    </div>
                    <div>
                        <label htmlFor="image">Image</label>
                        <input type="file" accept="image/*" name='image' id='image' onChange={ handleImageChange } required />
                    </div>
                    <button type="submit" disabled={ loading }>{ loading ? 'Creating...' : 'Submit' }</button>
                </form>
            </div>
            <Alert 
                message="Created new product!" 
                isVisible={showAlert} 
                onClose={() => setShowAlert(false)} 
            />
        </>
    )
}

export default NewProduct