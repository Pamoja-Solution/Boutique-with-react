import Form from './Form';

export default function Create({ auth, devises, modesPaiement }) {
    return (
        <Form 
            auth={auth}
            devises={devises}
            modesPaiement={modesPaiement}
        />
    );
}