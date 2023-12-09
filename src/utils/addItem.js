require("dotenv").config();

const { MongoClient } = require("mongodb");

/**
 * Adds an item to a collection in the MongoDB database.
 *
 * @param {string} category - The name of the category to add the item to.
 * @param {object} item - The item to be added to the category.
 * @param {string} moderatorId - The ID of the moderator performing the action.
 * @returns {Promise<any>} - A promise that resolves to the result of the update operation.
 */
async function addItem(category, item, moderatorId) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const col = client.db("inventory").collection("contents");

    const cursor = col.findOneAndUpdate(
      {},
      {
        $push: {
          [category]: { item, moderatorId, date: Date.now() },
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
