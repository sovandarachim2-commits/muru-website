<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SitePage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AboutUsController extends Controller
{
    public function index()
    {
        $page = SitePage::where('page_key', 'about-us')->first();
        return response()->json($page ? $page->extra_data : null);
    }

    public function update(Request $request)
    {
        $payload = $request->input('data');
        $data = $payload ? json_decode($payload, true) : $request->all();
        $validator = Validator::make($data ?: [], [
            'hero' => 'required|array',
            'hero.label' => 'nullable|string',
            'hero.title' => 'nullable|string',
            'hero.description' => 'nullable|string',
            'hero.image' => 'nullable|string',
            
            'story' => 'required|array',
            'story.title' => 'nullable|string',
            'story.content' => 'nullable|string',
            'story.image' => 'nullable|string',
            
            'pillars' => 'required|array',
            'pillars.mission' => 'nullable|string',
            'pillars.values' => 'nullable|string',
            'pillars.promise' => 'nullable|string',
            
            'quality' => 'required|array',
            'quality.title' => 'nullable|string',
            'quality.description' => 'nullable|string',
            'quality.image' => 'nullable|string',
            
            'cta' => 'required|array',
            'cta.heading' => 'nullable|string',
            'cta.explore_button' => 'nullable|string',
            'cta.telegram_button' => 'nullable|string',
        ]);
        $validated = $validator->validate();

        $imageDisk = env('IMAGE_STORAGE_DISK') === 'r2' && env('R2_BUCKET')
            ? 'r2'
            : 'public';
        foreach (['hero_image' => 'hero', 'story_image' => 'story', 'quality_image' => 'quality'] as $fileKey => $section) {
            if (!$request->hasFile($fileKey)) continue;

            $path = $request->file($fileKey)->store('about', $imageDisk);
            $validated[$section]['image'] = $imageDisk === 'public'
                ? $request->getSchemeAndHttpHost() . '/storage/' . ltrim($path, '/')
                : Storage::disk($imageDisk)->url($path);
        }

        $page = SitePage::updateOrCreate(
            ['page_key' => 'about-us'],
            [
                'title' => 'About Us',
                'extra_data' => $validated
            ]
        );

        return response()->json(['message' => 'About Us page updated successfully', 'data' => $page->extra_data]);
    }
}
