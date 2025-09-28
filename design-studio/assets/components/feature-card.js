export function featureCard({ icon = "⚡", title = "Feature", body = "" } = {}) {
  return `
    <article class="feature card">
      <div class="icon">${icon}</div>
      <h3>${title}</h3>
      <p>${body}</p>
      <a class="learn" href="#">Explore →</a>
    </article>
  `;
}
