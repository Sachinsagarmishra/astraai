var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express3 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/routes/index.ts
var import_express2 = require("express");

// server/services/AiService.ts
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
var AiService = class {
  static async getPalmReading(base64Data) {
    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    };
    const textPart = {
      text: "Analyze this palm image based on Vedic astrology and palmistry principles. Please provide a respectful, positive, but detailed reading covering Life Line, Heart Line, Head Line, and Fate Line. Offer some insights about the user's future, career, and emotional well-being. Make it engaging, mystical yet modern, and format the output beautifully using Markdown."
    };
    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] }
    });
    if (!aiResponse.text) {
      throw new Error("No response from AI");
    }
    return aiResponse.text;
  }
};

// server/db/index.ts
var import_better_sqlite3 = __toESM(require("better-sqlite3"), 1);
var import_promise = __toESM(require("mysql2/promise"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv2 = __toESM(require("dotenv"), 1);
import_dotenv2.default.config();
var dbType = "sqlite";
var sqliteDb = null;
var mysqlPool = null;
var isMysqlConfigured = process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME;
if (isMysqlConfigured) {
  dbType = "mysql";
  console.log("Database configuration detected. Using MySQL connection pool.");
  mysqlPool = import_promise.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  dbType = "sqlite";
  console.log("No MySQL configuration detected. Falling back to local SQLite.");
  const dbPath = import_path.default.resolve(process.cwd(), "database.sqlite");
  sqliteDb = new import_better_sqlite3.default(dbPath);
  sqliteDb.pragma("foreign_keys = ON");
}
async function execute(sql, params = []) {
  if (dbType === "mysql") {
    const [result] = await mysqlPool.execute(sql, params);
    if (result && typeof result === "object" && "insertId" in result) {
      return {
        insertId: result.insertId,
        affectedRows: result.affectedRows
      };
    }
    return result;
  } else {
    const normalizedSql = sql.trim().toUpperCase();
    if (normalizedSql.startsWith("SELECT") || normalizedSql.startsWith("PRAGMA")) {
      const stmt = sqliteDb.prepare(sql);
      return stmt.all(...params);
    } else {
      const stmt = sqliteDb.prepare(sql);
      const result = stmt.run(...params);
      return {
        insertId: result.lastInsertRowid,
        affectedRows: result.changes
      };
    }
  }
}
async function query(sql, params = []) {
  const result = await execute(sql, params);
  if (dbType === "mysql") {
    return Array.isArray(result) ? result : [];
  } else {
    return Array.isArray(result) ? result : [];
  }
}

// server/models/Reading.ts
var ReadingModel = class {
  static async create(data) {
    const result = await execute(
      "INSERT INTO palm_readings (reading_text, user_id) VALUES (?, ?)",
      [data.reading_text, data.user_id || null]
    );
    return result.insertId;
  }
};

// server/controllers/PalmReadingController.ts
var PalmReadingController = class {
  static async readPalm(req, res) {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        res.status(400).json({ error: "Image data is required" });
        return;
      }
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const reading = await AiService.getPalmReading(base64Data);
      await ReadingModel.create({ reading_text: reading });
      res.json({ reading });
    } catch (error) {
      console.error("Palm reading error:", error);
      res.status(500).json({ error: "Failed to read palm. Please try another image." });
    }
  }
};

