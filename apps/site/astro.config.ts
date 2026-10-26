import { defineConfig } from "astro/config";
import astroSage from "astro-sage";
import sageConfig from "./sage.config";

// A fully static site: `astro build` writes plain files to dist/ for any host.
export default defineConfig({
  site: sageConfig.site.url,
  // Every link the theme generates ends in a slash; be explicit so the
  // static host doesn't have to guess.
  trailingSlash: "always",
  integrations: [astroSage(sageConfig)],
});
