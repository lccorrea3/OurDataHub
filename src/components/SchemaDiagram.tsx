import React from 'react';
import { Database, Key, ArrowDownRight, Layers, Table, Code, CheckCircle2 } from 'lucide-react';

export const SchemaDiagram: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">SQLite Relational Architecture &amp; Normalization</h2>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          The pipeline transforms two disparate CSV formats into a 3NF normalized relational schema stored in an embedded SQLite database (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-700">research_students.db</code>).
          Every student is deduplicated and given a centralized identity in <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-700">students_doing_research</code>.
          Their original submission records are preserved in isolated sub-tables, joined via Foreign Key <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-700">student_id</code> with cascading referential integrity.
        </p>

        {/* Visual Entity-Relationship Cards */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Centralized Table */}
          <div className="lg:col-span-1 bg-gradient-to-b from-indigo-50/50 to-white rounded-xl border-2 border-indigo-400/80 shadow-md p-5 flex flex-col">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                <span className="font-bold text-sm text-slate-900 font-mono">students_doing_research</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white uppercase tracking-wider">
                Central Master (SQLite)
              </span>
            </div>

            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between p-2 rounded bg-indigo-100/70 text-indigo-900 font-mono font-bold border border-indigo-200">
                <div className="flex items-center space-x-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-700" />
                  <span>student_id</span>
                </div>
                <span className="text-[10px] uppercase font-sans tracking-wider bg-indigo-200/80 px-1.5 rounded">TEXT PRIMARY KEY</span>
              </div>

              <div className="p-1.5 border-b border-slate-100 flex justify-between">
                <span className="font-mono text-slate-700">first_name</span>
                <span className="text-slate-400 text-[11px]">TEXT NOT NULL</span>
              </div>
              <div className="p-1.5 border-b border-slate-100 flex justify-between">
                <span className="font-mono text-slate-700">last_name</span>
                <span className="text-slate-400 text-[11px]">TEXT NOT NULL</span>
              </div>
              <div className="p-1.5 border-b border-slate-100 flex justify-between">
                <span className="font-mono text-slate-700">email</span>
                <span className="text-slate-400 text-[11px]">TEXT NOT NULL (INDEX)</span>
              </div>
              <div className="p-1.5 border-b border-slate-100 flex justify-between">
                <span className="font-mono text-slate-700">mentor_first_name</span>
                <span className="text-slate-400 text-[11px]">TEXT</span>
              </div>
              <div className="p-1.5 border-b border-slate-100 flex justify-between">
                <span className="font-mono text-slate-700">mentor_last_name</span>
                <span className="text-slate-400 text-[11px]">TEXT</span>
              </div>
              <div className="p-1.5 border-b border-slate-100 flex justify-between">
                <span className="font-mono text-slate-700">mentor_email</span>
                <span className="text-slate-400 text-[11px]">TEXT</span>
              </div>
              <div className="p-1.5 flex justify-between">
                <span className="font-mono text-slate-700">funding_type</span>
                <span className="text-slate-400 text-[11px]">TEXT (FWS / Grant / Dual)</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-100 text-[11px] text-indigo-900 bg-indigo-50/50 p-2 rounded">
              Holds single source of truth for student identity and funding status in SQLite.
            </div>
          </div>

          {/* Sub-Table 1: FWS */}
          <div className="bg-gradient-to-b from-blue-50/40 to-white rounded-xl border border-blue-200 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between border-b border-blue-100 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="font-bold text-sm text-slate-900 font-mono">fws_funding_students</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                Sub-Table (FWS)
              </span>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-100 font-mono text-slate-700">
                <span>id</span>
                <span className="text-[10px] text-slate-500">INTEGER PK AUTOINCREMENT</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-blue-100/80 text-blue-900 font-mono font-bold border border-blue-300">
                <div className="flex items-center space-x-1.5">
                  <ArrowDownRight className="w-3.5 h-3.5 text-blue-700" />
                  <span>student_id</span>
                </div>
                <span className="text-[10px] uppercase font-sans tracking-wider bg-blue-200 px-1.5 rounded">FK → TEXT</span>
              </div>

              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">student_id_number</span>
                <span className="text-slate-400">TEXT</span>
              </div>
              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">college, department, major</span>
                <span className="text-slate-400">TEXT</span>
              </div>
              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">research_duties_description</span>
                <span className="text-slate-400">TEXT</span>
              </div>
              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">award_amount, fws_eligible</span>
                <span className="text-slate-400">TEXT</span>
              </div>
              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">approval_status, reviewer_name</span>
                <span className="text-slate-400">Review Fields</span>
              </div>
              <div className="p-1 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">raw_data_json</span>
                <span className="text-slate-400">JSON String</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100 text-[11px] text-blue-800 bg-blue-50/50 p-2 rounded">
              Enforced by SQLite: <code className="font-mono">FOREIGN KEY (student_id) REFERENCES students_doing_research(student_id) ON DELETE CASCADE</code>.
            </div>
          </div>

          {/* Sub-Table 2: Grant */}
          <div className="bg-gradient-to-b from-violet-50/40 to-white rounded-xl border border-violet-200 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between border-b border-violet-100 pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
                <span className="font-bold text-sm text-slate-900 font-mono">grant_funding_students</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-violet-800 uppercase tracking-wider">
                Sub-Table (Supply Grant)
              </span>
            </div>

            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-100 font-mono text-slate-700">
                <span>id</span>
                <span className="text-[10px] text-slate-500">INTEGER PK AUTOINCREMENT</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-violet-100/80 text-violet-900 font-mono font-bold border border-violet-300">
                <div className="flex items-center space-x-1.5">
                  <ArrowDownRight className="w-3.5 h-3.5 text-violet-700" />
                  <span>student_id</span>
                </div>
                <span className="text-[10px] uppercase font-sans tracking-wider bg-violet-200 px-1.5 rounded">FK → TEXT</span>
              </div>

              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">submitter_email</span>
                <span className="text-slate-400">TEXT</span>
              </div>
              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">has_co_applicants, summary</span>
                <span className="text-slate-400">Co-Applicants</span>
              </div>
              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">mentor_department, affiliation</span>
                <span className="text-slate-400">Mentor Details</span>
              </div>
              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">research_experience_narrative</span>
                <span className="text-slate-400">TEXT</span>
              </div>
              <div className="p-1 border-b border-slate-100 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">student_readiness_evaluation</span>
                <span className="text-slate-400">TEXT</span>
              </div>
              <div className="p-1 flex justify-between text-[11px]">
                <span className="font-mono text-slate-600">raw_data_json</span>
                <span className="text-slate-400">JSON String</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-violet-100 text-[11px] text-violet-800 bg-violet-50/50 p-2 rounded">
              Enforced by SQLite: <code className="font-mono">FOREIGN KEY (student_id) REFERENCES students_doing_research(student_id) ON DELETE CASCADE</code>.
            </div>
          </div>
        </div>
      </div>

      {/* Deduplication & Migration Workflow Explanation */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-6 border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Code className="w-4 h-4 text-indigo-400" />
          <span>Data Ingestion & Deduplication Lifecycle</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
          <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700/80">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold mb-2">
              <span className="w-5 h-5 rounded-full bg-indigo-900 flex items-center justify-center text-[10px]">1</span>
              <span>Intake & Extraction</span>
            </div>
            <p className="text-slate-300">
              Pandas reads CSV buffers using automatic encoding detection (<code className="text-indigo-200">utf-8</code>, <code className="text-indigo-200">latin1</code>, <code className="text-indigo-200">cp1252</code>) and vectorized cleaning to strip NaNs, normalize whitespaces, and extract core student and mentor attributes.
            </p>
          </div>

          <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700/80">
            <div className="flex items-center space-x-2 text-emerald-300 font-bold mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-900 flex items-center justify-center text-[10px]">2</span>
              <span>Deduplication & ID Assignment</span>
            </div>
            <p className="text-slate-300">
              The pipeline checks if the student already exists via Email, University Unity ID prefix (e.g. <code className="text-emerald-200">pgeorge</code> = <code className="text-emerald-200">pg@gmail.com</code> / <code className="text-emerald-200">pgeorge@ncsu.edu</code>), or full name. If new, it assigns an incrementing <code className="text-emerald-200">STU-XXXX</code> ID. If existing, it updates funding to combined (e.g. <code className="text-amber-200">Federal Work Study, Grant</code>).
            </p>
          </div>

          <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700/80">
            <div className="flex items-center space-x-2 text-violet-300 font-bold mb-2">
              <span className="w-5 h-5 rounded-full bg-violet-900 flex items-center justify-center text-[10px]">3</span>
              <span>Foreign Key Sub-Table Insertion</span>
            </div>
            <p className="text-slate-300">
              All remaining CSV fields (college, department, duties, award, hire status, proposal narratives) are routed directly to the corresponding sub-table with the student's unique ID as Foreign Key, plus the complete lossless JSON row.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
