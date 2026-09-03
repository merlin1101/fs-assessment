import Products from './Products'
import heroimage from '../assets/hero-img.png'
import bottombanner from '../assets/bottom-banner.png'

const Home = () => {
    return (
        <>
            <div id='hero-section'>
                <img src={ heroimage } alt="hero section" />
            </div>
            <div id='new-arrivals'>
                <Products />
            </div>
            <div id='bottom-banner'>
                <img src={ bottombanner } alt="bottom banner" />
            </div>
        </>
    )
}

export default Home