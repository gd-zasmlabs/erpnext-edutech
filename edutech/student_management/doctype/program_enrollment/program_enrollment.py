# Copyright (c) 2025, Glavin and contributors
# For license information, please see license.txt

# import frappe
# edutech/student_management/doctype/student/student.py

import frappe
from frappe.model.document import Document

<<<<<<< HEAD:edutech/student_management/doctype/program_enrollment/program_enrollment.py

class ProgramEnrollment(Document):
	pass
=======
class Student(Document):
    pass

@frappe.whitelist()
def generate_summary(name):
    doc = frappe.get_doc("Student", name)

    summary = f"""
    Student Summary:
    Name: {doc.first_name} {doc.last_name}
    Program: {doc.program_enrolled}
    Date of Birth: {doc.date_of_birth}
    Enrollment Date: {doc.enrollment_date}
    Course Code:{doc.course_code}
    """

    return summary.strip()
>>>>>>> 20598db (Add complete app folders (api, www, templates, student_management, etc)):student_management/doctype/student/student.py
