import React, {useContext} from 'react'
import {AppContext} from "../../context/ContextProvider"

function SearchPage(){
    
    const {searchRes} = useContext(AppContext)

    console.log(searchRes)
    return (
        <div>
        <h2>Søgeresultater</h2>
        {searchRes && searchRes.items && searchRes.items.map((item, i) => {
            return (
                <p>{item.name}</p>
            )
        })}
        </div>
    )
}

export default SearchPage