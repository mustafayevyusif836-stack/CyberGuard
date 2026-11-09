
async function checkServerStatus() {
    const statusElements = [
        document.getElementById("server-status"),
        document.getElementById("platform-status"),
        document.getElementById("footer-status")
    ];

    try {
        const response = await fetch("/api/status");

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        statusElements[0].textContent = "● " + data.status;
        statusElements[1].textContent = "Operational";
        statusElements[2].textContent = "Online";

    } catch (error) {
        statusElements[0].textContent = "● Offline";
        statusElements[1].textContent = "Unavailable";
        statusElements[2].textContent = "Offline";

        console.error(error);
    }
}

checkServerStatus();

