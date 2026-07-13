require("dotenv").config({ quiet: true });
const crypto = require("crypto");
const path = require("path");
const mysql = require("mysql2/promise");
const {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const uploadOnly = process.argv.includes("--upload-only");
const required = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "R2_ENDPOINT",
  "R2_BUCKET_NAME",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
];
for (const name of required)
  if (!process.env[name]) throw new Error(`${name} is required.`);
if (!uploadOnly && !process.env.R2_PUBLIC_URL)
  throw new Error("R2_PUBLIC_URL is required when updating database URLs.");

const baseUrl = (process.env.CLIENT_URL || "https://www.penielbeachotel.com")
  .split(",")[0]
  .replace(/\/$/, "");
const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
  connectionLimit: 2,
});
const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const parseList = (value) => {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value || "[]") : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
const absoluteUrl = (source) =>
  /^https?:\/\//i.test(source) ? source : `${baseUrl}/${String(source).replace(/^\//, "")}`;
const extensionFor = (source, contentType) => {
  const pathname = new URL(absoluteUrl(source)).pathname;
  const extension = path.extname(pathname).toLowerCase();
  if (/^\.[a-z0-9]{2,5}$/.test(extension)) return extension;
  const extensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
  };
  return extensions[contentType] || ".bin";
};
const publicUrl = (key) =>
  `${publicBase}/${key.split("/").map(encodeURIComponent).join("/")}`;

const main = async () => {
  const [[rooms], [gallery], [contentRows]] = await Promise.all([
    pool.query("SELECT id,image,imageLg,images FROM rooms"),
    pool.query("SELECT id,url FROM gallery"),
    pool.query(
      "SELECT contentKey,contentValue FROM site_content WHERE contentKey IN ('homeHeroImages','kidsBackgroundImages','kidsActivities','contactBackgroundImage')",
    ),
  ]);
  const content = Object.fromEntries(
    contentRows.map((item) => [item.contentKey, item.contentValue]),
  );
  const sources = new Set();
  const add = (value) => {
    if (typeof value === "string" && value.trim()) sources.add(value.trim());
  };
  rooms.forEach((room) => {
    add(room.image);
    add(room.imageLg);
    parseList(room.images).forEach(add);
  });
  gallery.forEach((item) => add(item.url));
  parseList(content.homeHeroImages).forEach(add);
  parseList(content.kidsBackgroundImages).forEach(add);
  parseList(content.kidsActivities).forEach((item) => add(item.imageUrl));
  add(content.contactBackgroundImage);

  const mapping = new Map();
  let uploaded = 0;
  let reused = 0;
  let failed = 0;
  let bytes = 0;
  for (const source of sources) {
    try {
      const sourceUrl = absoluteUrl(source);
      const hash = crypto.createHash("sha256").update(sourceUrl).digest("hex").slice(0, 32);
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error(`Download returned ${response.status}`);
      const contentType = (response.headers.get("content-type") || "application/octet-stream")
        .split(";")[0];
      const body = Buffer.from(await response.arrayBuffer());
      const key = `migrated-media/${hash}${extensionFor(source, contentType)}`;
      try {
        await r2.send(
          new HeadObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }),
        );
        reused += 1;
      } catch (error) {
        if (error.$metadata?.httpStatusCode !== 404 && error.name !== "NotFound")
          throw error;
        await r2.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentType: contentType,
            CacheControl: "public, max-age=31536000, immutable",
          }),
        );
        uploaded += 1;
        bytes += body.length;
      }
      mapping.set(source, key);
      process.stdout.write(`Transferred ${mapping.size}/${sources.size}\r`);
    } catch (error) {
      failed += 1;
      console.error(`\nFailed to transfer ${source}: ${error.message}`);
    }
  }
  process.stdout.write("\n");
  if (failed) throw new Error(`${failed} media files could not be transferred.`);

  if (!uploadOnly) {
    const replace = (source) => (source && mapping.has(source) ? publicUrl(mapping.get(source)) : source);
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const room of rooms)
        await connection.execute(
          "UPDATE rooms SET image=?,imageLg=?,images=? WHERE id=?",
          [
            replace(room.image),
            replace(room.imageLg),
            JSON.stringify(parseList(room.images).map(replace)),
            room.id,
          ],
        );
      for (const item of gallery)
        await connection.execute("UPDATE gallery SET url=? WHERE id=?", [
          replace(item.url),
          item.id,
        ]);
      const updates = {
        homeHeroImages: JSON.stringify(
          parseList(content.homeHeroImages).map(replace),
        ),
        kidsBackgroundImages: JSON.stringify(
          parseList(content.kidsBackgroundImages).map(replace),
        ),
        kidsActivities: JSON.stringify(
          parseList(content.kidsActivities).map((item) => ({
            ...item,
            imageUrl: replace(item.imageUrl),
          })),
        ),
        contactBackgroundImage: replace(content.contactBackgroundImage || ""),
      };
      for (const [key, value] of Object.entries(updates))
        await connection.execute(
          "INSERT INTO site_content (contentKey,contentValue) VALUES (?,?) ON DUPLICATE KEY UPDATE contentValue=VALUES(contentValue)",
          [key, value],
        );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  console.log(
    JSON.stringify({
      discovered: sources.size,
      uploaded,
      reused,
      failed,
      uploadedBytes: bytes,
      databaseUpdated: !uploadOnly,
    }),
  );
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
