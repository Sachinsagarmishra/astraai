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
var import_express2 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/routes/index.ts
var import_express = require("express");

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
var import_path = __toESM(require("path"), 1);
var dbPath = import_path.default.resolve(process.cwd(), "database.sqlite");
var db = new import_better_sqlite3.default(dbPath);
db.pragma("foreign_keys = ON");
var db_default = db;

// server/models/Reading.ts
var ReadingModel = class {
  static create(data) {
    const stmt = db_default.prepare("INSERT INTO palm_readings (reading_text, user_id) VALUES (?, ?)");
    const info = stmt.run(data.reading_text, data.user_id || null);
    return info.lastInsertRowid;
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
      ReadingModel.create({ reading_text: reading });
      res.json({ reading });
    } catch (error) {
      console.error("Palm reading error:", error);
      res.status(500).json({ error: "Failed to read palm. Please try another image." });
    }
  }
};

// server/routes/index.ts
var router = (0, import_express.Router)();
router.post("/palm-reading", PalmReadingController.readPalm);
var routes_default = router;

// server.ts
async function startServer() {
  const app = (0, import_express2.default)();
  const PORT = 3e3;
  app.use(import_express2.default.json({ limit: "50mb" }));
  app.use("/api", routes_default);
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express2.default.static(distPath));
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
