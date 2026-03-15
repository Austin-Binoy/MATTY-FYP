window.App = {
    // Grab all main DOM nodes once so we don't keep querying every time
    elements: {
        video: document.getElementById('webcam'),
        captureBtn: document.getElementById('capture'),
        statusMsg: document.getElementById('status-message'),
        idField: document.getElementById('id-field'),
        nameField: document.getElementById('name-field'),
        scanForm: document.getElementById('scan-form'),
        submitBtn: document.getElementById('submit-btn'),
        consentCheck: document.getElementById('consent-check'),
        scannerView: document.getElementById('scanner-view'),
        dashboardView: document.getElementById('dashboard-view'),
        accountHeader: document.getElementById('account-header'),
        userDisplay: document.getElementById('user-display'),
        cameraContainer: document.querySelector('.container'),
        dateFilterInput: document.getElementById('date-filter'),
        clearFilterButton: document.getElementById('clear-filter-btn')
    },
    // Shared runtime state used across modules
    state: {
        loggedInUser: "",
        attendanceData: [],
        currentFacingMode: "environment",
        currentStream: null,
        isMobileDevice: /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
};

if (window.App.state.isMobileDevice) {
    // Mobile gets a slightly different scanner layout treatment
    document.body.classList.add('mobile-scan');
}
