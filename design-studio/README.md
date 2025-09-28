Design Studio - quick start and testing

This README contains quick notes to preview and test the local builder and demo chat widget inside the `design-studio` folder.

Preview pages

- Open `design-studio/builder.html` in a browser (or run the project's dev server and navigate to the builder path).
- Open `design-studio/layouts/dashboard.html` to view the dashboard preview which includes the demo chat widget.

Testing the demo chat widget

- The chat widget is implemented in `design-studio/modules/dashboard/chats.js` and styled by `design-studio/modules/dashboard/chats.css`.
- To initialize manually from the browser console:
  - Run: `window.initChats && window.initChats('chatsWidget')`
  - Type a message in the input and press Send — the widget will append your message and reply with an "Echo" message.
- The chat is a demo-only widget (no network calls) intended for layout and styling tests.

Testing the builder UI

- The builder app is implemented locally at `design-studio/scripts/builder-app.js` and exposed as `window.builderApp`.
- `design-studio/builder.html` mounts Alpine with `x-data="builderApp()"` and uses the local module so the builder works without importing files outside `design-studio`.
- Use the controls on the left to change component props and the preview to validate the rendered component.
- Use the "Open preview" button to open a new window with the rendered component markup.

Page Builder (new)

- File: `design-studio/page-builder.html` — a minimal drag-and-drop page builder that lets you drag components onto a canvas, edit them, and export as an HTML file.
- To preview quickly run a static server from the repo root and open `design-studio/page-builder.html` (example: `npx http-server . -p 5174`).
- Exporting currently downloads a client-side HTML file. If you'd like server-side export (write into `public/pages/`), I can add a Node CLI or an API endpoint to accept the exported HTML and save it into the repo.

Saving exports to the repo (CLI)

- I added a small CLI at `scripts/save-page.js` which reads HTML from stdin and writes it to `public/pages/<slug>.html`.
- Example usage after exporting from the builder (on your machine):

  ```bash
  # Download the exported HTML from the builder (page-export.html), then run:
  node scripts/save-page.js --slug my-new-page < page-export.html
  # The file will be saved to public/pages/my-new-page.html
  ```

This keeps the export workflow local and safe: the builder produces the HTML, and the CLI persists it into the `public/pages/` folder.

Notes & next steps

- If you want persistence for builder presets or richer controls (color pickers, ranges, icon sets), tell me which feature you'd like next and I can implement it inside `design-studio`.
- If you want the demo chat to persist messages or connect to a backend, I can add a simple local storage adapter or server hooks.

Enjoy testing — tell me what to add next!
