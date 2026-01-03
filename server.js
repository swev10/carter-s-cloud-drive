import { createServer } from 'http';
import { join, dirname } from 'path';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync, writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const UPLOADS_DIR = join(process.cwd(), "uploads");
const META_FILE = join(process.cwd(), "data.json");
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    storageLimit: { type: Number, default: 500 * 1024 * 1024 * 1024 } // 500GB
});

const CarterUser = mongoose.model('CarterUser', userSchema);

// Seed Users
const seedUsers = async () => {
    const users = [
        { username: "carte1", password: "HelloAiden@273!", role: "admin" },
        { username: "jordan05", password: "HelloJordan!23@@$%", role: "member" }
    ];

    for (const u of users) {
        const exists = await CarterUser.findOne({ username: u.username });
        if (!exists) {
            const hashedPassword = await bcrypt.hash(u.password, 10);
            await CarterUser.create({ ...u, password: hashedPassword });
            console.log(`Seeded user: ${u.username}`);
        }
    }
};
seedUsers();

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR);
}

// Initial Metadata
let metadata = { folders: [], files: [] };
if (existsSync(META_FILE)) {
    try {
        metadata = JSON.parse(readFileSync(META_FILE, "utf-8"));
        if (!metadata.files) metadata.files = [];
        if (!metadata.folders) metadata.folders = [];
    } catch (e) {
        console.error("Error reading metadata", e);
    }
} else {
    writeFileSync(META_FILE, JSON.stringify(metadata));
}

const saveMetadata = () => {
    writeFileSync(META_FILE, JSON.stringify(metadata, null, 2));
};

const server = createServer(async (req, res) => {
    // Log every request
    console.log(`[${req.method}] ${req.url}`);
    console.log(`Origin: ${req.headers.origin}`);

    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    const sendJSON = (data, status = 200) => {
        res.writeHead(status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    };

    const readBody = () => new Promise((resolve, reject) => {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
        req.on("error", reject);
    });

    try {
        // API: Login
        if (path === "/api/login" && req.method === "POST") {
            const body = await readBody();
            const { username, password } = body;

            const user = await CarterUser.findOne({ username });
            if (user && await bcrypt.compare(password, user.password)) {
                sendJSON({
                    success: true,
                    user: {
                        username: user.username,
                        role: user.role,
                        storageLimit: user.storageLimit
                    }
                });
            } else {
                sendJSON({ success: false, error: "Invalid username or password" }, 401);
            }
            return;
        }

        // API: List Files
        if (path === "/api/files" && req.method === "GET") {
            // Filter out files that don't exist on disk anymore
            metadata.files = metadata.files.filter(f => existsSync(join(UPLOADS_DIR, f.id)));
            saveMetadata();

            sendJSON({
                files: metadata.files,
                folders: metadata.folders
            });
            return;
        }

        // API: Upload File (JSON Body with Base64)
        if (path === "/api/upload" && req.method === "POST") {
            // Increase limit? default node http has no limit on body size, just memory. 
            // V8 has memory limit. 50MB might be fine.
            const body = await readBody();
            const { file, metadata: metaStr } = body;
            // Wait, front end will send { name, size, type, data: base64, folderId, ... }

            // Adjust to accept what frontend sends.
            // If frontend sends the whole StoredFile object including data (base64)
            const fileData = body;

            if (!fileData || !fileData.id || !fileData.data) {
                sendJSON({ error: "Invalid file data" }, 400);
                return;
            }

            // Save actual file
            // Remove header "data:mixed/mixed;base64," if present
            const base64Data = fileData.data.replace(/^data:.*,/, "");
            writeFileSync(join(UPLOADS_DIR, fileData.id), Buffer.from(base64Data, 'base64'));

            // Update metadata (dont store huge base64 in json)
            const storedMeta = { ...fileData, data: '' };
            metadata.files.push(storedMeta);
            saveMetadata();

            sendJSON(storedMeta);
            return;
        }

        // API: Delete File
        if (path.startsWith("/api/files/") && req.method === "DELETE") {
            const id = path.split("/").pop();
            if (id) {
                if (existsSync(join(UPLOADS_DIR, id))) {
                    try { unlinkSync(join(UPLOADS_DIR, id)); } catch (e) { }
                }
                metadata.files = metadata.files.filter(f => f.id !== id);
                saveMetadata();
                sendJSON({ success: true });
            }
            return;
        }

        // API: Download File (GET)
        if (path.startsWith("/api/files/") && req.method === "GET") {
            const id = path.split("/").pop();
            const filePath = join(UPLOADS_DIR, id);
            const fileMeta = metadata.files.find(f => f.id === id);

            if (existsSync(filePath)) {
                const stat = statSync(filePath);
                res.writeHead(200, {
                    "Content-Type": fileMeta ? fileMeta.type : "application/octet-stream",
                    "Content-Length": stat.size,
                    "Content-Disposition": `attachment; filename="${fileMeta ? fileMeta.name : id}"`
                });
                // Stream it
                const stream = readFileSync(filePath); // Sync for simplicity in this proto, or createReadStream
                res.end(stream);
            } else {
                res.writeHead(404);
                res.end("Not found");
            }
            return;
        }

        // API: Save Folders
        if (path === "/api/folders" && req.method === "POST") {
            const body = await readBody();
            metadata.folders = body;
            saveMetadata();
            sendJSON({ success: true });
            return;
        }


        // API: Fetch from URL
        if (path === "/api/fetch-url" && req.method === "POST") {
            const body = await readBody();
            const { url, folderId } = body;

            if (!url) {
                sendJSON({ error: "Missing URL" }, 400);
                return;
            }

            try {
                const fetchRes = await fetch(url);
                if (!fetchRes.ok) {
                    throw new Error(`Failed to fetch URL: ${fetchRes.statusText}`);
                }

                // Determine filename
                let filename = "downloaded_file";
                const disposition = fetchRes.headers.get('content-disposition');
                if (disposition && disposition.includes('filename=')) {
                    filename = disposition.split('filename=')[1].replace(/['"]/g, '');
                } else {
                    const urlPath = new URL(url).pathname;
                    const possibleName = urlPath.split('/').pop();
                    if (possibleName) filename = possibleName;
                }

                const contentType = fetchRes.headers.get('content-type') || 'application/octet-stream';

                const buffer = await fetchRes.arrayBuffer();
                const bufferData = Buffer.from(buffer);

                const now = Date.now();
                const id = `file_${now}_${Math.random().toString(36).substr(2, 9)}`;
                const filePath = join(UPLOADS_DIR, id);

                writeFileSync(filePath, bufferData);

                const newFile = {
                    id,
                    name: filename,
                    size: bufferData.length,
                    type: contentType,
                    data: '',
                    createdAt: now,
                    updatedAt: now,
                    folderId: folderId || null
                };

                metadata.files.push(newFile);
                saveMetadata();

                sendJSON(newFile);
            } catch (e) {
                console.error("Fetch URL error", e);
                sendJSON({ error: "Failed to download file from URL" }, 500);
            }
            return;
        }

        // API: Health Check
        if (path === "/api/health" && req.method === "GET") {
            sendJSON({ status: "ok", mongo: mongoose.connection.readyState === 1 ? "connected" : "connecting" });
            return;
        }

    } catch (e) {
        console.error(e);
        sendJSON({ error: "Internal Server Error" }, 500);
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
