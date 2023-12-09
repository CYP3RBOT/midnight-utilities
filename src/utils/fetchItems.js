require("dotenv").config();

const { MongoClient } = require("mongodb");

/**
 * Fetches items from a MongoDB collection based on the provided query.
 *
 * @param {string} collectionName - The name of the collection to fetch items from.
 * @param {Object} query - The query object used to filter the items.
 * @returns {Promise<Array>} A promise that resolves to an array of fetched items.
 */
async function fetchItem(collection, query) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const col = client.db("inventory").collection(collection);

    const cursor = col.find({ collection: query.toString() });
    const results = await cursor.toArray();

    return results;
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = fetchItem;
