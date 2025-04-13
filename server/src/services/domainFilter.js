module.exports = function domainFilter(userQuery) {
  const query = userQuery.toLowerCase();

  const domainKeywords = [
    'dishwasher', 'refrigerator', 'fridge', 'whirlpool', 'model', 'kenmore',
    'part ', 'ice maker', 'compartment', 'freezer', 'ge fridge', 'water filter'
  ];

  return domainKeywords.some((keyword) => query.includes(keyword));
};
