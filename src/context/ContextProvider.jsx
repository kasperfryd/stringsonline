import React, { createContext, useState, useEffect } from 'react';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  // Here goes all states, functions etc. that need to be part of the global scope.
  const [loginData, setLoginData] = useState([])
  const [data, setData] = useState([])
  const [searchRes, setSearchRes] = useState([])
  const [brandID, setBrandID] = useState(0)

  // States to save specified ID's 
  const [groupID, setGroupID] = useState(0)
  const [subID, setSubID] = useState(0)
  const [productID, setProductID] = useState(0)

  // States to save names of selected
  const [groupName, setGroupName] = useState("")
  const [subGroupName, setSubgroupName] = useState("")
  const [productName, setProductName] = useState("")

  // Cart states
  const [cart, setCart] = useState([])
  const [cartQuantity, setCartQuantity] = useState(0)

  // Function to do a fetch with URL as argument
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

  // Function to Fetch product data
  const fetchData = async (groupid, subid, productid) => {

    let url = `https://api.mediehuset.net/stringsonline/groups${groupName !== "" && groupid ? "/" + groupid : ''}${subGroupName !== "" ? '/subgroup' : ''}${subGroupName !== "" && subid ? "/" + subid : ''}${productName !== "" ? '/product' : ''}${productName !== "" && productid ? "/" + productid : ''}`

    if (url !== `https://api.mediehuset.net/stringsonline/groups/subgroup` && url !== `https://api.mediehuset.net/stringsonline/groups/product` && url !== `https://api.mediehuset.net/stringsonline/groups/${groupID}/product` && url !== `https://api.mediehuset.net/stringsonline/groups/${groupID}/product/${productID}`) {
      try {
        const response = await fetch(url)
        const data = await response.json()
        setData(data)
      }
      catch (error) {
        console.log(error)
      }
    }
  }

  // Function to get Cart
  const getCart = async () => {
    let options = {
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`
      }
    }
    try {
      const url = `https://api.mediehuset.net/stringsonline/cart`
      const response = await fetch(url, options);
      const data = await response.json();
      setCart(data);
    }
    catch (error) {
      console.log(error)
    }
  }

  // Function to add to cart
  const addToCart = async (selectedID, amount) => {

    let formData = new FormData()

    formData.append("product_id", selectedID)
    formData.append("quantity", amount)

    let options = {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Bearer ${loginData.access_token}`
      }
    }
    try {
      const url = `https://api.mediehuset.net/stringsonline/cart`
      const response = await fetch(url, options);
      await response.json();
      getCart()
    }
    catch (error) {
      console.log(error)
    }
  }

  // useEffect der gemmer logindata fra sessionStorage
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setLoginData(JSON.parse(sessionStorage.getItem("token")))
    }
  }, [])


  // UseEffect to update Cart total when user logs in or adds to cart
  useEffect(() => {
    if (cart.cartlines) {
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const quantArr = cart.cartlines.map((i) => { return parseInt(i.quantity) })
      let total = quantArr.reduce(reducer)
      setCartQuantity(total)
    }
    if (!loginData.access_token) {
      setCartQuantity(0)
    }
  }, [cart, loginData])


  // UseEffect to get Cart when user logs in
  useEffect(() => {
    if (loginData.access_token) {
      getCart()
    }
  }, [loginData])


  // UseEffect that runs every time a state changes and re-fetches
  useEffect(() => {

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
      setBrandID,
      brandID,
      cart,
      getCart,
      setCart,
      addToCart,
      cartQuantity,
      setCartQuantity,
      data,
      setData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppContextProvider } 