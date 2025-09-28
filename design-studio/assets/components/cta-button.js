export function ctaButton({ text = "Start free trial", href = "#", variant = "primary" } = {}) {
  const classes = variant === "primary" ? "btn btn-primary" : variant === "cta" ? "btn btn-cta" : "btn btn-outline";
  return `<a href="${href}" class="${classes}">${text}</a>`;
}
