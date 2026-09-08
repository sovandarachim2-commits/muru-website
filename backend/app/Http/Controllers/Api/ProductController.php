<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('primaryImage');

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $sortField = $request->get('sort_by', 'sort_order');
        $sortOrder = $request->get('sort_direction', 'asc');

        // Whitelist sort fields to prevent SQL injection
        $allowedSortFields = ['name', 'price', 'sort_order', 'created_at', 'updated_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'sort_order';
        }

        // Whitelist sort direction
        $sortOrder = strtolower($sortOrder) === 'desc' ? 'desc' : 'asc';

        $query->orderBy($sortField, $sortOrder);

        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'show_price' => 'boolean',
            'benefits' => 'nullable|array',
            'how_to_use' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'featured' => 'boolean',
            'status' => 'required|in:active,hidden',
            'sort_order' => 'integer',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function show($id)
    {
        $product = Product::with('images')->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug,' . $id,
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'show_price' => 'boolean',
            'benefits' => 'nullable|array',
            'how_to_use' => 'nullable|string',
            'ingredients' => 'nullable|string',
            'featured' => 'boolean',
            'status' => 'required|in:active,hidden',
            'sort_order' => 'integer',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $imageDisk = env('IMAGE_STORAGE_DISK') === 'r2' && env('R2_BUCKET')
            ? 'r2'
            : 'public';
        
        // Delete images from storage
        foreach ($product->images as $image) {
            if (!Str::startsWith($image->image_path, ['http://', 'https://', '/'])) {
                Storage::disk($imageDisk)->delete($image->image_path);
            }
        }
        
        $product->delete();

        return response()->json(null, 204);
    }

    public function toggleStatus($id)
    {
        $product = Product::findOrFail($id);
        $product->status = $product->status === 'active' ? 'hidden' : 'active';
        $product->save();

        return response()->json($product);
    }

    public function uploadImages(Request $request, $id)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $product = Product::findOrFail($id);
        $uploadedImages = [];
        $imageDisk = env('IMAGE_STORAGE_DISK') === 'r2' && env('R2_BUCKET')
            ? 'r2'
            : 'public';

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('products', $imageDisk);
                
                $image = $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $product->images()->count() === 0,
                    'sort_order' => ($product->images()->max('sort_order') ?? 0) + 1,
                ]);

                $uploadedImages[] = $image;
            }
        }

        return response()->json($uploadedImages);
    }

    public function setPrimaryImage($productId, $imageId)
    {
        $product = Product::findOrFail($productId);
        
        // Reset all to false
        $product->images()->update(['is_primary' => false]);
        
        // Set new primary
        $image = $product->images()->findOrFail($imageId);
        $image->update(['is_primary' => true]);

        return response()->json(['success' => true]);
    }

    public function deleteImage($productId, $imageId)
    {
        $product = Product::findOrFail($productId);
        $image = $product->images()->findOrFail($imageId);
        
        $imageDisk = env('IMAGE_STORAGE_DISK') === 'r2' && env('R2_BUCKET')
            ? 'r2'
            : 'public';
        if (!Str::startsWith($image->image_path, ['http://', 'https://', '/'])) {
            Storage::disk($imageDisk)->delete($image->image_path);
        }
        
        $image->delete();

        // If we deleted the primary image, make the first remaining one primary
        if ($image->is_primary && $product->images()->count() > 0) {
            $product->images()->first()->update(['is_primary' => true]);
        }

        return response()->json(['success' => true]);
    }
}
