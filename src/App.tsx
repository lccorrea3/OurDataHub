/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { CentralTable } from './components/CentralTable';
import { FwsSubTable } from './components/FwsSubTable';
import { GrantSubTable } from './components/GrantSubTable';
import { StudentDetailModal } from './components/StudentDetailModal';
import { SchemaDiagram } from './components/SchemaDiagram';
import { DocumentationView } from './components/DocumentationView';
import { DatabaseState, CentralStudent, MigrationResult } from './types';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('import');
  const [dataState, setDataState] = useState<DatabaseState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [latestMigration, setLatestMigration] = useState<MigrationResult | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<CentralStudent | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchDatabaseState = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Failed to fetch database state');
      const data = await res.json();
      setDataState(data);
    } catch (err: any) {
      console.error('Error fetching database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseState();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleUpload = async (file: File, fundingType: 'fws' | 'grant') => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fundingType', fundingType);

      const res = await fetch('/api/pipeline/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      setLatestMigration(json.result);
      if (json.state) setDataState(json.state);
      showNotification('success', `Successfully processed ${json.result.total_rows} rows from ${json.result.source}!`);
    } catch (err: any) {
      showNotification('error', err.message || 'Pipeline processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = async (type: 'fws' | 'grant' | 'both') => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/pipeline/sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Sample load failed');

      if (type === 'both') {
        const fwsRes = json.result.fws;
        const grantRes = json.result.grant;
        setLatestMigration({
          source: 'Dual Batch (FWS & Grant)',
          total_rows: (fwsRes?.total_rows || 0) + (grantRes?.total_rows || 0),
          new_students: (fwsRes?.new_students || 0) + (grantRes?.new_students || 0),
          existing_students_matched: (fwsRes?.existing_students_matched || 0) + (grantRes?.existing_students_matched || 0),
          records_inserted: (fwsRes?.records_inserted || 0) + (grantRes?.records_inserted || 0),
          details: [...(fwsRes?.details || []), ...(grantRes?.details || [])],
        });
      } else {
        setLatestMigration(json.result);
      }

      if (json.state) setDataState(json.state);
      showNotification('success', `Successfully loaded and migrated sample data!`);
    } catch (err: any) {
      showNotification('error', err.message || 'Sample load failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all 3 tables? All student and sub-table records will be cleared.')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/pipeline/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Reset failed');
      await fetchDatabaseState();
      setLatestMigration(null);
      showNotification('success', 'Database re-initialized to clean state.');
    } catch (err: any) {
      showNotification('error', err.message || 'Reset failed.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSelectStudentById = (studentId: string) => {
    if (!dataState) return;
    const student = dataState.students_doing_research.find((s) => s.student_id === studentId);
    if (student) {
      setSelectedStudent(student);
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName?: string) => {
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(studentId)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete student');

      if (json.state) {
        setDataState(json.state);
      } else {
        await fetchDatabaseState();
      }

      if (selectedStudent?.student_id === studentId) {
        setSelectedStudent(null);
      }

      showNotification(
        'success',
        `Removed student ${studentName || studentId} from central registry (cascaded to sub-tables).`
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Deletion failed.');
    }
  };

  const handleDeleteSubRecord = async (table: 'fws' | 'grant', recordId: number, studentId?: string) => {
    try {
      const res = await fetch(`/api/subtable/${table}/${recordId}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete record');

      if (json.state) {
        setDataState(json.state);
        if (selectedStudent) {
          const updated = json.state.students_doing_research.find(
            (s: any) => s.student_id === selectedStudent.student_id
          );
          if (updated) {
            setSelectedStudent(updated);
          }
        }
      } else {
        await fetchDatabaseState();
      }

      const tableLabel = table === 'fws' ? 'Federal Work Study' : 'Project Supply Grant';
      showNotification(
        'success',
        `Removed ${tableLabel} record #${recordId}. Central funding status updated.`
      );
    } catch (err: any) {
      showNotification('error', err.message || 'Record deletion failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      <Navbar
        summary={dataState?.summary || null}
        onReset={handleReset}
        isResetting={isResetting}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-xs font-medium flex items-center space-x-2 ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : 'bg-rose-900 text-rose-100 border-rose-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
            <p className="text-sm font-medium">Initializing Research Data Pipeline...</p>
          </div>
        ) : (
          <>
            {activeTab === 'import' && (
              <UploadSection
                onUpload={handleUpload}
                onLoadSample={handleLoadSample}
                isProcessing={isProcessing}
                latestMigration={latestMigration}
                onViewCentral={() => setActiveTab('central')}
              />
            )}

            {activeTab === 'central' && (
              <CentralTable
                students={dataState?.students_doing_research || []}
                fwsRecords={dataState?.fws_funding_students || []}
                grantRecords={dataState?.grant_funding_students || []}
                onSelectStudent={(s) => setSelectedStudent(s)}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {activeTab === 'fws' && (
              <FwsSubTable
                records={dataState?.fws_funding_students || []}
                onSelectStudentId={handleSelectStudentById}
                onDeleteRecord={(id, sId) => handleDeleteSubRecord('fws', id, sId)}
              />
            )}

            {activeTab === 'grant' && (
              <GrantSubTable
                records={dataState?.grant_funding_students || []}
                onSelectStudentId={handleSelectStudentById}
                onDeleteRecord={(id, sId) => handleDeleteSubRecord('grant', id, sId)}
              />
            )}

            {activeTab === 'schema' && <SchemaDiagram />}

            {activeTab === 'docs' && <DocumentationView />}
          </>
        )}
      </main>

      {/* Modal for Student Detail & Linked Records */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          fwsRecords={dataState?.fws_funding_students || []}
          grantRecords={dataState?.grant_funding_students || []}
          onDeleteStudent={handleDeleteStudent}
          onDeleteSubRecord={handleDeleteSubRecord}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        Research Student Funding Pipeline &bull; Automated Normalization with Python &amp; Pandas &bull; Relational SQLite Database (Embedded)
      </footer>
    </div>
  );
}
