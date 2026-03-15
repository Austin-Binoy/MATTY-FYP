// Boot sequence for the scanner app
App.initAuth();
App.initCamera();
App.initScan();
App.initSubmit();
App.initDashboard();

App.startCamera(App.state.currentFacingMode);
