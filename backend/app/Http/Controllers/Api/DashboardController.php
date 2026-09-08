<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_products' => Product::count(),
            'active_products' => Product::where('status', 'active')->count(),
            'hidden_products' => Product::where('status', 'hidden')->count(),
            'featured_products' => Product::where('featured', true)->count(),
        ];

        $recent_products = Product::with('primaryImage')
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'price', 'status', 'updated_at']);

        return response()->json([
            'stats' => $stats,
            'recent_products' => $recent_products
        ]);
    }
}
