import React, { useState } from 'react';

export default function PanierItem({ item, onRemove, onQuantityChange }) {
    const [editMode, setEditMode] = useState(false);
    const [quantite, setQuantite] = useState(item.quantite);
    
    const handleQuantityChange = (e) => {
        const newQty = parseInt(e.target.value) || 1;
        setQuantite(newQty);
    };
    
    const saveQuantity = () => {
        onQuantityChange(quantite);
        setEditMode(false);
    };
    
    const typeLabels = {
        'detail': 'Détail',
        'semi_gros': 'Semi-gros',
        'gros': 'Gros'
    };
    
    return (
        <div className="grid grid-cols-12 items-center py-2 border-b ">
            <div className="col-span-5">
                <p className="font-medium">{item.produit_nom}</p>
                <div className="flex text-xs text-gray-500 mt-1">
                    <span className="mr-2">{item.produit_code}</span>
                    <span className="badge badge-sm">{typeLabels[item.type_vente]}</span>
                    <span className="ml-2">Rayon: {item.rayon_nom}</span>
                </div>
            </div>
            
            <div className="col-span-2 text-center">
                {item.prix_unitaire} CDF
            </div>
            
            <div className="col-span-2 text-center">
                {editMode ? (
                    <div className="flex items-center">
                        <input
                            type="number"
                            min="1"
                            max={item.stock_disponible}
                            value={quantite}
                            onChange={handleQuantityChange}
                            className="input input-xs input-bordered w-20 text-center"
                        />
                        <button 
                            onClick={saveQuantity}
                            className="btn btn-xs btn-circle ml-1"
                        >
                            ✓
                        </button>
                    </div>
                ) : (
                    <div 
                        onClick={() => setEditMode(true)}
                        className="cursor-pointer hover:bg-base-200 rounded-md px-2 py-1"
                    >
                        {item.quantite}
                    </div>
                )}
            </div>
            
            <div className="col-span-2 text-right font-semibold">
                 <div className="text-sm">HT :  {item.montant_ht.toFixed(2)} CDF</div>

                <div className="text-xs">TTC : {item.montant_ttc.toFixed(2)} CDF</div>
            </div>
            
            <div className="col-span-1 text-right">
                <button 
                    onClick={onRemove}
                    className="btn btn-xs btn-circle btn-error"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}