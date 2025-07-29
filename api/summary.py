# edutech/api/summary.py
import frappe

@frappe.whitelist()
def get_student_summary(student_id):
    doc = frappe.get_doc("Student", student_id)
    return {
        "full_name": f"{doc.first_name} {doc.last_name or ''}",
        "dob": doc.date_of_birth,
        "program": doc.program_enrolled,
        "course":doc.course_code,
        "enrolled": doc.enrollment_date
    }
