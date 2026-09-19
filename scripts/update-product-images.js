const mongoose = require('mongoose');

const imageMap = {
  'porte-cle-prenom-personnalise': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  'porte-cle-logo-voiture': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
  'porte-cle-flexible-dragon': 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
  'support-telephone-bureau-ajustable': 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80',
  'support-telephone-anime-gaming': 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
  'support-casque-gamer-rgb': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
  'support-manette-ps5-xbox': 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&auto=format&fit=crop&q=80',
  'prenom-3d-lumineux-decoration': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
  'vase-geometrique-moderne': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
  'lithophanie-photo-lumineuse-couple': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
  'tirelire-personnalisee-voiture-gaming': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80',
  'organisateur-cables-bureau-magnetic': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80'
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
  console.log('All product photos updated successfully!');
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
