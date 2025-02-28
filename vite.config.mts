import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

const workflowName: string | undefined = process.env.VITE_WORKFLOW_NAME;
if (!workflowName) {
  throw new Error("VITE_WORKFLOW_NAME is required");
}


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src", workflowName, "index.ts"),
      name: "plugin-template",
      fileName: (format) => "script.js",
      formats: ["es"],
    },
    outDir: `dist/${workflowName}`,
    rollupOptions: {
      external: [/caido:.+/],
      output: {
        manualChunks: undefined,
      },
      plugins: [
        {
          name: "Render Workflow",
          generateBundle: async function generateBundle(options, bundle) {
            const script = bundle["script.js"];
            if (script && script.type === "chunk") {
              const templatePath = resolve(__dirname, "src", workflowName, "workflow.json");
              const template = await fs.promises.readFile(
                templatePath,
                "utf-8",
              );
              const workflow = template.replace(
                '"[REPLACE_SCRIPT]"',
                JSON.stringify(script.code),
              );
              this.emitFile({
                fileName: "workflow.json",
                source: workflow,
                type: "asset",
              });
            }
          },
        }
      ],
    },
  },
});
