// import React from "react";
import React, { createContext } from "react";
import all_product from '../Components/Assets/all_product';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {


    // this is the shared data
    const contextValue = {all_product};

    return(
        //provider component is used to wrap the parent component that holds the shared data, the prop in value is the one that will be shared
        <ShopContext.Provider value={contextValue}>
            {props.children}
            </ShopContext.Provider>

    );
}

export default ShopContextProvider