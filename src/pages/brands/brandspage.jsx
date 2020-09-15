import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from "../../context/ContextProvider"
import Style from './brands.module.scss'

function BrandsPage() {

    const { brandID, doFetch, addToCart } = useContext(AppContext);
    const [brand, setBrand] = useState([])

    const getBrandDetails = async () => {
        let url = `https://api.mediehuset.net/stringsonline/brands/${brandID}`
        let res = await doFetch(url)
        setBrand(res)
    }

    useEffect(() => {
        if (brandID !== 0){
            getBrandDetails()
        }
    }, [])

    console.log(brand)
    return (
        <section>
            {brand && brand.item &&
                <section className={Style.topGrid}>
                    <figure className={Style.imgWrapper}>
                        <img src={brand.item.image_fullpath} alt={brand.item.image_filename}></img>
                    </figure>
                    <article>
                        <h1>{brand.item.title}</h1>
                        <p>{brand.item.description}</p>
                    </article>
                </section>
            }
                <section className={Style.gridContainer}>
                    <h3>{brand && brand.item ? brand.item.title + " produkter" : null}</h3>
                    {brand && brand.item && brand.item.products && brand.item.products.map((item, i) => {
                        return (
                            <div className={Style.gridItem} key={i}>
                                <img src={item.image_fullpath} alt={item.name}></img>
                                <article>
                                    <h3>{item.name}</h3>
                                    <p>{item.description_short}</p>
                                </article>
                                <div>
                                    <p>Pris: {item.price}</p>
                                    <button onClick={()=>{addToCart(item.id)}}>Læg i kurv</button>
                                    <p>{item.stock}+ på lager</p>
                                </div>
                            </div>
                        )

                    })}
                </section>
        </section>
    )
}

export default BrandsPage