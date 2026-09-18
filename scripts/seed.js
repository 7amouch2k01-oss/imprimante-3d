#!/usr/bin/env node
'use strict';

/**
 * MongoDB Seed Script — CBV 3D Printing Store
 * Runs on every container startup (idempotent — skips if products already exist)
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.log('⚠️  MONGODB_URI not set — skipping seed');
  process.exit(0);
}

// ─── Schemas ───────────────────────────────────────────────────────────────

const TranslationSchema = new mongoose.Schema(
  {
    languageCode: String,
    name: String,
    description: String,
    specs: { type: Map, of: String },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    price: Number,
    comparePrice: Number,
    stock: { type: Number, default: 10 },
    images: [String],
    category: { type: String, default: 'PRINTER' },
    featured: { type: Boolean, default: false },
    translations: [TranslationSchema],
  },
  { timestamps: true }
);

// ─── Seed Data ─────────────────────────────────────────────────────────────

const products = [
  {
    slug: 'cbv-pro-x1',
    price: 1299.99,
    comparePrice: 1599.99,
    stock: 15,
    images: ['/images/printer-1.jpg', '/images/printer-1b.jpg'],
    category: 'PRINTER',
    featured: true,
    translations: [
      {
        languageCode: 'en',
        name: 'CBV Pro X1 3D Printer',
        description:
          'Professional-grade FDM 3D printer with auto-leveling, dual extrusion, and 300×300×400mm build volume. Perfect for engineers and makers.',
        specs: new Map([
          ['Build Volume', '300×300×400mm'],
          ['Layer Resolution', '0.05–0.35mm'],
          ['Print Speed', 'Up to 200mm/s'],
          ['Filament Diameter', '1.75mm'],
          ['Nozzle Temperature', 'Up to 280°C'],
          ['Bed Temperature', 'Up to 110°C'],
          ['Connectivity', 'Wi-Fi, USB, SD Card'],
          ['Weight', '12.5 kg'],
        ]),
      },
      {
        languageCode: 'fr',
        name: 'Imprimante 3D CBV Pro X1',
        description:
          'Imprimante 3D FDM professionnelle avec nivellement automatique, double extrusion et volume d\'impression 300×300×400mm. Idéale pour les ingénieurs et les makers.',
        specs: new Map([
          ['Volume d\'impression', '300×300×400mm'],
          ['Résolution des couches', '0,05–0,35mm'],
          ['Vitesse d\'impression', 'Jusqu\'à 200mm/s'],
          ['Diamètre du filament', '1,75mm'],
          ['Température de la buse', 'Jusqu\'à 280°C'],
          ['Température du plateau', 'Jusqu\'à 110°C'],
          ['Connectivité', 'Wi-Fi, USB, Carte SD'],
          ['Poids', '12,5 kg'],
        ]),
      },
    ],
  },
  {
    slug: 'cbv-mini-s2',
    price: 499.99,
    comparePrice: 649.99,
    stock: 25,
    images: ['/images/printer-2.jpg'],
    category: 'PRINTER',
    featured: true,
    translations: [
      {
        languageCode: 'en',
        name: 'CBV Mini S2 3D Printer',
        description:
          'Compact, beginner-friendly 3D printer with a 180×180×180mm build volume. Silent stepper motors and easy touchscreen interface.',
        specs: new Map([
          ['Build Volume', '180×180×180mm'],
          ['Layer Resolution', '0.1–0.3mm'],
          ['Print Speed', 'Up to 120mm/s'],
          ['Filament Diameter', '1.75mm'],
          ['Nozzle Temperature', 'Up to 260°C'],
          ['Connectivity', 'USB, SD Card'],
          ['Weight', '6.2 kg'],
        ]),
      },
      {
        languageCode: 'fr',
        name: 'Imprimante 3D CBV Mini S2',
        description:
          'Imprimante 3D compacte et conviviale avec un volume d\'impression de 180×180×180mm. Moteurs pas à pas silencieux et interface tactile facile.',
        specs: new Map([
          ['Volume d\'impression', '180×180×180mm'],
          ['Résolution des couches', '0,1–0,3mm'],
          ['Vitesse d\'impression', 'Jusqu\'à 120mm/s'],
          ['Diamètre du filament', '1,75mm'],
          ['Température de la buse', 'Jusqu\'à 260°C'],
          ['Connectivité', 'USB, Carte SD'],
          ['Poids', '6,2 kg'],
        ]),
      },
    ],
  },
  {
    slug: 'cbv-resin-r3',
    price: 799.99,
    comparePrice: null,
    stock: 10,
    images: ['/images/printer-3.jpg'],
    category: 'PRINTER',
    featured: false,
    translations: [
      {
        languageCode: 'en',
        name: 'CBV Resin R3 SLA Printer',
        description:
          '4K mono LCD resin printer with 192×120×200mm build volume. Ultra-high detail for jewelry, dental, and miniature printing.',
        specs: new Map([
          ['Build Volume', '192×120×200mm'],
          ['LCD Resolution', '4K Mono'],
          ['XY Resolution', '0.05mm'],
          ['Layer Thickness', '0.01–0.2mm'],
          ['Light Source', '405nm UV'],
          ['Weight', '7.5 kg'],
        ]),
      },
      {
        languageCode: 'fr',
        name: 'Imprimante SLA CBV Resin R3',
        description:
          'Imprimante résine LCD mono 4K avec volume d\'impression 192×120×200mm. Détail ultra-élevé pour la bijouterie, le dentaire et les miniatures.',
        specs: new Map([
          ['Volume d\'impression', '192×120×200mm'],
          ['Résolution LCD', '4K Mono'],
          ['Résolution XY', '0,05mm'],
          ['Épaisseur de couche', '0,01–0,2mm'],
          ['Source lumineuse', 'UV 405nm'],
          ['Poids', '7,5 kg'],
        ]),
      },
    ],
  },
  {
    slug: 'cbv-recycler-eco1',
    price: 2499.99,
    comparePrice: null,
    stock: 5,
    images: ['/images/recycler-1.jpg'],
    category: 'RECYCLING_EQUIPMENT',
    featured: true,
    translations: [
      {
        languageCode: 'en',
        name: 'CBV Eco-Recycler 1',
        description:
          'Industrial-grade plastic filament recycler. Converts PLA, PETG, and ABS waste into new 1.75mm filament spools.',
        specs: new Map([
          ['Compatible Materials', 'PLA, PETG, ABS'],
          ['Output Diameter', '1.75mm ± 0.05mm'],
          ['Processing Speed', '0.5 kg/hour'],
          ['Temperature Range', '150–260°C'],
          ['Power', '800W'],
          ['Weight', '18 kg'],
        ]),
      },
      {
        languageCode: 'fr',
        name: 'CBV Éco-Recycleur 1',
        description:
          'Recycleur de filament plastique de qualité industrielle. Convertit les déchets PLA, PETG et ABS en nouvelles bobines de filament 1,75mm.',
        specs: new Map([
          ['Matériaux compatibles', 'PLA, PETG, ABS'],
          ['Diamètre de sortie', '1,75mm ± 0,05mm'],
          ['Vitesse de traitement', '0,5 kg/heure'],
          ['Plage de température', '150–260°C'],
          ['Puissance', '800W'],
          ['Poids', '18 kg'],
        ]),
      },
    ],
  },
  {
    slug: 'pla-filament-white-1kg',
    price: 24.99,
    comparePrice: 34.99,
    stock: 100,
    images: ['/images/filament-white.jpg'],
    category: 'PRINTER',
    featured: false,
    translations: [
      {
        languageCode: 'en',
        name: 'PLA Filament White 1kg',
        description:
          'High-quality white PLA filament. Consistent diameter, minimal stringing, and easy printing. Compatible with all FDM printers.',
        specs: new Map([
          ['Material', 'PLA'],
          ['Diameter', '1.75mm ± 0.02mm'],
          ['Weight', '1kg spool'],
          ['Print Temperature', '190–220°C'],
          ['Bed Temperature', '20–60°C (no heated bed required)'],
          ['Color', 'White'],
        ]),
      },
      {
        languageCode: 'fr',
        name: 'Filament PLA Blanc 1kg',
        description:
          'Filament PLA blanc de haute qualité. Diamètre constant, bavures minimales et impression facile. Compatible avec toutes les imprimantes FDM.',
        specs: new Map([
          ['Matériau', 'PLA'],
          ['Diamètre', '1,75mm ± 0,02mm'],
          ['Poids', 'Bobine de 1kg'],
          ['Température d\'impression', '190–220°C'],
          ['Température du plateau', '20–60°C (plateau chauffant non requis)'],
          ['Couleur', 'Blanc'],
        ]),
      },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('🌿 Connected to MongoDB');

    const Product =
      mongoose.models.Product || mongoose.model('Product', ProductSchema);

    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ Database already seeded (${existingCount} products found) — skipping`);
      await mongoose.disconnect();
      return;
    }

    console.log('🌱 Seeding products...');
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products successfully`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Seed error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
