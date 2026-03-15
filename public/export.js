// export.js
function exportAttendancePDF(userName) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Add Title
    const title = `Maynooth ID Portal - Attendance Report (${userName.toUpperCase()})`;
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // 2. Add Timestamp of Export
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 22);

    // 3. Generate Table
    // This looks for the table with ID #attendance-table in index.html
    doc.autoTable({
        html: '#attendance-table',
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [0, 123, 255] }, // Match your blue UI
        styles: { fontSize: 10 }
    });

    // 4. Save file
    doc.save(`Attendance_${userName}_${new Date().toLocaleDateString()}.pdf`);
}