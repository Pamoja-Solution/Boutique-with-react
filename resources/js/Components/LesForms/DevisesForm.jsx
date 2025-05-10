import { useForm } from '@inertiajs/react';
import InputLabel from '../InputLabel';
import TextInput from '../TextInput';
import InputError from '../InputError';
import { toast } from 'react-hot-toast';

export default function DevisesForm() {
    
    const data = useForm({
        
        'code':'',
        'symbole':'',
        'taux_achat':'',
        'taux_vente':'',
        'is_default':false,
      });
    
      const submitAddDevise = (e) => {
        e.preventDefault();
        data.post(route('currencies.store'), {
          preserveScroll: true, // Empêche le rechargement de la page
          onSuccess: () => {
            //console.log("page.props")
            //toast.success("Votre compte a était dé");
          },
          onError:()=>{
            toast.error("Une erreur");

          }
        });
      };
      
      
   
    return (
        <form onSubmit={submitAddDevise}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                    <InputLabel htmlFor="code" value="Nom" />
                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        placeholder="Franc Congolais"
                        value={data.code}
                        className="input input-bordered mt-1 block w-full"
                        autoComplete="code"
                        isFocused={true}
                        onChange={(e) => data.setData('code', e.target.value)}
                    />
                    <InputError message={data.errors.code} className="mt-2" />
                </div>
                <div className="form-control">
                    <InputLabel htmlFor="symbole" value="Symbole" />
                    <TextInput
                        id="symbole"
                        type="text"
                        name="symbole"
                        placeholder="FC"
                        value={data.symbole}
                        className="input input-bordered mt-1 block w-full"
                        autoComplete="symbole"
                        isFocused={true}
                        onChange={(e) => data.setData('symbole', e.target.value)}
                    />
                    <InputError message={data.errors.symbole} className="mt-2" />
                </div>


                <div className="form-control">
                    <InputLabel htmlFor="taux_vente" value="Prix de Vente" />
                    <TextInput
                        id="taux_vente"
                        type="text"
                        placeholder="2940"
                        name="taux_vente"
                        value={data.taux_vente}
                        className="input input-bordered mt-1 block w-full"
                        autoComplete="taux_vente"
                        isFocused={true}
                        onChange={(e) => data.setData('taux_vente', e.target.value)}
                    />
                    <InputError message={data.errors.taux_vente} className="mt-2" />
                </div>
                <div className="form-control">
                    <InputLabel htmlFor="taux_achat" value="Prix d'Achat" />
                    <TextInput
                        id="taux_achat"
                        type="text"
                        name="taux_achat"
                        placeholder="2840"
                        value={data.taux_achat}
                        className="input input-bordered mt-1 block w-full"
                        autoComplete="taux_achat"
                        isFocused={true}
                        onChange={(e) => data.setData('taux_achat', e.target.value)}
                    />
                    <InputError message={data.errors.taux_achat} className="mt-2" />
                </div>
                

                <div className="modal-action">
                 
                  <button 
                    type="submit" 
                    className="btn btn-primary hover:bg-primary-focus transition-all duration-200"
                    disabled={data.processing}
                  >
                    {data.processing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Enregistrement...
                      </>
                    ) : 'Enregistrer'}
                  </button>
                </div>
            </div>
            
            {data.errors.content && (
                <p className="mt-1 text-sm text-red-600">{data.errors.content}</p>
            )}
        </form>
    );
}