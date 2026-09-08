import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, CheckCircle2, Server, Database, Layers, Sparkles } from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const sampleCommand = `python3 pipeline.py --action import_both --fws sample_data/federal_work_study_sample.csv --grant sample_data/grant_sample.csv`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Frameworks, Libraries & Architectural Rationale</h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Below is a complete accounting of all frameworks, libraries, and runtime engines utilized across both the data migration pipeline and the full-stack management application, including why each was selected.
        </p>

        {/* Frameworks Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Framework 1: Python 3 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">Python 3 (ETL Engine)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Core Runtime</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Why used:</strong> Python is the gold standard for data engineering pipelines. Its robust standard library (`sqlite3`, `json`, `argparse`, `os`) provides zero-dependency relational operations, process isolation, and cross-platform compatibility across servers and developer machines.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 font-mono">runtime: python 3.10+</div>
          </div>

          {/* Framework 2: Pandas */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">Pandas (Data Manipulation)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Data Library</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Why used:</strong> Pandas excels at handling noisy, real-world university CSV exports. It provides automatic encoding detection (UTF-8, UTF-8-BOM, Latin1, CP1252), vectorized null/NaN handling, column deduplication (handling identical column names in survey exports), and high-throughput bulk SQL ingestion.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 font-mono">library: pandas 1.5.3+</div>
          </div>

          {/* Framework 3: SQLite 3 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">SQLite 3 (Embedded Relational Database)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">Database Engine</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Why used:</strong> A self-contained, serverless, zero-configuration SQL database engine. It enforces foreign key constraints (<code className="font-mono text-xs">PRAGMA foreign_keys = ON</code>) with cascading deletes (<code className="font-mono text-xs">ON DELETE CASCADE</code>), guarantees ACID transactional integrity during multi-file migrations, and stores all normalized tables in a single portable <code className="font-mono text-xs">.db</code> file.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 font-mono">file: research_students.db</div>
          </div>

          {/* Framework 4: Express & Node.js */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">Express (Node.js API Server)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-800">Backend Server</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Why used:</strong> Express acts as the full-stack bridge between the browser UI and the backend filesystem. It handles secure streaming multipart CSV uploads via `multer`, invokes the Python process via `child_process.spawn`, and streams database exports directly to the client.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 font-mono">server: express 4.21.2</div>
          </div>

          {/* Framework 5: React 19 & TypeScript */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">React 19 & TypeScript</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Frontend UI</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Why used:</strong> Delivers a responsive, reactive desktop dashboard with full compile-time type safety across complex data shapes. Users can instantly filter, search, expand nested records, and inspect relational links without page reloads.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 font-mono">client: react 19.0.1 + typescript</div>
          </div>

          {/* Framework 6: Tailwind CSS */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">Tailwind CSS</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">Styling System</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Why used:</strong> Utility-first styling engine that provides high-contrast, mathematically consistent typography, status badges, responsive tables, and accessible layouts without custom CSS bundle overhead.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 font-mono">css: tailwindcss 4.1</div>
          </div>
        </div>
      </div>

      {/* CLI Usage Guide */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Standalone CLI Execution (Headless Automation)</h3>
          </div>
          <a
            href="/api/download/python-script"
            download="pipeline.py"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download pipeline.py</span>
          </a>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          You can run the Python pipeline completely standalone in any terminal, batch job, or cron automation without the web server.
        </p>

        {/* Command snippet */}
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-200 border border-slate-800 relative group">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/80 text-[11px] text-slate-400 font-sans">
            <span>Terminal Command</span>
            <button
              onClick={() => copyToClipboard(sampleCommand)}
              className="flex items-center space-x-1 text-slate-400 hover:text-white transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="overflow-x-auto text-emerald-400">
            {sampleCommand}
          </div>
        </div>

        {/* Supported CLI Arguments */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-800/60 p-3 rounded border border-slate-700">
            <span className="font-mono text-indigo-300 font-bold block mb-1">--action import_fws --fws &lt;file.csv&gt;</span>
            <span className="text-slate-400 text-[11px]">Intakes Federal Work Study CSV, cleans data, updates central registry in SQLite, and inserts into sub-table.</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded border border-slate-700">
            <span className="font-mono text-violet-300 font-bold block mb-1">--action import_grant --grant &lt;file.csv&gt;</span>
            <span className="text-slate-400 text-[11px]">Intakes Project Supply Grant CSV, checks for existing student, updates funding, and inserts into sub-table.</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded border border-slate-700">
            <span className="font-mono text-emerald-300 font-bold block mb-1">--db &lt;path/to/database.db&gt;</span>
            <span className="text-slate-400 text-[11px]">Target custom SQLite database file path (defaults to research_students.db).</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded border border-slate-700">
            <span className="font-mono text-amber-300 font-bold block mb-1">--action get_data</span>
            <span className="text-slate-400 text-[11px]">Dumps current SQLite database state, central students, and all sub-tables as structured JSON.</span>
          </div>
          <div className="bg-slate-800/60 p-3 rounded border border-slate-700 sm:col-span-2">
            <span className="font-mono text-rose-300 font-bold block mb-1">--action reset</span>
            <span className="text-slate-400 text-[11px]">Re-initializes all tables and clears SQLite database schema cleanly with foreign key checks.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
