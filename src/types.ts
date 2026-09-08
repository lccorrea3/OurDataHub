export interface CentralStudent {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mentor_first_name?: string;
  mentor_last_name?: string;
  mentor_email?: string;
  funding_type: string;
  created_at?: string;
  updated_at?: string;
}

export interface FWSFundingStudent {
  id: number;
  student_id: string;
  submission_timestamp?: string;
  email_raw?: string;
  legal_first_name?: string;
  last_name?: string;
  preferred_name?: string;
  pronouns?: string;
  student_id_number?: string;
  phone_number?: string;
  college?: string;
  department?: string;
  major?: string;
  research_duties_description?: string;
  anticipated_graduation?: string;
  mentor_affiliated_nc_state?: string;
  faculty_mentor_first_name?: string;
  faculty_mentor_last_name?: string;
  faculty_mentor_email?: string;
  faculty_mentor_college?: string;
  faculty_mentor_department?: string;
  faculty_mentor_phone?: string;
  external_mentor_first_name?: string;
  external_mentor_last_name?: string;
  external_mentor_institution?: string;
  external_mentor_job_title?: string;
  external_mentor_email?: string;
  external_mentor_phone?: string;
  position_retention_intent?: string;
  expectations_agreement?: string;
  code_of_conduct_agreement?: string;
  referral_source?: string;
  approval_status?: string;
  reviewer_name?: string;
  review_notes?: string;
  mentor_faculty_qualification?: string;
  jens_notes?: string;
  fws_eligible?: string;
  award_amount?: string;
  sent_contract?: string;
  received_signed_contract?: string;
  created_voucher?: string;
  initiated_hire_action?: string;
  hire_status?: string;
  added_to_moodle?: string;
  added_to_tracking_list?: string;
  attended_orientation?: string;
  raw_data_json?: string;
  imported_at?: string;
}

export interface GrantFundingStudent {
  id: number;
  student_id: string;
  submission_timestamp?: string;
  submitter_email?: string;
  lead_student_first_name?: string;
  lead_student_last_name?: string;
  lead_student_email?: string;
  has_co_applicants?: string;
  co_applicants_summary?: string;
  mentor_nc_state_affiliated?: string;
  is_primary_mentor?: string;
  mentor_first_name?: string;
  mentor_last_name?: string;
  mentor_department?: string;
  mentor_email?: string;
  external_mentor_first_name?: string;
  external_mentor_last_name?: string;
  external_mentor_institution?: string;
  external_mentor_job_title?: string;
  external_mentor_email?: string;
  research_experience_narrative?: string;
  student_readiness_evaluation?: string;
  development_support_plan?: string;
  additional_information?: string;
  rec_letter_survey_preference?: string;
  raw_data_json?: string;
  imported_at?: string;
}

export interface DatabaseSummary {
  total_students: number;
  total_fws_records: number;
  total_grant_records: number;
  students_fws: number;
  students_grant: number;
  students_dual_funded: number;
  db_engine?: string;
}

export interface DatabaseState {
  summary: DatabaseSummary;
  students_doing_research: CentralStudent[];
  fws_funding_students: FWSFundingStudent[];
  grant_funding_students: GrantFundingStudent[];
}

export interface MigrationLogDetail {
  student_id: string;
  student_name: string;
  email: string;
  mentor: string;
  is_new: boolean;
  funding_type: string;
}

export interface MigrationResult {
  source: string;
  total_rows: number;
  new_students: number;
  existing_students_matched: number;
  records_inserted: number;
  details: MigrationLogDetail[];
}
