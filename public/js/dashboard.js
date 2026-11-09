
const clock = document.getElementById("clock");

function updateClock() {
    const now = new Date();

    clock.textContent = now.toLocaleTimeString("en-GB", {
        hour12: false
    });
}

updateClock();
setInterval(updateClock, 1000);


async function checkServer() {
    const status = document.getElementById("server-status");
    const health = document.getElementById("api-health");

    try {
        const response = await fetch("/api/status");

        if (!response.ok) {
            throw new Error("API unavailable");
        }

        const data = await response.json();

        status.textContent = data.status;
        status.style.color = "#35d6a0";

        health.textContent = "Connected";
        health.style.color = "#35d6a0";

    } catch (error) {
        status.textContent = "Offline";
        status.style.color = "#ff6262";

        health.textContent = "Disconnected";
        health.style.color = "#ff6262";

        console.error("CyberGuard API:", error);
    }
}

checkServer();
