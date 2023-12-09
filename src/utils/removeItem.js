require("dotenv").config();

const { MongoClient } = require("mongodb");

/**
 * Removes an item from a specific category in the inventory.
 *
 * @param {string} category - The category from which to remove the item.
 * @param {string} item - The item to be removed.
 * @returns {Promise} - A promise that resolves with the result of the deletion operation.
 */
async function removeItem(category, item) {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const col = client.db("inventory").collection("contents");

    const cursor = await col.findOneAndUpdate(
      {},
      {
        $pull: {
          [category]: { item },
        },
      }
    );

    if (await col.findOne({ [category]: { $size: 0 } })) {
      await col.findOneAndUpdate(
        {},
        {
          $unset: {
            [category]: "",
          },
        }
      );
    }

    return cursor;
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

module.exports = removeItem;
