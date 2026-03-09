import { useState, useEffect } from "react";
import "./../../app.scss";
import "./../../components/entry/entry.scss";
import { toast } from "react-toastify";

import QrCodeScanner from "../../components/qr-code-scanner/QrCodeScanner";
import FullPageLoader from "../../components/full-page-loader/FullPageLoader";
import DataEntryFormModal from "../../components/modals/data-entry-form-modal/DataEntryFormModal";
import { addData } from "../../utils/addData";

export default function EmployeePage() {
  // const [scanResult, setScanResult] = useState(null);
  const [isFullPageLoader, setIsFullPageLoader] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(true);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // fetch and update user data
  /*  useEffect(() => {
    const fetchAndUpdateUser = async () => {
      if (!scanResult) return;

      console.log("scanResult", scanResult);

      // if employee qr code, open form modal
      if (scanResult === "35DN9QXYQ") {
        setIsFormModalOpen(true);
        return;
      } else {
        toast.error("Invalid QR code", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setScanResult(null);
      }
    };

    fetchAndUpdateUser();
  }, [scanResult]); */

  const handleFormSubmit = async (formData) => {
    setIsFormModalOpen(false);
    setIsFullPageLoader(true);
    try {
      const id = await addData(formData);
      if (id) {
        toast.success(`${formData.name}'s data added successfully`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
      setIsFullPageLoader(false);
      setIsFormSubmitted(true);
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Error adding user", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setIsFullPageLoader(false);
      setIsFormSubmitted(false);
    }
  };

  return (
    <div className="App">
      <div className="Entry w-100 h-100  flex-col-center justify-content-center px-4 py-5 gap-3">
        {isFormSubmitted && (
          <h1 className="fs-1 text-center w-100">Thank You</h1>
        )}
        {/* <QrCodeScanner setScanResult={setScanResult} /> */}

        {isFullPageLoader && <FullPageLoader />}

        <DataEntryFormModal
          show={isFormModalOpen}
          onClose={() => {
            // setIsFormModalOpen(false);
          }}
          onSubmit={(formData) => handleFormSubmit(formData)}
        />
      </div>
    </div>
  );
}
