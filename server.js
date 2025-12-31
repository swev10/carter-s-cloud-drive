import { createServer } from 'http';
import { join, dirname } from 'path';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync, writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const UPLOADS_DIR = join(process.cwd(), "uploads");
const META_FILE = join(process.cwd(), "data.json");

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

            if (username === "carte1" && password === "C@rter!23") {
                sendJSON({ success: true, user: { username: "carte1", storageLimit: 100 * 1024 * 1024 * 1024 } });
            } else {
                sendJSON({ success: false, error: "Incorrect" }, 401);
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

    } catch (e) {
        console.error(e);
        sendJSON({ error: "Internal Server Error" }, 500);
        return;
    }

    res.writeHead(404);
    res.end("Not Found");
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
