import cartimage from '../assets/cart-icon.png'
import logoimage from '../assets/fsassessment-logo.png'

const Header = () => {
    return (
        <>
            <header>
                <section className="content">
                    <div className="logo">
                        <a href='/'><img src={ logoimage } alt="logo" /></a>
                    </div>
                    <div className="right-section">
                        <a href="/">Home</a>
                        <a href="/cart" className='cart-icon'>
                            {/* <img src={ cartimage } alt="cart" /> */}
                            Cart</a>
                    </div>
                </section>
            </header>
        </>
    )
}

export default Header