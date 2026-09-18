const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CBV-3D PRINTING database seed...');

  // 1. Seed Users (ADMIN & CUSTOMER) if not existing
  const existingAdmin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!existingAdmin) {
    console.log('👤 Seeding Admin and Customer users...');
    const adminPassword = await bcrypt.hash('AdminSecure2026!', 10);
    const customerPassword = await bcrypt.hash('CustomerSecure2026!', 10);

    await prisma.user.create({
      data: {
        name: 'CBV Lead Engineer',
        email: 'admin@cbv3dprinting.com',
        passwordHash: adminPassword,
        role: 'ADMIN',
      },
    });

    await prisma.user.create({
      data: {
        name: 'Marc Lefevre',
        email: 'marc.lefevre@additive-lab.fr',
        passwordHash: customerPassword,
        role: 'CUSTOMER',
      },
    });
    console.log('✅ Users seeded successfully.');
  }

  // 2. Check if products already exist
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`ℹ️ Database already has ${count} products. Skipping duplicate seed.`);
    return;
  }

  console.log('🖨️ Seeding 3D Printers & Equipment with EN/FR Translations...');
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
  ];

  for (const prodData of seedProducts) {
    const { translations, ...productBase } = prodData;
    const createdProduct = await prisma.product.create({
      data: productBase,
    });

    await prisma.productTranslation.create({
      data: {
        productId: createdProduct.id,
        languageCode: 'en',
        name: translations.en.name,
        description: translations.en.description,
        specs: JSON.stringify(translations.en.specs),
      },
    });

    await prisma.productTranslation.create({
      data: {
        productId: createdProduct.id,
        languageCode: 'fr',
        name: translations.fr.name,
        description: translations.fr.description,
        specs: JSON.stringify(translations.fr.specs),
      },
    });
    console.log(`  ✓ Seeded product: ${translations.en.name}`);
  }

  // Seed waitlist
  const waitlistCount = await prisma.recyclingWaitlist.count();
  if (waitlistCount === 0) {
    await prisma.recyclingWaitlist.create({
      data: { email: 'maker.sustainable@circular-additive.eu', preferredLanguage: 'fr' },
    });
  }

  console.log('🎉 Seed finished cleanly!');
}

main()
  .catch((err) => {
    console.error('Seed notice:', err.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
