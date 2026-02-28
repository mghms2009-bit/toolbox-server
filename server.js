const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/search", async (req, res) => {
    const query = req.query.query || "";
    const category = req.query.category || "Audio";

    const assetType = category === "Mesh" ? 40 : 3;

    try {
        const response = await axios.get(
            "https://catalog.roblox.com/v1/search/items/details",
            {
                params: {
                    Category: 11, // Marketplace
                    Subcategory: 0,
                    Keyword: query,
                    AssetTypes: assetType,
                    SortType: 1,
                    SortAggregation: 5,
                    Limit: 30
                },
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const items = response.data.data || [];

        const freeOnly = items.filter(item => item.price === 0);

        res.json(freeOnly.map(item => ({
            id: item.id,
            name: item.name
        })));

    } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        res.status(500).json([]);
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
