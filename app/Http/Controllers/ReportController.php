<?php

namespace App\Http\Controllers;

use App\Models\Vente;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\Client;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Protection;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use App\Models\Caisse;
use App\Models\Depense;
use App\Models\CaisseMouvement;
use App\Models\Categorie;
use App\Models\StockMouvement;
use App\Models\Inventaire;
use App\Models\Rayon;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index',[
            'categories' => Categorie::all(),
        'rayons' => Rayon::all(),
        'users' => User::all(),
        'clients' => Client::all(),
        'caisses' => Caisse::all(),
        'produits' => Produit::all(),
        ]);
    }

    public function genererRapport(Request $request)
    {
        $typeRapport = $request->input('type_rapport');
        $format = $request->input('format', 'pdf'); // pdf ou xlsx
        $dateDebut = $request->input('date_debut') ? Carbon::parse($request->input('date_debut')) : null;
        $dateFin = $request->input('date_fin') ? Carbon::parse($request->input('date_fin'))->endOfDay() : null;
        $filtres = $request->input('filtres', []);
        
        // Appeler la méthode appropriée en fonction du type de rapport
        $methodName = 'rapport' . Str::studly($typeRapport);
        
        if (method_exists($this, $methodName)) {
            return $this->$methodName($format, $dateDebut, $dateFin, $filtres);
        }
        
        return response()->json(['error' => 'Type de rapport non pris en charge'], 400);
    }
    
    protected function rapportVentes($format, $dateDebut, $dateFin, $filtres)
    {

        $query = Vente::whereHas('client')->with(['client', 'user', 'articlesVente.produit', 'articlesVente.rayon'])
            ->where('statut', 'terminee');
            
        if ($dateDebut && $dateFin) {
            $query->whereBetween('created_at', [$dateDebut, $dateFin]);
        }
        
        if (isset($filtres['client_id']) && $filtres['client_id']) {
            $query->where('client_id', $filtres['client_id']);
        }
        
        if (isset($filtres['user_id']) && $filtres['user_id']) {
            $query->where('user_id', $filtres['user_id']);
        }
        
        $ventes = $query->get();
        try {

        $data = [
            'titre' => 'Rapport des ventes',
            'dateGeneration' => now()->format('d/m/Y H:i'),
            'periode' => $dateDebut && $dateFin 
            ? $dateDebut->format('d/m/Y') . ' au ' . $dateFin->format('d/m/Y') 
            : 'Toutes les périodes',            'ventes' => $ventes,
            'totalHT' => $ventes->sum('total_ht'),
            'totalTVA' => $ventes->sum('total_tva'),
            'totalTTC' => $ventes->sum('total_ttc'),
            'totalRemise' => $ventes->sum('montant_remise'),
        ];
    } catch (\Exception $e) {
        dd($e->getMessage(), $dateDebut, $dateFin);
    }
        return $this->genererFichier('ventes', $data, $format);
    }
    
    protected function rapportStock($format, $dateDebut, $dateFin, $filtres)
    {
        $query = Stock::with(['produit.categorie', 'rayon']);
        
        if (isset($filtres['rayon_id']) && $filtres['rayon_id']) {
            $query->where('rayon_id', $filtres['rayon_id']);
        }
        
        if (isset($filtres['categorie_id']) && $filtres['categorie_id']) {
            $query->whereHas('produit', function($q) use ($filtres) {
                $q->where('categorie_id', $filtres['categorie_id']);
            });
        }
        
        if (isset($filtres['niveau_stock']) && $filtres['niveau_stock'] === 'alert') {
            $query->whereRaw('quantite <= quantite_alerte');
        }
        
        if (isset($filtres['niveau_stock']) && $filtres['niveau_stock'] === 'rupture') {
            $query->where('quantite', 0);
        }
        
        $stocks = $query->get();
        
        $data = [
            'titre' => 'Rapport d\'état des stocks',
            'dateGeneration' => now()->format('d/m/Y H:i'),
            'stocks' => $stocks,
            'totalProduits' => $stocks->count(),
            'produitsEnAlerte' => $stocks->filter(function($stock) {
                return $stock->quantite <= $stock->quantite_alerte && $stock->quantite > 0;
            })->count(),
            'produitsEnRupture' => $stocks->where('quantite', 0)->count(),
        ];
        
        return $this->genererFichier('stock', $data, $format);
    }
    
    protected function rapportMouvementStock($format, $dateDebut, $dateFin, $filtres)
    {
        $query = StockMouvement::with(['produit', 'rayon', 'user']);
        
        if ($dateDebut && $dateFin) {
            $query->whereBetween('created_at', [$dateDebut, $dateFin]);
        }
        
        if (isset($filtres['type']) && $filtres['type']) {
            $query->where('type', $filtres['type']);
        }
        
        if (isset($filtres['produit_id']) && $filtres['produit_id']) {
            $query->where('produit_id', $filtres['produit_id']);
        }
        
        if (isset($filtres['rayon_id']) && $filtres['rayon_id']) {
            $query->where('rayon_id', $filtres['rayon_id']);
        }
        
        $mouvements = $query->orderBy('created_at', 'desc')->get();
        
        $data = [
            'titre' => 'Rapport des mouvements de stock',
            'dateGeneration' => now()->format('d/m/Y H:i'),
            'periode' => $dateDebut && $dateFin ? $dateDebut->format('d/m/Y') . ' au ' . $dateFin->format('d/m/Y') : 'Toutes les périodes',
            'mouvements' => $mouvements,
            'totalEntrees' => $mouvements->where('type', 'entree')->sum('quantity'),
            'totalSorties' => $mouvements->where('type', 'sortie')->sum('quantity'),
        ];
        
        return $this->genererFichier('mouvements_stock', $data, $format);
    }
    
    protected function rapportCaisse($format, $dateDebut, $dateFin, $filtres)
    {
        $query = CaisseMouvement::with(['caisse', 'user']);
        
        if ($dateDebut && $dateFin) {
            $query->whereBetween('created_at', [$dateDebut, $dateFin]);
        }
        
        if (isset($filtres['caisse_id']) && $filtres['caisse_id']) {
            $query->where('caisse_id', $filtres['caisse_id']);
        }
        
        if (isset($filtres['type']) && $filtres['type']) {
            $query->where('type', $filtres['type']);
        }
        
        $mouvements = $query->orderBy('created_at', 'desc')->get();
        
        $data = [
            'titre' => 'Rapport des mouvements de caisse',
            'dateGeneration' => now()->format('d/m/Y H:i'),
            'periode' => $dateDebut && $dateFin ? $dateDebut->format('d/m/Y') . ' au ' . $dateFin->format('d/m/Y') : 'Toutes les périodes',
            'mouvements' => $mouvements,
            'totalEntrees' => $mouvements->where('type', 'entree')->sum('montant'),
            'totalSorties' => $mouvements->where('type', 'sortie')->sum('montant'),
            'solde' => $mouvements->where('type', 'entree')->sum('montant') - $mouvements->where('type', 'sortie')->sum('montant'),
        ];
        
        return $this->genererFichier('caisse', $data, $format);
    }
    
    protected function rapportDepenses($format, $dateDebut, $dateFin, $filtres)
    {
        $query = Depense::with(['user', 'devise']);
        
        if ($dateDebut && $dateFin) {
            $query->whereBetween('date_depense', [$dateDebut->format('Y-m-d'), $dateFin->format('Y-m-d')]);
        }
        
        if (isset($filtres['mode_paiement']) && $filtres['mode_paiement']) {
            $query->where('mode_paiement', $filtres['mode_paiement']);
        }
        
        $depenses = $query->orderBy('date_depense', 'desc')->get();
        
        $data = [
            'titre' => 'Rapport des dépenses',
            'dateGeneration' => now()->format('d/m/Y H:i'),
            'periode' => $dateDebut && $dateFin ? $dateDebut->format('d/m/Y') . ' au ' . $dateFin->format('d/m/Y') : 'Toutes les périodes',
            'depenses' => $depenses,
            'totalDepenses' => $depenses->sum('montant'),
            'totalParMode' => $depenses->groupBy('mode_paiement')->map->sum('montant'),
        ];
        
        return $this->genererFichier('depenses', $data, $format);
    }
    
    protected function rapportInventaires($format, $dateDebut, $dateFin, $filtres)
    {
        $query = Inventaire::with(['user', 'inventaireItems.produit', 'inventaireItems.rayon']);
        
        if ($dateDebut && $dateFin) {
            $query->whereBetween('date_inventaire', [$dateDebut->format('Y-m-d'), $dateFin->format('Y-m-d')]);
        }
        
        if (isset($filtres['statut']) && $filtres['statut']) {
            $query->where('statut', $filtres['statut']);
        }
        
        $inventaires = $query->orderBy('date_inventaire', 'desc')->get();
        
        $data = [
            'titre' => 'Rapport des inventaires',
            'dateGeneration' => now()->format('d/m/Y H:i'),
            'periode' => $dateDebut && $dateFin ? $dateDebut->format('d/m/Y') . ' au ' . $dateFin->format('d/m/Y') : 'Toutes les périodes',
            'inventaires' => $inventaires,
        ];
        
        return $this->genererFichier('inventaires', $data, $format);
    }
    
    protected function rapportClients($format, $dateDebut, $dateFin, $filtres)
    {
        $query = Client::withCount(['ventes' => function ($query) use ($dateDebut, $dateFin) {
            if ($dateDebut && $dateFin) {
                $query->whereBetween('created_at', [$dateDebut, $dateFin]);
            }
        }])->withSum(['ventes' => function ($query) use ($dateDebut, $dateFin) {
            if ($dateDebut && $dateFin) {
                $query->whereBetween('created_at', [$dateDebut, $dateFin]);
            }
        }], 'total_ttc');
        
        if (isset($filtres['type']) && $filtres['type']) {
            $query->where('type', $filtres['type']);
        }
        
        $clients = $query->orderBy('ventes_count', 'desc')->get();
        
        $data = [
            'titre' => 'Rapport des clients',
            'dateGeneration' => now()->format('d/m/Y H:i'),
            'periode' => $dateDebut && $dateFin ? $dateDebut->format('d/m/Y') . ' au ' . $dateFin->format('d/m/Y') : 'Toutes les périodes',
            'clients' => $clients,
            'totalClients' => $clients->count(),
        ];
        
        return $this->genererFichier('clients', $data, $format);
    }
    
    protected function rapportProduits($format, $dateDebut, $dateFin, $filtres)
    {
        $query = Produit::with(['categorie', 'prixProduits' => function($q) {
            $q->orderBy('date_effet', 'desc')->limit(1);
        }])->withCount(['articlesVente as ventes_count' => function ($query) use ($dateDebut, $dateFin) {
            if ($dateDebut && $dateFin) {
                $query->whereBetween('created_at', [$dateDebut, $dateFin]);
            }
        }])->withSum(['articlesVente as montant_ventes' => function ($query) use ($dateDebut, $dateFin) {
            if ($dateDebut && $dateFin) {
                $query->whereBetween('created_at', [$dateDebut, $dateFin]);
            }
        }], 'montant_ttc');
        
        if (isset($filtres['categorie_id']) && $filtres['categorie_id']) {
            $query->where('categorie_id', $filtres['categorie_id']);
        }
        
        $produits = $query->orderBy('ventes_count', 'desc')->get();
        
        $data = [
            'titre' => 'Rapport des produits',
            'dateGeneration' => now()->format('d/m/Y H:i'),
            'periode' => $dateDebut && $dateFin ? $dateDebut->format('d/m/Y') . ' au ' . $dateFin->format('d/m/Y') : 'Toutes les périodes',
            'produits' => $produits,
        ];
        
        return $this->genererFichier('produits', $data, $format);
    }
    
    protected function genererFichier($type, $data, $format)
    {
        if ($format === 'pdf') {
            return $this->genererPDF($type, $data);
        } else {
            return $this->genererExcel($type, $data);
        }
    }
    
    protected function genererPDF($type, $data)
    {
        $pdf = PDF::loadView('rapports.' . $type, $data);
        $filename = $type . '_' . now()->format('Y-m-d_His') . '.pdf';
        $pdf->setPaper('A4', 'landscape');

        // Options essentielles
        $pdf->setOption('enable_html5_parser', true);
        $pdf->setOption('isPhpEnabled', true); // Nécessaire pour la pagination
        $pdf->setOption('isRemoteEnabled', true);
        
        return $pdf->download($filename);
    }
    protected function genererExcel($type, $data)
{
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    
    // Appeler la méthode spécifique pour chaque type de rapport
    $methodName = 'excel' . Str::studly($type);
    
    if (method_exists($this, $methodName)) {
        $this->$methodName($sheet, $data);
    } else {
        // Style par défaut amélioré
        $this->applyDefaultExcelStyle($sheet, $data);
    }
    
    $filename = $type . '_' . now()->format('Y-m-d_His') . '.xlsx';
    
    // Téléchargement direct
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="' . $filename . '"');
    header('Cache-Control: max-age=0');
    
    $writer = new Xlsx($spreadsheet);
    $writer->save('php://output');
    exit;
}

