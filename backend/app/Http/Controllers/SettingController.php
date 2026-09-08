<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use App\Http\Resources\SiteSettingResource;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display public website settings.
     * GET /api/site-settings
     */
    public function index()
    {
        try {
            $settings = SiteSetting::all();
            
            // Transform key-value map for convenient frontend use
            $formatted = [];
            foreach ($settings as $setting) {
                $formatted[$setting->setting_key] = $setting->setting_value;
            }

            return response()->json([
                'success' => true,
                'data' => $formatted,
                'list' => SiteSettingResource::collection($settings),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load site settings.',
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'contact_title' => 'nullable|string',
            'contact_subtitle' => 'nullable|string',
            'telegram' => 'nullable|string',
            'telegram_label' => 'nullable|string',
            'telegram_url' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
            'address' => 'nullable|string',
            'instagram' => 'nullable|string',
            'facebook' => 'nullable|string',
            'tiktok' => 'nullable|string',
            'youtube' => 'nullable|string',
            'contact_image' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            SiteSetting::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
