import React, {useContext, useState} from 'react'
import Style from './productpage.module.scss'
import { AppContext } from "../../context/ContextProvider"

function ProductPage(){

    const {data, setProductID, setProductName, doFetch, addToCart} = useContext(AppContext);
    const [avgRating, setAvgRating] = useState([])

    const getRating = (id) => {
        let url=`https://api.mediehuset.net/stringsonline/ratings/average/${id}`
        let res = doFetch(url)
        setAvgRating(res)
    }


    console.log(data)
    //console.log("Rating, ", avgRating)
    return(

        data.items ? 
        <section>
            <h3>{data.items.title}</h3>
            <h5>{data.items.subgroup && data.items.subgroup.title}</h5>
            <section className={Style.gridContainer}>
            {data.items.subgroup && data.items.subgroup.products && data.items.subgroup.products.map((item, i)=>{
                return (
                    <div className={Style.gridItem} key={i}>
                        <img onClick={() => {setProductID(item.id); setProductName(item.name); getRating(item.id)}} src={item.image_fullpath} alt={item.name}></img>
                        <article>
                            <h3>{item.name}</h3>
                            <p>{item.description_short}</p>
                        </article>
                        <div>
                            <div>{item.offerprice === "0.00" ?<p>Pris: {item.price}</p> : <p className={Style.offer}>Tilbud: {item.offerprice}</p>}</div>
                            <button onClick={()=>{addToCart(item.id)}}>Læg i kurv</button>
                            <p>{item.stock}+ på lager</p>
                        </div>
                    </div>
                    )
                })}

                {data.items.subgroup && !data.items.subgroup.products && data.items.subgroup.product && 
                    <>
                    <img className={Style.topImage} src={data.items.subgroup.product.image.fullpath} alt={data.items.subgroup.product.title}></img>
                    <div className={Style.detailContainer}>
                        <article>
                            <h3>{data.items.subgroup.product.name}</h3>
                            <p>{data.items.subgroup.product.description_long}</p>
                        </article>
                        <div className={Style.detailPriceContainer}>
                            <img className={Style.brandLogo} src={`https://api.mediehuset.net/images/stringsonline/brands/${data.items.subgroup.product.brand.toLowerCase()}.png`} alt={data.items.subgroup.product.name}></img>
                            <div>{data.items.subgroup.product.offerprice === "0.00" ? <p>Pris {data.items.subgroup.product.price}</p> : <p className={Style.offer}>Tilbud: {data.items.subgroup.product.offerprice}</p>}</div>
                            <input defaultValue="1"></input>
                            <button onClick={()=>{addToCart(data.items.subgroup.id)}}>Læg i kurv</button>
                            <p>{data.items.subgroup.product.stock}+ på lager</p>
                            <p>Rating</p>
                        </div>
                    </div>
                    </>
                }
                </section>
        </section>
        : <p>Indlæser siden</p>
    )
}

export default ProductPage