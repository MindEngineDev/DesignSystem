document.addEventListener("alpine:init", () => {
  Alpine.data("signaturePadComponent", (config = {}) => ({
    signaturePad: null,
    canvas: null,
    resizeHandler: null,
    base64Image: config.initialSignature || "",
    penColor: config.penColor || "#1f2937",
    isEmpty: true,
    init() {
      if (!window.SignaturePad) {
        console.error("SignaturePad library is not available.");
        return;
      }
      this.canvas = this.$refs.canvas;
      this.resizeHandler = () => this.resizeCanvas();
      this.setupPad();
      window.addEventListener("resize", this.resizeHandler);

      if (this.base64Image) {
        this.isEmpty = false;
        this.$dispatch("signature-status", { filled: true, value: this.base64Image });
        this.$dispatch("signatureStatus", { filled: true, value: this.base64Image });
      }
    },
    setupPad() {
      this.resizeCanvas();
      this.signaturePad = new SignaturePad(this.canvas, {
        penColor: this.penColor,
        backgroundColor: "rgba(0, 0, 0, 0)",
      });

      if (this.base64Image) {
        try {
          this.signaturePad.fromDataURL(this.base64Image);
        } catch (err) {
          console.warn("Unable to parse existing signature", err);
        }
        this.isEmpty = this.signaturePad.isEmpty();
      }

      this.signaturePad.onBegin = () => {
        if (this.isEmpty) {
          this.isEmpty = false;
          const detail = { filled: true };
          this.$dispatch("signature-status", detail);
          this.$dispatch("signatureStatus", detail);
        }
      };

      this.signaturePad.onEnd = () => {
        this.base64Image = this.signaturePad.toDataURL();
        this.isEmpty = this.signaturePad.isEmpty();
        const detail = { value: this.base64Image };
        this.$dispatch("signature-change", detail);
        this.$dispatch("signatureChange", detail);
        this.$dispatch("signature-done", detail);
        this.$dispatch("signatureDone", detail);
      };
    },
    resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const context = this.canvas.getContext("2d");
      const data = this.signaturePad ? this.signaturePad.toData() : null;

      this.canvas.width = this.$refs.field.offsetWidth * ratio;
      this.canvas.height = this.$refs.field.offsetHeight * ratio;

      if (context.resetTransform) context.resetTransform();
      context.scale(ratio, ratio);

      if (this.signaturePad) {
        this.signaturePad.clear();
        if (data && data.length) {
          this.signaturePad.fromData(data);
        } else if (this.base64Image) {
          try {
            this.signaturePad.fromDataURL(this.base64Image);
          } catch (err) {
            console.warn("Unable to restore signature after resize", err);
          }
        }
        this.isEmpty = this.signaturePad.isEmpty();
      }
    },
    clearSignature() {
      if (!this.signaturePad) return;
      this.signaturePad.clear();
      this.base64Image = "";
      this.isEmpty = true;
      this.$dispatch("signature-cleared");
      this.$dispatch("signatureCleared");
      const detail = { filled: false };
      this.$dispatch("signature-status", detail);
      this.$dispatch("signatureStatus", detail);
    },
    submitSignature() {
      if (!this.signaturePad || this.signaturePad.isEmpty()) return;
      this.base64Image = this.signaturePad.toDataURL();
      const detail = { value: this.base64Image };
      this.$dispatch("signature-submit", detail);
      this.$dispatch("signatureSubmit", detail);
    },
    destroy() {
      window.removeEventListener("resize", this.resizeHandler);
      this.signaturePad = null;
    },
  }));
});
