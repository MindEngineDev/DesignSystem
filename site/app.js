document.addEventListener('alpine:init', () => {
  Alpine.data('counter', () => ({
    n: 0,
    inc() { this.n++ },
    dec() { this.n-- }
  }))
})
