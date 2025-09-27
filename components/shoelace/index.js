// components/shoelace/index.js - shim re-exporting the actual implementations
// This file exists to satisfy legacy imports from app.js which expect
// components to live under `components/shoelace/*`. The canonical
// implementations are under `packages/ui/` so we re-export them here.

export * from "../../packages/ui/index.js";
