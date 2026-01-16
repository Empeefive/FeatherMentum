// Paste this into the site using devtools (inspect)

const resetSystem = () => {
    document.querySelectorAll("[id^='cyber-system'], #cyber-ui-refined").forEach(el => el.remove());
    document.querySelectorAll(".cyber-node-wrapper, .cyber-frame").forEach(el => {
        el.classList.remove("cyber-node-wrapper", "cyber-frame");
        el.querySelectorAll(".bracket, .scanner-bar, .node-id").forEach(child => child.remove());
    });
};
resetSystem();

const style = document.createElement("style");
style.id = "cyber-system-styles";
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;900&display=swap');

  :root {
    --cyan: #00f2ff;
    --deep-bg: rgba(5, 8, 15, 0.95);
    --glass: rgba(0, 242, 255, 0.03);
    --border: rgba(0, 242, 255, 0.2);
  }

  .cyber-node-wrapper {
    position: relative !important;
    background: var(--deep-bg) !important;
    border: 1px solid var(--border) !important;
    padding: 45px !important;
    margin: 25px 0 !important;
    border-radius: 4px !important;
    box-shadow: 0 0 30px rgba(0,0,0,0.5), inset 0 0 20px var(--glass) !important;
    overflow: hidden !important;
    animation: nodeEntrance 0.6s ease-out;
  }

  @keyframes nodeEntrance { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }

  .bracket {
    position: absolute; width: 20px; height: 20px;
    border-color: var(--cyan); border-style: solid; opacity: 0.8;
  }
  .tl { top: -2px; left: -2px; border-width: 3px 0 0 3px; }
  .tr { top: -2px; right: -2px; border-width: 3px 3px 0 0; }
  .bl { bottom: -2px; left: -2px; border-width: 0 0 3px 3px; }
  .br { bottom: -2px; right: -2px; border-width: 0 3px 3px 0; }

  .scanner-bar {
    position: absolute; top: 0; left: 0; width: 100%; height: 3px;
    background: var(--cyan); box-shadow: 0 0 15px var(--cyan);
    opacity: 0.4; z-index: 5; pointer-events: none;
    animation: scanLine 4s linear infinite;
  }

  @keyframes scanLine { 0% { top: 0% } 100% { top: 100% } }

  .node-id {
    position: absolute; top: 10px; left: 30px;
    font-family: 'JetBrains Mono'; font-size: 9px; color: var(--cyan);
    letter-spacing: 2px; opacity: 0.6;
  }

  .cyber-node-wrapper * {
    color: #e0faff !important;
    font-family: 'JetBrains Mono', monospace !important;
  }

  .cyber-console {
    position: fixed; top: 50px; left: 50px; width: 320px;
    background: var(--deep-bg); backdrop-filter: blur(15px);
    border: 1px solid var(--border); border-radius: 4px;
    z-index: 100000; font-family: 'Orbitron', sans-serif;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
  }

  .console-header {
    background: linear-gradient(90deg, rgba(0,242,255,0.2), transparent);
    padding: 15px; border-bottom: 1px solid var(--border);
    cursor: grab; display: flex; justify-content: space-between; align-items: center;
  }

  .console-header span {
    font-size: 10px; letter-spacing: 3px; font-weight: 900;
    color: var(--cyan); text-shadow: 0 0 10px var(--cyan);
  }

  .console-body { padding: 20px; display: flex; flex-direction: column; gap: 15px; }

  .btn-main {
    background: var(--cyan); color: #000; border: none; padding: 14px;
    font-family: 'Orbitron'; font-weight: 900; font-size: 11px;
    letter-spacing: 1px; cursor: pointer;
    clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0% 30%);
    transition: 0.2s;
  }

  .btn-main:hover { transform: translateY(-2px); box-shadow: 0 0 20px var(--cyan); }

  .btn-options {
    background: transparent; border: 1px solid var(--border); color: var(--cyan);
    padding: 8px; font-size: 9px; cursor: pointer; text-transform: uppercase;
  }

  .options-drawer {
    max-height: 0; overflow: hidden;
    transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(0,0,0,0.3);
  }

  .options-drawer.open { max-height: 150px; padding: 15px 20px; border-top: 1px solid var(--border); }

  .option-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 10px; font-size: 10px; color: rgba(255,255,255,0.6);
  }

  .switch {
    width: 30px; height: 16px; background: #222;
    border-radius: 10px; position: relative; cursor: pointer;
    border: 1px solid var(--border);
  }
  .switch.active { background: var(--cyan); }
  .switch::after {
    content: ""; position: absolute; top: 2px; left: 2px;
    width: 10px; height: 10px; background: #fff; border-radius: 50%;
    transition: 0.2s;
  }
  .switch.active::after { left: 16px; }
