<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $images = $this->images->map(fn ($image) => $image->url)->toArray();
        if (empty($images)) {
            $images = ['/images/muru_hero_campaign_1788771956720.jpg'];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'tagline' => $this->short_description,
            'subtitle' => $this->short_description,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'price' => $this->price,
            'formatted_price' => $this->show_price && $this->price !== null ? '$' . number_format($this->price, 2) : null,
            'show_price' => $this->show_price,
            'image' => $images[0],
            'images' => $images,
            'benefits' => $this->benefits ?? [],
            'how_to_use' => $this->how_to_use,
            'ingredients' => $this->ingredients,
            'featured' => $this->featured,
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'created_at' => $this->created_at,
        ];
    }
}
