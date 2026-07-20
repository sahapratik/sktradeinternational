// Seeds the database with the same real content used in the static homepage
// build (index.html) — same products, solutions, industries, and gallery
// captions, so the two deliverables describe one consistent site.
//
// Works identically against a local file (default) or a real Turso database
// (if TURSO_DATABASE_URL / TURSO_AUTH_TOKEN are set) — same code, same SQL,
// just a different connection. Run this once against your production Turso
// database too, after creating it, to populate it before first deploy.
import { client, ensureSchema, newId, createQuoteRequest, createAdminUser } from '../src/db';
import { hashPassword } from '../src/lib/password';

async function clearAll() {
  for (const table of [
    'rate_limit_hit', 'message', 'conversation', 'quote_request_item', 'quote_request',
    'product', 'product_category', 'solution', 'industry',
    'gallery_image', 'partner', 'audit_log', 'admin_user',
  ]) {
    await client.execute(`DELETE FROM ${table}`);
  }
}

async function main() {
  console.log('Seeding…');
  await ensureSchema();
  await clearAll();

  const categories = [
    { slug: 'tableware-raw-materials', title: 'Tableware Raw Materials', tag: 'Materials', icon: 'layers', summary: 'China clay, feldspar, quartz and specialty minerals engineered for porcelain and fine tableware bodies.' },
    { slug: 'tile-raw-materials', title: 'Tile Raw Materials', tag: 'Materials', icon: 'tiles', summary: 'Body and glaze-grade minerals, frits and colourants formulated for ceramic and porcelain tile production.' },
    { slug: 'sanitary-ware-raw-materials', title: 'Sanitary Ware Raw Materials', tag: 'Materials', icon: 'droplet', summary: 'Casting and glaze materials suited to the demands of sanitaryware slip and glazing lines.' },
    { slug: 'ceramic-machinery', title: 'Ceramic Machinery', tag: 'Machinery', icon: 'factory', summary: 'Production, glazing and finishing machinery sourced from established international manufacturers.' },
    { slug: 'kiln-furniture', title: 'Kiln Furniture', tag: 'Machinery', icon: 'flame', summary: 'Refractory setters, batts, posts and cranks engineered for consistent firing performance.' },
  ];
  const categoryIds: Record<string, string> = {};
  for (const [i, c] of categories.entries()) {
    const id = newId();
    categoryIds[c.title] = id;
    await client.execute({
      sql: `INSERT INTO product_category (id, slug, title, tag, icon, summary, sort_order) VALUES (?,?,?,?,?,?,?)`,
      args: [id, c.slug, c.title, c.tag, c.icon, c.summary, i],
    });
  }

  function categoryId(title: string): string {
    const id = categoryIds[title];
    if (!id) throw new Error(`Seed data error: no category found named "${title}" — check for a typo.`);
    return id;
  }

  const products = [
    { slug: 'china-clay-kaolin', title: 'China Clay / Kaolin', category: 'Tableware Raw Materials', summary: 'A primary plastic clay used across tableware, tile and sanitaryware bodies for strength, whiteness and workability.', application: 'Body formulation', icon: 'layers' },
    { slug: 'ceramic-colours', title: 'Ceramic Colours', category: 'Tile Raw Materials', summary: 'Stains and pigments engineered for consistent, reproducible colour in glazes and decoration.', application: 'Glazing & decoration', icon: 'package' },
    { slug: 'zirconium-silicate', title: 'Zirconium Silicate', category: 'Tile Raw Materials', summary: 'A high-performance opacifier used to achieve bright, uniform white glazes.', application: 'Glaze opacification', icon: 'gem' },
    { slug: 'precious-materials', title: 'Precious Materials', category: 'Sanitary Ware Raw Materials', summary: 'Specialty and high-value minerals sourced for demanding formulations on request.', application: 'Specialty formulation', icon: 'gem' },
    { slug: 'kiln-furniture-sets', title: 'Kiln Furniture Sets', category: 'Kiln Furniture', summary: 'Setters, batts and supports engineered for dimensional stability under repeated firing cycles.', application: 'Firing support', icon: 'flame' },
    { slug: 'automatic-glazing-line', title: 'Automatic Glazing Line', category: 'Ceramic Machinery', summary: 'Automated glazing systems for consistent coverage and finish across tile and sanitaryware production.', application: 'Glazing production', icon: 'factory' },
    { slug: 'conveyor-line', title: 'Conveyor Line', category: 'Ceramic Machinery', summary: 'Material-handling conveyor systems built for continuous ceramic production environments.', application: 'Production handling', icon: 'factory' },
    { slug: 'bolting-cloth', title: 'Bolting Cloth', category: 'Tile Raw Materials', summary: 'Precision mesh screens used for slip and glaze screening in ceramic slurry processing.', application: 'Slurry processing', icon: 'tiles' },
  ];
  for (const [i, p] of products.entries()) {
    await client.execute({
      sql: `INSERT INTO product (id, slug, title, category_id, summary, application, icon, sort_order) VALUES (?,?,?,?,?,?,?,?)`,
      args: [newId(), p.slug, p.title, categoryId(p.category), p.summary, p.application, p.icon, i],
    });
  }

  const solutions = [
    { title: 'Machinery Installation Assistance', desc: 'On-site coordination support during equipment installation and commissioning.', icon: 'wrench' },
    { title: 'Logistics Support', desc: 'Import coordination and delivery planning across the sourcing and shipping process.', icon: 'truck' },
    { title: 'Production Accuracy Guidance', desc: 'Technical input to help maintain consistency across production runs.', icon: 'sliders' },
    { title: 'Documentation Support', desc: 'Assistance with the paperwork that accompanies international procurement.', icon: 'file-text' },
    { title: 'Quality Assurance', desc: 'Attention to material and machinery quality throughout the sourcing process.', icon: 'shield-check' },
    { title: 'Technical Consultation', desc: 'Guidance from a team with dedicated ceramic-industry sourcing experience.', icon: 'life-buoy' },
    { title: 'International Sourcing', desc: 'A sourcing network spanning established global material and machinery principals.', icon: 'globe' },
    { title: 'After-Sales Coordination', desc: 'Continued support and coordination once materials or machinery are delivered.', icon: 'message' },
  ];
  for (const [i, s] of solutions.entries()) {
    await client.execute({
      sql: `INSERT INTO solution (id, title, description, icon, sort_order) VALUES (?,?,?,?,?)`,
      args: [newId(), s.title, s.desc, s.icon, i],
    });
  }

  const industries = [
    { slug: 'ceramic-tableware', title: 'Ceramic Tableware', icon: 'layers', points: ['Body & glaze raw materials', 'Decoration & colour systems', 'Firing & kiln furniture', 'Consistency-focused QC support'] },
    { slug: 'tiles', title: 'Tiles', icon: 'tiles', points: ['Body & glaze minerals, frits', 'Glazing line machinery', 'Production-line technical support', 'Dimensional & finish QC needs'] },
    { slug: 'sanitary-ware', title: 'Sanitary Ware', icon: 'droplet', points: ['Casting slip materials', 'Glaze systems for sanitaryware', 'Line & finishing machinery', 'Production quality coordination'] },
  ];
  for (const [i, ind] of industries.entries()) {
    await client.execute({
      sql: `INSERT INTO industry (id, slug, title, icon, points_json, sort_order) VALUES (?,?,?,?,?,?)`,
      args: [newId(), ind.slug, ind.title, ind.icon, JSON.stringify(ind.points), i],
    });
  }

  const galleryFiles: Array<{ filename: string; category: string; featured?: 1 | 0 }> = [
    { filename: 'hero-697ae64c.jpg', category: 'Facility', featured: 1 },
    { filename: 'gallery-06a389ce.jpg', category: 'Factory Visits' },
    { filename: 'gallery-img_7204.jpg', category: 'Raw Materials' },
    { filename: 'gallery-c9b091bf.jpg', category: 'Products' },
    { filename: 'gallery-img_7274.jpg', category: 'Machinery' },
    { filename: 'gallery-52358c75.jpg', category: 'Office & Team' },
    { filename: 'gallery-13e42bc5.jpg', category: 'Kiln Furniture' },
    { filename: 'gallery-76f9780e.jpg', category: 'Exhibitions' },
    { filename: 'gallery-3a1635f1.jpg', category: 'Machinery' },
    { filename: 'gallery-953f197c.jpg', category: 'Raw Materials' },
    { filename: 'gallery-b84a69a5.jpg', category: 'Installation Projects' },
    { filename: 'gallery-img_8558.jpg', category: 'Products' },
  ];
  for (const [i, g] of galleryFiles.entries()) {
    await client.execute({
      sql: `INSERT INTO gallery_image (id, category, filename, featured, sort_order) VALUES (?,?,?,?,?)`,
      args: [newId(), g.category, g.filename, g.featured ?? 0, i],
    });
  }

  // Demo admin account so the dashboard is actually usable right after seeding.
  // CHANGE THIS PASSWORD before deploying anywhere real — see README.
  const passwordHash = await hashPassword('ChangeMe!2026');
  await createAdminUser('admin@sktradeinternational.net', passwordHash, 'SUPER_ADMIN');

  // One example quote so /admin/quotes isn't empty on first look.
  await createQuoteRequest({
    contactName: 'Demo Buyer',
    contactEmail: 'buyer@example.com',
    contactPhone: '+880 1XXXXXXXXX',
    company: 'Example Ceramics Ltd.',
    sector: 'Tiles',
    message: 'Example seeded quote request — safe to delete from /admin/quotes.',
    items: [{ productName: 'Zirconium Silicate', quantity: '2 MT' }],
  });

  console.log(
    'Seed complete: %d categories, %d products, %d solutions, %d industries, %d gallery images, 1 admin user.',
    categories.length, products.length, solutions.length, industries.length, galleryFiles.length
  );
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .then(() => process.exit(0));
