import express from 'express';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

const DB_PATH = path.resolve(process.cwd(), process.env.SQLITE_DB_PATH || 'research_students.db');
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Setup upload directory
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Helper function to run pipeline.py
function runPipeline(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['pipeline.py', ...args], {
      cwd: process.cwd(),
      env: process.env,
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Pipeline process failed with code ${code}: ${stderr || stdout}`));
      }
      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (err) {
        resolve({ rawOutput: stdout, error: err instanceof Error ? err.message : String(err) });
      }
    });

    pythonProcess.on('error', (err) => {
      reject(err);
    });
  });
}

// ================= API ROUTES =================

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: 'SQLite 3 (Embedded)',
    dbPath: DB_PATH,
    timestamp: new Date().toISOString()
  });
});

// Fetch current database state
app.get('/api/data', async (_req, res) => {
  try {
    const data = await runPipeline(['--action', 'get_data']);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch database data.' });
  }
});

// Reset database
app.post('/api/pipeline/reset', async (_req, res) => {
  try {
    const result = await runPipeline(['--action', 'reset']);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to reset database.' });
  }
});

// Delete central student (and cascading sub-table records)
app.delete('/api/students/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ error: 'Missing studentId' });
    }
    const result = await runPipeline(['--action', 'delete_student', '--student_id', studentId]);
    const state = await runPipeline(['--action', 'get_data']);
    res.json({ result, state });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete student.' });
  }
});

// Delete sub-table record (and update central student funding status)
app.delete('/api/subtable/:table/:recordId', async (req, res) => {
  try {
    const { table, recordId } = req.params;
    if (!table || !recordId) {
      return res.status(400).json({ error: 'Missing table or recordId' });
    }
    const result = await runPipeline(['--action', 'delete_subtable_record', '--table', table, '--record_id', recordId]);
    const state = await runPipeline(['--action', 'get_data']);
    res.json({ result, state });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to delete sub-table record.' });
  }
});

// Ingest sample data
app.post('/api/pipeline/sample', async (req, res) => {
  try {
    const { type } = req.body;
    const fwsPath = path.join(process.cwd(), 'sample_data', 'federal_work_study_sample.csv');
    const grantPath = path.join(process.cwd(), 'sample_data', 'grant_sample.csv');

    let result;
    if (type === 'fws') {
      result = await runPipeline(['--action', 'import_fws', '--fws', fwsPath]);
    } else if (type === 'grant') {
      result = await runPipeline(['--action', 'import_grant', '--grant', grantPath]);
    } else if (type === 'both') {
      result = await runPipeline(['--action', 'import_both', '--fws', fwsPath, '--grant', grantPath]);
    } else {
      return res.status(400).json({ error: "Invalid sample type. Must be 'fws', 'grant', or 'both'." });
    }

    const state = await runPipeline(['--action', 'get_data']);
    res.json({ result, state });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to import sample data.' });
  }
});

// Upload and ingest CSV
app.post('/api/pipeline/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const fundingType = req.body.fundingType;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    if (!fundingType || (fundingType !== 'fws' && fundingType !== 'grant')) {
      return res.status(400).json({ error: "Invalid fundingType. Must be 'fws' or 'grant'." });
    }

    const action = fundingType === 'fws' ? 'import_fws' : 'import_grant';
    const flag = fundingType === 'fws' ? '--fws' : '--grant';

    const result = await runPipeline(['--action', action, flag, file.path]);
    const state = await runPipeline(['--action', 'get_data']);

    // Clean up temporary uploaded file
    fs.unlink(file.path, () => {});

    res.json({ result, state });
  } catch (error: any) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(500).json({ error: error.message || 'Failed to process and migrate file.' });
  }
});

// Download SQLite Database file
app.get('/api/download/sqlite', (_req, res) => {
  if (!fs.existsSync(DB_PATH)) {
    return res.status(404).json({ error: 'SQLite database file has not been created yet.' });
  }
  res.download(DB_PATH, 'research_students.db');
});

// Download standalone Python script
app.get('/api/download/python-script', (_req, res) => {
  const scriptPath = path.join(process.cwd(), 'pipeline.py');
  if (!fs.existsSync(scriptPath)) {
    return res.status(404).json({ error: 'pipeline.py script not found.' });
  }
  res.download(scriptPath, 'pipeline.py');
});

// Download table as CSV
app.get('/api/download/csv/:tableName', async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const allowed = ['students_doing_research', 'fws_funding_students', 'grant_funding_students'];
    if (!allowed.includes(tableName)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const exportScript = `
import sqlite3, pandas as pd, sys
conn = sqlite3.connect("${DB_PATH}")
df = pd.read_sql_query("SELECT * FROM ${tableName}", conn)
df.to_csv(sys.stdout, index=False)
conn.close()
`;
    const py = spawn('python3', ['-c', exportScript], { cwd: process.cwd() });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${tableName}.csv"`);
    py.stdout.pipe(res);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to export CSV.' });
  }
});

// ================= VITE INTEGRATION =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (SQLite embedded mode)`);
  });
}

startServer();
