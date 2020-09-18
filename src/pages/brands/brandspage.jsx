import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from "../../context/ContextProvider"
import Style from './brands.module.scss'
import ReactStars from 'react-stars'


function BrandsPage() {

    const { brandID, doFetch, addToCart, setProductName, loginData, productID, productName, setProductID } = useContext(AppContext);
    const [brand, setBrand] = useState([])
    const [avgRating, setAvgRating] = useState([])
    const [amount, setAmount] = useState(1)
    const [selected, setSelected] = useState([])

    const getBrandDetails = async () => {
        let url = `https://api.mediehuset.net/stringsonline/brands/${brandID}`
        let res = await doFetch(url)
        setBrand(res)
    }

    const getRating = async (id) => {
        let url = `https://api.mediehuset.net/stringsonline/ratings/average/${id}`
        let res = await doFetch(url)
        setAvgRating(res)
    }

    const getProductByID = async (id) => {
        let url = `https://api.mediehuset.net/stringsonline/products/${id}`
        let res = await doFetch(url)
        setSelected(res)
    }

    const hasUserRated = async (id) => {
        let options = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${loginData.access_token}`
            }
        }
        try {
            let url = `https://api.mediehuset.net/stringsonline/ratings/${id}`
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data)
            if (data.status === false) {
                return false
            }
            else if (data.status === true) {
                return true
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const sendRating = async (rating) => {

        console.log("rating er ", rating)
        console.log("product id er", productID)

        const formData = new URLSearchParams();
        formData.append("product_id", parseInt(productID))
        formData.append("num_stars", parseInt(rating))

        let options = {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${loginData.access_token}`
            }
        }
        try {
            let url = `https://api.mediehuset.net/stringsonline/ratings`
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data)
        }
        catch (error) {
            console.log(error)
        }
    }

    const ratingChanged = async (newRating) => {
        console.log(newRating)
        if (loginData.access_token) {
            let status = await hasUserRated(productID)

            if (status === false) {
                await sendRating(newRating)
                await getRating(productID)
                window.alert(`Vi har modtaget din bedømmelse af produktet - Du har givet produktet ${newRating} stjerner`)
            }
            if (status === true) {
                await getRating(productID)
                window.alert("Du har allerede bedømt dette produkt")
            }
        }
        else {
            window.alert("Du skal være logget ind for at bedømme et produkt")
        }
    }

    useEffect(() => {
        if (brandID !== 0) {
            getBrandDetails()
        }
    }, [])

    return (
        <section className={Style.productWrapper}>
            {productName === "" && brand && brand.item &&
                <section className={Style.topGrid}>
                    <img className={Style.brandImage} src={brand.item.image_fullpath} alt={brand.item.image_filename}></img>
                    <article className={Style.brandContainer}>
                        <h2>{brand.item.title}</h2>
                        <p>{brand.item.description}</p>
                    </article>
                </section>
            }

            <section className={Style.gridContainer}>
                {productName === "" && brand.item && brand.item.products && brand.item.products.map((item, i) => {
                    return (
                        <section className={Style.gridItem} key={i}>
                            <img onClick={() => { getProductByID(item.id); setProductID(item.id); setProductName(item.name); getRating(item.id) }} src={item.image_fullpath} alt={item.name}></img>
                            <article>
                                <h2>{item.name}</h2>
                                <p>{item.description_short}</p>
                            </article>
                            <div>
                                {item.offerprice === "0.00" ? <p className={Style.price}>Pris: DKK {item.price}</p> : <p className={Style.offer}>Tilbud: DKK {item.offerprice}</p>}
                                <button onClick={() => { addToCart(item.id, amount) }}>Læg i kurv</button>
                                <p>{item.stock}+ på lager</p>
                            </div>
                        </section>
                    )
                })}

                {productName !== "" && selected && selected.item &&
                    <section className={Style.detailContainer}>
                        <img className={Style.topImage} src={selected.item.image.fullpath} alt={selected.item.title}></img>
                        <article>
                            <h2>{selected.item.name}</h2>
                            <p>{selected.item.description_long}</p>
                        </article>
                        <div className={Style.detailPriceContainer}>
                            <img className={Style.brandLogo} src={selected.item.brand_image} alt={selected.item.name}></img>
                            {selected.item.offerprice === "0.00" ? <p className={Style.price}>Pris DKK {selected.item.price}</p> : <p className={Style.offer}>Tilbud: DKK {selected.item.offerprice}</p>}
                            <span className={Style.priceContainer}>
                                <input defaultValue="1" onChange={(e) => setAmount(e.target.value)}></input>
                                <button onClick={() => { addToCart(selected.item.id, amount) }}>Læg i kurv</button>
                            </span>
                            <span className={Style.moveRight}>
                                <p>{selected.item.stock}+ på lager</p>
                                <ReactStars count={5} half={false} value={parseInt(avgRating.average_num_stars)} onChange={ratingChanged} size={24} color2={'#ffd700'} />
                            </span>
                        </div>
                    </section>
                }
            </section>
        </section>
    )
}

export default BrandsPage