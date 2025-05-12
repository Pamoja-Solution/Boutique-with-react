import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Trans from '@/Components/Trans';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Login({ status, canResetPassword,flash }) {
    const  data  = useForm({
        email: '',
        password: '',
        remember: false,
    });
    useEffect(() => {
      if (flash?.message) {
          toast.success(flash.message);
      }
      if (flash?.error) {
          toast.error(flash.error);
      }
  }, [flash]);


    const submit = (e) => {
      e.preventDefault();
      data.post(route('login'), {
        preserveScroll: true, // Empêche le rechargement de la page
        onSuccess: () => {
          
        },
        onFinish: () => data.password="",

        onError:()=>{

          toast.error("Une erreur");

        }
      });
    };
    
    //console.log(sessionStorage);

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className=''>
              <div className="space-y-4">
                <div className="form-control">
                  <InputLabel htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="input input-bordered mt-1 block w-full"
                    autoComplete="username"
                    isFocused={true}
                    onChange={(e) => data.setData('email', e.target.value)}
                  />
                  <InputError message={data.errors.email} className="mt-2" />
                </div>
                
                <div className="form-control">
                  <InputLabel htmlFor="password" value="Mot de passe" />
                  <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="input input-bordered mt-1 block w-full"
                    autoComplete="current-password"
                    onChange={(e) => data.setData('password', e.target.value)}
                  />
                  <InputError message={data.errors.password} className="mt-2" />
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={data.remember}
                      onChange={(e) => data.setData('remember', e.target.checked)}
                      className="checkbox checkbox-accent"
                    />
                    <span className="label-text">Se souvenir de moi</span>
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="link me-2"
                        >
                            <Trans id="Forgot your password?"/>
                        </Link>
                    )}
                  <button 
                    type="submit" 
                    className="btn btn-primary hover:bg-primary-focus transition-all duration-200"
                    disabled={data.processing}
                  >
                    {data.processing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Connexion...
                      </>
                    ) : 'Se connecter'}
                  </button>
                </div>
              </div>
            </form>
        </GuestLayout>
    );
}

