const API_KEY = "fw_3ZWkesJfwvEW3fSJzEW9wKYd";
const MODEL = "accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new";

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  const chatBox = document.getElementById("chatBox");

  // Unique ID for each bot message
  const uniqueId = "typingText-" + Date.now();

  const botDiv = document.createElement("div");
  botDiv.className = "message bot";
  botDiv.innerHTML = `<span id="${uniqueId}"></span><span class="cursor"></span>`;
  chatBox.appendChild(botDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("https://api.fireworks.ai/inference/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are Dobby dialectica - a savage, unhinged debater. Always argue fiercely, mock weaknesses, and never admit defeat." },
          { role: "user", content: message }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();
    console.log(data);

    if (data.choices && data.choices.length > 0) {
      typeText(uniqueId, data.choices[0].message.content);
    } else {
      typeText(uniqueId, "⚠️ Unexpected API response. Check console.");
    }
  } catch (err) {
    console.error(err);
    typeText(uniqueId, "⚠️ Error contacting API.");
  }
}

function typeText(elementId, text, speed = 35) {
  const el = document.getElementById(elementId);
  el.textContent = "";
  let i = 0;
  function typing() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
      document.getElementById("chatBox").scrollTop = document.getElementById("chatBox").scrollHeight;
    }
  }
  typing();
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
