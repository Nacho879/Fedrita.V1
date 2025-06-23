import React, { createContext, useContext, useState } from 'react';

const DemoContext = createContext();

export const useDemo = () => useContext(DemoContext);

export const DemoProvider = ({ children }) => {
    const [isDemo, setIsDemo] = useState(false);
    
    const value = { isDemo, setIsDemo };
    
    return (
        <DemoContext.Provider value={value}>
            {children}
        </DemoContext.Provider>
    );
};