<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HomepageSection;
use Illuminate\Http\Request;

class HomepageController extends Controller
{
    public function index()
    {
        $sections = HomepageSection::orderBy('sort_order')->get()->keyBy('section_key');
        return response()->json($sections);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'sections' => 'required|array',
            'sections.*.section_key' => 'required|string',
            'sections.*.title' => 'nullable|string',
            'sections.*.subtitle' => 'nullable|string',
            'sections.*.content' => 'nullable|string',
            'sections.*.button_text' => 'nullable|string',
            'sections.*.button_link' => 'nullable|string',
            'sections.*.extra_data' => 'nullable|array',
        ]);

        foreach ($validated['sections'] as $sectionData) {
            HomepageSection::updateOrCreate(
                ['section_key' => $sectionData['section_key']],
                $sectionData
            );
        }

        return response()->json(['message' => 'Homepage updated successfully']);
    }
}
