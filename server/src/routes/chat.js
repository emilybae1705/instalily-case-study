const express = require('express');
const router = express.Router();
const domainFilter = require('../services/domainFilter');
const deepseek = require('../services/deepseek');

// /api/chat
router.post('/', async (req, res) => {
  const userQuery = req.body.query || '';

  const isInDomain = domainFilter(userQuery);

  const fallback = "I'm here to help with refrigerator or dishwasher parts. Please rephrase or ask a relevant question."
  if (!isInDomain) {
    return res.json({
      answer: fallback
    });
  }

  try {
    // 2. Optionally retrieve relevant product data or docs
    //    E.g., const productContext = await productSearch(userQuery);

    const response = await deepseek.sendQuery({
      userQuery,
      // context: productContext, // if you have relevant data
    });
    res.status(200).json({ answer: response });

  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
