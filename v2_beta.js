// Lightweight Much more accurate due to code overflow
let copyButton = document.createElement('button');
copyButton.textContent = "Load Model (v3-open)";
Object.assign(copyButton.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    zIndex: 9999,
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer"
});
document.body.appendChild(copyButton);
copyButton.addEventListener("click", function() {
    const container = document.querySelector(".questions-container");
    if (!container) return alert("No questions found!");
    const fullText = container.innerText;
    const strictPrompt = fullText + " ONLY SHOW LETTER IN RESPONSE MAKE IT BOLD AND NOTHING ELSE BESIDES THE LETTER";
    window.open(`https://chatgpt.com/?prompt=${encodeURIComponent(strictPrompt)}`, "_blank");
});
