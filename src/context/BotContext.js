import React, { createContext, useContext, useEffect } from 'react';
import { useBots } from '../hooks/useBots';
import { AuthContext } from './AuthContext';

export const BotContext = createContext({});

export const BotProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const botsData = useBots(false); 

    useEffect(() => { 
        if (user) {
            botsData.refresh();
        }
    }, [user]); 

    return (
        <BotContext.Provider value={{
            bots: user ? botsData.bots : [],
            loading: botsData.loading,
            error: botsData.error,
            refresh: botsData.refresh,
            linkNewBot: botsData.linkNewBot,
            updateBot: botsData.updateBot,
            deleteBot: botsData.deleteBot,
            fetchBots: botsData.fetchBots
        }}>
            {children}
        </BotContext.Provider>
    );
};