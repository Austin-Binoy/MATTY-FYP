App.startCamera = async function startCamera(facingMode) {
    // Stop old stream before switching camera to avoid conflicts
    if (App.state.currentStream) {
        App.state.currentStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
        video: App.state.isMobileDevice
            ? {
                facingMode: { ideal: facingMode },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
            : {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
    };

    try {
        App.state.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        App.elements.video.srcObject = App.state.currentStream;
        App.elements.video.setAttribute("playsinline", true);
        App.elements.video.onloadedmetadata = () => {
            if (!App.elements.cameraContainer) return;

            if (App.state.isMobileDevice) {
                // Keep mobile on cover mode (no letterboxing)
                App.elements.cameraContainer.classList.remove('portrait-feed');
                return;
            }

            const isPortraitFeed = App.elements.video.videoHeight > App.elements.video.videoWidth;
            App.elements.cameraContainer.classList.toggle('portrait-feed', isPortraitFeed);
        };
        App.elements.video.play();
    } catch (err) {
        console.error("Camera error:", err);
        App.elements.statusMsg.innerText = "Error: Camera not found.";
    }
};

App.initCamera = function initCamera() {
    document.getElementById('swap-camera').onclick = () => {
        // Quick toggle between rear and front lens
        App.state.currentFacingMode = (App.state.currentFacingMode === "environment") ? "user" : "environment";
        App.startCamera(App.state.currentFacingMode);
    };
};
