import { usePage } from '@inertiajs/react';

export default function Trans({ id, params = {} }) {
    const { translations } = usePage().props;
    
    let text = translations[id] || id;
    
    Object.keys(params).forEach(key => {
        text = text.replace(`:${key}`, params[key]);
    });
    
    return text;
}