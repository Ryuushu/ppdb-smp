<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
    <link rel="stylesheet" href="{{ (isset($isPdf) && $isPdf) ? public_path('css/css-admin/adminlte.min.css') : asset('css/css-admin/adminlte.min.css') }}">
    <style>
        /* .page-break {
            page-break-after: always;
        } */
    </style>
</head>

<body>
    @yield('content')

    @if(!isset($isPdf) || !$isPdf)
    <script>
        window.addEventListener("load", window.print());
    </script>
    @endif
</body>
</html>
