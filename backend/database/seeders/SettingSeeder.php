<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Setting::create([
            'telegram' => 'muru_skincare',
            'phone' => '+855 12 345 678',
            'email' => 'hello@muru.com',
            'address' => "No. 123, Street 456\nPhnom Penh, Cambodia",
            'instagram' => 'muru.official',
            'facebook' => 'muru.skincare',
            'tiktok' => 'muru_beauty',
            'youtube' => 'muru_skincare_official',
        ]);
    }
}
