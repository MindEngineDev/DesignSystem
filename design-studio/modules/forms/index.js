// Lightweight form helpers for the Design Studio playground
// - Attaches to forms with class `demo-form` and provides:
//   * Live JSON preview of form data
//   * Fill sample data button
//   * Enhanced submit handler that validates and shows result

function serializeForm(form) {
  const data = {};
  const fm = new FormData(form);
  for (const [k, v] of fm.entries()) {
    // handle multiple values
    if (Object.prototype.hasOwnProperty.call(data, k)) {
      if (Array.isArray(data[k])) data[k].push(v);
      else data[k] = [data[k], v];
    } else {
      data[k] = v;
    }
  }
  // include values for custom shoelace controls (sl-input, sl-select, sl-textarea)
  form.querySelectorAll("sl-input[name], sl-select[name], sl-textarea[name], sl-range[name], sl-checkbox[name], sl-radio[name]").forEach((el) => {
    const name = el.getAttribute("name");
    try {
      const val = el.value;
      if (name) data[name] = val;
    } catch (e) {
      // ignore
    }
  });
  return data;
}

function attachDemo(form) {
  // create controls area
  const preview = document.createElement("pre");
  preview.className = "forms__preview muted";

  const controls = document.createElement("div");
  controls.className = "forms__controls";

  const fillBtn = document.createElement("button");
  fillBtn.type = "button";
  fillBtn.className = "secondary";
  fillBtn.textContent = "Fill sample data";
  controls.appendChild(fillBtn);

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "contrast";
  clearBtn.textContent = "Clear";
  controls.appendChild(clearBtn);

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "secondary";
  copyBtn.textContent = "Copy JSON";
  controls.appendChild(copyBtn);

  const wrap = document.createElement("div");
  wrap.className = "forms__demo";
  form.parentNode.insertBefore(wrap, form.nextSibling);
  wrap.appendChild(controls);
  wrap.appendChild(preview);

  function updatePreview() {
    const data = serializeForm(form);
    preview.textContent = JSON.stringify(data, null, 2);
  }

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(preview.textContent);
      copyBtn.textContent = "Copied";
      setTimeout(() => (copyBtn.textContent = "Copy JSON"), 1200);
    } catch (e) {
      console.warn("Copy failed", e);
    }
  });

  // Live update on input/change
  form.addEventListener("input", updatePreview);
  form.addEventListener("change", updatePreview);

  fillBtn.addEventListener("click", () => {
    // naive fill: set inputs by type/name
    form.querySelectorAll("input, textarea, select, sl-input, sl-textarea, sl-select").forEach((el) => {
      const name = el.getAttribute("name") || el.getAttribute("id") || "";
      if (!name) return;
      if ((el.type === "checkbox" || el.getAttribute("type") === "checkbox") && !el.matches("[multiple]")) {
        el.checked = true;
      } else if (el.type === "radio") {
        el.checked = true;
      } else if (el.tagName.toLowerCase().startsWith("sl-")) {
        try {
          el.value = el.getAttribute("data-sample") || "Sample " + name;
          // Some Shoelace components require an input/change event to update UI
          el.dispatchEvent(new Event("sl-change"));
        } catch {}
      } else if (el.tagName.toLowerCase() === "select") {
        if (el.options && el.options.length) el.selectedIndex = 0;
      } else if (el.type === "file") {
        // can't populate file inputs for security
      } else {
        el.value = el.getAttribute("placeholder") || "Sample " + name;
      }
    });
    updatePreview();
  });

  clearBtn.addEventListener("click", () => {
    form.reset();
    // reset shoelace components (if present)
    form.querySelectorAll("sl-input, sl-select, sl-textarea").forEach((el) => {
      try {
        el.value = "";
        el.dispatchEvent(new Event("sl-change"));
      } catch {}
    });
    updatePreview();
  });

  // File input preview (images) — append a small image preview under the preview area
  form.querySelectorAll("input[type=file]").forEach((fi) => {
    fi.addEventListener("change", (e) => {
      const f = fi.files && fi.files[0];
      // remove existing preview for this input
      const existing = wrap.querySelector('.forms__filepreview[data-name="' + fi.name + '"]');
      if (existing) existing.remove();
      if (f && f.type.startsWith("image/")) {
        const imgWrap = document.createElement("div");
        imgWrap.className = "forms__filepreview";
        imgWrap.setAttribute("data-name", fi.name);
        const img = document.createElement("img");
        img.style.maxWidth = "200px";
        img.style.display = "block";
        img.style.marginTop = "0.5rem";
        imgWrap.appendChild(img);
        wrap.appendChild(imgWrap);
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result;
        };
        reader.readAsDataURL(f);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // run constraint validation
    if (!form.checkValidity()) {
      form.reportValidity?.();
      // highlight first invalid
      const first = form.querySelector(":invalid");
      if (first) first.focus();
      return;
    }
    // show a quick inline result
    const out = document.createElement("div");
    out.className = "forms__result alert";
    out.textContent = "Form submitted — data logged to console.";
    wrap.appendChild(out);
    setTimeout(() => out.remove(), 2500);
    console.log("Form submit data:", serializeForm(form));
  });

  // initial preview
  updatePreview();
}

function init() {
  document.querySelectorAll("form.demo-form").forEach(attachDemo);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

export { init };
