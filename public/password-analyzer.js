
const passwordInput = document.getElementById("passwordInput");
const togglePassword = document.getElementById("togglePassword");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");

const recommendationsList =
    document.getElementById("recommendationsList");

// Show / Hide password
togglePassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }
});

// Password analysis
passwordInput.addEventListener("input", analyzePassword);

function analyzePassword() {
    const password = passwordInput.value;

    const checks = {
        length: password.length >= 12,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password)
    };

    updateCheck("lengthCheck", checks.length);
    updateCheck("upperCheck", checks.upper);
    updateCheck("lowerCheck", checks.lower);
    updateCheck("numberCheck", checks.number);
    updateCheck("symbolCheck", checks.symbol);

    const score = Object.values(checks).filter(Boolean).length;

    let level = "";
    let percentage = 0;
    let color = "#253249";

    if (!password) {
        level = "Not analyzed";
        percentage = 0;
    } else if (score <= 2) {
        level = "Weak";
        percentage = 25;
        color = "#ef4444";
    } else if (score <= 3) {
        level = "Medium";
        percentage = 50;
        color = "#f59e0b";
    } else if (score === 4) {
        level = "Strong";
        percentage = 75;
        color = "#3b82f6";
    } else {
        level = "Very Strong";
        percentage = 100;
        color = "#22c55e";
    }

    strengthText.textContent = level;
    strengthText.style.color = color;

    strengthFill.style.width = percentage + "%";
    strengthFill.style.background = color;

    updateRecommendations(password, checks);
}

// Update requirement status
function updateCheck(id, passed) {
    const element = document.getElementById(id);

    if (passed) {
        element.classList.add("valid");
        element.textContent = "✓ " + element.textContent.substring(2);
    } else {
        element.classList.remove("valid");

        const text = element.textContent
            .replace(/^✓\s*/, "")
            .replace(/^○\s*/, "");

        element.textContent = "○ " + text;
    }
}

// Security recommendations
function updateRecommendations(password, checks) {
    const recommendations = [];

    if (!password) {
        recommendations.push("Enter a test password to begin analysis.");
    } else {
        if (!checks.length) {
            recommendations.push("Use at least 12 characters.");
        }

        if (!checks.upper) {
            recommendations.push("Add uppercase letters.");
        }

        if (!checks.lower) {
            recommendations.push("Add lowercase letters.");
        }

        if (!checks.number) {
            recommendations.push("Include numbers.");
        }

        if (!checks.symbol) {
            recommendations.push("Include special characters.");
        }

        if (password.length < 16) {
            recommendations.push("Consider using a longer passphrase.");
        }

        if (/(.)\1{2,}/.test(password)) {
            recommendations.push("Avoid repeating the same character many times.");
        }

        if (recommendations.length === 0) {
            recommendations.push("All basic checks passed. Avoid reusing passwords.");
        }
    }

    recommendationsList.innerHTML = "";

    recommendations.forEach((recommendation) => {
        const li = document.createElement("li");
        li.textContent = recommendation;
        recommendationsList.appendChild(li);
    });
}

// Initial state
analyzePassword();
