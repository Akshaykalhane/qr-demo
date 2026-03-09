import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RegistrationStatusModal({
  status,
  show,
  onClose,
  base64,
}) {
  // Download function
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = base64; // base64 string passed as prop
    link.download = "qrcode.png"; // filename
    link.click();
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-center p-3">
          <div className="modal-body">
            {status === "success" ? (
              <>
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h4 className="mt-3 text-success">Registration Successful!</h4>
                <p>QR code has been sent to your email.</p>

                {/* Download Button */}
                {base64 && (
                  <button
                    className="btn btn-success mt-3"
                    onClick={downloadImage}
                  >
                    <i className="bi bi-download"></i> Download QR
                  </button>
                )}
              </>
            ) : (
              <>
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h4 className="mt-3 text-danger">Registration Failed</h4>
                <p>Something went wrong. Please try again.</p>
              </>
            )}
          </div>

          <div className="modal-footer border-0 justify-content-center">
            <button className="btn btn-primary px-4" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
