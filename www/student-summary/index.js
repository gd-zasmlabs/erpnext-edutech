frappe.ready(async () => {
    document.addEventListener("click", function (e) {
        const dropdown = document.getElementById('student-dropdown');
        const toggle = document.querySelector('.dropdown-toggle');
        if (!dropdown.contains(e.target) && e.target !== toggle) {
            dropdown.classList.remove("show");
        }
    });

    const res = await frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Student',
            fields: ['name', 'first_name', 'last_name'],
            limit: 100
        }
    });

    if (res && res.message && Array.isArray(res.message)) {
        const list = document.getElementById('student-checkboxes');
        res.message.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = `<label><input type="checkbox" name="student" value="${s.name}"> ${s.first_name} ${s.last_name}</label>`;
            list.appendChild(li);
        });
    }
});

function toggleDropdown() {
    const dropdown = document.getElementById('student-dropdown');
    dropdown.classList.toggle("show");
}

async function generateSummary() {
    const selected = [...document.querySelectorAll('input[name="student"]:checked')]
        .map(cb => cb.value);

    if (selected.length === 0) {
        frappe.msgprint("Please select at least one student.");
        return;
    }

    const filters = {
        show_course: document.getElementById('filter_course').checked,
        show_grade: document.getElementById('filter_grade').checked,
        show_attendance: document.getElementById('filter_attendance').checked
    };

    const r = await frappe.call({
        method: 'edutech.api.api.get_student_summary',
        args: {
            student_ids: selected,
            filters: filters
        }
    });

    if (r.message && r.message.students && r.message.data) {
        renderTable(r.message);
    } else {
        frappe.msgprint("No data returned from server.");
    }
}

function renderTable(data) {
    const container = document.getElementById('summary-table');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table table-bordered';

    const header = document.createElement('tr');
    header.innerHTML = `<th>Category ↓ / Student →</th>`;
    data.students.forEach(s => {
        header.innerHTML += `<th>${s}</th>`;
    });
    table.appendChild(header);

    if (data.show_course) {
        const row = document.createElement('tr');
        row.innerHTML = `<td><b>Course</b></td>`;
        data.students.forEach(s => {
            const courses = data.data[s]?.courses || [];
            const courseHTML = courses.map(c =>
                `${c.course_code} - ${c.course_name} (${c.credits})`
            ).join("<br>") || "—";
            row.innerHTML += `<td>${courseHTML}</td>`;
        });
        table.appendChild(row);
    }

    if (data.show_grade) {
        const row = document.createElement('tr');
        row.innerHTML = `<td><b>Grade</b></td>`;
        data.students.forEach(s => {
            const grades = data.data[s]?.grades || [];
            const gradeHTML = grades.join("<br>") || "—";
            row.innerHTML += `<td>${gradeHTML}</td>`;
        });
        table.appendChild(row);
    }

    if (data.show_attendance) {
        const row = document.createElement('tr');
        row.innerHTML = `<td><b>Attendance (%)</b></td>`;
        data.students.forEach(s => {
            const att = data.data[s]?.attendance ?? "—";
            row.innerHTML += `<td>${att}%</td>`;
        });
        table.appendChild(row);
    }

    container.appendChild(table);
}
