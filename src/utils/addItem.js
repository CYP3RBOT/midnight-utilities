require("dotenv").config();

const { MongoClient } = require("mongodb");

/**
 * Adds an item to a MongoDB collection.
 *
 * @param {string} collection - The name of the collection to add the item to.
 * @param {any} item - The item to be added to the collection.
 * @returns {Promise<any>} A promise that resolves to the result of the insertion operation.
 */
async function addItem(collection, item) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const col = client.db("inventory").collection("contents");

    const cursor = col.findOneAndUpdate(
      {},
      {
        $push: {
          [collection]: item,
        },
      },
      { upsert: true }
    );

    return await cursor;
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = addItem;
