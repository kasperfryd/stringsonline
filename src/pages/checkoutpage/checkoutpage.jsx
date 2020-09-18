import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from "../../context/ContextProvider"
import { useForm } from "react-hook-form"
import { Link } from 'react-router-dom'
import Style from './checkoutpage.module.scss'

function CheckoutPage() {

    const { loginData, setCartQuantity, cartQuantity } = useContext(AppContext);
    const [orderComplete, setOrderComplete] = useState([])
    const [latestOrder, setLatestOrder] = useState([])
    const [delivery, setDelivery] = useState()

    const getLatestOrder = async () => {
        let options = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${loginData.access_token}`,
            }
        }
        try {
            let url = `https://api.mediehuset.net/stringsonline/orders/${orderComplete.order_id}`
            const response = await fetch(url, options);
            const data = await response.json();
            setLatestOrder(data)
        }

        catch (error) {
            console.log(error)
        }
    }
    const submitOrder = async (data, e) => {

        e.target.reset();

        const formData = new URLSearchParams();
        formData.append('firstname', data.firstname.toString());
        formData.append('lastname', data.lastname.toString());
        formData.append('address', data.address.toString());
        formData.append('zipcode', parseInt(data.zip));
        formData.append('city', data.city);
        formData.append('email', data.email.toString());
        formData.append('status', 1);
        formData.append('delivery_address', data.delivery_address ? data.delivery_address.toString() : data.address.toString());
        formData.append('delivery_zipcode', data.delivery_zip ? parseInt(data.delivery_zip) : parseInt(data.zip));
        formData.append('delivery_city', data.delivery_city ? data.delivery_city.toString() : data.city.toString());

        let options = {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${loginData.access_token}`,
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }
        try {
            const url = `https://api.mediehuset.net/stringsonline/orders`
            const response = await fetch(url, options);
            const data = await response.json();
            setOrderComplete(data)
        }

        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (orderComplete.status === true) {
            setCartQuantity(0)
            getLatestOrder()
        }
    }, [orderComplete])

    const { register, handleSubmit, errors } = useForm(
        {
            mode: 'onBlur',
            reValidateMode: 'onChange',
        }
    );

    const calculateTax = (num) => {
        let tax = Math.round(num / 100 * 25)
        return tax + ".00"
    }

    const onSubmit = (data, e) => { submitOrder(data, e) }
    return (
        <main>
            {cartQuantity > 0 &&
                <form className={Style.formGrid} onSubmit={handleSubmit(onSubmit)}>
                    <div className={Style.addressGrid}>
                        <label><h2>Fakturering- {"&"} leveringsadresse</h2></label>

                        <input
                            placeholder={!errors.firstname ? "Fornavn" : "Udfyld fornavn"}
                            name={"firstname"}
                            ref={register({ required: true, pattern: /^[A-Za-z]+$/i })}
                            style={{ borderColor: errors.firstname && "red" }}>
                        </input>

                        <input
                            placeholder={!errors.lastname ? "Efternavn" : "Udfyld efternavn"}
                            name={"lastname"}
                            ref={register({ required: true })}
                            style={{ borderColor: errors.lastname && "red" }}>
                        </input>

                        <input
                            placeholder={!errors.address ? "Gade/vej og husnummer" : "Udfyld gade/vej og husnummer"}
                            name={"address"}
                            ref={register({ required: true })}
                            style={{ borderColor: errors.address && "red" }}>
                        </input>

                        <div>
                            <input
                                placeholder={!errors.zip ? "Postnummer" : "Udfyld postnr"}
                                name={"zip"}
                                ref={register({ required: true, maxLength: 4 })}
                                style={{ borderColor: errors.zip && "red" }}>
                            </input>
                            <input
                                placeholder={!errors.city ? "By" : "Udfyld by"}
                                name={"city"}
                                ref={register({ required: true })}
                                style={{ borderColor: errors.city && "red" }}>
                            </input>
                        </div>
                        <div className={Style.checkArea}>
                            <input className={Style.checkbox} type={'checkbox'} name={"deliveryoption"} onClick={() => delivery === true ? setDelivery(false) : setDelivery(true)}></input>
                            <label className={Style.checkboxLabel}>Anden leveringsadresse</label>
                        </div>
                    </div>
                    <div className={Style.phoneGrid}>
                        <label><h2>Email {"&"} telefon</h2></label>
                        <input
                            placeholder={!errors.email ? "Emailadresse" : "Udfyld emailadresse"}
                            name={"email"}
                            ref={register({ required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ })}
                            style={{ borderColor: errors.email && "red" }}></input>
                        <input
                            type="tel"
                            placeholder={!errors.phone ? "Telefonnummer" : "Udfyld telefonnummer"}
                            name={"phone"}
                            ref={register({ required: true, maxLength: 10 })}
                            style={{ borderColor: errors.phone && "red" }}></input>
                    </div>
                    <div className={Style.cardGrid}>
                        <label><h2>Betalingsmetode</h2></label>
                        <div>
                            <input className={Style.radioButton} type={"checkbox"} name={"banking"}></input>
                            <label>Bankoverførsel</label>
                        </div>
                        <div>
                            <div>
                                <input className={Style.radioButton} defaultChecked={true} type={"checkbox"} name={"card"}></input>
                                <label>Kreditkort</label>
                            </div>
                            <input
                                placeholder={!errors.cardnumber ? "Kortnummer" : "Udfyld kortnummer"}
                                name={"cardnumber"}
                                ref={register({ required: true, maxLength: 16 })}
                                style={{ borderColor: errors.cardnumber && "red" }}>
                            </input>
                            <input
                                type={"number"}
                                placeholder={!errors.month ? "Måned" : "Udfyld måned"}
                                name={"month"}
                                ref={register({ required: true, maxLength: 2 })}
                                style={{ borderColor: errors.month && "red" }}>
                            </input>
                            <input
                                type={"number"}
                                placeholder={!errors.year ? "År" : "Udfyld år"}
                                name={"year"}
                                ref={register({ required: true, maxLength: 4 })}
                                style={{ borderColor: errors.year && "red" }}>
                            </input>
                            <input
                                placeholder={!errors.pin ? "Kontrolciffer" : "Udfyld kontrolciffer"}
                                name={"pin"}
                                ref={register({ required: true, maxLength: 3 })}
                                style={{ borderColor: errors.pin && "red" }}>
                            </input>
                            <input
                                placeholder={!errors.cardholder ? "Kortindehaver" : "Udfyld kortindehaver"}
                                name={"cardholder"}
                                ref={register({ required: true })}
                                style={{ borderColor: errors.cardholder && "red" }}>
                            </input>
                        </div>
                    </div>
                    {delivery === true ?
                        <div>
                            <input
                                placeholder={!errors.address ? "Gade/vej og husnummer" : "Udfyld gade/vej og husnummer"}
                                name={"delivery_address"}
                                ref={register({ required: true })}
                                style={{ borderColor: errors.address && "red" }}>
                            </input>
                            <input
                                placeholder={!errors.zip ? "Postnummer" : "Udfyld postnr"}
                                name={"delivery_zip"}
                                ref={register({ required: true, maxLength: 4 })}
                                style={{ borderColor: errors.zip && "red" }}>
                            </input>
                            <input
                                placeholder={!errors.city ? "By" : "Udfyld by"}
                                name={"delivery_city"}
                                ref={register({ required: true })}
                                style={{ borderColor: errors.city && "red" }}>
                            </input>

                        </div> : <span></span>}
                    <span></span>
                    <input className={Style.payButton} value={"BETAL"} type="submit"></input>
                </form>}

            {latestOrder && latestOrder.order && latestOrder.order.orderlines &&
                <section className={Style.orderCompleteGrid}>
                    <section className={Style.completeContainer}>
                        <Link to="/stringsonline/forside"><button>TAK FOR DIN BESTILLING</button></Link>
                        <ul>
                            <li><p>Ordrenr.</p><p className={Style.colored}>{latestOrder.order.id}</p></li>
                            {latestOrder.order.orderlines.map((item, i) => {
                                return <li key={i} className={Style.listGridItem}><p>Produkt</p> <p className={Style.colored}>{item.name}</p> <p>{item.quantity} stk.</p> <p>DKK {item.price}</p></li>
                            })}
                            <li className={Style.tax}><p>Moms</p><p>DKK {calculateTax(latestOrder.order.total)}</p></li>
                            <li className={Style.total}><p>I alt</p><p>DKK {latestOrder.order.total}</p></li>
                        </ul>
                    </section>
                    <aside>
                        <div>
                            <h3>Faktureringsadresse</h3>
                            <p>{latestOrder.order.name}</p>
                            <p>{latestOrder.order.address}</p>
                            <p>{latestOrder.order.zipcode} {latestOrder.order.city}</p>
                        </div>
                        <div>
                            <h3>Leveringsadresse</h3>
                            <p>{latestOrder.order.name}</p>
                            <p>{latestOrder.order.delivery_address}</p>
                            <p>{latestOrder.order.delivery_zipcode} {latestOrder.order.delivery_city}</p>
                        </div>
                    </aside>
                </section>
            }
        </main>
    )
}

export default CheckoutPage