protected function applyDefaultExcelStyle($sheet, $data)
{
    // Style pour le titre
    $sheet->mergeCells('A1:I1');
    $sheet->setCellValue('A1', $data['titre']);
    $sheet->getStyle('A1')->applyFromArray([
        'font' => [
            'bold' => true,
            'size' => 16,
            'color' => ['rgb' => 'FFFFFF']
        ],
        'alignment' => [
            'horizontal' => Alignment::HORIZONTAL_CENTER,
        ],
        'fill' => [
            'fillType' => Fill::FILL_SOLID,
            'startColor' => ['rgb' => '3498DB']
        ]
    ]);
    
    // Métadonnées
    $sheet->setCellValue('A2', 'Date de génération: ' . $data['dateGeneration']);
    $sheet->mergeCells('A2:I2');
    $sheet->getStyle('A2')->applyFromArray([
        'font' => [
            'italic' => true,
            'color' => ['rgb' => '7F8C8D']
        ]
    ]);
    
    if (isset($data['periode'])) {
        $sheet->setCellValue('A3', 'Période: ' . $data['periode']);
        $sheet->mergeCells('A3:I3');
        $sheet->getStyle('A3')->applyFromArray([
            'font' => [
                'italic' => true,
                'color' => ['rgb' => '7F8C8D']
            ]
        ]);
    }
    
    // En-têtes de colonnes
    $headers = ['Code', 'Date', 'Client', 'Vendeur', 'Total HT', 'TVA', 'Total TTC', 'Remise', 'Payé'];
    $sheet->fromArray($headers, null, 'A4');
    $sheet->getStyle('A4:I4')->applyFromArray([
        'font' => [
            'bold' => true,
            'color' => ['rgb' => 'FFFFFF']
        ],
        'fill' => [
            'fillType' => Fill::FILL_SOLID,
            'startColor' => ['rgb' => '2C3E50']
        ],
        'borders' => [
            'allBorders' => [
                'borderStyle' => Border::BORDER_THIN,
                'color' => ['rgb' => '000000']
            ]
        ]
    ]);
    
    // Données
    $row = 5;
    foreach ($data['ventes'] as $vente) {
        $sheet->setCellValue('A'.$row, $vente->code);
        $sheet->setCellValue('B'.$row, $vente->created_at->format('d/m/Y H:i'));
        $sheet->setCellValue('C'.$row, $vente->client?->name ?? 'Non spécifié');
        $sheet->setCellValue('D'.$row, $vente->user->name);
        $sheet->setCellValue('E'.$row, $vente->total_ht);
        $sheet->setCellValue('F'.$row, $vente->total_tva);
        $sheet->setCellValue('G'.$row, $vente->total_ttc);
        $sheet->setCellValue('H'.$row, $vente->montant_remise);
        $sheet->setCellValue('I'.$row, $vente->montant_paye);
        
        // Format numérique pour les montants
        $sheet->getStyle('E'.$row.':I'.$row)->getNumberFormat()
              ->setFormatCode('#,##0.00');
              
        // Alternance des couleurs de ligne
        $fillColor = $row % 2 == 0 ? 'EAEDED' : 'FDFEFE';
        $sheet->getStyle('A'.$row.':I'.$row)->applyFromArray([
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => $fillColor]
            ]
        ]);
        
        $row++;
    }
    
    // Ligne de totaux
    $sheet->setCellValue('A'.$row, 'TOTAL');
    $sheet->mergeCells('A'.$row.':D'.$row);
    $sheet->setCellValue('E'.$row, $data['totalHT']);
    $sheet->setCellValue('F'.$row, $data['totalTVA']);
    $sheet->setCellValue('G'.$row, $data['totalTTC']);
    $sheet->setCellValue('H'.$row, $data['totalRemise']);
    
    $sheet->getStyle('A'.$row.':I'.$row)->applyFromArray([
        'font' => [
            'bold' => true
        ],
        'fill' => [
            'fillType' => Fill::FILL_SOLID,
            'startColor' => ['rgb' => 'D5DBDB']
        ],
        'borders' => [
            'top' => [
                'borderStyle' => Border::BORDER_DOUBLE
            ]
        ]
    ]);
    
    // Format numérique pour les totaux
    $sheet->getStyle('E'.$row.':I'.$row)->getNumberFormat()
          ->setFormatCode('#,##0.00');
    
    // Ajustement automatique des colonnes
    foreach (range('A', 'I') as $column) {
        $sheet->getColumnDimension($column)->setAutoSize(true);
    }
    
    // Protection contre l'édition
    $sheet->getProtection()->setSheet(true);
    $sheet->getStyle('A5:I'.($row-1))->getProtection()
          ->setLocked(Protection::PROTECTION_UNPROTECTED);
}
    
    // Méthodes pour générer des fichiers Excel spécifiques
    protected function excelVentes($sheet, $data)
    {
        $sheet->setCellValue('A1', $data['titre']);
        $sheet->setCellValue('A2', 'Date de génération: ' . $data['dateGeneration']);
        $sheet->setCellValue('A3', 'Période: ' . $data['periode']);
        
        // En-têtes
        $sheet->setCellValue('A5', 'Code');
        $sheet->setCellValue('B5', 'Date');
        $sheet->setCellValue('C5', 'Client');
        $sheet->setCellValue('D5', 'Vendeur');
        $sheet->setCellValue('E5', 'Total HT');
        $sheet->setCellValue('F5', 'Total TVA');
        $sheet->setCellValue('G5', 'Total TTC');
        $sheet->setCellValue('H5', 'Remise');
        $sheet->setCellValue('I5', 'Montant payé');
        
        // Données
        $row = 6;
        foreach ($data['ventes'] as $vente) {
            $sheet->setCellValue('A'.$row, $vente->code);
            $sheet->setCellValue('B'.$row, $vente->created_at->format('d/m/Y H:i'));
            $sheet->setCellValue('C'.$row, $vente->client->name);
            $sheet->setCellValue('D'.$row, $vente->user->name);
            $sheet->setCellValue('E'.$row, $vente->total_ht);
            $sheet->setCellValue('F'.$row, $vente->total_tva);
            $sheet->setCellValue('G'.$row, $vente->total_ttc);
            $sheet->setCellValue('H'.$row, $vente->montant_remise);
            $sheet->setCellValue('I'.$row, $vente->montant_paye);
            $row++;
        }
        
        // Totaux
        $row += 1;
        $sheet->setCellValue('D'.$row, 'TOTAL:');
        $sheet->setCellValue('E'.$row, $data['totalHT']);
        $sheet->setCellValue('F'.$row, $data['totalTVA']);
        $sheet->setCellValue('G'.$row, $data['totalTTC']);
        $sheet->setCellValue('H'.$row, $data['totalRemise']);
    }
    
    protected function excelStock($sheet, $data)
    {
        $sheet->setCellValue('A1', $data['titre']);
        $sheet->setCellValue('A2', 'Date de génération: ' . $data['dateGeneration']);
        
        // En-têtes
        $sheet->setCellValue('A4', 'Code');
        $sheet->setCellValue('B4', 'Produit');
        $sheet->setCellValue('C4', 'Catégorie');
        $sheet->setCellValue('D4', 'Rayon');
        $sheet->setCellValue('E4', 'Quantité');
        $sheet->setCellValue('F4', 'Alerte');
        $sheet->setCellValue('G4', 'Statut');
        
        // Données
        $row = 5;
        foreach ($data['stocks'] as $stock) {
            $statut = $stock->quantite === 0 ? 'Rupture' : ($stock->quantite <= $stock->quantite_alerte ? 'Alerte' : 'Normal');
            
            $sheet->setCellValue('A'.$row, $stock->produit->code);
            $sheet->setCellValue('B'.$row, $stock->produit->nom);
            $sheet->setCellValue('C'.$row, $stock->produit->categorie->name);
            $sheet->setCellValue('D'.$row, $stock->rayon->nom);
            $sheet->setCellValue('E'.$row, $stock->quantite);
            $sheet->setCellValue('F'.$row, $stock->quantite_alerte);
            $sheet->setCellValue('G'.$row, $statut);
            $row++;
        }
        
        // Résumé
        $row += 2;
        $sheet->setCellValue('A'.$row, 'Récapitulatif:');
        $row++;
        $sheet->setCellValue('A'.$row, 'Total des produits:');
        $sheet->setCellValue('B'.$row, $data['totalProduits']);
        $row++;
        $sheet->setCellValue('A'.$row, 'Produits en alerte:');
        $sheet->setCellValue('B'.$row, $data['produitsEnAlerte']);
        $row++;
        $sheet->setCellValue('A'.$row, 'Produits en rupture:');
        $sheet->setCellValue('B'.$row, $data['produitsEnRupture']);
    }

    // Autres méthodes Excel pour les différents types de rapports...
}