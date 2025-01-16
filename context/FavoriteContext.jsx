import React, { createContext, useState, useContext } from "react";

 const FavoriteContext = createContext();
export const FavoriteProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState(new Set());
  
  return (
    <FavoriteContext.Provider value={{ favoriteItems, setFavoriteItems }}>
      {children}
    </FavoriteContext.Provider>
  );
};


export const useCondition = () => useContext(FavoriteContext);