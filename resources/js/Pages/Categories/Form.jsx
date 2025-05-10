import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CategoryForm({ auth, category = null }) {
    const { data, setData, post, put, errors, processing } = useForm({
        name: category?.name || '',
        description: category?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (category) {
            put(route('categories.update', category.id));
        } else {
            post(route('categories.store'));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={category ? "Modifier catégorie" : "Nouvelle catégorie"} />
            
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center mb-6">
                    <Link href={route('categories.index')} className="btn btn-ghost mr-4">
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold">
                        {category ? "Modifier la catégorie" : "Créer une nouvelle catégorie"}
                    </h1>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Nom de la catégorie*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ex: Électronique, Alimentaire..."
                                />
                                {errors.name && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.name}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control mt-4">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Description optionnelle de la catégorie..."
                                />
                                {errors.description && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.description}</span>
                                    </label>
                                )}
                            </div>

                            <div className="card-actions justify-end mt-6">
                                <Link href={route('categories.index')} className="btn btn-ghost">
                                    Annuler
                                </Link>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    {category ? "Mettre à jour" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}