import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from "../../context/ContextProvider"
import Style from './history.module.scss'

function HistoryPage(){

    const [orderData, setOrderData] = useState([])
    const { loginData } = useContext(AppContext);


    const getOrderHistory = async () => {
        let options = {
            headers: {
                'Authorization': `Bearer ${loginData.access_token}`,
            }
        }

        try {
            const url = `https://api.mediehuset.net/stringsonline/orders`
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data)
            setOrderData(data)
        }
        
        catch (error) {
            console.log(error)
        }
    }

    const convertToData = (timestamp) => {
            let date = new Date(timestamp * 1000)
            let converted = date.toLocaleString("en-GB")
            return converted 
    }

    useEffect(() => {
        if (loginData.access_token){
            getOrderHistory()
        }
    }, [])

    return (
        loginData.access_token ? 
        <ul>
            {orderData.items && orderData.items.map((item, i) =>{
               return (
                <li className={Style.listItem}>
                    <p>{convertToData(item.created)}</p>
                    <p>DKK {item.total}</p>
                    <p className={Style.colored}>Ordrenr {item.id}</p>
                </li>
               )
            })}
        </ul>
        
        : <h2>Log ind for at se ordrehistorik</h2>
    )
}

export default HistoryPage