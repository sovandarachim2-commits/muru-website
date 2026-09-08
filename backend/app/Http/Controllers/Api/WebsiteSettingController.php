<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class WebsiteSettingController extends Controller
{
    public function index()
    {
        $settings = SiteSetting::all()->pluck('setting_value', 'setting_key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'nullable|string',
            'logo' => 'nullable|string',
            'favicon' => 'nullable|string',
            'website_url' => 'nullable|string',
            'default_language' => 'nullable|string',
            'telegram_url' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
            'address' => 'nullable|string',
            'instagram' => 'nullable|string',
            'facebook' => 'nullable|string',
            'tiktok' => 'nullable|string',
            'youtube' => 'nullable|string',
            'show_prices_globally' => 'nullable',
            'products_per_page' => 'nullable|integer',
            'default_title' => 'nullable|string',
            'default_meta_description' => 'nullable|string',
            'social_sharing_image' => 'nullable|string',
            'footer_description' => 'nullable|string',
            'copyright_text' => 'nullable|string',
            'logo_file' => 'nullable|image|max:2048',
            'favicon_file' => 'nullable|image|max:1024',
            'social_file' => 'nullable|image|max:3072',
        ]);

        $imageDisk = env('IMAGE_STORAGE_DISK') === 'r2' && env('R2_BUCKET')
            ? 'r2'
            : 'public';

        // Handle Logo Upload
        if ($request->hasFile('logo_file')) {
            $path = $request->file('logo_file')->store('settings', $imageDisk);
            $validated['logo'] = $imageDisk === 'public'
                ? request()->getSchemeAndHttpHost() . '/storage/' . ltrim($path, '/')
                : \Illuminate\Support\Facades\Storage::disk($imageDisk)->url($path);
        }

        // Handle Favicon Upload
        if ($request->hasFile('favicon_file')) {
            $path = $request->file('favicon_file')->store('settings', $imageDisk);
            $validated['favicon'] = $imageDisk === 'public'
                ? request()->getSchemeAndHttpHost() . '/storage/' . ltrim($path, '/')
                : \Illuminate\Support\Facades\Storage::disk($imageDisk)->url($path);
        }

        // Handle Social Sharing Image Upload
        if ($request->hasFile('social_file')) {
            $path = $request->file('social_file')->store('settings', $imageDisk);
            $validated['social_sharing_image'] = $imageDisk === 'public'
                ? request()->getSchemeAndHttpHost() . '/storage/' . ltrim($path, '/')
                : \Illuminate\Support\Facades\Storage::disk($imageDisk)->url($path);
        }

        // Clean up internal file keys before saving to DB
        unset($validated['logo_file']);
        unset($validated['favicon_file']);
        unset($validated['social_file']);

        foreach ($validated as $key => $value) {
            // Convert boolean to string for DB storage if needed
            if ($key === 'show_prices_globally') {
                $value = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
            }

            SiteSetting::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }

        return response()->json(['message' => 'Website settings updated successfully']);
    }
}
