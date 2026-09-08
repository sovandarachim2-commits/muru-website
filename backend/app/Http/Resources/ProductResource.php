<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $primaryImg = $this->images->where('is_primary', true)->first() ?? $this->images->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'subtitle' => $this->short_description,
            'short_description' => $this->short_description,
            'price' => $this->price,
            'formatted_price' => $this->show_price && $this->price !== null ? '$' . number_format($this->price, 2) : null,
            'show_price' => $this->show_price,
            'image' => $primaryImg ? $primaryImg->url : '/images/muru_hero_campaign_1788771956720.jpg',
            'featured' => $this->featured,
            'status' => $this->status,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at,
        ];
    }
}
