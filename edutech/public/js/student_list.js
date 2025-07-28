frappe.listview_settings['Student'] = {
    onload: function(listview) {
        listview.page.add_inner_button('Import Random User', function() {
            frappe.call({
                method: 'edutech.api.random_user.create_student_from_api',
                callback: function(r) {
                    if (r.message) {
                        frappe.msgprint(r.message);
                        listview.refresh(); // reload list view
                    } else {
                        frappe.msgprint("Failed to import student.");
                    }
                }
            });
        });
    }
};
