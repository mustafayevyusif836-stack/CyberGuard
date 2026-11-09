
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// SERVER STATUS
app.get("/api/status", (req, res) => {
    res.json({
        project: "CyberGuard",
        status: "Online",
        version: "1.0.0"
    });
});

// CVE EXPLORER API
app.get("/api/cves", async (req, res) => {
    try {
        const query = String(req.query.q || "").trim();

        if (!/^[a-zA-Z0-9 ._-]{2,80}$/.test(query)) {
            return res.status(400).json({
                error: "Enter a valid CVE ID or search keyword."
            });
        }

        const isCve = /^CVE-\d{4}-\d{4,}$/i.test(query);

        const apiURL = new URL(
            "https://services.nvd.nist.gov/rest/json/cves/2.0"
        );

        if (isCve) {
            apiURL.searchParams.set("cveId", query.toUpperCase());
        } else {
            apiURL.searchParams.set("keywordSearch", query);
        }

        apiURL.searchParams.set("resultsPerPage", "10");

        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("NVD API is temporarily unavailable.");
        }

        const data = await response.json();

        const results = (data.vulnerabilities || []).map(item => {
            const cve = item.cve;

            const description = cve.descriptions?.find(
                d => d.lang === "en"
            );

            const metrics = cve.metrics || {};

            const cvss =
                metrics.cvssMetricV40?.[0]?.cvssData ||
                metrics.cvssMetricV31?.[0]?.cvssData ||
                metrics.cvssMetricV30?.[0]?.cvssData ||
                metrics.cvssMetricV2?.[0]?.cvssData;

            return {
                id: cve.id,
                description: description?.value || "No description.",
                score: cvss?.baseScore ?? null,
                severity: cvss?.baseSeverity || "UNKNOWN",
                published: cve.published || "Unknown",
                modified: cve.lastModified || "Unknown"
            };
        });

        res.json({
            total: data.totalResults || 0,
            results
        });

    } catch (error) {
        console.error("CVE API Error:", error.message);

        res.status(500).json({
            error: error.message || "Unable to retrieve CVE data."
        });
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`CyberGuard: http://localhost:${PORT}`);
});
