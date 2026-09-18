const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.waitlistSubscriber.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Users...');
  const adminPassword = await bcrypt.hash('AdminPassword123!', 10);
  const userPassword = await bcrypt.hash('UserPassword123!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Oussema Architect',
      email: 'admin@additive3d.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Alex Maker',
      email: 'alex@makerlab.io',
      passwordHash: userPassword,
      role: 'USER',
    },
  });

  console.log('Seeding Categories...');
  const catFdm = await prisma.category.create({
    data: {
      slug: 'fdm-printers',
      nameEn: 'FDM / FFF 3D Printers',
      nameFr: 'Imprimantes 3D FDM / Dépôt de Fil',
      descriptionEn: 'High-speed extrusion 3D printers for engineering thermoplastics and prototypes.',
      descriptionFr: 'Imprimantes 3D à dépôt de fil fondu haute vitesse pour thermoplastiques techniques.',
    },
  });

  const catSla = await prisma.category.create({
    data: {
      slug: 'resin-sla-printers',
      nameEn: 'SLA / MSLA Resin 3D Printers',
      nameFr: 'Imprimantes 3D Résine SLA / MSLA',
      descriptionEn: 'Micron-level precision photopolymer printers for miniatures, dental, and jewelry.',
      descriptionFr: 'Imprimantes photopolymères à résolution micrométrique pour miniatures, dentaire et joaillerie.',
    },
  });

  const catFilament = await prisma.category.create({
    data: {
      slug: 'materials-filaments',
      nameEn: 'Technical Filaments & Resins',
      nameFr: 'Filaments & Résines Techniques',
      descriptionEn: 'Industrial carbon-fiber reinforced filaments, engineering PLA, and tough resins.',
      descriptionFr: 'Filaments renforcés fibre de carbone, PLA technique et résines haute ténacité.',
    },
  });

  console.log('Seeding Products...');
  const products = [
    {
      slug: 'bambu-lab-x1-carbon-combo',
      titleEn: 'Bambu Lab X1-Carbon Combo (with AMS)',
      titleFr: 'Bambu Lab X1-Carbon Combo (avec AMS)',
      descriptionEn: 'The flagship AI-powered multi-color 3D printer featuring carbon-rod coreXY architecture, 500 mm/s acceleration, hardened steel nozzle for abrasive polymers, and integrated lidar first-layer inspection.',
      descriptionFr: 'L\'imprimante 3D multi-couleurs haut de gamme avec intelligence artificielle, structure CoreXY ultra-rigide, 500 mm/s, buse en acier trempé pour filaments abrasifs et capteur Lidar.',
      price: 1449.00,
      comparePrice: 1599.00,
      brand: 'Bambu Lab',
      technology: 'FDM',
      buildVolume: '256 x 256 x 256 mm',
      speed: 'Up to 500 mm/s (20000 mm/s² accel)',
      stock: 15,
      featured: true,
      categoryId: catFdm.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631556097152-c39479cbfe5e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      ]),
      specs: JSON.stringify({
        'Max Hotend Temp': '300 °C',
        'Max Bed Temp': '110 °C',
        'Nozzle': '0.4mm Hardened Steel',
        'Supported Filaments': 'PLA, PETG, TPU, ABS, ASA, PVA, PET, Carbon/Glass Fiber Reinforced PA, PC',
        'Sensors': 'AI LiDAR, 1080p Chamber Camera, Door Sensor, Filament Runout',
        'Connectivity': 'Wi-Fi, Bambu Bus',
      }),
    },
    {
      slug: 'prusa-mk4s-assembled',
      titleEn: 'Original Prusa MK4S Factory Assembled',
      titleFr: 'Original Prusa MK4S Assemblée d\'Usine',
      descriptionEn: 'Rock-solid reliability built on the Nextruder platform with load-cell automated first layer calibration, 32-bit architecture, native input shaping, and open-source upgradeability.',
      descriptionFr: 'Fiabilité légendaire conçue sur l\'extrudeur Nextruder avec première couche automatique par jauge de contrainte, électronique 32 bits et Input Shaping natif.',
      price: 1099.00,
      comparePrice: 1199.00,
      brand: 'Prusa Research',
      technology: 'FDM',
      buildVolume: '250 x 210 x 220 mm',
      speed: 'Up to 300 mm/s',
      stock: 8,
      featured: true,
      categoryId: catFdm.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
      ]),
      specs: JSON.stringify({
        'Max Hotend Temp': '290 °C',
        'Max Bed Temp': '120 °C',
        'Bed Type': 'Magnetic Spring Steel PEI Sheet',
        'Calibration': 'Automatic Loadcell Bed Leveling (Zero Z-offset Tuning)',
        'Ecosystem': 'Prusa Connect, PrusaLink, Ethernet, Wi-Fi',
      }),
    },
    {
      slug: 'formlabs-form-4-basic-package',
      titleEn: 'Formlabs Form 4 Industrial SLA Printer',
      titleFr: 'Formlabs Form 4 Imprimante SLA Industrielle',
      descriptionEn: 'Next-generation Low Force Display (LFD) SLA technology delivering blazingly fast print speeds with unbeatable surface finish and dimensional tolerances for medical, aerospace, and rapid tooling.',
      descriptionFr: 'Technologie SLA Low Force Display (LFD) de nouvelle génération offrant des vitesses d\'impression ultra-rapides et des tolérances géométriques exceptionnelles.',
      price: 4350.00,
      comparePrice: 4790.00,
      brand: 'Formlabs',
      technology: 'SLA',
      buildVolume: '200 x 125 x 210 mm',
      speed: '100 mm/hour vertical speed',
      stock: 4,
      featured: true,
      categoryId: catSla.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1000&q=80',
      ]),
      specs: JSON.stringify({
        'Laser / Light Engine': 'High-Power Light Processing Unit 4 (405nm)',
        'XY Resolution': '50 microns',
        'Resin Dispensing': 'Automated Smart Cartridge Dispense',
        'Materials': 'Tough, Rigid, Medical, Castable, ESD Resins',
      }),
    },
    {
      slug: 'creality-k1c-high-speed',
      titleEn: 'Creality K1C High-Speed Carbon Fiber 3D Printer',
      titleFr: 'Creality K1C Imprimante Haute Vitesse Fibre de Carbone',
      descriptionEn: 'Enclosed CoreXY 3D printer running at 600 mm/s with all-metal hotend, unicorn quick-swap tri-metal nozzle, AI camera monitoring, and active carbon air purification filter.',
      descriptionFr: 'Imprimante CoreXY fermée fonctionnant à 600 mm/s, buse bimétal anti-bouchage, caméra IA embarquée et filtre à charbon actif pour émissions de COV.',
      price: 559.00,
      comparePrice: 629.00,
      brand: 'Creality',
      technology: 'FDM',
      buildVolume: '220 x 220 x 250 mm',
      speed: '600 mm/s (20000 mm/s²)',
      stock: 22,
      featured: false,
      categoryId: catFdm.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631556097152-c39479cbfe5e?auto=format&fit=crop&w=1000&q=80',
      ]),
      specs: JSON.stringify({
        'Max Hotend Temp': '300 °C',
        'Filament Compatibility': 'PLA-CF, PA-CF, PETG-CF, ABS, PETG, TPU',
        'Air Filter': 'Integrated Activated Carbon Filter',
        'Chassis': 'Die-cast Aluminum Alloy Unibody',
      }),
    },
    {
      slug: 'elegoo-saturn-4-ultra-12k',
      titleEn: 'Elegoo Saturn 4 Ultra 12K MSLA Printer',
      titleFr: 'Elegoo Saturn 4 Ultra 12K Imprimante MSLA',
      descriptionEn: 'Equipped with a 12K mono LCD, tilt-release technology for ultra-fast layer peel cycles, automatic leveling, AI intelligent camera detection, and power-loss resume.',
      descriptionFr: 'Équipée d\'un écran LCD monochrome 12K, technologie de basculement du bac pour décollement ultra-rapide et détection automatique des résidus par IA.',
      price: 449.00,
      comparePrice: 499.00,
      brand: 'Elegoo',
      technology: 'SLA',
      buildVolume: '218.88 x 122.88 x 220 mm',
      speed: 'Up to 150 mm/h with Tilt Release',
      stock: 18,
      featured: false,
      categoryId: catSla.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      ]),
      specs: JSON.stringify({
        'Screen': '10-inch 12K Mono LCD (11520 x 5120)',
        'XY Precision': '19 x 24 microns',
        'Mechanism': 'Tilt Release Vat Technology',
        'Connectivity': 'Wi-Fi Cluster Management, USB',
      }),
    },
    {
      slug: 'polymaker-polylite-pla-cf-1kg',
      titleEn: 'PolyMaker PolyLite PLA-CF Carbon Fiber 1kg Spool',
      titleFr: 'PolyMaker PolyLite PLA-CF Fibre de Carbone Bobine 1kg',
      descriptionEn: 'Engineering-grade PLA composite reinforced with 8% milled carbon fibers. Delivers a gorgeous matte dark finish that conceals layer lines with increased structural rigidity.',
      descriptionFr: 'Composite PLA de qualité technique renforcé avec 8% de fibres de carbone broyées. Finition mate haut de gamme masquant les lignes de couche.',
      price: 34.90,
      comparePrice: 39.90,
      brand: 'PolyMaker',
      technology: 'FILAMENT',
      buildVolume: 'Spool: 1kg (1.75mm)',
      speed: 'Up to 300 mm/s',
      stock: 45,
      featured: true,
      categoryId: catFilament.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
      ]),
      specs: JSON.stringify({
        'Diameter': '1.75 mm (+/- 0.02 mm)',
        'Extrusion Temp': '210 °C - 230 °C',
        'Bed Temp': '30 °C - 60 °C',
        'Recommended Nozzle': 'Hardened Steel or Ruby Nozzle',
      }),
    },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: prod,
    });
  }

  console.log('Seeding waitlist subscribers for recycling...');
  await prisma.waitlistSubscriber.create({
    data: {
      email: 'eco.maker@polytech.eu',
      interest: 'RECYCLING_PILOT',
      languagePref: 'fr',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
