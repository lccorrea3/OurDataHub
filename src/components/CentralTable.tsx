import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, ExternalLink, UserCheck, Layers, Award, Trash2, AlertTriangle, X } from 'lucide-react';
import { CentralStudent, FWSFundingStudent, GrantFundingStudent } from '../types';

interface CentralTableProps {
  students: CentralStudent[];
  fwsRecords: FWSFundingStudent[];
  grantRecords: GrantFundingStudent[];
  onSelectStudent: (student: CentralStudent) => void;
  onDeleteStudent?: (studentId: string, studentName: string) => void;
}

export const CentralTable: React.FC<CentralTableProps> = ({
  students,
  fwsRecords,
  grantRecords,
  onSelectStudent,
  onDeleteStudent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fundingFilter, setFundingFilter] = useState<'ALL' | 'FWS' | 'GRANT' | 'DUAL'>('ALL');
  const [studentToDelete, setStudentToDelete] = useState<CentralStudent | null>(null);

  // Count linked records for each student
  const linkedCounts = useMemo(() => {
    const fwsMap: Record<string, number> = {};
    const grantMap: Record<string, number> = {};

    fwsRecords.forEach((r) => {
      fwsMap[r.student_id] = (fwsMap[r.student_id] || 0) + 1;
    });
    grantRecords.forEach((r) => {
      grantMap[r.student_id] = (grantMap[r.student_id] || 0) + 1;
    });

    return { fwsMap, grantMap };
  }, [fwsRecords, grantRecords]);

  // Filter students based on search and funding type
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        s.student_id.toLowerCase().includes(q) ||
        s.first_name.toLowerCase().includes(q) ||
        s.last_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.mentor_first_name && s.mentor_first_name.toLowerCase().includes(q)) ||
        (s.mentor_last_name && s.mentor_last_name.toLowerCase().includes(q)) ||
        (s.mentor_email && s.mentor_email.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      const ft = s.funding_type || '';
      const isFws = ft.includes('Federal Work Study');
      const isGrant = ft.includes('Grant');
      const isDual = isFws && isGrant;

      if (fundingFilter === 'DUAL') return isDual;
      if (fundingFilter === 'FWS') return isFws && !isDual;
      if (fundingFilter === 'GRANT') return isGrant && !isDual;
      return true;
    });
  }, [students, searchTerm, fundingFilter]);

  const renderFundingBadge = (fundingType: string) => {
    const isFws = fundingType.includes('Federal Work Study');
    const isGrant = fundingType.includes('Grant') || fundingType.includes('Supply');
    const isDual = isFws && isGrant;

    if (isDual) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
          <Award className="w-3 h-3 mr-1 text-amber-600" />
          FWS & Supply Grant (Dual)
        </span>
      );
    }
    if (isFws) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Federal Work Study
        </span>
      );
    }
    if (isGrant) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800 border border-violet-200">
          Project Supply Grant
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
        {fundingType}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 sm:flex sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Centralized Table: <code className="text-xs bg-slate-200 px-1.5 py-0.5 rounded text-indigo-900 font-mono">students_doing_research</code>
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Normalized Master Registry: Contains only student identity, contact, mentor identity, and consolidated funding type.
          </p>
        </div>

        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <a
            href="/api/download/csv/students_doing_research"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, Unique ID, email, mentor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-slate-50/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Funding:</span>
          {(['ALL', 'FWS', 'GRANT', 'DUAL'] as const).map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setFundingFilter(filterKey)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                fundingFilter === filterKey
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filterKey === 'ALL' && 'All Students'}
              {filterKey === 'FWS' && 'FWS Only'}
              {filterKey === 'GRANT' && 'Supply Grant Only'}
              {filterKey === 'DUAL' && 'Dual Funded'}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Unique ID</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-4">Student Email</th>
              <th className="py-3 px-4">Mentor Name</th>
              <th className="py-3 px-4">Mentor Email</th>
              <th className="py-3 px-4">Funding Type</th>
              <th className="py-3 px-4 text-center">Linked Records</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <UserCheck className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No student records found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {students.length === 0
                        ? 'Upload a Federal Work Study or Grant CSV file to start.'
                        : 'Try adjusting your search or filter criteria.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const fwsCount = linkedCounts.fwsMap[student.student_id] || 0;
                const grantCount = linkedCounts.grantMap[student.student_id] || 0;

                return (
                  <tr
                    key={student.student_id}
                    onClick={() => onSelectStudent(student)}
                    className="hover:bg-indigo-50/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {student.student_id}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {student.first_name} {student.last_name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {student.email}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {student.mentor_first_name || student.mentor_last_name ? (
                        <span>{`${student.mentor_first_name || ''} ${student.mentor_last_name || ''}`.trim()}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not listed</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {student.mentor_email || <span className="text-slate-400 italic">—</span>}
                    </td>
                    <td className="py-3 px-4">
                      {renderFundingBadge(student.funding_type)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center space-x-1.5">
                        {fwsCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                            {fwsCount} FWS
                          </span>
                        )}
                        {grantCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-200 rounded">
                            {grantCount} Grant
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStudent(student);
                          }}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        {onDeleteStudent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setStudentToDelete(student);
                            }}
                            title="Remove student from central database (cascades to sub-tables)"
                            className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
        <span>
          Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students
        </span>
        <span className="text-slate-400">
          Click any row to inspect all linked sub-table records & full application data
        </span>
      </div>

      {/* Confirmation Modal for Central Student Deletion */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">Remove Student from Central Registry?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Removing <strong className="text-slate-800">{studentToDelete.first_name} {studentToDelete.last_name}</strong> (<code className="font-mono text-indigo-700">{studentToDelete.student_id}</code>) will permanently delete this student from <code className="font-mono">students_doing_research</code>.
                </p>
              </div>
              <button
                onClick={() => setStudentToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 mb-5">
              <p className="font-semibold mb-1">Sub-Table Cascading Effect:</p>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                By foreign key constraint (<code className="font-mono">ON DELETE CASCADE</code>), this will also subsequently delete all linked application records in both <code className="font-mono">fws_funding_students</code> and <code className="font-mono">grant_funding_students</code>.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDeleteStudent && studentToDelete) {
                    onDeleteStudent(studentToDelete.student_id, `${studentToDelete.first_name} ${studentToDelete.last_name}`);
                  }
                  setStudentToDelete(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition inline-flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
