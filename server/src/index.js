const express = require('express');
const cors = require('cors');
const pool = require('../config/database');
const chatRoute = require('./routes/chat');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use('/api/chat', chatRoute);

app.get('/api/model/:modelNumber/parts', async (req, res) => {
  const { modelNumber } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT p.part_select_number, p.part_name, p.price
      FROM Parts p
      JOIN ModelParts mp ON p.part_id = mp.part_id
      JOIN Models m ON m.model_id = mp.model_id
      WHERE m.model_number = $1
      `,
      [modelNumber]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
