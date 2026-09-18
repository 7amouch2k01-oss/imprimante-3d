import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CBV-3D PRINTING database seed...');

  // Clean existing records safely
  console.log('🧹 Cleaning existing tables...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productTranslation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.recyclingWaitlist.deleteMany();
  await prisma.user.deleteMany();

  // 1. Seed Users (ADMIN & CUSTOMER)
  console.log('👤 Seeding Users with CUSTOMER and ADMIN roles...');
  const adminPassword = await bcrypt.hash('AdminSecure2026!', 10);
  const customerPassword = await bcrypt.hash('CustomerSecure2026!', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'CBV Lead Engineer',
      email: 'admin@cbv3dprinting.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Marc Lefevre',
      email: 'marc.lefevre@additive-lab.fr',
      passwordHash: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log(`✅ Users created: Admin (${adminUser.email}), Customer (${customerUser.email})`);

  // 2. Seed 6+ Realistic 3D Printers & Recycling Equipment
  console.log('🖨️  Seeding 6+ Realistic 3D Printers & Equipment with EN/FR Translations...');
  
  const seedProducts = [
    {
      slug: 'cbv-vortex-corexy-pro',
      price: 1399.0,
      comparePrice: 1549.0,
      stock: 18,
      category: 'PRINTER',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631556097152-c39479cbfe5e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      ]),
      translations: {
        en: {
          name: 'CBV Vortex CoreXY Pro 3D Printer',
          description:
            'Ultra-high-speed enclosed CoreXY 3D printer engineered with carbon fiber linear rods, active chamber heating (65°C), high-flow hardened steel nozzle, and vibration compensation up to 600 mm/s.',
          specs: {
            kinematics: 'CoreXY with Linear Carbon Rods',
            buildVolume: '300 x 300 x 300 mm',
            maxPrintSpeed: '600 mm/s (Acceleration: 25,000 mm/s²)',
            maxHotendTemp: '350 °C',
            maxBedTemp: '120 °C',
            chamberHeating: 'Active chamber heating up to 65 °C',
            nozzle: '0.4 mm Hardened Tool Steel (Anti-abrasive)',
            filamentCompatibility: ['PLA', 'PETG', 'ABS', 'ASA', 'PA-CF', 'PC', 'TPU'],
            leveling: 'Full Bed Automatic Mesh via Piezo Sensor Matrix',
            connectivity: 'Wi-Fi 6, Gigabit Ethernet, USB-C, CAN-bus Toolhead',
          },
        },
        fr: {
          name: 'Imprimante 3D CBV Vortex CoreXY Pro',
          description:
            'Imprimante 3D CoreXY haute vitesse entièrement fermée, équipée d\'axes linéaires en fibre de carbone, d\'une chambre régulée à 65°C, d\'une buse en acier trempé à haut débit et de compensation active des résonances à 600 mm/s.',
          specs: {
            cinematique: 'CoreXY avec tiges linéaires en fibre de carbone',
            volumeImpression: '300 x 300 x 300 mm',
            vitesseMax: '600 mm/s (Accélération: 25 000 mm/s²)',
            temperatureBuseMax: '350 °C',
            temperaturePlateauMax: '120 °C',
            chauffageChambre: 'Chambre chauffée active jusqu\'à 65 °C',
            buse: '0,4 mm Acier trempé haute résistance aux abrasifs',
            compatibiliteFilaments: ['PLA', 'PETG', 'ABS', 'ASA', 'PA-CF', 'PC', 'TPU'],
            nivellement: 'Maillage automatique multipoint par capteurs piézoélectriques',
            connectivite: 'Wi-Fi 6, Ethernet Gigabit, USB-C, tête CAN-bus',
          },
        },
      },
    },
    {
      slug: 'cbv-duomax-idex-dual-extruder',
      price: 1850.0,
      comparePrice: 2090.0,
      stock: 12,
      category: 'PRINTER',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      ]),
      translations: {
        en: {
          name: 'CBV DuoMax IDEX Independent Dual-Extruder 3D Printer',
          description:
            'Professional dual-extruder additive manufacturing system with Independent Dual Extruders (IDEX). Effortlessly print complex soluble support structures (PVA/BVOH), multi-material engineering parts, duplicate, or mirror modes.',
          specs: {
            extrusionSystem: 'Independent Dual Extrusion (IDEX)',
            printModes: ['Dual Material', 'Soluble Supports', 'Duplication (2x output)', 'Mirror'],
            buildVolume: '330 x 270 x 300 mm (Single), 160 x 270 x 300 mm (Duplication)',
            maxHotendTemp: '320 °C (Dual Direct-Drive Extruders)',
            nozzleTypes: 'Dual Ruby-tipped 0.4 mm & 0.6 mm',
            supportFilaments: ['PVA', 'BVOH', 'HIPS', 'PLA', 'PETG', 'TPU 95A', 'ABS'],
            monitoring: 'Dual AI optical cameras with thermal drift calibration',
          },
        },
        fr: {
          name: 'Imprimante 3D CBV DuoMax Double Extrudeur Indépendant (IDEX)',
          description:
            'Système de fabrication additive professionnel à double extrusion indépendante (IDEX). Imprimez des géométries complexes avec supports solubles (PVA/BVOH), des pièces multimatériaux, ou doublez votre production en mode miroir et copie.',
          specs: {
            systemeExtrusion: 'Double Extrusion Indépendante (IDEX)',
            modesImpression: ['Bi-matériau', 'Supports solubles', 'Duplication (débit x2)', 'Miroir symétrique'],
            volumeImpression: '330 x 270 x 300 mm (Simple), 160 x 270 x 300 mm (Duplication)',
            temperatureBuseMax: '320 °C (Extrudeurs Direct-Drive indépendants)',
            typesBuses: 'Double buse à pointe rubis 0,4 mm & 0,6 mm',
            filamentsSupportes: ['PVA', 'BVOH', 'HIPS', 'PLA', 'PETG', 'TPU 95A', 'ABS'],
            surveillance: 'Double caméra optique IA avec calibration de dérive thermique',
          },
        },
      },
    },
    {
      slug: 'cbv-ecocraft-sustainable-3d-printer',
      price: 799.0,
      comparePrice: 899.0,
      stock: 25,
      category: 'PRINTER',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1631556097152-c39479cbfe5e?auto=format&fit=crop&w=1000&q=80',
      ]),
      translations: {
        en: {
          name: 'CBV EcoCraft Circular Filament 3D Printer',
          description:
            'Engineered for circularity: constructed with 65% recycled post-consumer aluminum and biodegradable biopolymers. Optimized specifically for 100% recycled rPLA, rPET, and closed-loop bio-composite printing.',
          specs: {
            ecoCertification: 'Class-A Low Power Consumption (Max 180W peak, 75W running)',
            frameComposition: '65% Recycled Cast Aluminum + FSC-certified renewable composites',
            buildVolume: '250 x 250 x 260 mm',
            nozzle: 'Micro-Swiss FlowTech All-Metal 0.4mm with non-stick nickel coating',
            maxHotendTemp: '280 °C',
            optimizedMaterials: ['rPLA (Recycled PLA)', 'rPETG', 'recycled ocean plastic filaments', 'Bio-TPU'],
            firmware: 'Open-Source Klipper running on low-power ARM SoC',
          },
        },
        fr: {
          name: 'Imprimante 3D Circulaire CBV EcoCraft pour Filament Recyclé',
          description:
            'Conçue pour l\'économie circulaire : bâtie avec 65% d\'aluminium recyclé et biopolymères. Spécialement optimisée pour l\'extrusion de filaments 100% recyclés rPLA, rPET et composites biosourcés.',
          specs: {
            certificationEco: 'Basse consommation Énergie Classe A (180W crête, 75W nominal)',
            compositionChassis: '65% Aluminium recyclé fondu + composites biosourcés durables',
            volumeImpression: '250 x 250 x 260 mm',
            buse: 'Micro-Swiss FlowTech tout métal 0,4 mm avec revêtement anti-adhérent',
            temperatureBuseMax: '280 °C',
            materiauxOptimises: ['rPLA (PLA Recyclé)', 'rPETG', 'Plastiques marins recyclés', 'Bio-TPU'],
            firmware: 'Klipper open-source tournant sur SoC ARM éco-énergétique',
          },
        },
      },
    },
    {
      slug: 'cbv-titan-industrial-large-format',
      price: 3890.0,
      comparePrice: 4200.0,
      stock: 6,
      category: 'PRINTER',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
      ]),
      translations: {
        en: {
          name: 'CBV Titan Industrial Large-Format 3D Printer (500mm³)',
          description:
            'Massive scale 500x500x500mm build capacity for full-scale prototyping and industrial tooling. Features quad-Z ballscrews, servo closed-loop motors, water-cooled hotend, and 80°C chamber convection.',
          specs: {
            buildVolume: '500 x 500 x 500 mm (125 Liters)',
            driveSystem: 'Precision Ground Ball Screws on Quad Z-Axis + Closed-loop Servos',
            cooling: 'Liquid Cooled Hotend Block (Zero Heat Creep)',
            maxHotendTemp: '420 °C (Ultem, PEEK, PEKK ready)',
            chamberTemp: 'Active convection chamber up to 80 °C',
            powerSupply: 'Industrial MeanWell 2400W 3-phase compatible',
          },
        },
        fr: {
          name: 'Imprimante 3D Industrielle Grand Format CBV Titan (500mm³)',
          description:
            'Volume d\'impression colossal de 500x500x500mm pour le prototypage fonctionnel à l\'échelle 1:1 et l\'outillage d\'usine. 4 vis à billes sur l\'axe Z, servomoteurs en boucle fermée et tête refroidie par liquide.',
          specs: {
            volumeImpression: '500 x 500 x 500 mm (125 Litres)',
            transmission: 'Vis à billes rectifiées sur 4 axes Z synchronisés + Servomoteurs',
            refroidissement: 'Tête d\'extrusion à refroidissement liquide (zéro bouchage)',
            temperatureBuseMax: '420 °C (Compatible PEEK, PEKK, Ultem 9085)',
            temperatureChambre: 'Convection thermique active régulée à 80 °C',
            alimentation: 'Alimentation industrielle MeanWell 2400W',
          },
        },
      },
    },
    {
      slug: 'cbv-precision-photocure-sla',
      price: 1199.0,
      comparePrice: 1349.0,
      stock: 14,
      category: 'PRINTER',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80',
      ]),
      translations: {
        en: {
          name: 'CBV Precision PhotoCure 14K Resin SLA Printer',
          description:
            'Micron-scale photopolymer 3D printer featuring a 14K monochrome LCD, uniform collimated COB light array, internal resin heater, and automatic vat refilling for dental labs and micro-engineering.',
          specs: {
            screenType: '10.1-inch 14K Ultra-HD Monochrome LCD (13320 x 5120)',
            xyResolution: '16.8 microns',
            buildVolume: '223 x 126 x 260 mm',
            lightSource: 'Collimated Fresnel Light Engine (405nm UV)',
            resinManagement: 'Automatic peristaltic resin pump with heated reservoir (30°C)',
            releaseFilm: 'Long-life PFA film with tilt peel mechanism',
          },
        },
        fr: {
          name: 'Imprimante 3D Résine SLA CBV Precision PhotoCure 14K',
          description:
            'Imprimante 3D résine de précision micrométrique dotée d\'un écran LCD monochrome 14K, matrice UV collimatée à lentille Fresnel, chauffage interne de résine et réapprovisionnement automatisé.',
          specs: {
            typeEcran: 'LCD Monochrome 14K Ultra-HD 10,1 pouces (13320 x 5120)',
            resolutionXY: '16,8 microns',
            volumeImpression: '223 x 126 x 260 mm',
            sourceLumineuse: 'Source lumineuse collimatée Fresnel (UV 405nm)',
            gestionResine: 'Pompe péristaltique automatique avec réservoir chauffé (30°C)',
            filmDeDecompression: 'Film PFA longue durée avec basculement rapide',
          },
        },
      },
    },
    {
      slug: 'cbv-cycler-pellet-to-filament-extruder',
      price: 2490.0,
      comparePrice: 2790.0,
      stock: 9,
      category: 'RECYCLING_EQUIPMENT',
      featured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1631556097152-c39479cbfe5e?auto=format&fit=crop&w=1000&q=80',
      ]),
      translations: {
        en: {
          name: 'CBV Cycler 2.0 Pellet & Shred-to-Filament Desktop Extruder',
          description:
            'Closed-loop desktop recycling extruder that turns failed 3D prints, shredded supports, and raw polymer pellets into commercial-tolerance 1.75mm or 2.85mm filament with dual-axis laser diameter monitoring.',
          specs: {
            equipmentType: 'Desktop Filament Extrusion & Spooling System',
            throughput: '1.2 kg to 2.5 kg per hour',
            screwDesign: 'Nitrided steel 3-stage compression screw with static mixer',
            diameterTolerance: '± 0.02 mm (Real-time dual-axis optical laser caliper)',
            temperatureControl: '4 independent PID heating zones up to 350 °C',
            spooling: 'Integrated motorized traversing winder with tension feedback',
          },
        },
        fr: {
          name: 'Extrudeuse de Recyclage CBV Cycler 2.0 Broyats & Granulés vers Filament',
          description:
            'Extrudeuse de recyclage de laboratoire transformant vos impressions ratées broyées et granulés en filament calibré à 1,75mm ou 2,85mm grâce à un micromètre laser optique double axe en temps réel.',
          specs: {
            typeEquipement: 'Système complet d\'extrusion et bobinage de filament',
            rendement: '1,2 kg à 2,5 kg par heure',
            visExtrusion: 'Vis en acier nitruré à 3 zones de compression et mélangeur statique',
            toleranceDiametre: '± 0,02 mm (Micromètre laser optique double axe en continu)',
            regulationThermique: '4 zones de chauffe PID indépendantes jusqu\'à 350 °C',
            bobinage: 'Enrouleur motorisé synchronisé avec guidage automatique et capteur de tension',
          },
        },
      },
    },
    {
      slug: 'cbv-grindpro-polymer-granulator',
      price: 1450.0,
      comparePrice: 1650.0,
      stock: 11,
      category: 'RECYCLING_EQUIPMENT',
      featured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
      ]),
      translations: {
        en: {
          name: 'CBV GrindPro Precision Plastic Granulator & Shredder',
          description:
            'Heavy-duty quiet desktop shredder designed to grind defective 3D models, failed prints, and purge towers into uniform 3-5mm granules ideal for direct hopper feed into the CBV Cycler extruder.',
          specs: {
            shredderBlades: 'High-torque SKD-11 tool steel reversible rotary blades',
            motor: '750W high-torque induction motor with automatic reverse anti-jamming',
            screenSize: 'Interchangeable 3mm / 5mm classification screens',
            safetySystem: 'Dual mechanical interlock switches & emergency e-stop',
            hopperCapacity: '4.5 Liters batch chamber',
          },
        },
        fr: {
          name: 'Broyeur de Plastique et Granulateur de Précision CBV GrindPro',
          description:
            'Broyeur compact silencieux à fort couple, conçu pour réduire les pièces 3D défectueuses, chutes de supports et tours de purge en granulés réguliers de 3 à 5 mm prêts à être réextrudés.',
          specs: {
            lamesBroyage: 'Couteaux rotatifs réversibles en acier à outils SKD-11 trempé',
            moteur: 'Moteur asynchrone 750W fort couple avec inversion automatique anti-blocage',
            tamisage: 'Grilles de calibration interchangeables 3 mm / 5 mm',
            securite: 'Double contacteur de verrouillage mécanique et arrêt d\'urgence coup-de-poing',
            capaciteTremie: 'Chambre de chargement de 4,5 Litres',
          },
        },
      },
    },
  ];

  for (const prodData of seedProducts) {
    const { translations, ...productBase } = prodData;

    const createdProduct = await prisma.product.create({
      data: productBase,
    });

    // Create English Translation
    await prisma.productTranslation.create({
      data: {
        productId: createdProduct.id,
        languageCode: 'en',
        name: translations.en.name,
        description: translations.en.description,
        specs: JSON.stringify(translations.en.specs),
      },
    });

    // Create French Translation
    await prisma.productTranslation.create({
      data: {
        productId: createdProduct.id,
        languageCode: 'fr',
        name: translations.fr.name,
        description: translations.fr.description,
        specs: JSON.stringify(translations.fr.specs),
      },
    });

    console.log(`  ✓ Seeded product: ${translations.en.name} (${createdProduct.slug})`);
  }

  // 3. Seed Sample Completed Orders & Items
  console.log('📦 Seeding Initial Sample Order & OrderItem transactions...');
  const firstProduct = await prisma.product.findFirst({ where: { slug: 'cbv-vortex-corexy-pro' } });
  const secondProduct = await prisma.product.findFirst({ where: { slug: 'cbv-cycler-pellet-to-filament-extruder' } });

  if (firstProduct && secondProduct) {
    const sampleOrder = await prisma.order.create({
      data: {
        orderNumber: 'CBV-ORD-2026-9812',
        userId: customerUser.id,
        customerName: customerUser.name || 'Marc Lefevre',
        customerEmail: customerUser.email,
        shippingAddress: JSON.stringify({
          street: '18 Rue de l\'Innovation Technologique',
          city: 'Lyon',
          postalCode: '69007',
          country: 'France',
        }),
        totalAmount: firstProduct.price + secondProduct.price,
        currency: 'EUR',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        paymentMethod: 'STRIPE',
        stripeSessionId: 'cs_test_sample_live_seed_session_001',
        items: {
          create: [
            {
              productId: firstProduct.id,
              quantity: 1,
              unitPrice: firstProduct.price,
            },
            {
              productId: secondProduct.id,
              quantity: 1,
              unitPrice: secondProduct.price,
            },
          ],
        },
      },
    });
    console.log(`✅ Seeded sample order ${sampleOrder.orderNumber} with 2 items`);
  }

  // 4. Seed Recycling Waitlist Entries
  console.log('♻️  Seeding Recycling Waitlist entries...');
  const waitlistEntries = [
    { email: 'greentech.fablab@sorbonne.fr', preferredLanguage: 'fr' },
    { email: 'maker.sustainable@brussels-circular.be', preferredLanguage: 'fr' },
    { email: 'circular.materials@cambridge-maker.org', preferredLanguage: 'en' },
  ];

  for (const entry of waitlistEntries) {
    await prisma.recyclingWaitlist.create({
      data: entry,
    });
  }
  console.log(`✅ Seeded ${waitlistEntries.length} waitlist subscribers`);

  console.log('🎉 CBV-3D PRINTING seed completed successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Error executing seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });