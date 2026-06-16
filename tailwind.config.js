export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gridlock: {
          void: "#050816",
          panel: "rgba(10,15,30,0.65)",
          cyan: "#00E5FF",
          amber: "#F59E0B",
          red: "#EF4444",
          green: "#22C55E",
        },
      },
      fontFamily: {
        command: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "var(--shadow)",
        danger: "var(--shadow)",
      },
      backgroundImage: {
        "radial-command": "none",
      },
    },
  },
  plugins: [],
};