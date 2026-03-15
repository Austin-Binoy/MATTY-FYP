App.initSubmit = function initSubmit() {
    // Only allow submit after user consent
    App.elements.consentCheck.onchange = () => {
        App.elements.submitBtn.disabled = !App.elements.consentCheck.checked;
        App.elements.submitBtn.style.opacity = App.elements.consentCheck.checked ? "1" : "0.5";
    };

    App.elements.submitBtn.onclick = async () => {
        const payload = {
            studentId: App.elements.idField.value,
            name: App.elements.nameField.value,
            account: App.state.loggedInUser
        };

        try {
            const res = await fetch('/save-student', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert(`Success: Saved to ${App.state.loggedInUser} database.`);
                // Reset form for the next scan
                App.elements.idField.value = "";
                App.elements.nameField.value = "";
                App.elements.scanForm.style.display = 'none';
                App.elements.consentCheck.checked = false;
                App.elements.submitBtn.disabled = true;
                App.elements.statusMsg.innerText = "Ready for next scan...";
            }
        } catch (err) {
            alert("Database connection error.");
        }
    };
};
