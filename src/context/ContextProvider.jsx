import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {

// Here goes all states, functions etc. that need to be part of the global scope.
const [loginData, setLoginData] = useState([])
const [data, setData] = useState([])
const [searchRes, setSearchRes] = useState([])

  // useEffect der gemmer logindata fra sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setLoginData(JSON.parse(sessionStorage.getItem("token")))
    }
  }, [setLoginData])

  // Funktion til at lave fetch - sendes med ind i de komponenter der skal fetche
  async function doFetch(url) {
    try {
      const response = await fetch(url)
      const data = await response.json()
      return data
    }
    catch (error) {
      console.log(error)
    }
  }

    // States to save specified ID's 
    const [groupID, setGroupID] = useState(0)
    const [subID, setSubID] = useState(0)
    const [productID, setProductID] = useState(0)

    // States to save names of selected
    const [groupName, setGroupName] = useState("")
    const [subGroupName, setSubgroupName] = useState("")
    const [productName, setProductName] = useState("")

    // Fetch function
    const fetchData = async (groupid, subid, productid) => {

        let url = `https://api.mediehuset.net/stringsonline/groups${!groupName == "" && groupid ? "/" + groupid : ''}${!subGroupName == "" ? '/subgroup' : ''}${!subGroupName == "" && subid ? "/" + subid : ''}${!productName == "" ? '/product' : ''}${!productName == "" && productid ? "/" + productid : ''}`

        console.log(url)
        try {
            const response = await fetch(url)
            const data = await response.json()
            setData(data)
        }
        catch (error) {
            console.log(error)
        }
    }

    // UseEffect that runs every time a state changes and re-fetches
    useEffect(() => {
        // re-fetch
        console.log("Group ID is" + groupID)
        console.log("Sub ID is" + subID)
        console.log("Product ID is" + productID)

        let group_id = groupID
        let sub_id = subID
        let product_id = productID

        fetchData(group_id, sub_id, product_id)

        //eslint-disable-next-line
    }, [groupID, subID, productID, groupName, subGroupName, productName])

// Return AppContext.Provider with value={ALL THE VALUES}
    return (
        <AppContext.Provider value={{
          doFetch, 
          loginData, 
          setLoginData,
          groupID,
          setGroupID,
          subID,
          setSubID,
          productID,
          setProductID,
          groupName,
          setGroupName,
          subGroupName,
          setSubgroupName,
          productName,
          setProductName,
          searchRes,
          setSearchRes,
          data
          }}>
            {children}
        </AppContext.Provider>
    );
}

// Now import {AppContextProvider} from './context/ContextProvider'; in Top Hierachi (index.js)
// Then import { AppContext } from "../../context/ContextProvider" inside component that subscribes &  declare it with: const {testState, setTestState } = useContext(AppContext);

export { AppContext, AppContextProvider } 