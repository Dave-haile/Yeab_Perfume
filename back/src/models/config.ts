import db from "../db/connection";

/**
 * Simple config table to store key-value pairs.
 * Used for:
 *  - accord colors: key = "accord_colors", value = JSON string
 *  - logo URL:     key = "logo", value = URL string or empty
 */

const CONFIG_TABLE = "app_config";

export function ensureConfigTable() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${CONFIG_TABLE} (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    )
  `);

  // Seed default values if they don't exist
  const defaultColors = {
    Woody: "#8d6e63",
    Spicy: "#d84315",
    Amber: "#ff8f00",
    Citrus: "#fbc02d",
    Floral: "#ec407a",
    Powdery: "#ce93d8",
    Sweet: "#f06292",
    Aquatic: "#29b6f6",
    Leather: "#5d4037",
    Chocolate: "#4e342e",
    Musk: "#b0bec5",
    Aldehydic: "#f59e0b",
    Fresh: "#26c6da",
    Fruity: "#ff5252",
    Aromatic: "#009688",
    "Fresh Spicy": "#00acc1",
    Animalic: "#4e4d4a",
    Herbal: "#43a047",
    "Warm Spicy": "#ff6f00",
    Bozy: "#4e342e",
    Oud: "#6B2737",
    Rose: "#C9A876",
    "White Floral": "#f8bbd0",
    Creamy: "#f5f5f5",
    Gourmand: "#795548",
    Tobacco: "#5d4037",
    Green: "#43a047",
    Smoky: "#120F0E",
    Musky: "#e0e0e0",
  };

  const insert = db.prepare(
    `INSERT OR IGNORE INTO ${CONFIG_TABLE} (key, value) VALUES (?, ?)`,
  );

  insert.run("accord_colors", JSON.stringify(defaultColors));
  insert.run("logo", "");
}

export function getConfig(key: string): string | null {
  const row = db
    .prepare(`SELECT value FROM ${CONFIG_TABLE} WHERE key = ?`)
    .get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setConfig(key: string, value: string): void {
  db.prepare(
    `INSERT OR REPLACE INTO ${CONFIG_TABLE} (key, value) VALUES (?, ?)`,
  ).run(key, value);
}
