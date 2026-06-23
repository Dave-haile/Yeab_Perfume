import { v4 as uuidv4 } from "uuid";
import db from "../db/connection";
import {
  Perfume,
  PerfumeRow,
  CreatePerfumeDTO,
  UpdatePerfumeDTO,
} from "../types";

/**
 * Converts a raw SQLite row (snake_case, JSON strings)
 * into the clean Perfume object the frontend expects (camelCase, parsed objects).
 *
 * This function is the bridge between "how SQLite stores it" and
 * "how the frontend uses it". It runs on every row that comes out of the DB.
 */
function rowToPerfume(row: PerfumeRow): Perfume {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    brand: row.brand,
    price: row.price,
    gender: row.gender,
    category: row.category,
    description: row.description,
    rating: row.rating,
    mainImage: row.main_image,
    galleryImages: JSON.parse(row.gallery_images),
    accords: JSON.parse(row.accords),
    fragranceProfile: JSON.parse(row.fragrance_profile),
    dayNight: row.day_night,
    seasons: JSON.parse(row.seasons),
    notes: JSON.parse(row.notes),
    inStock: row.in_stock === 1, // convert 0/1 back to boolean
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Queries ────────────────────────────────────────────────────────────────

/**
 * Get all perfumes. Optionally filter by gender, category, or dayNight.
 * Results are ordered newest first.
 */
export function getAllPerfumes(filters?: {
  gender?: string;
  category?: string;
  dayNight?: string;
  inStock?: boolean;
}): Perfume[] {
  let query = "SELECT * FROM perfumes WHERE 1=1";
  const params: (string | number)[] = [];

  if (filters?.gender) {
    query += " AND gender = ?";
    params.push(filters.gender);
  }
  if (filters?.category) {
    query += " AND category = ?";
    params.push(filters.category);
  }
  if (filters?.dayNight) {
    query += " AND day_night = ?";
    params.push(filters.dayNight);
  }
  if (filters?.inStock !== undefined) {
    query += " AND in_stock = ?";
    params.push(filters.inStock ? 1 : 0);
  }

  query += " ORDER BY created_at DESC";

  const rows = db.prepare(query).all(...params) as PerfumeRow[];
  return rows.map(rowToPerfume);
}

/**
 * Get a single perfume by its UUID.
 * Returns null if not found (controller will send a 404).
 */
export function getPerfumeById(id: string): Perfume | null {
  const row = db.prepare("SELECT * FROM perfumes WHERE id = ?").get(id) as
    | PerfumeRow
    | undefined;

  return row ? rowToPerfume(row) : null;
}

/**
 * Create a new perfume. Generates a UUID and timestamps automatically.
 * Returns the newly created perfume.
 */
export function createPerfume(data: CreatePerfumeDTO): Perfume {
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO perfumes (
      id, name, code, brand, price, gender, category, description,
      rating, main_image, gallery_images, accords, fragrance_profile,
      day_night, seasons, notes, in_stock, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `,
  ).run(
    id,
    data.name,
    data.code,
    data.brand,
    data.price,
    data.gender,
    data.category,
    data.description,
    data.rating,
    data.mainImage,
    JSON.stringify(data.galleryImages), // serialize arrays/objects to JSON
    JSON.stringify(data.accords),
    JSON.stringify(data.fragranceProfile),
    data.dayNight,
    JSON.stringify(data.seasons),
    JSON.stringify(data.notes),
    data.inStock ? 1 : 0, // serialize boolean to 0/1
    now,
    now,
  );

  // Fetch and return the full created record (rather than re-constructing it)
  return getPerfumeById(id)!;
}

/**
 * Update an existing perfume. Only updates fields that are actually sent
 * (PATCH semantics — not a full replacement).
 * Returns the updated perfume, or null if not found.
 */
export function updatePerfume(
  id: string,
  data: UpdatePerfumeDTO,
): Perfume | null {
  const existing = getPerfumeById(id);
  if (!existing) return null;

  // Build SET clause dynamically from whatever fields were sent
  const fields: string[] = [];
  const params: (string | number)[] = [];

  const fieldMap: Record<string, () => void> = {
    name: () => {
      fields.push("name = ?");
      params.push(data.name!);
    },
    code: () => {
      fields.push("code = ?");
      params.push(data.code!);
    },
    brand: () => {
      fields.push("brand = ?");
      params.push(data.brand!);
    },
    price: () => {
      fields.push("price = ?");
      params.push(data.price!);
    },
    gender: () => {
      fields.push("gender = ?");
      params.push(data.gender!);
    },
    category: () => {
      fields.push("category = ?");
      params.push(data.category!);
    },
    description: () => {
      fields.push("description = ?");
      params.push(data.description!);
    },
    rating: () => {
      fields.push("rating = ?");
      params.push(data.rating!);
    },
    mainImage: () => {
      fields.push("main_image = ?");
      params.push(data.mainImage!);
    },
    galleryImages: () => {
      fields.push("gallery_images = ?");
      params.push(JSON.stringify(data.galleryImages!));
    },
    accords: () => {
      fields.push("accords = ?");
      params.push(JSON.stringify(data.accords!));
    },
    fragranceProfile: () => {
      fields.push("fragrance_profile = ?");
      params.push(JSON.stringify(data.fragranceProfile!));
    },
    dayNight: () => {
      fields.push("day_night = ?");
      params.push(data.dayNight!);
    },
    seasons: () => {
      fields.push("seasons = ?");
      params.push(JSON.stringify(data.seasons!));
    },
    notes: () => {
      fields.push("notes = ?");
      params.push(JSON.stringify(data.notes!));
    },
    inStock: () => {
      fields.push("in_stock = ?");
      params.push(data.inStock ? 1 : 0);
    },
  };

  // Only add to SET clause if the field was actually provided in the request
  for (const key of Object.keys(data) as (keyof UpdatePerfumeDTO)[]) {
    if (key in fieldMap && data[key] !== undefined) {
      fieldMap[key]();
    }
  }

  if (fields.length === 0) return existing; // nothing to update

  // Always bump updated_at
  fields.push("updated_at = ?");
  params.push(new Date().toISOString());
  params.push(id); // for the WHERE clause

  db.prepare(`UPDATE perfumes SET ${fields.join(", ")} WHERE id = ?`).run(
    ...params,
  );

  return getPerfumeById(id)!;
}

/**
 * Delete a perfume by ID.
 * Returns true if a row was deleted, false if the ID didn't exist.
 */
export function deletePerfume(id: string): boolean {
  const result = db.prepare("DELETE FROM perfumes WHERE id = ?").run(id);
  return result.changes > 0;
}
