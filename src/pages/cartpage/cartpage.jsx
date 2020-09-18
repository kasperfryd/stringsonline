import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from "../../context/ContextProvider"
import Style from './cartpage.module.scss'
import { Link } from 'react-router-dom'


function BasketPage() {
    const { loginData, cart, getCart, setCart, setProductName, setCartQuantity } = useContext(AppContext);
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        if (loginData.access_token) {
            getCart()
        }
        if (!loginData.access_token) {
            setCart([])
        }
    }, [loginData])

    useEffect(() => {
        if (cart.cartlines) {
            calculateTotal()
        }
    }, [cart, getCart])

    const removeFromCart = async (selectedID) => {

        let formData = new FormData()
        formData.append("product_id", selectedID)

        let options = {
            method: "DELETE",
            body: formData,
            headers: {
                'Authorization': `Bearer ${loginData.access_token}`
            }
        }
        try {
            const url = `https://api.mediehuset.net/stringsonline/cart/${selectedID}`
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data)
            getCart()
        }
        catch (error) {
            console.log(error)
        }
    }

    const clearCart = async () => {

        let options = {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${loginData.access_token}`
            }
        }
        try {
            const url = `https://api.mediehuset.net/stringsonline/cart`
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data)
            setCartQuantity(0)
            getCart()
        }
        catch (error) {
            console.log(error)
        }
    }

    const updateCart = async (selectedID, selectedQuantity) => {

        if (selectedQuantity > 0) {
            const formData = new URLSearchParams();
            formData.append('product_id', selectedID);
            formData.append('field', 'quantity');
            formData.append('value', selectedQuantity);

            let options = {
                method: "PATCH",
                body: formData.toString(),
                headers: {
                    'Authorization': `Bearer ${loginData.access_token}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
            try {
                const url = `https://api.mediehuset.net/stringsonline/cart`
                const response = await fetch(url, options);
                const data = await response.json();
                console.log(data)
                getCart()
            }

            catch (error) {
                console.log(error)
            }
        }
    }

    const calculateTotal = () => {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        const priceArr = cart.cartlines.map((i) => { return parseInt(i.offerprice === "0.00" ? i.price * i.quantity : i.offerprice * i.quantity) })
        const total = priceArr.reduce(reducer)
        setTotalPrice(total)
    }

    return (
        <section>
            {!loginData.access_token && <h2 className={Style.error}>Du skal være logget ind for at se din kurv</h2>}
            {loginData.access_token && cart.status === false ? <h2 className={Style.error}>Ingen produkter i kurven</h2> : null}
            <ul className={Style.list}>
                {cart.cartlines && cart.cartlines.map((item, i) => {
                    return (
                        <li className={Style.cartline} key={i}>
                            <img src={item.image_fullpath} alt={item.name}></img>
                            <p>{item.name}</p>
                            <div>
                                <p>Antal:</p>
                                <button className={Style.quant} onClick={() => { updateCart(item.product_id, (parseInt(item.quantity) - 1)) }}>-</button>
                                <p>{item.quantity}</p>
                                <button className={Style.quant} onClick={() => { updateCart(item.product_id, (parseInt(item.quantity) + 1)) }}>+</button>
                            </div>
                            {item.offerprice === "0.00" ? <p className={Style.price}>Pris: {parseInt(item.price * item.quantity)}</p> : <p className={Style.offer}>Pris: {parseInt(item.offerprice * item.quantity)}</p>}
                            <button className={Style.delete} onClick={() => { removeFromCart(item.id) }}>X</button>
                        </li>
                    )
                })}
            </ul>
            <div className={Style.totalGrid}>
                {cart.cartlines ?
                    <>
                        <p>BELØB</p>
                        <span><p>DKK {totalPrice}</p><p>Prisen er inkl. moms</p></span>
                        <button onClick={() => { clearCart() }}>RYD</button>
                    </>
                    : null}
            </div>
            {cart.cartlines ? <Link to="/stringsonline/kassen"><button className={Style.toCart} onClick={() => { setProductName("Kassen"); }}>Til kassen</button></Link> : null}
        </section>
    )
}

export default BasketPage