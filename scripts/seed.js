#!/usr/bin/env node
'use strict';

/**
 * MongoDB Seed Script — CBV 3D Printing Tunisia
 * Seeds ready-made 3D printed products across the 7 categories in Tunisian Dinars (TND / DT)
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.log('⚠️  MONGODB_URI not set — skipping seed');
  process.exit(0);
}

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
    stock: { type: Number, default: 15 },
    images: [String],
    category: String,
    featured: { type: Boolean, default: false },
    translations: [TranslationSchema],
  },
  { timestamps: true }
);

const products = [
  // 1. Porte-clés personnalisés (5 - 16 DT)
  {
    slug: 'porte-cle-prenom-personnalise',
    price: 8.0,
    comparePrice: 12.0,
    stock: 50,
    images: ['/images/products/keychain-name.jpg'],
    category: 'KEYCHAINS',
    featured: true,
    translations: [
      {
        languageCode: 'fr',
        name: 'Porte-Clé Prénom Personnalisé 3D',
        description:
          'Porte-clé avec votre prénom ou initiales en relief 3D. Fabriqué en PLA haute résistance avec anneau métallique inclus. Plusieurs couleurs disponibles.',
        specs: new Map([
          ['Personnalisation', 'Nom / Prénom au choix'],
          ['Matière', 'PLA Biodégradable'],
          ['Longueur', 'Environ 6 à 8 cm'],
          ['Couleurs', 'Noir, Blanc, Or, Rouge, Bleu, Vert'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Custom 3D Name Keychain',
        description:
          'Personalized 3D printed keychain with your custom name or initials. Durable PLA with metallic ring included.',
        specs: new Map([
          ['Customization', 'Name or Initials'],
          ['Material', 'Bio-based PLA'],
          ['Length', '6–8 cm'],
        ]),
      },
    ],
  },
  {
    slug: 'porte-cle-logo-voiture',
    price: 12.0,
    comparePrice: 15.0,
    stock: 40,
    images: ['/images/products/keychain-car.jpg'],
    category: 'KEYCHAINS',
    featured: true,
    translations: [
      {
        languageCode: 'fr',
        name: 'Porte-Clé Logo Voiture (BMW, Mercedes, VW, Golf...)',
        description:
          'Porte-clé stylisé aux logos des marques automobiles avec possibilité d\'ajouter votre matricule ou vos initiales au dos.',
        specs: new Map([
          ['Modèles', 'BMW, Mercedes, Audi, VW, Peugeot, Renault'],
          ['Finition', 'Bi-couleur haute précision'],
          ['Épaisseur', '4 mm'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Car Brand Logo 3D Keychain',
        description:
          'Stylized automotive brand logo keychain with custom license plate or initials on back.',
        specs: new Map([
          ['Brands', 'BMW, Mercedes, Audi, VW, etc.'],
          ['Finish', 'Dual-color precision'],
        ]),
      },
    ],
  },
  {
    slug: 'porte-cle-flexible-dragon',
    price: 15.0,
    comparePrice: 18.0,
    stock: 30,
    images: ['/images/products/keychain-flex.jpg'],
    category: 'KEYCHAINS',
    featured: false,
    translations: [
      {
        languageCode: 'fr',
        name: 'Porte-Clé Flexible Articulé (Print-in-Place)',
        description:
          'Porte-clé articulé ultra-satisfaisant imprimé d\'un seul bloc sans assemblage. Flexible et très robuste.',
        specs: new Map([
          ['Type', 'Articulé print-in-place'],
          ['Matière', 'PLA Premium'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Articulated Flexible Keychain',
        description: 'Satisfying print-in-place flexible articulated mini dragon / creature keychain.',
        specs: new Map([['Type', 'Print-in-place articulated']]),
      },
    ],
  },

  // 2. Supports téléphone (15 - 28 DT)
  {
    slug: 'support-telephone-bureau-ajustable',
    price: 18.0,
    comparePrice: 24.0,
    stock: 25,
    images: ['/images/products/phone-stand.jpg'],
    category: 'PHONE_STANDS',
    featured: true,
    translations: [
      {
        languageCode: 'fr',
        name: 'Support Téléphone Bureau Ergonomique',
        description:
          'Support de téléphone pour bureau avec passage pour câble de chargeur. Compatible avec tous les smartphones (iPhone, Samsung, Xiaomi...). Personnalisable avec votre prénom gravé.',
        specs: new Map([
          ['Angle', '60° ergonomique'],
          ['Passage Câble', 'Oui, prévu pour charge simultanée'],
          ['Compatibilité', 'Tout smartphone de 4 à 7 pouces'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Ergonomic Desk Phone Stand',
        description:
          'Desk phone holder with dedicated charging cable slot. Universal fit for all smartphone sizes.',
        specs: new Map([
          ['Ergonomics', '60° viewing angle'],
          ['Cable Slot', 'Included'],
        ]),
      },
    ],
  },
  {
    slug: 'support-telephone-anime-gaming',
    price: 25.0,
    comparePrice: 30.0,
    stock: 20,
    images: ['/images/products/phone-anime.jpg'],
    category: 'PHONE_STANDS',
    featured: false,
    translations: [
      {
        languageCode: 'fr',
        name: 'Support Téléphone Thème Anime / Gaming',
        description:
          'Design exclusif inspiré de vos univers manga et gaming préférés (One Piece, Dragon Ball, Valorant).',
        specs: new Map([
          ['Style', 'Anime & Pop Culture'],
          ['Finition', 'Peint main ou bi-couleur'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Anime / Gaming Edition Phone Stand',
        description: 'Custom stylized phone holder with anime and gaming inspired themes.',
        specs: new Map([['Style', 'Pop culture edition']]),
      },
    ],
  },

  // 3. Accessoires gaming (22 - 45 DT)
  {
    slug: 'support-casque-gamer-rgb',
    price: 35.0,
    comparePrice: 45.0,
    stock: 18,
    images: ['/images/products/headphone-stand.jpg'],
    category: 'GAMING_ACCESSORIES',
    featured: true,
    translations: [
      {
        languageCode: 'fr',
        name: 'Support Casque Audio Gamer Premium',
        description:
          'Support vertical solide pour casque gaming avec base antidérapante et gestion de câble intégrée. Logo ou gamertag personnalisable sur la base.',
        specs: new Map([
          ['Hauteur', '26 cm'],
          ['Base', 'Lestée et stable'],
          ['Option', 'Gravure gamertag'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Pro Gaming Headset Stand',
        description: 'Sturdy vertical stand for gaming headphones with cable management base.',
        specs: new Map([
          ['Height', '26 cm'],
          ['Base', 'Weighted with cable clip'],
        ]),
      },
    ],
  },
  {
    slug: 'support-manette-ps5-xbox',
    price: 22.0,
    comparePrice: 28.0,
    stock: 25,
    images: ['/images/products/controller-stand.jpg'],
    category: 'GAMING_ACCESSORIES',
    featured: false,
    translations: [
      {
        languageCode: 'fr',
        name: 'Support Manette PS5 / Xbox / Switch',
        description:
          'Support profilé pour ranger élégamment vos manettes sur votre bureau ou étagère setup.',
        specs: new Map([
          ['Compatibilité', 'DualSense PS5, Xbox Series, Switch Pro'],
          ['Design', 'Minimaliste et stable'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Universal Controller Stand',
        description: 'Sleek custom holder for PS5 DualSense, Xbox, and Nintendo Switch controllers.',
        specs: new Map([['Compatibility', 'Universal controller dock']]),
      },
    ],
  },

  // 4. Décoration (20 - 55 DT)
  {
    slug: 'prenom-3d-lumineux-decoration',
    price: 32.0,
    comparePrice: 42.0,
    stock: 15,
    images: ['/images/products/name-3d.jpg'],
    category: 'DECORATION',
    featured: true,
    translations: [
      {
        languageCode: 'fr',
        name: 'Prénom & Calligraphie 3D Décorative sur Socle',
        description:
          'Votre prénom ou mot inspirant calligraphié en 3D sur socle bois ou plastique. Idéal pour chambre d\'enfant, bureau ou salon.',
        specs: new Map([
          ['Langues', 'Arabe calligraphique ou Français/Anglais'],
          ['Taille', '20 à 30 cm de long'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Custom 3D Calligraphy & Name Decor',
        description: 'Elegant freestanding 3D name decor in Arabic or Latin typography on base.',
        specs: new Map([['Size', '20–30 cm length']]),
      },
    ],
  },
  {
    slug: 'vase-geometrique-moderne',
    price: 28.0,
    comparePrice: 35.0,
    stock: 20,
    images: ['/images/products/vase-geo.jpg'],
    category: 'DECORATION',
    featured: false,
    translations: [
      {
        languageCode: 'fr',
        name: 'Vase Géométrique Design Minimaliste',
        description:
          'Vase imprimé en mode spirale avec motifs géométriques modernes. Parfait pour fleurs séchées ou décoration de table.',
        specs: new Map([
          ['Hauteur', '22 cm'],
          ['Style', 'Origami / Facettes géométriques'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Modern Geometric Faceted Vase',
        description: 'Striking spiral-vase 3D printed with modern minimalist polygon facets.',
        specs: new Map([['Height', '22 cm']]),
      },
    ],
  },

  // 5. Cadeaux personnalisés (25 - 60 DT)
  {
    slug: 'lithophanie-photo-lumineuse-couple',
    price: 38.0,
    comparePrice: 48.0,
    stock: 12,
    images: ['/images/products/lithophane.jpg'],
    category: 'GIFTS',
    featured: true,
    translations: [
      {
        languageCode: 'fr',
        name: 'Lampe Photo 3D (Lithophanie Magique)',
        description:
          'Transformez votre photo souvenir (couple, bébé, diplôme) en lithophanie 3D magique qui révèle les détails une fois rétroéclairée.',
        specs: new Map([
          ['Source', 'Votre photo personnelle haute définition'],
          ['Éclairage', 'Socle LED fourni inclus'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Custom 3D Photo Lithophane Lamp',
        description: 'Magic 3D lithophane lamp converting your favorite portrait into a glowing light.',
        specs: new Map([['Lighting', 'LED base included']]),
      },
    ],
  },

  // 6. Tirelires (18 - 35 DT)
  {
    slug: 'tirelire-personnalisee-voiture-gaming',
    price: 24.0,
    comparePrice: 30.0,
    stock: 15,
    images: ['/images/products/piggy-bank.jpg'],
    category: 'PIGGY_BANKS',
    featured: false,
    translations: [
      {
        languageCode: 'fr',
        name: 'Tirelire Forme Voiture avec Prénom',
        description:
          'Tirelire ludique personnalisée avec le prénom de votre enfant ou votre motif préféré. Trappe de vidage sécurisée au dessous.',
        specs: new Map([
          ['Sécurité', 'Bouchon vissé au dessous'],
          ['Personnalisation', 'Nom gravé en relief'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Custom 3D Piggy Bank with Name',
        description: 'Fun 3D printed piggy bank shaped like sports car or animal with embossed name.',
        specs: new Map([['Opening', 'Secure screw cap bottom']]),
      },
    ],
  },

  // 7. Objets utilitaires (6 - 20 DT)
  {
    slug: 'organisateur-cables-bureau-magnetic',
    price: 10.0,
    comparePrice: 14.0,
    stock: 35,
    images: ['/images/products/cable-holder.jpg'],
    category: 'UTILITY',
    featured: false,
    translations: [
      {
        languageCode: 'fr',
        name: 'Organisateur de Câbles et Chargeurs de Bureau',
        description:
          'Lot de clips passe-câbles pour bureau avec adhésif puissant. Évite l\'emmêlement de vos câbles USB et chargeurs.',
        specs: new Map([
          ['Capacité', '5 câbles simultanés'],
          ['Fixation', 'Adhésif 3M double face inclus'],
        ]),
      },
      {
        languageCode: 'en',
        name: 'Desk Cable Organizer Clips',
        description: 'Smart adhesive cable management dock for 5 USB charging lines.',
        specs: new Map([['Capacity', '5 cables dock']]),
      },
    ],
  },
];

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('🌿 Connected to MongoDB');

    const Product =
      mongoose.models.Product || mongoose.model('Product', ProductSchema);

    // Refresh collection to load new Tunisian products
    console.log('🔄 Updating products collection with Tunisian 3D products...');
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} Tunisian 3D printed products successfully`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Seed error:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
