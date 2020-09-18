import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from "../../context/ContextProvider"
import Style from './history.module.scss'

function HistoryPage() {

    // Imports from context
    const { loginData } = useContext(AppContext);
    
    // States needed by components
    const [orderData, setOrderData] = useState([])

    // Function to get all orders by user token
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
            setOrderData(data)
        }
        catch (error) {
            console.log(error)
        }
    }

    // Function to convert time stamp to human readable format
    const convertToData = (timestamp) => {
        let date = new Date(timestamp * 1000)
        let converted = date.toLocaleString("en-GB")
        return converted
    }

    // useEffect to get all orderHistory when component mounts
    useEffect(() => {
        if (loginData.access_token) {
            getOrderHistory()
        }
    }, [])

    // Return html
    return (
        loginData.access_token ?
            <ul className={Style.list}>
                {orderData.items && orderData.items.map((item, i) => {
                    return (
                        <li key={i} className={Style.listItem}>
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