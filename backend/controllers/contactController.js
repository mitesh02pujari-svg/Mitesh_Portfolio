const { pool } = require("../config/db");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createContactMessage(req, res) {
    const fields = ["name", "email", "subject", "message"];
    const values = {};

    for (const field of fields) {
        const value = req.body?.[field];

        if (typeof value !== "string" || value.trim() === "") {
            return res.status(400).json({
                success: false,
                message: `${field} is required`
            });
        }

        values[field] = value.trim();
    }

    if (!emailPattern.test(values.email)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address"
        });
    }

    if (!pool) {
        return res.status(503).json({
            success: false,
            message: "Contact service is not configured"
        });
    }

    try {
        await pool.query(
            `INSERT INTO contact_messages (name, email, subject, message)
             VALUES ($1, $2, $3, $4)`,
            [values.name, values.email, values.subject, values.message]
        );

        return res.status(201).json({
            success: true,
            message: "Message received successfully"
        });
    } catch (error) {
        console.error("Contact message database insert failed:", {
            message: error.message,
            code: error.code,
            sqlState: error.code,
            detail: error.detail,
            hint: error.hint
        });
        return res.status(500).json({
            success: false,
            message: "Unable to process your message right now"
        });
    }
}

module.exports = { createContactMessage };
