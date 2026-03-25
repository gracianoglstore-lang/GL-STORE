import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database
const db = new Database("chat.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    userName TEXT,
    lastUpdate INTEGER,
    offline INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chatId TEXT,
    text TEXT,
    sender TEXT,
    timestamp TEXT,
    FOREIGN KEY(chatId) REFERENCES chats(id)
  );
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT,
    description TEXT,
    image TEXT,
    videoUrl TEXT,
    featured INTEGER DEFAULT 0,
    platform TEXT,
    version TEXT,
    requirements TEXT,
    androidVersion TEXT,
    ramRequired TEXT,
    fileSize TEXT,
    downloadUrl TEXT,
    rating REAL DEFAULT 5.0,
    reviewsCount INTEGER DEFAULT 0,
    brand TEXT DEFAULT 'Site Brand'
  );

  -- Add columns if they don't exist (for existing databases)
  PRAGMA table_info(products);
`);

try {
  db.exec("ALTER TABLE products ADD COLUMN androidVersion TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE products ADD COLUMN ramRequired TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE products ADD COLUMN fileSize TEXT");
} catch (e) {}
try {
  db.exec("ALTER TABLE products ADD COLUMN downloadUrl TEXT");
} catch (e) {}

const getActiveChats = () => {
  const chats = db.prepare("SELECT * FROM chats ORDER BY lastUpdate DESC").all();
  return chats.map(chat => ({
    ...chat,
    offline: !!chat.offline,
    messages: db.prepare("SELECT * FROM messages WHERE chatId = ? ORDER BY id ASC").all(chat.id)
  }));
};

async function startServer() {
  const app = express();
  
  // Enable CORS for all origins
  app.use(cors());
  
  // Logging middleware for API requests
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
  
  app.use(express.json({ limit: '50mb' }));
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Product API Routes
  app.get("/api/products", (req, res) => {
    try {
      const products = db.prepare("SELECT * FROM products").all();
      res.json(products.map(p => ({ ...p, featured: !!p.featured })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", (req, res) => {
    try {
      const p = req.body;
      const id = p.id || Math.random().toString(36).substr(2, 9);
      db.prepare(`
        INSERT OR REPLACE INTO products (id, name, price, category, description, image, videoUrl, featured, platform, version, requirements, androidVersion, ramRequired, fileSize, downloadUrl, rating, reviewsCount, brand)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, p.name, p.price, p.category, p.description, p.image, p.videoUrl, 
        p.featured ? 1 : 0, p.platform, p.version, p.requirements, p.androidVersion, p.ramRequired,
        p.fileSize, p.downloadUrl,
        p.rating || 5.0, p.reviewsCount || 0, p.brand || 'Site Brand'
      );
      res.json({ id, ...p });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", (req, res) => {
    try {
      const { id } = req.params;
      const p = req.body;
      db.prepare(`
        UPDATE products SET 
          name = ?, price = ?, category = ?, description = ?, image = ?, 
          videoUrl = ?, featured = ?, platform = ?, version = ?, requirements = ?,
          androidVersion = ?, ramRequired = ?, fileSize = ?, downloadUrl = ?
        WHERE id = ?
      `).run(
        p.name, p.price, p.category, p.description, p.image, 
        p.videoUrl, p.featured ? 1 : 0, p.platform, p.version, p.requirements, 
        p.androidVersion, p.ramRequired, p.fileSize, p.downloadUrl, id
      );
      res.json({ id, ...p });
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", (req, res) => {
    try {
      const { id } = req.params;
      db.prepare("DELETE FROM products WHERE id = ?").run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-admin", () => {
      socket.join("admin-room");
      console.log("Admin joined");
      socket.emit("active-chats", getActiveChats());
    });

    socket.on("join-user", (userData) => {
      const existingChat = db.prepare("SELECT * FROM chats WHERE id = ?").get(socket.id);
      
      if (!existingChat) {
        db.prepare("INSERT INTO chats (id, userName, lastUpdate, offline) VALUES (?, ?, ?, ?)")
          .run(socket.id, userData.name || "Cliente", Date.now(), 0);
      } else {
        db.prepare("UPDATE chats SET offline = 0, lastUpdate = ? WHERE id = ?")
          .run(Date.now(), socket.id);
      }

      socket.join(socket.id);
      const chat = getActiveChats().find(c => c.id === socket.id);
      io.to("admin-room").emit("new-chat", chat);
    });

    socket.on("send-message", (data) => {
      const { roomId, message, sender } = data;
      
      const chat = db.prepare("SELECT * FROM chats WHERE id = ?").get(roomId);
      if (chat) {
        const timestamp = new Date().toISOString();
        const info = db.prepare("INSERT INTO messages (chatId, text, sender, timestamp) VALUES (?, ?, ?, ?)")
          .run(roomId, message, sender, timestamp);
        
        db.prepare("UPDATE chats SET lastUpdate = ? WHERE id = ?").run(Date.now(), roomId);
        
        const msgObj = {
          id: info.lastInsertRowid,
          text: message,
          sender,
          timestamp
        };
        
        io.to(roomId).emit("receive-message", msgObj);
        
        if (sender !== "admin") {
          const updatedChat = getActiveChats().find(c => c.id === roomId);
          io.to("admin-room").emit("chat-updated", updatedChat);
        }
      }
    });

    socket.on("admin-join-chat", (roomId) => {
      socket.join(roomId);
      console.log(`Admin joined chat room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const chat = db.prepare("SELECT * FROM chats WHERE id = ?").get(socket.id);
      if (chat) {
        db.prepare("UPDATE chats SET offline = 1 WHERE id = ?").run(socket.id);
        const updatedChat = getActiveChats().find(c => c.id === socket.id);
        io.to("admin-room").emit("chat-updated", updatedChat);
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
