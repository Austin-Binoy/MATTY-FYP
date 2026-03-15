App.refreshData = async function refreshData() {
    const response = await fetch(`/get-data?collection=${App.state.loggedInUser}`);
    const data = await response.json();

    App.state.attendanceData = Array.isArray(data) ? data : [];
    App.renderAttendanceTable();
};

App.renderAttendanceTable = function renderAttendanceTable() {
    const tbody = document.getElementById('table-body');
    const totalCountSpan = document.getElementById('total-count');

    // Date filter works off YYYY-MM-DD from the input element
    const selectedDate = App.elements.dateFilterInput ? App.elements.dateFilterInput.value : "";
    const filteredData = selectedDate
        ? App.state.attendanceData.filter(student => {
            if (!student || !student.timestamp) return false;
            const timestamp = String(student.timestamp);
            return timestamp.slice(0, 10) === selectedDate;
        })
        : App.state.attendanceData;

    tbody.innerHTML = "";
    totalCountSpan.innerText = filteredData.length;

    if (filteredData.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>No records found</td></tr>";
        return;
    }

    filteredData.forEach(student => {
        const dt = new Date(student.timestamp);
        const timeStr = dt.getHours().toString().padStart(2, '0') + ":" +
            dt.getMinutes().toString().padStart(2, '0');
        const dateStr = dt.getDate().toString().padStart(2, '0') + "/" +
            (dt.getMonth() + 1).toString().padStart(2, '0') + "/" +
            dt.getFullYear();

        tbody.innerHTML += `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${timeStr}</td>
                <td>${dateStr}</td>
                <td>
                    <button onclick="deleteRecord('${student._id}')"
                        style="background:#dc3545; color:white; padding:5px 10px; margin:0; font-size:12px; border-radius:3px;">
                        Delete
                    </button>
                </td>
            </tr>`;
    });
};

App.deleteRecord = async function deleteRecord(recordId) {
    if (!confirm("Are you sure you want to permanently delete this student record? This cannot be undone.")) {
        return;
    }

    try {
        const response = await fetch('/delete-student', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: recordId,
                collection: App.state.loggedInUser
            })
        });

        if (response.ok) {
            alert("Record deleted successfully.");
            App.refreshData();
        } else {
            alert("Error deleting record from database.");
        }
    } catch (err) {
        console.error("Delete failed:", err);
        alert("Server error during deletion.");
    }
};

App.initDashboard = function initDashboard() {
    document.getElementById('dashboard-btn').onclick = () => {
        if (!App.state.loggedInUser) {
            location.reload();
            return;
        }

        // Small re-auth step before showing logs
        const verify = prompt(`Security Check: Please enter the password for ${App.state.loggedInUser.toUpperCase()} to access logs:`);
        const correctPass = (App.state.loggedInUser === "admin") ? "admin123" : "trial123";

        if (verify === correctPass) {
            App.elements.scannerView.style.display = 'none';
            App.elements.dashboardView.style.display = 'block';

            document.getElementById('display-role').innerText = `${App.state.loggedInUser.toUpperCase()} Attendance Dashboard`;
            App.refreshData();
        } else if (verify !== null) {
            alert("Incorrect password. Access to sensitive data denied.");
        }
    };

    document.getElementById('back-to-scanner').onclick = () => {
        App.elements.dashboardView.style.display = 'none';
        App.elements.scannerView.style.display = 'block';
    };

    document.getElementById('export-btn').onclick = () => {
        exportAttendancePDF(App.state.loggedInUser);
    };

    if (App.elements.dateFilterInput) {
        App.elements.dateFilterInput.addEventListener('change', App.renderAttendanceTable);
    }

    if (App.elements.clearFilterButton) {
        App.elements.clearFilterButton.addEventListener('click', () => {
            if (App.elements.dateFilterInput) {
                App.elements.dateFilterInput.value = "";
            }
            App.renderAttendanceTable();
        });
    }

    document.getElementById('logout-btn').onclick = () => {
        location.reload();
    };

    // Expose these for inline button handlers in index.html
    window.refreshData = App.refreshData;
    window.deleteRecord = App.deleteRecord;
};
