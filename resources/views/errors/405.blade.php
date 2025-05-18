<!DOCTYPE html>
<html lang="fr" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Action non permise</title>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@3.x/dist/full.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <figure class="px-10 pt-10">
            <div class="w-24 h-24 text-error">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full">
                    <path stroke-linecap="round" stroke-linecap="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
        </figure>
        <div class="card-body items-center text-center">
            <h2 class="card-title text-2xl font-bold text-error">Action non permise</h2>
            <p class="py-4 text-gray-600">
                Désolé, cette action n'est pas autorisée de cette manière.
                <br>
                Veuillez utiliser le formulaire approprié pour effectuer cette opération.
            </p>
            <div class="card-actions">
                <a href="/point-de-vente" class="btn btn-primary gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Retour à la page de vente
                </a>
            </div>
        </div>
    </div>
</body>
</html>