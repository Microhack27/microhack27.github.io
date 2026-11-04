
// Countdown to Hackathon Day
const eventDate = new Date("2027-02-25T09:00:00+05:30").getTime();

function updateCountdown() {
    const now = Date.now();
    const distance = eventDate - now;

    if (distance <= 0) {
        document.getElementById("countdown").innerHTML =
            "<h2>THE HACKATHON IS HERE!</h2>";
        return;
    }

    document.getElementById("days").textContent =
        Math.floor(distance / (1000 * 60 * 60 * 24));

    document.getElementById("hours").textContent =
        Math.floor((distance / (1000 * 60 * 60)) % 24).toString().padStart(2, "0");

    document.getElementById("minutes").textContent =
        Math.floor((distance / (1000 * 60)) % 60).toString().padStart(2, "0");

    document.getElementById("seconds").textContent =
        Math.floor((distance / 1000) % 60).toString().padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});

// Registration link
// Replace this URL with your actual Google Form URL
const registrationURL = "https://docs.google.com/forms/d/e/1FAIpQLSdKbUGo10ZdioGiEhTazxgl5JbF2qxyC5CixQR0mYnGfbqOoQ/viewform?usp=header";

document.getElementById("registerLink").href = registrationURL;
document.getElementById("registerLink").target = "_blank";
// Animated timeline progress on scroll

const timelineList = document.getElementById("timelineList");

function updateTimeline() {
    if (!timelineList) return;

    const rect = timelineList.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const progress = Math.max(
        0,
        Math.min(
            100,
            ((viewportHeight * 0.7 - rect.top) /
            (rect.height - viewportHeight * 0.3)) * 100
        )
    );

    timelineList.style.setProperty(
        "--timeline-progress",
        progress + "%"
    );
}

window.addEventListener("scroll", updateTimeline);
window.addEventListener("resize", updateTimeline);
updateTimeline();

/* ===== BLUE CURSOR CIRCUIT ANIMATION ===== */

const circuitCanvas = document.getElementById("cursor-circuit");
const circuitCtx = circuitCanvas.getContext("2d");

let mouseX = 0;
let mouseY = 0;
let previousX = 0;
let previousY = 0;
let circuitSegments = [];

function resizeCircuitCanvas() {
    const dpr = window.devicePixelRatio || 1;

    circuitCanvas.width = window.innerWidth * dpr;
    circuitCanvas.height = window.innerHeight * dpr;

    circuitCanvas.style.width = window.innerWidth + "px";
    circuitCanvas.style.height = window.innerHeight + "px";

    circuitCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCircuitCanvas();
window.addEventListener("resize", resizeCircuitCanvas);

window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    if (previousX !== 0 && previousY !== 0) {
        const distance = Math.hypot(
            mouseX - previousX,
            mouseY - previousY
        );

        if (distance > 5) {
            circuitSegments.push({
                x1: previousX,
                y1: previousY,
                x2: mouseX,
                y2: mouseY,
                time: performance.now()
            });

            if (circuitSegments.length > 35) {
                circuitSegments.shift();
            }
        }
    }

    previousX = mouseX;
    previousY = mouseY;
});

function animateCircuit() {
    const now = performance.now();

    circuitCtx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );

    circuitSegments = circuitSegments.filter(
        segment => now - segment.time < 650
    );

    circuitSegments.forEach(segment => {
        const age = now - segment.time;
        const opacity = 1 - age / 650;

        // Circuit-style right-angle connection
        const middleX = (segment.x1 + segment.x2) / 2;

        circuitCtx.beginPath();
        circuitCtx.moveTo(segment.x1, segment.y1);
        circuitCtx.lineTo(middleX, segment.y1);
        circuitCtx.lineTo(middleX, segment.y2);
        circuitCtx.lineTo(segment.x2, segment.y2);

        circuitCtx.strokeStyle =
            `rgba(0, 220, 255, ${opacity})`;

        circuitCtx.lineWidth = 2;
        circuitCtx.shadowColor = "#00dfff";
        circuitCtx.shadowBlur = 12;
        circuitCtx.stroke();

        // Small glowing circuit connection
        circuitCtx.beginPath();
        circuitCtx.arc(
            segment.x2,
            segment.y2,
            3,
            0,
            Math.PI * 2
        );

        circuitCtx.fillStyle =
            `rgba(100, 240, 255, ${opacity})`;

        circuitCtx.fill();
    });

    circuitCtx.shadowBlur = 0;

    requestAnimationFrame(animateCircuit);
}

animateCircuit();
