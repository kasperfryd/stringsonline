import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from "../../context/ContextProvider"
import Style from './cartpage.module.scss'
import {Link} from 'react-router-dom'


function BasketPage() {
    const { loginData, cart, getCart, setCart, setProductName } = useContext(AppContext);
    const [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        if (loginData.access_token) {
            getCart()
        }
        if (!loginData.access_token){
            setCart([])
        }
    }, [loginData])

    useEffect(() => {
        if (cart.cartlines){
            calculateTotal()
        }
    }, [cart,getCart])

    console.log(cart)

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
          getCart()
      }
      catch (error) {
          console.log(error)
        }
      }
  
      const updateCart = async (selectedID, selectedQuantity) => {
  
        if (selectedQuantity > 0){
            console.log(selectedID)
            console.log(selectedQuantity)
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
        let lines = cart && cart.cartlines
        var total = 0;
        for(var i=0; i<lines.length; i++){
            total += parseInt(lines[i].price) * lines[i].quantity;
        }
        setTotalPrice(total)
      }

    return (
        <section>
            <h2>Din kurv</h2>
            {cart.status === false ? <p>Ingen produkter i kurven</p> : null}
            <ul>
            {cart.cartlines && cart.cartlines.map((item, i) => { 
            return (
            <li className={Style.cartline} key={i}>
                <img src={item.image_fullpath} alt={item.name}></img>
                <p>{item.name}</p>
                <div>
                    <p>Antal:</p>
                    <button onClick={()=>{updateCart(item.product_id, (parseInt(item.quantity)+1))}}>+</button>
                    <p>{item.quantity}</p>
                    <button onClick={() =>{updateCart(item.product_id, (parseInt(item.quantity)-1))}}>-</button>
                </div>
                <p>DKK: {parseInt(item.price) * item.quantity}</p>
                <button onClick={()=>{removeFromCart(item.id)}}>X</button>
            </li>
            )
        })}
        </ul>
        <div className={Style.totalGrid}>
            {cart.cartlines ? 
            <>
            <p>Beløb</p>
            <div>DKK {totalPrice}<p>Prisen er inkl. moms</p></div> 
            <button onClick={()=>{clearCart()}}>Fjern alt fra kurven</button>
            </>
            : null}
            {!loginData.access_token ? <p>Log ind for at se din kurv</p> : null}
        </div>
        <Link to="/kassen"><button onClick={()=>{setProductName("Kassen");}}>Til kassen</button></Link>
        </section>
    )
}

export default BasketPage