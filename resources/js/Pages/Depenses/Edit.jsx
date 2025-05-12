import Form from './Form';

export default function Edit({ auth, depense, devises, modesPaiement }) {
    const { data, setData } = useForm({
        // ... autres champs
        date_depense: props.depense?.date_depense_input || 
                     new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
    });
    return (
        <Form 
            auth={auth}
            depense={depense}
            devises={devises}
            modesPaiement={modesPaiement}
        />
    );
}