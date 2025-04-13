import pool from './database';

export async function seedAppliances() {
  const names = ['Dishwasher', 'Refrigerator'];
  const ids = {};

  for (const name of names) {
    const res = await pool.query(
      `INSERT INTO appliances (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING appliance_id`,
      [name]
    );
    ids[name] = res.rows[0].appliance_id;
  }

  return ids;
}

export const applianceURLs = {
  Dishwasher: {
    url: 'https://www.partselect.com/Dishwasher-Parts.htm'
  },
  Refrigerator: {
    url: 'https://www.partselect.com/Refrigerator-Parts.htm'
  }
}