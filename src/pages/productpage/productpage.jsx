import React, { useContext, useState } from 'react'
import Style from './productpage.module.scss'
import { AppContext } from "../../context/ContextProvider"
import ReactStars from 'react-stars'

function ProductPage() {

    // Imports from context
    const { data, setProductID, setProductName, doFetch, addToCart, productID, loginData, } = useContext(AppContext);
    
    // States needed by component
    const [sorted, setSorted] = useState([])
    const [sortedStatus, setSortedStatus] = useState(false)
    const [avgRating, setAvgRating] = useState([])
    const [amount, setAmount] = useState(1)

    // Function to sort the array from type
    const sortArray = (type, array) => {
        const types = {
            price: 'price',
            name: 'name',
            stock: 'stock',
        };
        const sortProperty = types[type];
        const sorted = [...array].sort((a, b) => b[sortProperty] - a[sortProperty]);
        console.log(sorted);
        setSortedStatus(true)
        setSorted(sorted);
    };

    // Function to get rating for specific ID
    const getRating = async (id) => {
        let url = `https://api.mediehuset.net/stringsonline/ratings/average/${id}`
        let res = await doFetch(url)
        setAvgRating(res)
    }

    // Function to check if user has rated specific product
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

    // Function to POST rating with number of stars and product id
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

    // Function to handle ratings onChange from react stars 
    const ratingChanged = async (newRating) => {
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

    // Return html
    return (
        data.items ?
            <section className={Style.productWrapper}>
                {data.items && data.items.subgroup && !data.items.subgroup.product &&
                    <select className={Style.sortBar} onChange={(e) => { sortArray(e.target.value, data.items.subgroup.products) }}>
                        <option value={null}>Vælg</option>
                        <option value="price">Pris</option>
                        <option value="name">Navn</option>
                        <option value="stock">På lager</option>
                    </select>
                }
                <section className={Style.gridContainer}>
                    {sortedStatus === false && data.items.subgroup && data.items.subgroup.products && data.items.subgroup.products.map((item, i) => {
                        return (
                            <section className={Style.gridItem} key={i}>
                                <img onClick={() => { setSortedStatus(false); setProductID(item.id); setProductName(item.name); getRating(item.id) }} src={item.image_fullpath} alt={item.name}></img>
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

                    {sortedStatus === true && !data.items.subgroup.product && sorted && sorted.map((item, i) => {
                        return (
                            <section className={Style.gridItem} key={i}>
                                <img onClick={() => { setProductID(item.id); setProductName(item.name); getRating(item.id) }} src={item.image_fullpath} alt={item.name}></img>
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

                    {data.items.subgroup && !data.items.subgroup.products && data.items.subgroup.product &&
                        <section className={Style.detailContainer}>
                            <img className={Style.topImage} src={data.items.subgroup.product.image.fullpath} alt={data.items.subgroup.product.title}></img>
                            <article>
                                <h2>{data.items.subgroup.product.name}</h2>
                                <p>{data.items.subgroup.product.description_long}</p>
                            </article>
                            <div className={Style.detailPriceContainer}>
                                <img className={Style.brandLogo} src={data.items.subgroup.product.brand_image} alt={data.items.subgroup.product.name}></img>
                                {data.items.subgroup.product.offerprice === "0.00" ? <p className={Style.price}>Pris DKK {data.items.subgroup.product.price}</p> : <p className={Style.offer}>Tilbud: DKK {data.items.subgroup.product.offerprice}</p>}
                                <span className={Style.priceContainer}>
                                    <input defaultValue="1" onChange={(e) => setAmount(e.target.value)}></input>
                                    <button onClick={() => { addToCart(data.items.subgroup.id, amount) }}>Læg i kurv</button>
                                </span>
                                <span className={Style.moveRight}>
                                    <p>{data.items.subgroup.product.stock}+ på lager</p>
                                    <ReactStars count={5} half={false} value={parseInt(avgRating.average_num_stars)} onChange={ratingChanged} size={24} color2={'#ffd700'} />
                                </span>
                            </div>
                        </section>
                    }
                </section>
            </section>
            : <p>Indlæser siden</p>
    )
}

export default ProductPage