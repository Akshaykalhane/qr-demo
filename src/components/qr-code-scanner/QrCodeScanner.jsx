import { useEffect, useRef, useState } from "react";
import "./qrCodeOverwrite.css";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QrCodeScanner({ setScanResult }) {
  const scannerRef = useRef(null);
  const scannerInstance = useRef(null);

  useEffect(() => {
    if (scannerInstance.current) {
      console.log(scannerInstance.current);
      return;
    }

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scannerInstance.current = scanner;

    // success function
    const onScanSuccess = (decodedResult) => {
      setScanResult(decodedResult);

      let stopButton = document.getElementById(
        "html5-qrcode-button-camera-stop"
      );
      if (stopButton) stopButton.click();
    };

    // error function
    const onScanFailure = (error) => {
      if (error) {
        console.log("error", error);
      }
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerInstance.current) {
        scannerInstance.current.clear().catch((error) => {
          console.error("Failed to clear html5QrcodeScanner:", error);
        });
        scannerInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="QrCodeScanner flex-col-center w-100 w-md-75 h-auto p-2">
      <div id="qr-reader" ref={scannerRef} className="flex-col-center"></div>
    </div>
  );
}
