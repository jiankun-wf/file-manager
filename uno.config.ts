// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
  presetWind,
} from "unocss";

export default defineConfig({
  shortcuts: [
    // ...
  ],
  rules: [
    ["w-block", { width: "73.75rem", marginLeft: "auto", marginRight: "auto" }],
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: "#29AE8C",
        secondary: "#40CBA7",
        // dark: primaryColorDark,
      },
      gery: {
        DEFAULT: "#F9FAFC",
        dark: "rgba(255, 255, 255, 0.06)",
      },
      hovered: {
        bg: "rgb(243, 243, 245)",
      },
      article: {
        title: "#000",
        darkTitle: "#fff",
        secondary: "#666",
        main: "#333",
        placeholder: "#999",
      },
    },
    breakpoints: {
      xs: "475px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1600px",
      "2k": "2400px",
      "4k": "3600px",
    },
    screens: {
      xs: "475px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1600px",
      "2k": "2400px",
      "4k": "3600px",
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
    presetWind({
      darkMode: ['[data-theme="dark"]'],
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
