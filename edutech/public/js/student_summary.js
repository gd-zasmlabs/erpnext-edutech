frappe.ready(async () => {
  console.log("JS Loaded ✅");

  document.addEventListener("click", function (e) {
    const dropdown = document.getElementById('student-dropdown');
    const toggle = document.querySelector('.dropdown-toggle');
    if (!dropdown.contains(e.target) && e.target !== toggle) {
      dropdown.classList.remove("show");
    }
  });

const r = await frappe.call({
  method: 'apps.edutech.edutech.api.student_summary.get_student_summary',  // ✅ CORRECT PATH
  args: {
    student_ids: selectedIds,
    filters: {
      show_course: true,
      show_grade: true,
      show_attendance: true
    }
  }
});
console.log("Backend response ✅", r.message);


  const list = document.getElementById('student-checkboxes');
  res.message.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<label><input type="checkbox" name="student" value="${s.name}" data-fullname="${s.first_name} ${s.last_name}"> ${s.first_name} ${s.last_name}</label>`;
    list.appendChild(li);
  });

  // 🔁 Attach click handler inside frappe.ready
  document.getElementById('generate-btn').addEventListener('click', generateStudentTable);
});

function toggleDropdown() {
  const dropdown = document.getElementById('student-dropdown');
  dropdown.classList.toggle("show");
}

function generateStudentTable() {
  console.log("Generate button clicked ✅");

  const selected = [...document.querySelectorAll('input[name="student"]:checked')]
    .map(cb => cb.getAttribute("data-fullname"));

  if (selected.length === 0) {
    frappe.msgprint("Please select at least one student.");
    return;
  }

  const container = document.getElementById('summary-table');
  container.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'table table-bordered';

  const header = document.createElement('tr');
  header.innerHTML = '<th>Selected Students</th>';
  table.appendChild(header);

  selected.forEach(name => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${name}</td>`;
    table.appendChild(row);
  });

  container.appendChild(table);
}
