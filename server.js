const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

/* Middleware */

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* Route */

app.post("/send-email", async (req, res) => {

    try {

        const { message, email, count } = req.body;

        // Validation

        if (!message || !email || !count) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // Brevo SMTP Transport

        const transporter = nodemailer.createTransport({

            host: "smtp-relay.brevo.com",

            port: 587,

            secure: false,

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },

            connectionTimeout: 10000

        });

        // Send Multiple Emails

        for (let i = 0; i < Number(count); i++) {

            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: email,

                subject: `Message ${i + 1}`,

                text: message

            });

        }

        res.status(200).json({
            message: `${count} emails sent successfully`
        });

    } catch (error) {

        console.log("FULL ERROR:");
        console.log(error);

        res.status(500).json({
            error: error.message
        });

    }

});

/* Start Server */

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});