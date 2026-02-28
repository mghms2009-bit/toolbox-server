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
                    Category: 11,
                    Keyword: query,
                    AssetTypes: assetType,
                    Limit: 30
                },
                headers: {
                    "User-Agent": "Mozilla/5.0"
                }
            }
        );

        const items = response.data?.data || [];

        const results = items
            .filter(item => item && item.id && item.name)
            .map(item => ({
                id: item.id,
                name: item.name
            }));

        res.json(results);

    } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
