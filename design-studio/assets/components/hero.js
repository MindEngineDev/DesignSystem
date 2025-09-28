// Simple hero component factory (returns HTML string) for reuse in the design studio
export function hero({ title, subtitle, ctaText, ctaHref = "#", alt = "hero" } = {}) {
  return `
    <section class="hero">
      <div class="hero__content container">
        <div class="hero__left">
          <h1 class="display">${title || "Build better products faster"}</h1>
          <p class="lead">${subtitle || "A component-driven design system and toolkit for teams that ship UI faster."}</p>
          <div class="hero__ctas">
            <a href="${ctaHref}" class="btn btn-primary">${ctaText || "Get started — it's free"}</a>
            <a href="pricing.html" class="btn btn-outline">See plans</a>
          </div>
        </div>
        <div class="hero__right">
          <div class="device-mockup">
            <img src="./assets/images/hero.png" alt="${alt}" />
            <div class="blob" aria-hidden></div>
          </div>
        </div>
      </div>
    </section>
  `;
}
