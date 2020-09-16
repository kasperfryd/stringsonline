import React, {useState, useEffect, useContext} from 'react'
import Style from './frontpage.module.scss'
import { AppContext } from "../../context/ContextProvider"
import { Link } from 'react-router-dom';
import heroImg from '../../assets/hero-banner.png';

function FrontPage(){

    const {data, setProductID, setProductName, doFetch, setGroupID, setGroupName, setSubID, setSubgroupName, addToCart, getCart} = useContext(AppContext);
    const [heroData, setHeroData] = useState([])
    const [allData, setAllData] = useState([])

    const getHeroProduct = async (id) => {
        let url = `https://api.mediehuset.net/stringsonline/products/${id}`
        let res = await doFetch(url)
        setHeroData(res)
    }

    const getAllData = async () => {
        let url = `https://api.mediehuset.net/stringsonline/`
        let res = await doFetch(url)
        setAllData(res)
    }

    useEffect(() => {
        getHeroProduct(16)
        getAllData()
    }, [])

    console.log(heroData)
    console.log(allData)

    return(
        heroData.item ? 
        <div>
        <section className={Style.hero}>        
            <div className={Style.heroImage} style={{backgroundImage:`url(${heroImg})`}}></div>
            <article>
                <h3>{heroData.item.brand}</h3>
                <h4>{heroData.item.name}</h4>
                <p>Se den nye generation halvakustiske</p>
                <Link to="/guitarer/westernguitarer"><button onClick={()=>{setGroupID(2); setSubID(3); setProductID(15); setGroupName("Guitarer"); setSubgroupName("Westerguitarer"); setProductName(heroData.item.name)}}>Læs mere</button></Link>
            </article>
        </section>
        <span></span>
        <h2>Kundernes <b>favoritter</b></h2>
        <section className={Style.favoriteGrid}>
            {allData.productgroups && allData.productgroups.items[0].subgroups[0].products.map((item, i) => {
                return(
                    i < 4 ?
                    <div className={Style.favoriteGridItem}>
                        <img src={item.image_fullpath} alt={item.name}/>
                        <section>
                            <h2>{item.brand + item.name}</h2>
                            <p>{item.description_short}</p>
                            <div>
                                {item.price}
                                <button onClick={()=>{addToCart(item.id)}}>Læg i kurv</button>
                            </div>
                        </section>
                    </div>
                    : null
                    ) 
            })}
        </section>
        </div>
        
        : <p>Loading...</p>
    )
}

export default FrontPage