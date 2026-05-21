const form = document.getElementById("emailForm");
const statusText = document.getElementById("status");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const message = document.getElementById("message").value.trim();
    const email = document.getElementById("email").value.trim();
    const count = document.getElementById("count").value;

    // Validation

    if (!message || !email || !count) {
        statusText.innerHTML = "❌ Please fill all fields";
        return;
    }

    if (count <= 0) {
        statusText.innerHTML = "❌ Count must be greater than 0";
        return;
    }

    // Loading

    statusText.innerHTML = "⏳ Sending Emails...";

    try {

        const response = await fetch("/send-email", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message,
                email,
                count
            })

        });

        const data = await response.json();

        if (response.ok) {

            statusText.innerHTML = `
                ✅ ${data.message}
            `;

            form.reset();

        } else {

            statusText.innerHTML = `
                ❌ ${data.error}
            `;

        }

    } catch (error) {

        console.error(error);

        statusText.innerHTML = `
            ❌ Server Error
        `;

    }

});