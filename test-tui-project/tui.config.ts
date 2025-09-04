import type { TuiConfig } from '@tui-kit-ai/cli';

export default {
  renderer: "blessed",
  components: {
    path: "./src/components/ui",
  },
  utils: {
    path: "./src/lib/utils.ts",
  },
  types: {
    path: "./src/types/index.ts",
  },
} satisfies TuiConfig;