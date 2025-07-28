// Copyright (c) 2025, Glavin and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Student", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on('Student', {
    refresh: function(frm) {
        frm.add_custom_button('Fetch Summary', function () {
            frappe.call({
                method: 'edutech.api.summary.get_student_summary',
                args: { student_id: frm.doc.name },
                callback: function (r) {
                    if (r.message) {
                        let html = `
                            <p><strong>Full Name:</strong> ${r.message.full_name}</p>
                            <p><strong>Date of Birth:</strong> ${r.message.dob}</p>
                            <p><strong>Program:</strong> ${r.message.program}</p>
                            <p><strong>Course:</strong> ${r.message.course}</p>
                            <p><strong>Enrollment Date:</strong> ${r.message.enrolled}</p>
                        `;
                        frm.set_df_property('summary_info', 'options', html);
                    }
                }
            });
        });
    }
});
