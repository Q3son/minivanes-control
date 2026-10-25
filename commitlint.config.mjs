/** Conventional Commits: https://www.conventionalcommits.org/es/v1.0.0/ */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      1,
      "always",
      [
        "app",
        "ui",
        "db",
        "dominio",
        "llantas",
        "finanzas",
        "alertas",
        "auth",
        "ci",
        "deps",
        "docs",
      ],
    ],
    "subject-case": [0],
  },
};

export default config;
