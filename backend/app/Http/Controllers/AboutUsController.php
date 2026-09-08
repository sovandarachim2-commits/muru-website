<?php

namespace App\Http\Controllers;

use App\Models\SitePage;
use App\Http\Resources\SitePageResource;
use Illuminate\Http\Request;

class AboutUsController extends Controller
{
    /**
     * Display public about page data.
     * GET /api/pages/about
     */
    public function show()
    {
        try {
            $page = SitePage::whereIn('page_key', ['about', 'about-us'])->first();

            if (!$page) {
                return response()->json([
                    'success' => false,
                    'message' => 'About page content not found.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new SitePageResource($page),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load about page content.',
            ], 500);
        }
    }
}
