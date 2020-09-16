import React, {useContext} from 'react'
import { AppContext } from "../../context/ContextProvider"
import { useForm } from "react-hook-form"
import Style from './checkoutpage.module.scss'

function CheckoutPage() {

    const {loginData, getCart} = useContext(AppContext);


    const { register, handleSubmit, errors } = useForm(
        {
            mode: 'onBlur',
            reValidateMode: 'onChange',
        }
    );

    const onSubmit = (data, e) => { console.log(data); e.target.reset(); submitOrder(data) }


    const submitOrder = async (data) => {

        const formData = new URLSearchParams();
            formData.append('firstname', data.firstname);
            formData.append('lastname', data.lastname);
            formData.append('address', data.address);
            formData.append('zipcode', data.zip);
            formData.append('city', data.city);
            formData.append('email', data.email);
            formData.append('status', 1);
            formData.append('delivery_address', data.address);
            formData.append('delivery_zipcode', data.zip);
            formData.append('delivery_city', data.city);
       
            
            let options = {
                method: "POST",
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


    return (
        <form className={Style.formGrid} onSubmit={handleSubmit(onSubmit)}>
            <div className={Style.addressGrid}>
                <label><h2>Fakturering- {"&"} leveringsadresse</h2></label>

                <input
                    placeholder={!errors.firstname ? "Fornavn" : "Udfyld fornavn"}
                    name={"firstname"}
                    ref={register({ required: true, pattern: /^[A-Za-z]+$/i })}
                    style={{borderColor: errors.firstname && "red" }}>
                </input>

                <input
                    placeholder={!errors.lastname ? "Efternavn" : "Udfyld efternavn"}
                    name={"lastname"}
                    ref={register({ required: true, pattern: /^[A-Za-z]+$/i })}
                    style={{borderColor: errors.lastname && "red" }}>
                </input>

                <input
                    placeholder={!errors.address ? "Gade/vej og husnummer" : "Udfyld gade/vej og husnummer"}
                    name={"address"}
                    ref={register({ required: true })}
                    style={{borderColor: errors.address && "red" }}>
                </input>

                <div>
                    <input
                        placeholder={!errors.zip ? "Postnummer" : "Udfyld postnr"}
                        name={"zip"} 
                        ref={register({ required: true, maxLength: 4 })}
                        style={{borderColor: errors.zip && "red" }}>
                    </input>
                    <input
                        placeholder={!errors.city ? "By" : "Udfyld by"}
                        name={"city"}
                        ref={register({ required: true, pattern: /^[A-Za-z]+$/i })}
                        style={{borderColor: errors.city && "red" }}>
                    </input>
                </div>
            </div>
            <div className={Style.phoneGrid}>
                <label><h2>Email {"&"} telefon</h2></label>
                <input
                    placeholder={!errors.email ? "Emailadresse" : "Udfyld emailadresse"}
                    name={"email"}
                    ref={register({ required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ })}
                    style={{borderColor: errors.email && "red" }}></input>
                <input
                    type="tel"
                    placeholder={!errors.phone ? "Telefonnummer" : "Udfyld telefonnummer"}
                    name={"phone"}
                    ref={register({required: true, maxLength: 10 })}
                    style={{borderColor: errors.phone && "red" }}></input>
            </div>
            <div className={Style.cardGrid}>
                <label><h2>Betalingsmetode</h2></label>
                <div>
                    <input className={Style.radioButton} type={"radio"} name={"banking"}></input>
                    <label>Bankoverførsel</label>
                </div>
                <div>
                    <div>
                        <input className={Style.radioButton} defaultChecked={true} type={"radio"} name={"card"}></input>
                        <label>Kreditkort</label>
                    </div>
                    <input
                        placeholder={!errors.cardnumber ? "Kortnummer" : "Udfyld kortnummer"}
                        name={"cardnumber"}
                        ref={register({ required: true, maxLength: 16 })}
                        style={{borderColor: errors.cardnumber && "red" }}>
                    </input>
                    <input
                        type="number"
                        placeholder={!errors.month ? "Måned" : "Udfyld måned"}
                        name={"month"}
                        ref={register({ required: true,maxLength: 2 })}
                        style={{borderColor: errors.month && "red" }}>
                    </input>
                    <input
                        type={"number"}
                        placeholder={!errors.year ? "År" : "Udfyld år"}
                        name={"year"}
                        ref={register({ required: true,maxLength: 4 })}
                        style={{borderColor: errors.year && "red" }}>
                    </input>
                    <input
                        placeholder={!errors.pin ? "Kontrolciffer" : "Udfyld kontrolciffer"}
                        name={"pin"}
                        ref={register({ required: true, maxLength: 3 })}
                        style={{borderColor: errors.pin && "red" }}>
                    </input>
                    <input
                        placeholder={!errors.cardholder ? "Kortindehaver" : "Udfyld kortindehaver"}
                        name={"cardholder"}
                        ref={register({ required: true })}
                        style={{borderColor: errors.cardholder && "red" }}>
                    </input>
                </div>
            </div>
            <span></span>
            <span></span>
            <input className={Style.payButton} value={"BETAL"} type="submit"></input>
        </form>
    )
}

export default CheckoutPage