`;
document.head.appendChild(style);

const getFormattedQuestion = () => {
    let output = "";
    const prompt = document.querySelector(".prompt.visible")?.innerText.trim();
    if (prompt) output += prompt + "\n\n";
    const stem = document.querySelector(".stem")?.innerText.trim();
    if (stem) output += stem + "\n\n";
    const choices = document.querySelectorAll(".multichoice-choice");
    choices.forEach(choice => {
        const letter = choice.querySelector(".multichoice-answer-letter")?.innerText.trim() || "";
        const answerText = choice.querySelector(".content-inner")?.innerText.trim() || "";
        if (letter || answerText) output += `${letter} ${answerText}\n`;
    });
    return output.trim();
};

const setupNodeUI = () => {
    const target = document.querySelector(".interactive-template")?.closest(".content-wrapper") 
                 || document.querySelector(".stem")?.parentElement;
    if (target && !target.classList.contains("cyber-node-wrapper")) {
        target.classList.add("cyber-node-wrapper");
        ['tl', 'tr', 'bl', 'br'].forEach(pos => {
            const b = document.createElement("div"); b.className = `bracket ${pos}`;
            target.appendChild(b);
        });
        const scanner = document.createElement("div");
        scanner.className = "scanner-bar";
        target.appendChild(scanner);
        const idLabel = document.createElement("div");
        idLabel.className = "node-id";
        idLabel.textContent = "github.com/EmPeeFive (Kane6)";
        target.appendChild(idLabel);
    }
};

const consoleUI = document.createElement("div");
consoleUI.id = "cyber-system-console";
consoleUI.className = "cyber-console";
consoleUI.innerHTML = `
    <div class="console-header">
        <span>FeatherMentum</span>
        <div style="width:10px; height:10px; background:var(--cyan); border-radius:50%; box-shadow:0 0 10px var(--cyan);"></div>
    </div>
    <div class="console-body">
        <button class="btn-main" id="execTransfer">LOAD RESPONSE</button>
        <button class="btn-options" id="toggleOpts">System Options</button>
    </div>
    <div class="options-drawer" id="optDrawer">
        <div class="option-row">
            <span>COPY TO CLIPBOARD</span>
            <div class="switch active" id="swCopy"></div>
        </div>
        <div class="option-row">
            <span>STRICT LETTER MODE</span>
            <div class="switch active" id="swStrict"></div>
        </div>
    </div>
`;
document.body.appendChild(consoleUI);

setupNodeUI();

document.getElementById("toggleOpts").onclick = () => {
    document.getElementById("optDrawer").classList.toggle("open");
};

document.querySelectorAll(".switch").forEach(sw => {
    sw.onclick = () => sw.classList.toggle("active");
});

document.getElementById("execTransfer").onclick = () => {
    const fullText = getFormattedQuestion();
    if (!fullText) {
        alert("ERROR: No question data detected.");
        return;
    }
    const isCopy = document.getElementById("swCopy").classList.contains("active");
    const isStrict = document.getElementById("swStrict").classList.contains("active");
    if (isCopy) navigator.clipboard.writeText(fullText);
    let finalPrompt = fullText;
    if (isStrict) finalPrompt += " ONLY SHOW LETTER IN RESPONSE MAKE IT BOLD AND NOTHING ELSE BESIDES THE LETTER";
    window.open(`https://chatgpt.com/?prompt=${encodeURIComponent(finalPrompt)}`, "_blank");
};

let dragging = false, offset = [0,0];
const header = consoleUI.querySelector(".console-header");
header.onmousedown = (e) => {
    dragging = true;
    offset = [consoleUI.offsetLeft - e.clientX, consoleUI.offsetTop - e.clientY];
};
document.onmousemove = (e) => {
    if (!dragging) return;
    consoleUI.style.left = (e.clientX + offset[0]) + "px";
    consoleUI.style.top = (e.clientY + offset[1]) + "px";
};
document.onmouseup = () => dragging = false;
