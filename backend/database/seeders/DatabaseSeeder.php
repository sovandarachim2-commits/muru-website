<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\SiteSetting;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\HomepageSection;
use App\Models\SitePage;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin Account
        User::updateOrCreate(
            ['email' => 'admin@muru.com'],
            [
                'name' => 'MURU Admin',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Basic MURU Website Settings
        $settings = [
            'site_name' => 'MURU',
            'tagline' => 'Simple skincare for your everyday glow.',
            'telegram' => 'muru_skincare',
            'telegram_url' => 'https://t.me/muru_skincare',
            'phone' => '+855 12 345 678',
            'email' => 'hello@muru.com',
            'address' => 'Phnom Penh, Cambodia',
            'instagram' => 'https://instagram.com/muru.skincare',
            'facebook' => 'https://facebook.com/muru.skincare',
            'tiktok' => 'https://tiktok.com/@muru.skincare',
            'youtube' => '',
            'copyright' => '© 2026 MURU. All rights reserved.',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(
                ['setting_key' => $key],
                ['setting_value' => $value]
            );
        }

        // 3. Sample Products
        $products = [
            [
                'name' => 'Bloom Facial Cleanser',
                'slug' => 'bloom-facial-cleanser',
                'short_description' => 'Gentle hydrating daily cleanser with organic rose water & aloe vera.',
                'description' => 'Formulated specifically for daily use, Bloom Facial Cleanser cleanses deeply while preserving your skin’s natural lipid barrier.',
                'price' => 24.00,
                'show_price' => true,
                'benefits' => [
                    'Maintains optimal skin pH balance (pH 5.5)',
                    'Soothes redness and calms sensitive skin',
                    'Deeply hydrates with organic rose water & aloe',
                    '100% Sulphate-free, paraben-free & vegan',
                ],
                'how_to_use' => 'Dispense 1-2 pumps onto damp hands. Gently massage onto wet face in circular motions for 30-60 seconds. Rinse thoroughly with lukewarm water.',
                'ingredients' => 'Organic Rosa Damascena (Rose) Flower Water, Aqua, Aloe Barbadensis Leaf Juice, Glycerin, Sodium Cocoyl Isethionate, Coco-Glucoside, Peony Extract.',
                'featured' => true,
                'status' => 'active',
                'sort_order' => 1,
                'image' => '/images/muru_product_cleanser_1788772011928.jpg',
            ],
            [
                'name' => 'Lumière Rose Refresh',
                'slug' => 'lumiere-rose-refresh-toner',
                'short_description' => 'Minimalist hydrating toner mist that refreshes and balances skin.',
                'description' => 'Lumière Rose Refresh restores instant hydration to skin cells after cleansing. Rich in antioxidants and rose floral water.',
                'price' => 28.00,
                'show_price' => true,
                'benefits' => [
                    'Provides instant hydration replenishment',
                    'Refines skin texture and minimizes pores',
                    'Preps skin for deeper serum absorption',
                    'Calms inflammation and environmental stress',
                ],
                'how_to_use' => 'After cleansing, mist directly onto face and neck, or apply using a cotton pad. Gently press into skin with fingertips.',
                'ingredients' => 'Rosa Damascena Flower Water, Water/Aqua, Hyaluronic Acid, Propanediol, Chamomilla Recutita Flower Extract, Glycerin, Allantoin.',
                'featured' => true,
                'status' => 'active',
                'sort_order' => 2,
                'image' => '/images/muru_product_toner_1788772050928.jpg',
            ],
            [
                'name' => 'Éclat Botanique Essence',
                'slug' => 'eclat-botanique-essence',
                'short_description' => 'Aura vitalizing essence concentrated with peony peptides & glow complex.',
                'description' => 'Éclat Botanique Essence is a concentrated treatment formulated to revive tired, dull skin and restore youthful radiance.',
                'price' => 38.00,
                'show_price' => true,
                'benefits' => [
                    'Promotes natural, radiant youthful glow',
                    'Boosts collagen synthesis & elasticity',
                    'Lightweight, fast-absorbing essence texture',
                    'Evens out skin tone and dark spots',
                ],
                'how_to_use' => 'Dispense 3-4 drops onto palms and pat gently onto clean face and neck until fully absorbed.',
                'ingredients' => 'Paeonia Lactiflora Root Extract, Camellia Sinensis Leaf Extract, Niacinamide, Glycerin, Butylene Glycol, Adenosine, Acetyl Hexapeptide-8.',
                'featured' => true,
                'status' => 'active',
                'sort_order' => 3,
                'image' => '/images/muru_hero_campaign_1788771956720.jpg',
            ],
            [
                'name' => 'Aethel Radiance Boost',
                'slug' => 'aethel-radiance-boost-cream',
                'short_description' => 'Velvety barrier repair moisturizer that locks in hydration for 24 hours.',
                'description' => 'Aethel Radiance Boost is an ultra-nourishing cream enriched with ceramides and botanical oils. It locks in moisture and reinforces your barrier.',
                'price' => 32.00,
                'show_price' => true,
                'benefits' => [
                    'Strengthens skin natural moisture barrier',
                    '24-hour continuous hydration lock',
                    'Non-greasy, velvety luxurious feel',
                    'Reduces flakiness and fine dryness lines',
                ],
                'how_to_use' => 'Smooth a dime-sized amount over face and neck as the final step in your skincare routine.',
                'ingredients' => 'Water/Aqua, Caprylic/Capric Triglyceride, Ceramide NP, Squalane, Butyrospermum Parkii (Shea) Butter, Simmondsia Chinensis Oil.',
                'featured' => true,
                'status' => 'active',
                'sort_order' => 4,
                'image' => '/images/muru_product_cream_1788772069634.jpg',
            ],
        ];

        foreach ($products as $prodData) {
            $imgPath = $prodData['image'];
            unset($prodData['image']);

            $product = Product::updateOrCreate(
                ['slug' => $prodData['slug']],
                $prodData
            );

            ProductImage::updateOrCreate(
                ['product_id' => $product->id, 'image_path' => $imgPath],
                [
                    'alt_text' => $product->name,
                    'is_primary' => true,
                    'sort_order' => 1,
                ]
            );
        }

        // 4. Homepage Content Sections
        $homepageSections = [
            [
                'section_key' => 'hero',
                'title' => 'PURE CARE.',
                'subtitle' => 'REAL RESULTS.',
                'content' => 'Gentle skincare for your everyday glow.',
                'image' => '/images/muru_hero_campaign_1788771956720.jpg',
                'button_text' => 'Explore Products',
                'button_link' => '/products',
                'extra_data' => ['label' => 'MURU SKINCARE'],
                'sort_order' => 1,
            ],
            [
                'section_key' => 'signature_products',
                'title' => 'Our Signature Products',
                'subtitle' => 'Discover MURU skincare essentials.',
                'button_text' => 'View All Products',
                'button_link' => '/products',
                'sort_order' => 2,
            ],
            [
                'section_key' => 'brand_story',
                'title' => 'Healthy Skin, Happier You',
                'content' => 'At MURU, we believe everyday skincare should feel gentle, effortless, and genuinely restorative. Formulated with carefully selected natural extracts and skin-loving essentials, our products nurture your skin barrier so your natural radiance can shine through every single day.',
                'image' => '/images/muru_brand_story_1788771976448.jpg',
                'button_text' => 'Our Story',
                'button_link' => '/about',
                'sort_order' => 3,
            ],
            [
                'section_key' => 'telegram_cta',
                'title' => 'Questions about our products?',
                'subtitle' => 'Our MURU team is here to help.',
                'button_text' => 'Chat on Telegram',
                'sort_order' => 4,
            ],
        ];

        foreach ($homepageSections as $section) {
            HomepageSection::updateOrCreate(
                ['section_key' => $section['section_key']],
                $section
            );
        }

        // 5. About Page Content
        SitePage::updateOrCreate(
            ['page_key' => 'about'],
            [
                'title' => 'Skincare With a Purpose',
                'content' => 'MURU was born from a simple belief: daily skincare should be pure, intentional, and deeply restorative. We curate clean formulations designed to celebrate your skin’s natural radiance.',
                'extra_data' => [
                    'label' => 'ABOUT MURU',
                    'hero_image' => '/images/muru_hero_campaign_1788771956720.jpg',
                    'story_heading' => 'Thoughtfully Crafted for Everyday Radiance',
                    'story_paragraphs' => [
                        'Founded with a singular focus on eliminating unnecessary complexities in daily skincare routines, MURU realized that true skin health doesn’t require exhausting multi-step regimens—it requires gentle, biocompatible ingredients that nurture your natural moisture barrier.',
                        'Every MURU formula is crafted with delicate botanical extracts, hydrating floral waters, and protective antioxidants. We combine traditional plant wisdom with modern skin science to deliver visible, glowing results you can feel every day.',
                    ],
                    'story_image' => '/images/muru_brand_story_1788771976448.jpg',
                    'pillars' => [
                        ['title' => 'Our Mission', 'content' => 'To empower individuals to feel confident in their natural skin through gentle, high-efficacy skincare essentials.'],
                        ['title' => 'Our Values', 'content' => 'Purity, transparency, and mindfulness. We strictly formulate without harsh sulphates or parabens.'],
                        ['title' => 'Our Promise', 'content' => 'Uncompromising safety and visible care. Every formula undergoes rigorous dermatological testing.'],
                    ],
                    'quality_heading' => 'Clean Ingredients. Real Results.',
                    'quality_description' => 'We meticulously source every botanical distillate and active ingredient to ensure peak purity and skin harmony.',
                    'quality_image' => '/images/muru_about_quality_1788772489240.jpg',
                ],
            ]
        );
    }
}
