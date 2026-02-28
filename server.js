const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/search", async (req, res) => {
    const query = req.query.query || "";
    const category = req.query.category || "Audio";
    const page = req.query.page || 1;

    let assetType = category === "Mesh" ? 40 : 3; 
    // 3 = Audio
    // 40 = Mesh

    try {
        const response = await axios.get(
            `https://catalog.roblox.com/v1/search/items/details`,
            {
                params: {
                    Category: 11,
                    Subcategory: 0,
                    Keyword: query,
                    AssetTypes: assetType,
                    SortType: 1,
                    Limit: 30,
                    Cursor: ""
                }
            }
        );

        const freeOnly = response.data.data.filter(item => item.price === 0);

        res.json(freeOnly.map(item => ({
            id: item.id,
            name: item.name
        })));

    } catch (err) {
        console.log(err.message);
        res.status(500).json([]);
    }
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
