require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.API_PORT || 5000;
// Runtime uploads must stay outside React's watched `public` folder; otherwise
// every upload triggers a development-server page reload.
const UPLOAD_DIR = path.join(__dirname, "uploads");
const SEED_FILE = path.join(__dirname, "server-data", "store.json");
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";
let pool;

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(
  express.json({
    limit: "2mb",
    verify: (req, _res, buffer) => {
      req.rawBody = buffer;
    },
  }),
);
app.use("/uploads", express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) =>
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "-")}`,
    ),
});
const allowedMedia = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    allowedMedia.includes(file.mimetype)
      ? cb(null, true)
      : cb(
          new Error(
            "Only JPG, PNG, WebP, MP4, WebM, and MOV media is allowed.",
          ),
        ),
});
const requireAdmin = (req, res, next) => {
  try {
    req.admin = jwt.verify(
      req.headers.authorization?.replace("Bearer ", ""),
      JWT_SECRET,
    );
    next();
  } catch {
    res.status(401).json({ message: "Admin sign-in required." });
  }
};
const wrap = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
const parseJson = (value, fallback = []) => {
  try {
    return typeof value === "string"
      ? JSON.parse(value || "[]")
      : value || fallback;
  } catch {
    return fallback;
  }
};
const parseRoom = (room) => ({
  ...room,
  active: Boolean(room.active),
  price: Number(room.price),
  facilities: parseJson(room.facilities),
  images: parseJson(room.images),
});
const parseGallery = (item) => ({ ...item, active: Boolean(item.active) });

async function initializeDatabase() {
  const base = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
  const connection = await mysql.createConnection(base);
  const database = (process.env.DB_NAME || "peniel").replace(
    /[^a-zA-Z0-9_]/g,
    "",
  );
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  await connection.end();
  pool = mysql.createPool({
    ...base,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true,
  });
  await pool.query(
    `CREATE TABLE IF NOT EXISTS rooms (id VARCHAR(64) PRIMARY KEY, name VARCHAR(180) NOT NULL, description TEXT, size VARCHAR(30), maxPerson INT NOT NULL DEFAULT 1, price DECIMAL(10,2) NOT NULL DEFAULT 0, image TEXT, imageLg TEXT, facilities JSON, active BOOLEAN DEFAULT TRUE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  );
  const [imageColumns] = await pool.query(
    "SHOW COLUMNS FROM rooms LIKE 'images'",
  );
  if (!imageColumns.length)
    await pool.query(
      "ALTER TABLE rooms ADD COLUMN images JSON NULL AFTER imageLg",
    );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS gallery (id VARCHAR(64) PRIMARY KEY, url TEXT NOT NULL, title VARCHAR(180), category VARCHAR(80), active BOOLEAN DEFAULT TRUE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  );
  const [mediaTypeColumns] = await pool.query(
    "SHOW COLUMNS FROM gallery LIKE 'mediaType'",
  );
  if (!mediaTypeColumns.length)
    await pool.query(
      "ALTER TABLE gallery ADD COLUMN mediaType ENUM('image','video') NOT NULL DEFAULT 'image' AFTER category",
    );
  await pool.query(
    `CREATE TABLE IF NOT EXISTS bookings (id VARCHAR(64) PRIMARY KEY, names VARCHAR(180) NOT NULL, email VARCHAR(180) NOT NULL, checkIn DATETIME NOT NULL, checkOut DATETIME NOT NULL, roomId VARCHAR(64), type VARCHAR(180), adults INT DEFAULT 0, kids INT DEFAULT 0, price DECIMAL(10,2) DEFAULT 0, notes TEXT, status ENUM('pending','confirmed','checked-in','completed','cancelled') DEFAULT 'pending', createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
  );
  const bookingColumns = [
    [
      "paymentStatus",
      "ENUM('unpaid','pending','paid','failed','refunded') NOT NULL DEFAULT 'unpaid'",
    ],
    ["paymentAmount", "DECIMAL(10,2) NULL"],
    ["paymentReference", "VARCHAR(120) NULL"],
    ["flutterwaveTransactionId", "VARCHAR(120) NULL"],
    ["currency", "VARCHAR(10) NULL"],
    ["termsAcceptedAt", "DATETIME NULL"],
  ];
  for (const [column, definition] of bookingColumns) {
    const [found] = await pool.query(
      `SHOW COLUMNS FROM bookings LIKE '${column}'`,
    );
    if (!found.length)
      await pool.query(
        `ALTER TABLE bookings ADD COLUMN ${column} ${definition}`,
      );
  }
  await pool.query(
    `CREATE TABLE IF NOT EXISTS site_content (contentKey VARCHAR(100) PRIMARY KEY, contentValue TEXT)`,
  );

  const [[{ count }]] = await pool.query("SELECT COUNT(*) count FROM rooms");
  if (!count && fs.existsSync(SEED_FILE)) {
    const seed = JSON.parse(fs.readFileSync(SEED_FILE, "utf8"));
    for (const r of seed.rooms)
      await pool.execute(
        "INSERT INTO rooms (id,name,description,size,maxPerson,price,image,imageLg,facilities,active) VALUES (?,?,?,?,?,?,?,?,?,?)",
        [
          String(r.id),
          r.name,
          r.description,
          String(r.size),
          r.maxPerson,
          r.price,
          r.image,
          r.imageLg,
          JSON.stringify(r.facilities || []),
          r.active !== false,
        ],
      );
    for (const g of seed.gallery)
      await pool.execute(
        "INSERT IGNORE INTO gallery (id,url,title,category,active) VALUES (?,?,?,?,?)",
        [g.id, g.url, g.title, g.category, g.active !== false],
      );
    for (const [key, value] of Object.entries(seed.content))
      await pool.execute(
        "INSERT INTO site_content (contentKey,contentValue) VALUES (?,?) ON DUPLICATE KEY UPDATE contentValue=VALUES(contentValue)",
        [key, value],
      );
  }
  const defaults = {
    hotelName: "Peniel Beach Hotel",
    tagline: "Your hotel for vacation",
    aboutText:
      "A welcoming hotel on the shores of Lake Victoria, close to Entebbe International Airport. Enjoy comfortable rooms, fresh lake air, family activities, dining, and memorable events.",
    addressLine1: "Plot 110-120 Circular Road, Bugonga",
    addressLine2: "Opposite the old Airport, Entebbe",
    country: "Uganda",
    primaryPhone: "+256772485887",
    secondaryPhone: "+256750147892",
    whatsapp: "+256772485887",
    email: "penielbeachhotel@gmail.com",
    instagram: "https://www.instagram.com/peniel_beach_hotel_ebb/",
    facebook: "https://www.facebook.com",
    twitter: "https://x.com/PenielHotelEbbs",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8173409640895!2d32.4578450731043!3d0.040145464389186994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177d86c52afdeed7%3A0xf99d53c25a719bcc!2sPeniel%20Beach%20Hotel!5e0!3m2!1sen!2sug!4v1707709517160!5m2!1sen!2sug",
    currencySymbol: "$",
    currencyCode: "USD",
    paymentEnabled: "true",
    heroTitle: "Your hotel for vacation",
    heroButtonText: "See our rooms",
    cancellationPolicy:
      "Free cancellation is available until 48 hours before check-in. Cancellations made within 48 hours of check-in will be charged the first night. No-shows and cancellations after check-in are non-refundable. Approved refunds are returned to the original payment method, less any non-refundable payment processing charges permitted by law.",
    bookingTerms:
      "The lead guest must be at least 18 years old and present valid identification at check-in. Check-in and check-out times are set by the hotel. Room occupancy must not exceed the booked capacity. Guests are responsible for damage, loss, smoking penalties, and prohibited conduct. Special requests are subject to availability. The hotel may refuse or end a stay for illegal, unsafe, or disruptive conduct. Rates and taxes shown at checkout apply to this reservation.",
    galleryEyebrow: "Discover Peniel",
    galleryTitle: "A glimpse of your stay",
    galleryIntro:
      "From restful rooms to beach days and memorable meals, explore life at Peniel Beach Hotel.",
  };
  for (const [key, value] of Object.entries(defaults))
    await pool.execute(
      "INSERT IGNORE INTO site_content (contentKey,contentValue) VALUES (?,?)",
      [key, value],
    );
}

app.get("/", (_req, res) =>
  res.json({
    message: "Peniel Beach Hotel API is running.",
    database: "connected",
    website: process.env.CLIENT_URL || "http://localhost:3000",
    health: "/api/health",
  }),
);
app.get(
  "/api/health",
  wrap(async (_req, res) => {
    await pool.query("SELECT 1");
    res.json({ ok: true, database: "mysql" });
  }),
);
app.post("/api/admin/login", (req, res) => {
  if (
    req.body.username !== (process.env.ADMIN_USERNAME || "admin") ||
    req.body.password !== (process.env.ADMIN_PASSWORD || "peniel2026")
  )
    return res.status(401).json({ message: "Incorrect username or password." });
  res.json({
    token: jwt.sign(
      { username: req.body.username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "12h" },
    ),
  });
});

app.get(
  "/api/rooms",
  wrap(async (_req, res) => {
    const [rows] = await pool.query(
      "SELECT * FROM rooms WHERE active=TRUE ORDER BY createdAt",
    );
    res.json(rows.map(parseRoom));
  }),
);
app.get(
  "/api/gallery",
  wrap(async (_req, res) => {
    const [rows] = await pool.query(
      "SELECT * FROM gallery WHERE active=TRUE ORDER BY createdAt DESC",
    );
    res.json(rows.map(parseGallery));
  }),
);
app.get(
  "/api/content",
  wrap(async (_req, res) => {
    const [rows] = await pool.query(
      "SELECT contentKey,contentValue FROM site_content",
    );
    res.json(
      Object.fromEntries(rows.map((r) => [r.contentKey, r.contentValue])),
    );
  }),
);
app.post(
  "/api/bookings",
  wrap(async (req, res) => {
    const {
      names,
      email,
      checkIn,
      checkOut,
      roomId,
      adults = 0,
      kids = 0,
      notes = "",
      termsAccepted,
    } = req.body;
    if (!names || !email || !checkIn || !checkOut || !roomId)
      return res
        .status(400)
        .json({ message: "Name, email, dates, and room are required." });
    if (!termsAccepted)
      return res.status(400).json({
        message: "You must accept the booking and cancellation terms.",
      });
    if (new Date(checkOut) <= new Date(checkIn))
      return res
        .status(400)
        .json({ message: "Check-out must be after check-in." });
    const [[room]] = await pool.execute(
      "SELECT id,name,price FROM rooms WHERE id=? AND active=TRUE",
      [String(roomId)],
    );
    if (!room) return res.status(404).json({ message: "Room not found." });
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / 86400000,
    );
    const price = Number(room.price) * nights;
    const [contentRows] = await pool.query(
      "SELECT contentKey,contentValue FROM site_content WHERE contentKey IN ('currencyCode','hotelName','paymentEnabled')",
    );
    const content = Object.fromEntries(
      contentRows.map((x) => [x.contentKey, x.contentValue]),
    );
    const currency = content.currencyCode || "USD";
    const paymentEnabled = content.paymentEnabled !== "false";
    if (paymentEnabled && !process.env.FLW_SECRET_KEY)
      return res.status(503).json({
        message:
          "Online payment is not configured yet. Add the Flutterwave secret key.",
      });
    if (
      paymentEnabled &&
      process.env.NODE_ENV === "production" &&
      process.env.FLW_SECRET_KEY.startsWith("FLWSECK_TEST-")
    ) {
      return res.status(503).json({
        message:
          "Live payments require a Flutterwave live secret key. Test keys are disabled in production.",
      });
    }
    const paymentAmount = price;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const txRef = `PENIEL-${id}`;
    await pool.execute(
      "INSERT INTO bookings (id,names,email,checkIn,checkOut,roomId,type,adults,kids,price,notes,paymentStatus,paymentAmount,paymentReference,currency,termsAcceptedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())",
      [
        id,
        names,
        email,
        new Date(checkIn),
        new Date(checkOut),
        String(roomId),
        room.name,
        parseInt(adults) || 0,
        parseInt(kids) || 0,
        price,
        notes,
        paymentEnabled ? "pending" : "unpaid",
        paymentAmount,
        txRef,
        currency,
      ],
    );
    if (!paymentEnabled) {
      return res.status(201).json({
        id,
        paymentRequired: false,
        bookingTotal: price,
        currency,
        status: "pending",
      });
    }
    const flw = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: paymentAmount,
        currency,
        redirect_url: `${process.env.API_PUBLIC_URL || `http://localhost:${PORT}`}/api/payments/callback`,
        payment_options: "card",
        customer: { email, name: names },
        customizations: {
          title: content.hotelName || "Hotel reservation",
          description: `${room.name} - ${nights} night${nights === 1 ? "" : "s"}`,
        },
        meta: { bookingId: id },
      }),
    });
    const result = await flw.json();
    if (!flw.ok || !result.data?.link) {
      await pool.execute(
        "UPDATE bookings SET paymentStatus='failed' WHERE id=?",
        [id],
      );
      return res
        .status(502)
        .json({ message: result.message || "Unable to start card payment." });
    }
    res.status(201).json({
      id,
      paymentLink: result.data.link,
      amount: paymentAmount,
      bookingTotal: price,
      currency,
      paymentRequired: true,
    });
  }),
);

async function verifyFlutterwave(transactionId, txRef) {
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    { headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` } },
  );
  const result = await response.json();
  const [[booking]] = await pool.execute(
    "SELECT * FROM bookings WHERE paymentReference=?",
    [txRef],
  );
  if (!booking) return false;
  const valid =
    response.ok &&
    result.data?.status === "successful" &&
    result.data.tx_ref === txRef &&
    Number(result.data.amount) >=
      Number(booking.paymentAmount || booking.price) &&
    result.data.currency === booking.currency &&
    result.data.payment_type === "card";
  await pool.execute(
    "UPDATE bookings SET paymentStatus=?,status=?,flutterwaveTransactionId=? WHERE id=?",
    [
      valid ? "paid" : "failed",
      valid ? "confirmed" : "pending",
      String(transactionId),
      booking.id,
    ],
  );
  return valid;
}
app.get(
  "/api/payments/callback",
  wrap(async (req, res) => {
    const { status, tx_ref, transaction_id } = req.query;
    let paid = false;
    if (status === "successful" && transaction_id && tx_ref)
      paid = await verifyFlutterwave(transaction_id, tx_ref);
    res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-result?status=${paid ? "successful" : "failed"}&reference=${encodeURIComponent(tx_ref || "")}`,
    );
  }),
);
app.post(
  "/api/payments/webhook",
  wrap(async (req, res) => {
    const signature = req.headers["flutterwave-signature"];
    const expected = crypto
      .createHmac("sha256", process.env.FLW_SECRET_HASH || "")
      .update(req.rawBody || Buffer.from(""))
      .digest("base64");
    if (!process.env.FLW_SECRET_HASH || signature !== expected)
      return res.status(401).end();
    res.sendStatus(200);
    if (req.body?.data?.id && req.body?.data?.tx_ref)
      verifyFlutterwave(req.body.data.id, req.body.data.tx_ref).catch(
        console.error,
      );
  }),
);

app.get(
  "/api/admin/summary",
  requireAdmin,
  wrap(async (_req, res) => {
    const [[rooms], [gallery], [bookings], [pending], [revenue]] =
      await Promise.all([
        pool.query("SELECT COUNT(*) value FROM rooms"),
        pool.query("SELECT COUNT(*) value FROM gallery"),
        pool.query("SELECT COUNT(*) value FROM bookings"),
        pool.query(
          "SELECT COUNT(*) value FROM bookings WHERE status='pending'",
        ),
        pool.query(
          "SELECT COALESCE(SUM(price),0) value FROM bookings WHERE status NOT IN ('cancelled','pending')",
        ),
      ]);
    res.json({
      rooms: rooms[0].value,
      gallery: gallery[0].value,
      bookings: bookings[0].value,
      pending: pending[0].value,
      revenue: Number(revenue[0].value),
    });
  }),
);
app.get(
  "/api/admin/rooms",
  requireAdmin,
  wrap(async (_req, res) => {
    const [rows] = await pool.query("SELECT * FROM rooms ORDER BY createdAt");
    res.json(rows.map(parseRoom));
  }),
);
app.post(
  "/api/admin/rooms",
  requireAdmin,
  wrap(async (req, res) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const r = req.body;
    const images = r.images || [];
    const primary = r.image || images[0] || "";
    await pool.execute(
      "INSERT INTO rooms (id,name,description,size,maxPerson,price,image,imageLg,images,facilities,active) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        id,
        r.name,
        r.description,
        r.size,
        r.maxPerson,
        r.price,
        primary,
        r.imageLg || primary,
        JSON.stringify(images),
        JSON.stringify(r.facilities || []),
        r.active !== false,
      ],
    );
    res.status(201).json({ id, ...r, image: primary, images });
  }),
);
app.put(
  "/api/admin/rooms/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const r = req.body;
    const images = r.images || [];
    const primary = r.image || images[0] || "";
    const [result] = await pool.execute(
      "UPDATE rooms SET name=?,description=?,size=?,maxPerson=?,price=?,image=?,imageLg=?,images=?,facilities=?,active=? WHERE id=?",
      [
        r.name,
        r.description,
        r.size,
        r.maxPerson,
        r.price,
        primary,
        r.imageLg || primary,
        JSON.stringify(images),
        JSON.stringify(r.facilities || []),
        r.active !== false,
        req.params.id,
      ],
    );
    if (!result.affectedRows)
      return res.status(404).json({ message: "Room not found." });
    res.json({ id: req.params.id, ...r, image: primary, images });
  }),
);
app.delete(
  "/api/admin/rooms/:id",
  requireAdmin,
  wrap(async (req, res) => {
    await pool.execute("DELETE FROM rooms WHERE id=?", [req.params.id]);
    res.status(204).end();
  }),
);
app.get(
  "/api/admin/bookings",
  requireAdmin,
  wrap(async (_req, res) => {
    const [rows] = await pool.query(
      "SELECT * FROM bookings ORDER BY createdAt DESC",
    );
    res.json(rows.map((b) => ({ ...b, price: Number(b.price) })));
  }),
);
app.patch(
  "/api/admin/bookings/:id",
  requireAdmin,
  wrap(async (req, res) => {
    const allowed = [
      "pending",
      "confirmed",
      "checked-in",
      "completed",
      "cancelled",
    ];
    if (!allowed.includes(req.body.status))
      return res.status(400).json({ message: "Invalid booking status." });
    const [result] = await pool.execute(
      "UPDATE bookings SET status=? WHERE id=?",
      [req.body.status, req.params.id],
    );
    if (!result.affectedRows)
      return res.status(404).json({ message: "Booking not found." });
    res.json({ id: req.params.id, status: req.body.status });
  }),
);
app.post(
  "/api/admin/upload",
  requireAdmin,
  upload.single("media"),
  (req, res) =>
    req.file
      ? res.status(201).json({
          url: `/uploads/${req.file.filename}`,
          mediaType: req.file.mimetype.startsWith("video/") ? "video" : "image",
        })
      : res.status(400).json({ message: "Choose an image or video." }),
);
app.get(
  "/api/admin/gallery",
  requireAdmin,
  wrap(async (_req, res) => {
    const [rows] = await pool.query(
      "SELECT * FROM gallery ORDER BY createdAt DESC",
    );
    res.json(rows.map(parseGallery));
  }),
);
app.post(
  "/api/admin/gallery",
  requireAdmin,
  wrap(async (req, res) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await pool.execute(
      "INSERT INTO gallery (id,url,title,category,mediaType,active) VALUES (?,?,?,?,?,TRUE)",
      [
        id,
        req.body.url,
        req.body.title,
        req.body.category,
        req.body.mediaType === "video" ? "video" : "image",
      ],
    );
    res.status(201).json({ id, ...req.body, active: true });
  }),
);
app.delete(
  "/api/admin/gallery/:id",
  requireAdmin,
  wrap(async (req, res) => {
    await pool.execute("DELETE FROM gallery WHERE id=?", [req.params.id]);
    res.status(204).end();
  }),
);
app.put(
  "/api/admin/content",
  requireAdmin,
  wrap(async (req, res) => {
    for (const [key, value] of Object.entries(req.body))
      await pool.execute(
        "INSERT INTO site_content (contentKey,contentValue) VALUES (?,?) ON DUPLICATE KEY UPDATE contentValue=VALUES(contentValue)",
        [key, value],
      );
    res.json(req.body);
  }),
);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message:
      process.env.NODE_ENV === "production" ? "Server error." : error.message,
  });
});
initializeDatabase()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Peniel API running on http://localhost:${PORT} with MySQL`),
    ),
  )
  .catch((error) => {
    console.error("Database startup failed:", error.message);
    process.exit(1);
  });
