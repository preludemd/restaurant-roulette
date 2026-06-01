const fetch = require("node-fetch");

exports.handler = async function (event) {
  const { location, cuisine, price, radius } = event.queryStringParameters;

  const params = new URLSearchParams({
    term: "restaurants",
    location: location || "New York, NY",
    radius: Math.min((radius || 8000), 40000),
    limit: 20,
    sort_by: "rating",
  });

  if (cuisine) params.append("categories", cuisine);
  if (price) params.append("price", price);

  const response = await fetch(
    `https://api.yelp.com/v3/businesses/search?${params}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    }
  );

  const data = await response.json();

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(data.businesses || []),
  };
};
