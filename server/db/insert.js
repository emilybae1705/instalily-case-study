const pool = require('./database');

export async function insertBrand(brandName) {
  const res = await pool.query(
    `INSERT INTO brands (brand_name) 
     VALUES ($1) 
     ON CONFLICT (brand_name) DO NOTHING 
     RETURNING *`,
    [brandName]
  );
  return res.rows[0];
}

export async function insertBrandAppliance(brandId, applianceId, pageUrl) {
  await pool.query(
    `INSERT INTO brand_appliances (brand_id, appliance_id, page_url) 
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [brandId, applianceId, pageUrl]
  );
}

export async function insertModel({ model_number, page_url, brand_id = null, appliance_id }) {
  const res = await pool.query(
    `INSERT INTO models (model_number, page_url, brand_id, appliance_id)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [model_number, page_url, brand_id, appliance_id]
  );
  return res.rows[0];
}

export async function insertPart(part, applianceId, brandId = null, typeId = null) {
  const res = await pool.query(
    `INSERT INTO parts (
      part_select_number, manufacturer_number, part_name, page_url,
      part_description, price, in_stock, symptoms,
      appliance_id, brand_id, type_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT DO NOTHING
    RETURNING *`,
    [
      part.psNum,
      part.manufacturerNum,
      part.partName,
      part.partUrl,
      part.part_description || null,
      part.price || null,
      part.inStock ?? null,
      part.symptoms ?? null,
      applianceId,
      brandId,
      typeId
    ]
  );
  return res.rows[0];
}

export async function insertPartType(partType, page_url, applianceId) {
  const res = await pool.query(
    `INSERT INTO part_types (type_name, page_url, appliance_id)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [partType, page_url, applianceId]
  );
}
