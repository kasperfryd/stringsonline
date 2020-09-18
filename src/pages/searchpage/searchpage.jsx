import React, { useContext, useState } from 'react'
import { AppContext } from "../../context/ContextProvider"
import Style from './searchpage.module.scss'
import ReactStars from 'react-stars'

function SearchPage() {

    // Imports from context
    const { searchRes, setProductName, doFetch, productName, addToCart, loginData } = useContext(AppContext)

    // States needed by component
    const [avgRating, setAvgRating] = useState([])
    const [selected, setSelected] = useState([])
    const [sorted, setSorted] = useState([])
    const [sortedStatus, setSortedStatus] = useState(false)
    const [amount, setAmount] = useState(1)

    // Function to get product by specific id
    const getProductByID = async (id) => {
        let url = `https://api.mediehuset.net/stringsonline/products/${id}`
        let res = await doFetch(url)
        setSelected(res)
    }

    // Function to sort array by type
    const sortArray = (type, array) => {
        const types = {
            price: 'price',
            name: 'name',
            stock: 'stock',
        };
        const sortProperty = types[type];
        const sorted = [...array].sort((a, b) => b[sortProperty] - a[sortProperty]);
        setSortedStatus(true)
        setSorted(sorted);
    };

    // Function to get specific rating from ID
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

    // Function to POST rating with number of stars and product id
    const sendRating = async (rating, id) => {

        const formData = new URLSearchParams();
        formData.append("product_id", parseInt(id))
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

    // Function to handle rating onChange by react-stars component
    const ratingChanged = async (newRating) => {
        console.log(newRating)
        if (loginData.access_token) {
            let status = await hasUserRated(selected.item.id)

            if (status === false) {
                await sendRating(newRating, selected.item.id)
                await getRating(selected.item.id)
                window.alert(`Vi har modtaget din bedømmelse af produktet - Du har givet produktet ${newRating} stjerner`)
            }
            if (status === true) {
                await getRating(selected.item.id)
                window.alert("Du har allerede bedømt dette produkt")
            }
        }
        else {
            window.alert("Du skal være logget ind for at bedømme et produkt")
        }
    }

    // Return html
    return (
        <section className={Style.productWrapper}>
            {searchRes.items && productName === "" &&
                <select className={Style.sortBar} onChange={(e) => { sortArray(e.target.value, searchRes && searchRes.items) }}>
                    <option value={null}>Vælg</option>
                    <option value="price">Pris</option>
                    <option value="name">Navn</option>
                    <option value="stock">På lager</option>
                </select>
            }
            <section className={Style.gridContainer}>
                {sortedStatus === false && productName === "" && searchRes && searchRes.items && searchRes.items.map((item, i) => {
                    return (
                        <section className={Style.gridItem} key={i}>
                            <img onClick={() => { getProductByID(item.id); setProductName(item.name); getRating(item.id) }} src={item.image_fullpath} alt={item.name}></img>
                            <article>
                                <h3>{item.name}</h3>
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
                {sortedStatus === true && sorted && sorted.map((item, i) => {
                    return (
                        <section className={Style.gridItem} key={i}>
                            <img onClick={() => { setSortedStatus(false); getProductByID(item.id); setProductName(item.name); getRating(item.id) }} src={item.image_fullpath} alt={item.name}></img>
                            <article>
                                <h3>{item.name}</h3>
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

                {productName !== "" && sortedStatus === false && selected && selected.item &&
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

export default SearchPage