<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductDetailResource;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductController extends Controller
{
    /**
     * Display a listing of public active products.
     * GET /api/products
     */
    public function index(Request $request)
    {
        try {
            $query = Product::where('status', 'active')->with('images');

            // Search filter
            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('short_description', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Featured filter optional
            if ($request->has('featured') && $request->boolean('featured')) {
                $query->where('featured', true);
            }

            // Sort filter
            $sort = $request->input('sort', 'featured');
            switch ($sort) {
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'featured':
                default:
                    $query->orderBy('featured', 'desc')->orderBy('sort_order', 'asc')->orderBy('id', 'asc');
                    break;
            }

            $perPage = (int) $request->input('per_page', 12);
            $paginated = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($paginated->items()),
                'meta' => [
                    'current_page' => $paginated->currentPage(),
                    'last_page' => $paginated->lastPage(),
                    'per_page' => $paginated->perPage(),
                    'total' => $paginated->total(),
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Public Product Index Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve products.',
            ], 500);
        }
    }

    /**
     * Display the specified active product detail by slug or ID.
     * GET /api/products/{slug}
     */
    public function show($slug)
    {
        try {
            $product = Product::where('status', 'active')
                ->where(function ($q) use ($slug) {
                    $q->where('slug', $slug)->orWhere('id', $slug);
                })
                ->with('images')
                ->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found or hidden.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new ProductDetailResource($product),
            ]);
        } catch (\Exception $e) {
            \Log::error('Public Product Detail Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching product detail.',
            ], 500);
        }
    }

    /**
     * Display related active products excluding current product.
     * GET /api/products/{slug}/related
     */
    public function related($slug)
    {
        try {
            $current = Product::where('slug', $slug)->orWhere('id', $slug)->first();

            $query = Product::where('status', 'active')->with('images');
            if ($current) {
                $query->where('id', '!=', $current->id);
            }

            $related = $query->inRandomOrder()->limit(4)->get();

            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($related),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve related products.',
            ], 500);
        }
    }
}
