import frappe
import json

@frappe.whitelist()
def get_student_summary(student_ids=None, filters=None):
    # Ensure proper types
    if isinstance(student_ids, str):
        student_ids = json.loads(student_ids)
    if isinstance(filters, str):
        filters = json.loads(filters)

    if not student_ids:
        student_ids = []
    if not filters:
        filters = {}

    result = {
        "students": [],
        "data": {},
        "show_course": filters.get("show_course"),
        "show_grade": filters.get("show_grade"),
        "show_attendance": filters.get("show_attendance"),
    }

    for student_id in student_ids:
        student_info = frappe.db.get_value("Student", student_id, ["first_name", "last_name", "course_code"], as_dict=True)
        if not student_info:
            continue

        first_name = student_info.first_name or ""
        last_name = student_info.last_name or ""
        full_name = f"{first_name} {last_name}".strip()

        result["students"].append(full_name)
        result["data"][full_name] = {
            "courses": [],
            "grades": [],
            "attendance": 0
        }

        # ✅ Courses (from Student.course_code → Course)
        if result["show_course"] and student_info.course_code:
            course_doc = frappe.get_value(
                "Course",
                {"course_code": student_info.course_code},
                ["course_code", "course_name", "credits"],
                as_dict=True
            )
            if course_doc:
                result["data"][full_name]["courses"].append({
                    "course_code": course_doc.course_code,
                    "course_name": course_doc.course_name,
                    "credits": course_doc.credits
                })

        # ✅ Grades
        if result["show_grade"]:
            grades = frappe.get_all("Grade",
                filters={"student": student_id},
                fields=["grade"])
            result["data"][full_name]["grades"] = [g.grade for g in grades]

        # ✅ Attendance
        if result["show_attendance"]:
            attendance_records = frappe.get_all("Attendance",
                filters={"student": student_id},
                fields=["status"])
            if attendance_records:
                present_count = sum(1 for a in attendance_records if a.status == "Present")
                percent = round((present_count / len(attendance_records)) * 100, 2)
                result["data"][full_name]["attendance"] = percent

    return result
