
const ipInput = document.getElementById("ipInput");
const lookupBtn = document.getElementById("lookupBtn");
const message = document.getElementById("message");
const results = document.getElementById("results");

lookupBtn.addEventListener("click", lookupIP);

ipInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        lookupIP();
    }
});

async function lookupIP() {
    const ip = ipInput.value.trim();

    message.textContent = "";
    results.style.display = "none";

    if (!ip) {
        message.textContent = "Please enter an IP address.";
        return;
    }

    lookupBtn.disabled = true;
    lookupBtn.textContent = "Analyzing...";

    try {
        const response = await fetch(
            `https://ipwho.is/${encodeURIComponent(ip)}`
        );

        if (!response.ok) {
            throw new Error("API request failed.");
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Invalid IP address.");
        }

        document.getElementById("resultIP").textContent = data.ip || "—";
        document.getElementById("ipType").textContent = data.type || "—";
        document.getElementById("country").textContent = data.country || "—";
        document.getElementById("region").textContent = data.region || "—";
        document.getElementById("city").textContent = data.city || "—";
        document.getElementById("isp").textContent =
            data.connection?.isp || "Unknown";
        document.getElementById("org").textContent =
            data.connection?.org || "Unknown";
        document.getElementById("asn").textContent =
            data.connection?.asn || "Unknown";
        document.getElementById("timezone").textContent =
            data.timezone?.id || "Unknown";

        document.getElementById("resultStatus").textContent = "Complete";
        results.style.display = "block";

    } catch (error) {
        message.textContent = error.message ||
            "Something went wrong. Please try again.";
    } finally {
        lookupBtn.disabled = false;
        lookupBtn.textContent = "Analyze IP";
    }
}
