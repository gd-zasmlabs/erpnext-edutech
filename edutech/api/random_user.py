import frappe
import requests
import random

@frappe.whitelist()
def create_student_from_api():
    try:
        res = requests.get("https://randomuser.me/api/")
        user = res.json()['results'][0]

        student_id = f"{random.randint(100000, 999999)}"
        first_name = user['name']['first']
        last_name = user['name']['last']
        gender = user['gender'].capitalize()
        dob = user['dob']['date'].split("T")[0]
        email = user['email']
        phone = user['phone']
        city = user['location']['city']
        state = user['location']['state']
        country = user['location']['country']
        postcode = user['location']['postcode']
        address = f"{city}, {state}, {country} - {postcode}"

        student = frappe.get_doc({
            "doctype": "Student",
            "student_id": student_id,
            "first_name": first_name,
            "last_name": last_name,
            "gender": gender,
            "date_of_birth": dob,
            "email": email,
            "phone": phone,
            "address": address
        })

        student.insert(ignore_permissions=True)
        frappe.db.commit()

        return {
            "message": "Student created successfully",
            "student_name": student.name
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Student API Error")
        return {"error": "Failed to create student"}
