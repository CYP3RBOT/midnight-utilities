require("dotenv").config();

const { MongoClient } = require("mongodb");

/**
 * Fetches an item from the MongoDB inventory collection based on the provided query.
 *
 * @param {Object} query - The query object used to find the item in the collection.
 * @returns {Promise<Object>} A promise that resolves to the fetched item.
 */
async function getItem(query) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();

    const col = client.db("inventory").collection("contents");

    const result = await col.findOne({});

    if (!result) return null;
    for (const [key, value] of Object.entries(result)) {
      for (let i = 0; i < value.length; i++) {
        if (value[i].item === query) {
          return key;
        }
      }
    }

    return null;
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = getItem;
