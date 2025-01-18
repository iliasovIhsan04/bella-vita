import React, { createContext, useState, useContext } from "react";

 const FavoriteContext = createContext();
export const FavoriteProvider = ({ children }) => {
  const [favoriteItemsLocal, setrFavoriteItemsLocal] = useState(false);

  return (
    <FavoriteContext.Provider value={{ favoriteItemsLocal, setrFavoriteItemsLocal }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useCondition = () => useContext(FavoriteContext);