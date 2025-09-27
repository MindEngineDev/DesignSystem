// Simple chats module for dashboard testing
// Exposes init(containerId) to wire a minimal chat UI for preview pages.

export function initChats(containerId = "chatsWidget") {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Avoid double-initialization
  if (container.__chatsInitialized) return;
  container.__chatsInitialized = true;

  // Basic markup
  container.innerHTML = `
    <div class="chats">
      <div class="chats__header">Live chat (demo)</div>
      <div class="chats__messages"></div>
      <form class="chats__form">
        <input type="text" name="message" placeholder="Type a message" autocomplete="off" />
        <button type="submit">Send</button>
      </form>
    </div>
  `;

  const messages = container.querySelector(".chats__messages");
  const form = container.querySelector(".chats__form");
  const input = form.querySelector("input[name=message]");

  function appendMessage(text, from = "you") {
    const el = document.createElement("div");
    el.className = `chats__msg chats__msg--${from}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value && input.value.trim();
    if (!v) return;
    appendMessage(v, "you");
    input.value = "";

    // dummy reply
    setTimeout(() => appendMessage("Echo: " + v, "bot"), 400);
  });

  // initial message
  appendMessage("Welcome to the demo chat!", "bot");
}

// Auto-init when included as a module on the page
if (typeof window !== "undefined") {
  window.initChats = initChats;
}
