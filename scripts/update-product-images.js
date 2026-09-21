const mongoose = require('mongoose');

// Carefully curated, high-resolution product photography matching real 3D printed objects:
const imageMap = {
  // 1. Personalized Keychain
  'porte-cle-prenom-personnalise': 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=800&auto=format&fit=crop&q=80',
  // 2. Car Logo Keychain
  'porte-cle-logo-voiture': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
  // 3. Flexible Dragon
  'porte-cle-flexible-dragon': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
  // 4. Ergonomic Desk Phone Stand
  'support-telephone-bureau-ajustable': 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80',
  // 5. Anime / Gaming Phone Stand
  'support-telephone-anime-gaming': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
  // 6. RGB Gaming Headset Stand
  'support-casque-gamer-rgb': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  // 7. PS5/Xbox Controller Stand
  'support-manette-ps5-xbox': 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
  // 8. 3D Illuminated Name Decor
  'prenom-3d-lumineux-decoration': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
  // 9. Geometric Vase
  'vase-geometrique-moderne': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
  // 10. Photo Lithophane Lamp
  'lithophanie-photo-lumineuse-couple': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
  // 11. Custom 3D Piggy Bank
  'tirelire-personnalisee-voiture-gaming': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
  // 12. Desk Cable Organizer
  'organisateur-cables-bureau-magnetic': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80',
  // 13. BMW 3D Keychain
  'custom-3d-bmw-keychain-8096': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80'
};

async function updateDb(uri, name) {
  const conn = await mongoose.createConnection(uri).asPromise();
  for (const [slug, img] of Object.entries(imageMap)) {
    await conn.db.collection('products').updateOne(
      { slug },
      { $set: { images: [img] } }
    );
  }
  console.log('Successfully updated product images in:', name);
  await conn.close();
}

(async () => {
  await updateDb('mongodb+srv://h81546454_db_user:9FNgoEuSnCO9db5m@cluster0.mnhremb.mongodb.net/cbv3d?appName=Cluster0', 'cbv3d');
  await updateDb('mongodb+srv://h81546454_db_user:9FNgoEuSnCO9db5m@cluster0.mnhremb.mongodb.net/test?appName=Cluster0', 'test');
  console.log('All product photos updated successfully with crisp 3D item images!');
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
