<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" 
      @if(auth()->check() && auth()->user()->settings) 
          data-theme="{{ auth()->user()->settings['theme'] ?? 'light' }}"
          class="font-{{ auth()->user()->settings['font'] ?? 'sans' }}"
      @else
          data-theme="light"
          class="font-sans"
      @endif
>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <!-- Vos autres imports de polices... (gardez tous vos liens existants) -->

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <!-- Style initial pour éviter le flash de thème incorrect -->
        <script>
            document.documentElement.setAttribute('data-theme', 
                @if(auth()->check() && auth()->user()->settings)
                    '{{ auth()->user()->settings["theme"] ?? "dark" }}'
                @else
                    'dark'
                @endif
            );
            
            // Applique la police immédiatement
            document.documentElement.classList.add(
                @if(auth()->check() && auth()->user()->settings)
                    'font-{{ auth()->user()->settings["font"] ?? "sans" }}'
                @else
                    'font-sans'
                @endif
            );
        </script>
    </head>
    <body class="min-h-screen">
        @inertia
    </body>
</html>