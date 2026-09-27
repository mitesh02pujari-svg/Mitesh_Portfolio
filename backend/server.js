require("dotenv").config();

const cors = require("cors");
const express = require("express");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL;

app.use(cors({ origin: frontendUrl }));
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Portfolio API is running"
    });
});

app.use("/api/contact", contactRoutes);

app.use((error, req, res, next) => {
    if (error?.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON request body"
        });
    }

    return next(error);
});

app.listen(port, () => {
    console.log(`Portfolio API listening on port ${port}`);
});
