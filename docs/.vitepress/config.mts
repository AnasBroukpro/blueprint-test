import { defineConfig } from "vitepress"

export default defineConfig({
  lang: "fr-FR",
  title: "Blueprint AI Stack",
  description: "Framework de développement augmenté par l'IA",

  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "Blueprint", link: "/blueprint/core" },
      { text: "Spécifications", link: "/specs/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Démarrage", link: "/guide/getting-started" },
          ],
        },
      ],
      "/blueprint/": [
        {
          text: "Blueprint",
          items: [
            { text: "Core", link: "/blueprint/core" },
            { text: "Phase 1", link: "/blueprint/phase-1" },
            { text: "Tool Status", link: "/blueprint/tool-status" },
          ],
        },
      ],
      "/specs/": [
        {
          text: "Spécifications",
          items: [
            { text: "Index", link: "/specs/" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com" },
    ],
  },
})
