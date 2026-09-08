import React, { useState } from 'react';
import { X, User, Award, Mail, BookOpen, Layers, CheckCircle2, Trash2, AlertTriangle } from 'lucide-react';
import { CentralStudent, FWSFundingStudent, GrantFundingStudent } from '../types';

interface StudentDetailModalProps {
  student: CentralStudent | null;
  onClose: () => void;
  fwsRecords: FWSFundingStudent[];
  grantRecords: GrantFundingStudent[];
  onDeleteStudent?: (studentId: string, studentName: string) => void;
  onDeleteSubRecord?: (table: 'fws' | 'grant', recordId: number, studentId: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  fwsRecords,
  grantRecords,
  onDeleteStudent,
  onDeleteSubRecord,
}) => {
  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState(false);
  const [confirmDeleteRecord, setConfirmDeleteRecord] = useState<{
    table: 'fws' | 'grant';
    id: number;
    studentId: string;
    title: string;
  } | null>(null);

  if (!student) return null;

  const linkedFws = fwsRecords.filter((r) => r.student_id === student.student_id);
  const linkedGrant = grantRecords.filter((r) => r.student_id === student.student_id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {student.first_name[0]}{student.last_name[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {student.first_name} {student.last_name}
                </h3>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-xs">
                  {student.student_id}
                </span>
              </div>
              <p className="text-xs text-slate-500">Central Master Record & Linked Sub-Table Applications</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onDeleteStudent && (
              <button
                onClick={() => setConfirmDeleteStudent(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                title="Permanently remove student from central table and all sub-tables"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Student</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Central Normalized Attributes Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Centralized Profile (<code className="font-mono text-indigo-700">students_doing_research</code>)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                {student.funding_type}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Student Email</span>
                <span className="font-mono font-semibold text-slate-800">{student.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Assigned Mentor</span>
                <span className="font-medium text-slate-800">
                  {student.mentor_first_name || student.mentor_last_name
                    ? `${student.mentor_first_name || ''} ${student.mentor_last_name || ''}`.trim()
                    : 'Not assigned'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Mentor Email</span>
                <span className="font-mono text-slate-700">{student.mentor_email || '—'}</span>
              </div>
            </div>
          </div>

          {/* Linked Sub-Table 1: Federal Work Study */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <h4 className="font-bold text-slate-900 text-sm">
                Linked Federal Work Study Records ({linkedFws.length})
              </h4>
              <span className="text-xs text-slate-400 font-mono">fws_funding_students</span>
            </div>

            {linkedFws.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                No Federal Work Study application on file for this student.
              </div>
            ) : (
              <div className="space-y-4">
                {linkedFws.map((fws, idx) => (
                  <div key={idx} className="border border-blue-200 bg-blue-50/20 rounded-xl p-4 text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-800">Application #{fws.id}</span>
                        <span className="text-slate-500">({fws.submission_timestamp || 'No timestamp'})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Award: {fws.award_amount || '—'}
                        </span>
                        {onDeleteSubRecord && (
                          <button
                            onClick={() =>
                              setConfirmDeleteRecord({
                                table: 'fws',
                                id: fws.id,
                                studentId: student.student_id,
                                title: `FWS Application #${fws.id}`,
                              })
                            }
                            className="inline-flex items-center space-x-1 px-2 py-0.5 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition"
                            title="Remove this FWS application (removes funding from central profile)"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Student ID Number:</span>
                        <span className="font-mono text-slate-800">{fws.student_id_number || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">College:</span>
                        <span className="text-slate-800">{fws.college || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Major:</span>
                        <span className="text-slate-800">{fws.major || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Graduation:</span>
                        <span className="text-slate-800">{fws.anticipated_graduation || '—'}</span>
                      </div>
                    </div>

                    {fws.research_duties_description && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-700 block mb-1">Research Duties Description:</span>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs">
                          {fws.research_duties_description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Linked Sub-Table 2: Project Supply Grant */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span>
              <h4 className="font-bold text-slate-900 text-sm">
                Linked Project Supply Grant Records ({linkedGrant.length})
              </h4>
              <span className="text-xs text-slate-400 font-mono">grant_funding_students</span>
            </div>

            {linkedGrant.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-400">
                No Project Supply Grant application on file for this student.
              </div>
            ) : (
              <div className="space-y-4">
                {linkedGrant.map((grant, idx) => (
                  <div key={idx} className="border border-violet-200 bg-violet-50/20 rounded-xl p-4 text-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-violet-100 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-800">Proposal #{grant.id}</span>
                        <span className="text-slate-500">({grant.submission_timestamp || 'No timestamp'})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                          Dept: {grant.mentor_department || '—'}
                        </span>
                        {onDeleteSubRecord && (
                          <button
                            onClick={() =>
                              setConfirmDeleteRecord({
                                table: 'grant',
                                id: grant.id,
                                studentId: student.student_id,
                                title: `Grant Proposal #${grant.id}`,
                              })
                            }
                            className="inline-flex items-center space-x-1 px-2 py-0.5 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition"
                            title="Remove this Grant proposal (removes funding from central profile)"
                          >
                            <Trash2 className="w-3 h-3 text-rose-600" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Submitter Email:</span>
                        <span className="font-mono text-slate-800">{grant.submitter_email || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Primary Mentor:</span>
                        <span className="text-slate-800">{grant.is_primary_mentor || 'Yes'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Co-Applicants:</span>
                        <span className="text-slate-800">{grant.co_applicants_summary || 'None'}</span>
                      </div>
                    </div>

                    {grant.research_experience_narrative && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-700 block mb-1">Research Experience & Narrative:</span>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line text-xs">
                          {grant.research_experience_narrative}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>

        {/* Confirmation Modal for Central Student Deletion inside detail view */}
        {confirmDeleteStudent && (
          <div className="absolute inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900">Delete Student & Cascade Sub-Tables?</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Permanently delete <strong className="text-slate-800">{student.first_name} {student.last_name}</strong> (<code className="font-mono text-indigo-700">{student.student_id}</code>).
                  </p>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 mb-5">
                <p className="font-semibold mb-1">Cascading Deletion:</p>
                <p className="text-[11px] text-rose-800 leading-relaxed">
                  This will remove the student from <code className="font-mono">students_doing_research</code> and delete all <strong>{linkedFws.length} FWS</strong> and <strong>{linkedGrant.length} Grant</strong> linked records.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => setConfirmDeleteStudent(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmDeleteStudent(false);
                    if (onDeleteStudent) {
                      onDeleteStudent(student.student_id, `${student.first_name} ${student.last_name}`);
                    }
                    onClose();
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

        {/* Confirmation Modal for Sub-Record Deletion inside detail view */}
        {confirmDeleteRecord && (
          <div className="absolute inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900">Remove Application Record?</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Delete <strong className="text-slate-800">{confirmDeleteRecord.title}</strong> from sub-table.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-5">
                <p className="font-semibold mb-1">Central Funding Field Update:</p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Removing this application will automatically update or remove the <strong>{confirmDeleteRecord.table === 'fws' ? 'Federal Work Study' : 'Project Supply Grant'}</strong> funding field on the student's central master record.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => setConfirmDeleteRecord(null)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const target = confirmDeleteRecord;
                    setConfirmDeleteRecord(null);
                    if (onDeleteSubRecord && target) {
                      onDeleteSubRecord(target.table, target.id, target.studentId);
                    }
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition inline-flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Application</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
