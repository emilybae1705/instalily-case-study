const {
  scrapeBrands,
  scrapePopularModels,
  scrapePopularParts,
  scrapeParts,
  addPartDetail
} = require('../scraping/scraper');

const {
  insertBrand,
  insertBrandAppliance,
  insertModel,
  insertPart
} = require('./insert');

const pool = require('./database');
const { seedAppliances, applianceURLs } = require('./appliances');

const {
  scrapeBrands,
  scrapePopularModels,
  scrapePopularParts,
  scrapeParts,
  addPartDetail
} = require('../scraping/scraper');

const {
  insertBrand,
  insertBrandAppliance,
  insertModel,
  insertPart
} = require('./insert');

const pool = require('./database');
const { seedAppliances, applianceURLs } = require('./appliances');

(async () => {
  try {
    console.log('Seeding appliances...');
    const applianceIds = await seedAppliances();

    for (const [applianceName, { url }] of Object.entries(applianceURLs)) {
      const applianceId = applianceIds[applianceName];
      console.log(`Starting seed for ${applianceName} (${url})`);

      // 1. Brands
      const brands = await scrapeBrands(url);
      console.log(`Found ${brands.length} brands`);
      for (const brand of brands) {
        const brandRec = await insertBrand(brand.brandName);
        await insertBrandAppliance(brandRec.brand_id, applianceId, brand.brandUrl);
      }

      // 2. Popular Models
      const models = await scrapePopularModels(url);
      console.log(`Found ${models.length} models`);
      for (const model of models) {
        await insertModel({
          model_number: model.modelNum,
          page_url: model.modelUrl,
          appliance_id: applianceId
        });
      }

      // 3. Parts by Category
      const parts = await scrapeParts(url);
      console.log(`Found ${parts.length} part categories`);
      for (const part of parts) {
        const detailed = await addPartDetail(part);
        await insertPart(detailed, applianceId);
      }

      // 4. Popular Parts
      const popularParts = await scrapePopularParts(url);
      console.log(`Found ${popularParts.length} popular parts`);
      for (const part of popularParts) {
        const enriched = await addPartDetail(part);
        const inserted = await insertPart(enriched, applianceId);
        if (inserted?.part_id) {
          await pool.query(
            `INSERT INTO popular_parts (part_id)
             VALUES ($1)
             ON CONFLICT DO NOTHING`,
            [inserted.part_id]
          );
        }
      }

      console.log(`Finished seeding ${applianceName}`);
    }

    console.log('All appliance data seeded successfully.');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await pool.end();
  }
})();
