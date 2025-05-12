import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        theme: localStorage.getItem('theme') || 'dark',
        font: localStorage.getItem('font') || 'sans'
    });

    const applyFont = (font) => {
        const allFontClasses = [
            'font-sans', 'font-serif', 'font-mono', 'font-rounded',
            'font-ubuntu', 'font-dancing', 'font-comfortaa'
        ];
        document.documentElement.classList.remove(...allFontClasses);
        document.documentElement.classList.add(`font-${font}`);
        localStorage.setItem('font', font);
        setSettings(prev => ({ ...prev, font }));
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        setSettings(prev => ({ ...prev, theme }));
    };

    // Synchronisation initiale
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
        applyFont(settings.font);
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, setTheme, applyFont }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);