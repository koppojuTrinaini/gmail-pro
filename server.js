const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/send-email", async (req, res) => {

    try {

        const { message, email, count } = req.body;

        if (!message || !email || !count) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        for (let i = 0; i < Number(count); i++) {

            await axios.post(
                "https://api.brevo.com/v3/smtp/email",
                {
                    sender: {
                        name: "Gmail Pro",
                        email: process.env.EMAIL_USER
                    },

                    to: [
                        {
                            email: email
                        }
                    ],

                    subject: `Message ${i + 1}`,

                    textContent: message
                },
                {
                    headers: {
                        "api-key": process.env.BREVO_API_KEY,
                        "Content-Type": "application/json"
                    }
                }
            );

        }

        res.status(200).json({
            message: `${count} emails sent successfully`
        });

    } catch (error) {

        console.log("FULL ERROR:");
        console.log(error.response?.data || error.message);

        res.status(500).json({
            error: "Failed to send emails"
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});