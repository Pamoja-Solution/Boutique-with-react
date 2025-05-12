import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import DetailsModal from '@/Components/Ventes/DetailsModal';
export default function Dashboard({recents}){
    const [selectedVenteId, setSelectedVenteId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleShowDetails = (id) => {
        setSelectedVenteId(id);
        setShowModal(true);
    };

    return(
        <AuthenticatedLayout>
        <Head title="Activités" />

            {recents.map((activity, index) => (
                <div key={index}  className="collapse collapse-arrow bg-base-100 border border-base-300">
                    <input type="radio" name="my-accordion-2" defaultChecked />
                    <div className="collapse-title font-semibold">{activity.user}</div>
                    <div className="collapse-content text-sm">
                    <div  className="flex gap-3 it">
                                        
                                        <div className="avatar avatar-placeholder">
                                            <div className={`bg-${activity.color} text-${activity.color}-content w-16 rounded-full items-center`}>
                                                <span className="text-xl">{activity.type}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{activity.description}</p>
                                            <p className="text-xs opacity-70">
                                                {activity.date} • {activity.user}
                                            </p>
                                            {activity.type =="vente" &&(
                                                <button 
                                                onClick={() => handleShowDetails(activity.id)}
                                                className="btn btn-sm btn-info mt-2"
                                            >
                                                Détails
                                            </button>
                                            )}
                                            
                                        </div>
                                    </div>
                                    <DetailsModal 
                        venteId={selectedVenteId} 
                        show={showModal} 
                        onClose={() => setShowModal(false)} 
                     />
                    </div>
                    
                </div>
            ))}
               
                
        </AuthenticatedLayout>

    );
 }