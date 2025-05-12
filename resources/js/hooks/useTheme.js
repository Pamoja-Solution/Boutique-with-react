import { useEffect, useState } from 'react';

export default function useTheme(initialTheme) {
    const [theme, setTheme] = useState(initialTheme);

    // Applique le thème au chargement et quand il change
    useEffect(() => {
        if (!theme) return;
        
        console.log('Changing theme to:', theme); // Pour déboguer
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return [theme, setTheme];
}