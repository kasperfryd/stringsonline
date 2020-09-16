import React, {useContext, useState} from 'react'
import {AppContext} from "../../context/ContextProvider"
import Style from './searchpage.module.scss'

function SearchPage(){
    
    const {searchRes, setProductID, setProductName, doFetch, data, productName, addToCart} = useContext(AppContext)
    
    const [avgRating, setAvgRating] = useState([])
    const [selected, setSelected] = useState([])
    const [sorted, setSorted] = useState([])
    const [sortedStatus, setSortedStatus] = useState(false)

    const getRating = async (id) => {
        let url=`https://api.mediehuset.net/stringsonline/ratings/average/${id}`
        let res = await doFetch(url)
        setAvgRating(res)
    }

    const getProductByID = async (id) => {
        let url = `https://api.mediehuset.net/stringsonline/products/${id}`
        let res = await doFetch(url)
        setSelected(res)
    }


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



    console.log(selected)
    //console.log(searchRes)
    return (
        <section>
        <h2>Søgeresultater</h2>
        {!selected.item && searchRes.items && <select onChange={(e)=>{sortArray(e.target.value, searchRes && searchRes.items)}}>
                    <option value={null}>Vælg</option>
                    <option value="price">Pris</option>
                    <option value="name">Navn</option>
                    <option value="stock">På lager</option>
                </select>
        }
        {sortedStatus === false && productName=== "" && searchRes && searchRes.items && searchRes.items.map((item, i) => {
            return (
                <div className={Style.gridItem} key={i}>
                    <img onClick={() => {getProductByID(item.id); setProductName(item.name); getRating(item.id)}} src={item.image_fullpath} alt={item.name}></img>
                    <article>
                        <h3>{item.name}</h3>
                        <p>{item.description_short}</p>
                    </article>
                    <div>
                        <p>Pris: {item.price}</p>
                        <button onClick={()=>{addToCart(item.id)}}>Læg i kurv</button>
                        <p>{item.stock}+ på lager</p>
                    </div>
                </div>
                )
        })}
         {sortedStatus === true && !selected.item && sorted && sorted.map((item, i)=>{
                return (
                    <div className={Style.gridItem} key={i}>
                        <img onClick={() => {setSortedStatus(false); getProductByID(item.id); setProductName(item.name); getRating(item.id)}} src={item.image_fullpath} alt={item.name}></img>
                        <article>
                            <h2>{item.brand}</h2>
                            <h3>{item.name}</h3>
                            <p>{item.description_short}</p>
                        </article>
                        <div>
                            <div>{item.offerprice === "0.00" ?<p>Pris: {item.price}</p> : <p className={Style.offer}>Tilbud: {item.offerprice}</p>}</div>
                            <button onClick={()=>{addToCart(item.id)}}>Læg i kurv</button>
                            <p>{item.stock}+ på lager</p>
                        </div>
                    </div>
                    )
                })}

        {!productName == "" && selected && selected.item && 
            
            <>
            <img className={Style.topImage} src={selected.item.image.fullpath} alt={selected.item.title}></img>
            <div className={Style.detailContainer}>
                <article>
                    <h3>{selected.item.name}</h3>
                    <p>{selected.item.description_long}</p>
                </article>
                <div className={Style.detailPriceContainer}>
                    <img className={Style.brandLogo} src={`https://api.mediehuset.net/images/stringsonline/brands/${selected.item.brand.toLowerCase()}.png`} alt={selected.item.name}></img>
                    <p>Pris {selected.item.price}</p>
                    <input defaultValue="1"></input>
                    <button onClick={()=>{addToCart(selected.item.id)}}>Læg i kurv</button>
                    <p>{selected.item.stock}+ på lager</p>
                    <p>Rating</p>
                </div>
            </div>
            </>
        }
        </section>
    )
}


/*     <section>
            <h3>{data.items.title}</h3>
            <h5>{data.items.subgroup && data.items.subgroup.title}</h5>
            <section className={Style.gridContainer}>
            {data.items.subgroup && data.items.subgroup.products && data.items.subgroup.products.map((item, i)=>{
                return (
                    <div className={Style.gridItem} key={i}>
                        <img onClick={() => {setProductID(item.id); setProductName(item.name); getRating(item.id)}} src={item.image_fullpath} alt={item.name}></img>
                        <article>
                            <h3>{item.name}</h3>
                            <p>{item.description_short}</p>
                        </article>
                        <div>
                            <p>Pris: {item.price}</p>
                            <button>Læg i kurv</button>
                            <p>{item.stock}+ på lager</p>
                        </div>
                    </div>
                    )
                })} */

export default SearchPage