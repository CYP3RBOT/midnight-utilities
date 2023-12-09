require("dotenv").config();

const { MongoClient } = require("mongodb");

/**
 * Retrieves inventory data from the MongoDB database.
 *
 * @param {Object} query - The query object to filter the inventory data.
 * @returns {Promise<Object|null>} - A promise that resolves to the inventory data matching the query, or null if no data is found.
 */
async function getInventory(query) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();

    const col = client.db("inventory").collection("contents");

    const result = await col.findOne({});

    if (!result) return null;

    return result;
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = getInventory;