// server/routes/admin.ts
var import_express = require("express");
var router = (0, import_express.Router)();
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "Mercedes@001";
  if (username === adminUsername && password === adminPassword) {
    res.json({ token: "admin-session-token-astrai-2026" });
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});
router.get("/stats", async (req, res) => {
  try {
    const usersCount = await query("SELECT COUNT(*) as count FROM users");
    const readingsCount = await query("SELECT COUNT(*) as count FROM palm_readings");
    const subsCount = await query("SELECT COUNT(*) as count FROM subscriptions");
    const recentUsers = await query("SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 10");
    const recentReadings = await query(
      "SELECT id, user_id, created_at, reading_text FROM palm_readings ORDER BY created_at DESC LIMIT 10"
    );
    const formattedReadings = recentReadings.map((r) => ({
      id: r.id,
      user_id: r.user_id,
      created_at: r.created_at,
      snippet: r.reading_text ? r.reading_text.substring(0, 100) + "..." : ""
    }));
    res.json({
      totalUsers: usersCount[0]?.count || 0,
      totalPalmReadings: readingsCount[0]?.count || 0,
      totalSubscriptions: subsCount[0]?.count || 0,
      recentUsers,
      recentReadings: formattedReadings
    });
  } catch (err) {
    console.error("Failed to fetch stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});
router.get("/config", async (req, res) => {
  try {
    const config = await query("SELECT * FROM app_config ORDER BY id DESC LIMIT 1");
    res.json(config[0] || {});
  } catch (err) {
    console.error("Failed to fetch app config:", err);
    res.status(500).json({ error: "Failed to fetch app config" });
  }
});
router.post("/config", async (req, res) => {
  const {
    min_app_version,
    current_app_version,
    force_update,
    update_url,
    announcement_title,
    announcement_message,
    show_announcement,
    maintenance_mode
  } = req.body;
  try {
    const rows = await query("SELECT id FROM app_config LIMIT 1");
    if (rows.length > 0) {
      const id = rows[0].id;
      await execute(
        `UPDATE app_config SET 
          min_app_version = ?, 
          current_app_version = ?, 
          force_update = ?, 
          update_url = ?, 
          announcement_title = ?, 
          announcement_message = ?, 
          show_announcement = ?, 
          maintenance_mode = ?
         WHERE id = ?`,
        [
          min_app_version || "1.0.0",
          current_app_version || "1.0.0",
          force_update ? 1 : 0,
          update_url || "",
          announcement_title || "",
          announcement_message || "",
          show_announcement ? 1 : 0,
          maintenance_mode ? 1 : 0,
          id
        ]
      );
    } else {
      await execute(
        `INSERT INTO app_config (
          min_app_version, current_app_version, force_update, update_url, 
          announcement_title, announcement_message, show_announcement, maintenance_mode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          min_app_version || "1.0.0",
          current_app_version || "1.0.0",
          force_update ? 1 : 0,
          update_url || "",
          announcement_title || "",
          announcement_message || "",
          show_announcement ? 1 : 0,
          maintenance_mode ? 1 : 0
        ]
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update app config:", err);
    res.status(500).json({ error: "Failed to update app config" });
  }
});
router.get("/announcements", async (req, res) => {
  try {
    const list = await query("SELECT * FROM announcements ORDER BY id DESC");
    res.json(list);
  } catch (err) {
    console.error("Failed to load announcements:", err);
    res.status(500).json({ error: "Failed to load announcements" });
  }
});
router.post("/announcements", async (req, res) => {
  const { title, message, image_url, is_active } = req.body;
  try {
    if (is_active) {
      await execute("UPDATE announcements SET is_active = 0");
    }
    const result = await execute(
      "INSERT INTO announcements (title, message, image_url, is_active) VALUES (?, ?, ?, ?)",
      [title || "", message || "", image_url || null, is_active ? 1 : 0]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error("Failed to create announcement:", err);
    res.status(500).json({ error: "Failed to create announcement" });
  }
});
router.put("/announcements/:id", async (req, res) => {
  const { id } = req.params;
  const { title, message, image_url, is_active } = req.body;
  try {
    if (is_active) {
      await execute("UPDATE announcements SET is_active = 0");
    }
    await execute(
      "UPDATE announcements SET title = ?, message = ?, image_url = ?, is_active = ? WHERE id = ?",
      [title || "", message || "", image_url || null, is_active ? 1 : 0, id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to update announcement:", err);
    res.status(500).json({ error: "Failed to update announcement" });
  }
});
router.delete("/announcements/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await execute("DELETE FROM announcements WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to delete announcement:", err);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
});
router.post("/announcements/:id/activate", async (req, res) => {
  const { id } = req.params;
  try {
    await execute("UPDATE announcements SET is_active = 0");
    await execute("UPDATE announcements SET is_active = 1 WHERE id = ?", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Failed to activate announcement:", err);
    res.status(500).json({ error: "Failed to activate announcement" });
  }
});
var admin_default = router;

// server/routes/index.ts
var router2 = (0, import_express2.Router)();
router2.post("/palm-reading", PalmReadingController.readPalm);
router2.get("/app-config", async (req, res) => {
  try {
    const config = await query("SELECT * FROM app_config ORDER BY id DESC LIMIT 1");
    const activeAnnouncement = await query("SELECT * FROM announcements WHERE is_active = 1 ORDER BY id DESC LIMIT 1");
    const configData = config[0] || {
      min_app_version: "1.0.0",
      current_app_version: "1.0.0",
      force_update: 0,
      update_url: "https://play.google.com/store",
      maintenance_mode: 0
    };
    res.json({
      ...configData,
      announcement_title: activeAnnouncement[0]?.title || "",
      announcement_message: activeAnnouncement[0]?.message || "",
      announcement_image: activeAnnouncement[0]?.image_url || "",
      show_announcement: activeAnnouncement.length > 0 ? 1 : 0
    });
  } catch (err) {
    console.error("Failed to load app config:", err);
    res.status(500).json({ error: "Failed to load app config" });
  }
});
router2.use("/admin", admin_default);
var routes_default = router2;

// server.ts
async function startServer() {
  const app = (0, import_express3.default)();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  app.use(import_express3.default.json({ limit: "50mb" }));
  app.use("/api", routes_default);
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express3.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
