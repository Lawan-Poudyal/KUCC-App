import { createItem, getUserItems } from "../services/itemService.js";

export const getItems = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { data, error } = await getUserItems(userId);
    if (error) throw error;
    res.json({ items: data });
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

export const createNewItem = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const { data, error } = await createItem({ userId, title, description });
    if (error) throw error;

    res.json({ success: true, item: data });
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ error: "Failed to create item" });
  }
};
