<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { text-align: center; margin-bottom: 20px; }
        .title { font-size: 18px; font-weight: bold; }
        .period { font-size: 14px; margin-bottom: 15px; }
        .filters { margin-bottom: 15px; font-size: 12px; }
        .table { width: 100%; border-collapse: collapse; }
        .table th { background-color: #f2f2f2; text-align: left; padding: 8px; }
        .table td { padding: 8px; border-bottom: 1px solid #ddd; }
        .footer { margin-top: 20px; font-size: 10px; text-align: right; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">{{ $title }}</div>
        <div class="period">
            Période: {{ $filters['date_debut'] ?? 'Début' }} - {{ $filters['date_fin'] ?? 'Fin' }}
        </div>
    </div>

    @if(count($filters) > 2) <!-- More than just report_type and format -->
    <div class="filters">
        <strong>Filtres appliqués:</strong>
        <ul>
            @foreach($filters as $key => $value)
                @if(!in_array($key, ['report_type', 'format', '_token']))
                    <li>{{ ucfirst(str_replace('_', ' ', $key)) }}: {{ $value }}</li>
                @endif
            @endforeach
        </ul>
    </div>
    @endif

    <table class="table">
        <thead>
            <tr>
                @switch($report_type)
                    @case('ventes')
                        <th>Code</th>
                        <th>Client</th>
                        <th>Utilisateur</th>
                        <th class="text-right">Total HT</th>
                        <th class="text-right">Total TVA</th>
                        <th class="text-right">Total TTC</th>
                        <th class="text-right">Remise</th>
                        <th class="text-right">Montant Payé</th>
                        <th>Statut</th>
                        <th>Date</th>
                        @break
                    @case('articles')
                        <th>Vente</th>
                        <th>Produit</th>
                        <th>Rayon</th>
                        <th class="text-right">Quantité</th>
                        <th class="text-right">Prix Unitaire</th>
                        <th>Type Vente</th>
                        <th class="text-right">Montant HT</th>
                        <th class="text-right">TVA</th>
                        <th class="text-right">Montant TTC</th>
                        <th>Date</th>
                        @break
                    @case('depenses')
                        <th>Description</th>
                        <th class="text-right">Montant</th>
                        <th>Devise</th>
                        <th>Mode Paiement</th>
                        <th>Bénéficiaire</th>
                        <th>Utilisateur</th>
                        <th>Date Dépense</th>
                        @break
                    @case('stocks')
                        <th>Produit</th>
                        <th>Rayon</th>
                        <th class="text-right">Quantité</th>
                        <th>Type</th>
                        <th>Motif</th>
                        <th>Utilisateur</th>
                        <th>Date</th>
                        @break
                    @case('inventaires')
                        <th>Référence</th>
                        <th>Date Inventaire</th>
                        <th>Statut</th>
                        <th>Utilisateur</th>
                        <th>Notes</th>
                        @break
                    @case('caisses')
                        <th>Caisse</th>
                        <th>Type</th>
                        <th class="text-right">Montant</th>
                        <th>Source</th>
                        <th>Description</th>
                        <th>Utilisateur</th>
                        <th>Date</th>
                        @break
                @endswitch
            </tr>
        </thead>
        <tbody>
            @foreach($data as $item)
                <tr>
                    @switch($report_type)
                        @case('ventes')
                            <td>{{ $item->code }}</td>
                            <td>{{ $item->client->name }}</td>
                            <td>{{ $item->user->name }}</td>
                            <td class="text-right">{{ number_format($item->total_ht, 2) }}</td>
                            <td class="text-right">{{ number_format($item->total_tva, 2) }}</td>
                            <td class="text-right">{{ number_format($item->total_ttc, 2) }}</td>
                            <td class="text-right">{{ number_format($item->montant_remise, 2) }}</td>
                            <td class="text-right">{{ number_format($item->montant_paye, 2) }}</td>
                            <td>{{ ucfirst($item->statut) }}</td>
                            <td>{{ $item->created_at->format('d/m/Y H:i') }}</td>
                            @break
                        @case('articles')
                            <td>{{ $item->vente->code }}</td>
                            <td>{{ $item->produit->nom }}</td>
                            <td>{{ $item->rayon->nom }}</td>
                            <td class="text-right">{{ $item->quantite }}</td>
                            <td class="text-right">{{ number_format($item->prix_unitaire, 2) }}</td>
                            <td>{{ str_replace('_', ' ', $item->type_vente) }}</td>
                            <td class="text-right">{{ number_format($item->montant_ht, 2) }}</td>
                            <td class="text-right">{{ number_format($item->montant_tva, 2) }}</td>
                            <td class="text-right">{{ number_format($item->montant_ttc, 2) }}</td>
                            <td>{{ $item->created_at->format('d/m/Y H:i') }}</td>
                            @break
                        @case('depenses')
                            <td>{{ $item->description }}</td>
                            <td class="text-right">{{ number_format($item->montant, 2) }}</td>
                            <td>{{ $item->devise->code }}</td>
                            <td>{{ ucfirst($item->mode_paiement) }}</td>
                            <td>{{ $item->beneficiaire }}</td>
                            <td>{{ $item->user->name }}</td>
                            <td>{{ $item->date_depense->format('d/m/Y') }}</td>
                            @break
                        @case('stocks')
                            <td>{{ $item->produit->nom }}</td>
                            <td>{{ $item->rayon->nom }}</td>
                            <td class="text-right">{{ $item->quantity }}</td>
                            <td>{{ ucfirst($item->type) }}</td>
                            <td>{{ $item->motif }}</td>
                            <td>{{ $item->user->name }}</td>
                            <td>{{ $item->created_at->format('d/m/Y H:i') }}</td>
                            @break
                        @case('inventaires')
                            <td>{{ $item->reference }}</td>
                            <td>{{ $item->date_inventaire->format('d/m/Y') }}</td>
                            <td>{{ ucfirst($item->statut) }}</td>
                            <td>{{ $item->user->name }}</td>
                            <td>{{ $item->notes }}</td>
                            @break
                        @case('caisses')
                            <td>{{ $item->caisse->name }}</td>
                            <td>{{ ucfirst($item->type) }}</td>
                            <td class="text-right">{{ number_format($item->montant, 2) }}</td>
                            <td>{{ $item->source_type }}</td>
                            <td>{{ $item->description }}</td>
                            <td>{{ $item->user->name }}</td>
                            <td>{{ $item->created_at->format('d/m/Y H:i') }}</td>
                            @break
                    @endswitch
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        Généré le {{ now()->format('d/m/Y H:i') }} | Page @{{ $PAGE_NUM }} sur @{{ $PAGE_COUNT }}
    </div>
</body>
</html>