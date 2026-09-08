<?php

namespace App\Http\Controllers;

use App\Models\HomepageSection;
use App\Http\Resources\HomepageSectionResource;
use Illuminate\Http\Request;

class HomepageController extends Controller
{
    /**
     * Display public active homepage sections.
     * GET /api/homepage
     */
    public function show()
    {
        try {
            $sections = HomepageSection::where('is_active', true)
                ->orderBy('sort_order', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => HomepageSectionResource::collection($sections),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load homepage content.',
            ], 500);
        }
    }
}
