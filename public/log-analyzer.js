
const logFile = document.getElementById("logFile");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const logOutput = document.getElementById("logOutput");
const message = document.getElementById("message");

analyzeBtn.addEventListener("click", analyzeLogs);
clearBtn.addEventListener("click", clearLogs);

async function analyzeLogs() {
    const file = logFile.files[0];

    message.textContent = "";

    if (!file) {
        message.textContent = "Please select a log file.";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        message.textContent = "File is too large. Maximum size is 5 MB.";
        return;
    }

    try {
        const content = await file.text();
        const lines = content.split(/\r?\n/).filter(line => line.trim());

        const counts = {
            INFO: 0,
            WARNING: 0,
            ERROR: 0,
            CRITICAL: 0
        };

        logOutput.innerHTML = "";

        lines.forEach(line => {
            const upperLine = line.toUpperCase();

            let level = "INFO";

            if (/\bCRITICAL\b|\bFATAL\b/.test(upperLine)) {
                level = "CRITICAL";
            } else if (/\bERROR\b|\bFAIL\b/.test(upperLine)) {
                level = "ERROR";
            } else if (/\bWARNING\b|\bWARN\b/.test(upperLine)) {
                level = "WARNING";
            }

            counts[level]++;

            const entry = document.createElement("div");
            entry.className = `log-entry ${level}`;
            entry.textContent = `[${level}] ${line}`;

            logOutput.appendChild(entry);
        });

        document.getElementById("totalCount").textContent =
            lines.length;

        document.getElementById("infoCount").textContent =
            counts.INFO;

        document.getElementById("warningCount").textContent =
            counts.WARNING;

        document.getElementById("errorCount").textContent =
            counts.ERROR + counts.CRITICAL;

        if (lines.length === 0) {
            logOutput.textContent = "No log entries found.";
        }

    } catch {
        message.textContent = "Unable to read this file.";
    }
}

function clearLogs() {
    logFile.value = "";
    logOutput.innerHTML =
        '<p class="empty">Upload a log file to begin analysis.</p>';

    message.textContent = "";

    ["totalCount", "infoCount", "warningCount", "errorCount"]
        .forEach(id => {
            document.getElementById(id).textContent = "0";
        });
}

