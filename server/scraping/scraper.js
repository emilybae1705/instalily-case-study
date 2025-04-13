const axios = require('axios');
const cheerio = require('cheerio');

const baseURL = 'https://www.partselect.com';

async function scrapePage(url) {
  try {
    const { data: html } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(html);

    return $;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw new Error('Failed to scrape data');
  }
}

// extracts list of brands for an appliance category (e.g. dishwasher)
async function scrapeBrands(url) {
  const $ = await scrapePage(url);
  const brands = [];

  const brandList = $('#ShopByBrand').next('ul.nf__links');
  if (!brandList.length) {
    throw new Error('Brand list not found');
  }

  brandList.find('li a').each((_, el) => {
    const brandText = $(el).text().trim(); // e.g. "Admiral Dishwasher Parts"

    // extract brand name from text
    const brandName = brandText.split(' ')[0]; // e.g. "Admiral"
    const brandUrl = `${baseURL}${$(el).attr('href')}`;

    brands.push({ brandName, brandUrl });
  });

  return brands;
}

async function scrapePopularModels(url) {
  const $ = await scrapePage(url);
  const models = [];
  const modelList = $('#TopModelsSectionTitle').next('ul.nf__links').find('li a');

  modelList.each((_, el) => {
    const modelNum = $(el).text().trim().split(' ')[0];
    const modelUrl = `${baseURL}${$(el).attr('href')}`;

    models.push({ modelNum, modelUrl });
  });

  return models;
}

// extracts popular parts
async function scrapePopularParts(url) {
  const $ = await scrapePage(url);
  const popularParts = [];

  $('div.nf__part.mb-3').each((_, el) => {
    const partDetails = $(el).find('a.nf__part__detail__title')
    const partName = partDetails.text().trim();
    const partUrl = `${baseURL}${partDetails.attr('href')}`;

    // extract part_select_number & manufacture_number
    let psNum, manufacturerNum;
    $(el).find('.nf__part__detail__part-number').each((_, el) => {
      const text = $(el).text();
      if (text.includes('PartSelect Number')) {
        psNum = $(el).find('strong').text().trim();
      }
      if (text.includes('Manufacturer Part Number')) {
        manufacturerNum = $(el).find('strong').text().trim();
      }
    });

    const price = $(el).find('.mt-sm-2 price').text().trim().slice(1);
    price = parseFloat(price);
    console.log('price of part:', price)

    const stock = $(el)
      .find('.nf__part__left-col__basic-info__stock span').text().trim();
    const inStock = stock.includes('In Stock');

    popularParts.push({ 
      partName, 
      partUrl,
      psNum,
      manufacturerNum,
      price,
      inStock
    });
  });

  return popularParts;
}

async function addPartDetail(part) {
  try {
    const $ = await scrapePage(part.partUrl);

    if (!part.psNum) {
      part.psNum = $('span[itemprop="productID"]').text().trim();
    }
    if (!part.manufacturerNum) {
      part.manufacturerNum = $('span[itemprop="mpn"]').text().trim();
    }

    const desc = $('div[itemprop="description"]').text().trim();
    const brand = $('span[itemprop="name"]').text().trim();
    const symptomText = $('#Troubleshooting')
      .next('.pd__wrap')
      .find('.col-md-6')
      .first()
      .text()
      .split(':')[1];

    const symptoms = symptomText
      .split('|')
      .map(s => s.trim())
      .filter(Boolean);

    part.part_description = desc || "";
    part.brandName = brand || null;
    part.symptoms = symptoms.length > 0 ? symptoms : null;

    return part;
  } catch (err) {
    console.error(`Error scraping part detail from ${part.partUrl}:`, err);
    return part;
  }
}

async function scrapePartTypes(url) {
  const $ = await scrapePage(url);
  const partTypes = [];

  const partList = $('#ShopByPartType').next('ul.nf__links');
  if (!partList.length) {
    throw new Error('Part list not found');
  }

  partList.find('li a').each((_, el) => {
    const partType = $(el).text().trim();
    const partUrl = `${baseURL}${$(el).attr('href')}`;
    console.log('Running partList partUrl', partUrl)

    partTypes.push({ partType, partUrl });
  });

  return partTypes;
}

scrapeParts('https://www.partselect.com/Dishwasher-Parts.htm').then(parts => {
  console.log('Scraped Dishwasher Parts:', parts);
}
).catch(err => {
  console.error('Error:', err);
});

// TESTING
scrapeBrands('https://www.partselect.com/Dishwasher-Parts.htm').then(brands => {
  console.log('Scraped Dishwasher Brands:', brands);
}
).catch(err => {
  console.error('Error:', err);
});

scrapeBrands('https://www.partselect.com/Refrigerator-Parts.htm').then(brands => {
  console.log('Scraped Fridge Brands:', brands);
}
).catch(err => {
  console.error('Error:', err);
});

module.exports = {
  scrapePage,
  scrapeBrands,
  scrapePartTypes,
  scrapePopularParts,
  scrapePopularModels,
  addPartDetail
};
