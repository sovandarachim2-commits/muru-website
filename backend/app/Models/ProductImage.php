<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'image_path',
        'alt_text',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'url',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getUrlAttribute(): string
    {
        if (Str::startsWith($this->image_path, ['http://', 'https://', '/'])) {
            return $this->image_path;
        }

        $disk = env('IMAGE_STORAGE_DISK') === 'r2' && env('R2_BUCKET')
            ? 'r2'
            : 'public';
        if ($disk === 'public') {
            return request()->getSchemeAndHttpHost() . '/storage/' . ltrim($this->image_path, '/');
        }

        return Storage::disk($disk)->url($this->image_path);
    }
}
