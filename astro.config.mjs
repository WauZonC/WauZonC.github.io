// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 用户主站：绝对不要设置 base（见 PLAN.md ADR-2）
  site: 'https://wauzonc.github.io',
  output: 'static',
  markdown: { shikiConfig: { theme: 'github-light' } },
});
