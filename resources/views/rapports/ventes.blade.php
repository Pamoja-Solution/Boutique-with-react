<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{{ $titre }}</title>
    <style>
        @page {
            margin: 1.5cm 1cm;
            margin-bottom: 2.5cm; /* Espace pour le footer */
        }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 9pt;
            line-height: 1.4;
            color: #333;
        }
        h1 {
            font-size: 16pt;
            text-align: center;
            margin-bottom: 5px;
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .info {
            text-align: center;
            margin-bottom: 15px;
            font-size: 8pt;
            color: #555;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 5px;
            text-align: left;
            font-size: 8.5pt;
            word-wrap: break-word;
            max-width: 150px;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #2c3e50;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .total-row {
            font-weight: bold;
            background-color: #e9ecef !important;
        }
        .footer {
            position: fixed;
            bottom: -20px;
            left: 0;
            right: 0;
            height: 50px;
            text-align: center;
            font-size: 8pt;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .nowrap {
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <h1>{{ $titre }}</h1>
    <div class="info">
        <p>Date de génération: {{ $dateGeneration }}</p>
        <p>Période: {{ $periode }}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th style="width: 8%">Code</th>
                <th style="width: 10%">Date</th>
                <th style="width: 18%">Client</th>
                <th style="width: 15%">Vendeur</th>
                <th class="text-right" style="width: 10%">Total HT</th>
                <th class="text-right" style="width: 8%">TVA</th>
                <th class="text-right" style="width: 10%">Total TTC</th>
                <th class="text-right" style="width: 8%">Remise</th>
                <th class="text-right" style="width: 8%">Payé</th>
            </tr>
        </thead>
        <tbody>
            @foreach($ventes as $vente)
                <tr>
                    <td class="nowrap">{{ $vente->code }}</td>
                    <td class="nowrap">{{ $vente->created_at->format('d/m/Y H:i') }}</td>
                    <td>{{ Str::limit($vente->client?->name ?? 'Non spécifié', 25) }}</td>
                    <td>{{ Str::limit($vente->user->name, 20) }}</td>
                    <td class="text-right">{{ number_format($vente->total_ht, 2) }}</td>
                    <td class="text-right">{{ number_format($vente->total_tva, 2) }}</td>
                    <td class="text-right">{{ number_format($vente->total_ttc, 2) }}</td>
                    <td class="text-right">{{ number_format($vente->montant_remise, 2) }}</td>
                    <td class="text-right">{{ number_format($vente->montant_paye, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="4">TOTAL</td>
                <td class="text-right">{{ number_format($totalHT, 2) }}</td>
                <td class="text-right">{{ number_format($totalTVA, 2) }}</td>
                <td class="text-right">{{ number_format($totalTTC, 2) }}</td>
                <td class="text-right">{{ number_format($totalRemise, 2) }}</td>
                <td></td>
            </tr>
        </tfoot>
    </table>
    
    <div class="footer">
        Rapport généré automatiquement - Page <span class="pageNumber"></span> sur <span class="pageCount"></span>
    </div>

    <script type="text/php">
        if (isset($pdf)) {
            $font = $fontMetrics->get_font("DejaVu Sans");
            $pdf->page_text(
                $pdf->get_width() / 2 - 30, 
                $pdf->get_height() - 20, 
                "Page {PAGE_NUM} sur {PAGE_COUNT}", 
                $font, 
                8, 
                array(0, 0, 0)
            );
        }
    </script>
</body>
</html>