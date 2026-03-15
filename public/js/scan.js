App.initScan = function initScan() {
    App.elements.captureBtn.onclick = () => {
        App.elements.statusMsg.innerText = "Scanning ID...";

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let sourceX;
        let sourceY;
        let sourceWidth;
        let sourceHeight;
        // Approximate student card aspect ratio
        const cardAspect = 1.586;

        if (App.state.isMobileDevice) {
            // Mobile crop is tighter to avoid extra background noise
            sourceWidth = Math.floor(App.elements.video.videoWidth * 0.9);
            sourceHeight = Math.floor(sourceWidth / cardAspect);

            const maxHeight = Math.floor(App.elements.video.videoHeight * 0.55);
            if (sourceHeight > maxHeight) {
                sourceHeight = maxHeight;
                sourceWidth = Math.floor(sourceHeight * cardAspect);
            }

            sourceX = Math.floor((App.elements.video.videoWidth - sourceWidth) / 2);
            sourceY = Math.floor((App.elements.video.videoHeight - sourceHeight) / 2);
        } else {
            sourceWidth = Math.floor(App.elements.video.videoWidth * 0.88);
            sourceHeight = Math.floor(sourceWidth / cardAspect);

            const maxHeight = Math.floor(App.elements.video.videoHeight * 0.8);
            if (sourceHeight > maxHeight) {
                sourceHeight = maxHeight;
                sourceWidth = Math.floor(sourceHeight * cardAspect);
            }

            sourceX = Math.floor((App.elements.video.videoWidth - sourceWidth) / 2);
            sourceY = Math.floor((App.elements.video.videoHeight - sourceHeight) / 2);
        }

        canvas.width = sourceWidth;
        canvas.height = sourceHeight;
        // Draw only the cropped area we actually want to OCR
        ctx.drawImage(App.elements.video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);

        fetch('/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: canvas.toDataURL('image/jpeg', 0.8) })
        })
            .then(r => r.json())
            .then(data => {
                const parts = data.result.split('|');
                App.elements.idField.value = parts[0] ? parts[0].replace('ID:', '').trim() : "";
                App.elements.nameField.value = parts[1] ? parts[1].replace('NAME:', '').trim() : "";

                App.elements.consentCheck.checked = false;
                App.elements.submitBtn.disabled = true;
                App.elements.submitBtn.style.opacity = "0.5";

                App.elements.scanForm.style.display = 'block';
                App.elements.statusMsg.innerText = "Scan Complete! Please verify.";
            })
            .catch(err => {
                console.error("OCR Error:", err);
                App.elements.statusMsg.innerText = "OCR Server Error.";
            });
    };
};
