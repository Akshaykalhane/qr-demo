import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./registration.scss";
import QRCode from "qrcode";
import { serverTimestamp } from "firebase/firestore";

import { uploadBase64Image } from "../../utils/uploadImg";
import { addData } from "../../utils/addData";
import { sendEmail } from "../../utils/sendEmail";
import RegistrationStatusModal from "../../components/registration/Registration";

function generateUniqueFileName() {
  const timestamp = Date.now().toString();
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}${randomStr}`;
}

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    category: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("success");
  const [b64Qr, setB64Qr] = useState("");

  // function to handle form change
  const handleChange = (e) => {
    if (e.target.name === "phone") {
      e.target.value = e.target.value.slice(0, 10);
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log(formData);

  // function to generate QR code
  const generateQR = async (email) => {
    if (!email.trim()) {
      console.error("Email is required to generate QR code.");
      return;
    }

    try {
      const qrB64 = await QRCode.toDataURL(email, {
        width: 300,
        margin: 2,
      });
      return qrB64;
    } catch (err) {
      console.error("QR generation error:", err);
      return null;
    }
  };

  // funtion to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    if (
      formData.fullName.trim() === "" ||
      formData.email.trim() === "" ||
      formData.phone.trim() === ""
    ) {
      alert("Please fill all the fields");
      setIsUploading(false);
      return;
    }

    if (formData.phone.length < 10) {
      alert("Please enter a valid phone number");
      setIsUploading(false);
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      alert("Please enter a valid email address");
      setIsUploading(false);
      return;
    }

    console.log("qr generation started");
    function generateMCID() {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      return `MC${timestamp}${random}`;
    }
    let mcid = generateMCID();
    // generate QR code
    const qrB64 = await generateQR(mcid);

    if (!qrB64) {
      setIsUploading(false);
      setShowModal(true);
      setStatus("failed");
      console.log("qr generation failed");
      alert("QR code generation failed");
      return;
    }
    console.log("qr generation completed");
    setB64Qr(qrB64);

    const fileName = generateUniqueFileName();

    console.log("email send started");
    // send email
    const payload = {
      extra: {
        filename: fileName,
        email: formData.email,
        base64: qrB64,
      },
    };

    sendEmail(payload)
      .then((data) => console.log("Success:", data))
      .catch((err) => {
        console.error("Failed:", err);
        setIsUploading(false);
        setShowModal(true);
        setStatus("failed");
        alert("Email sending failed");
      });

    console.log("email send completed");

    console.log("qr upload started");
    // upload qr code to firebase storage
    const qrUrl = await uploadBase64Image(qrB64, `qr-demo/${fileName}.png`);

    if (!qrUrl) {
      setIsUploading(false);
      setShowModal(true);
      setStatus("failed");
      console.log("qr upload failed");
      alert("QR code upload failed");
      return;
    }
    console.log("qr upload completed");

    console.log("data upload started");
    // add data to firebase firestore
    const data = {
      ...formData,
      fileName,
      qrUrl,
      createdAt: serverTimestamp(),
      mcid: mcid,
    };
    const docId = await addData(data, import.meta.env.VITE_FIREBASE_REG_COL);

    if (!docId) {
      setIsUploading(false);
      setShowModal(true);
      setStatus("failed");
      console.log("data upload failed");
      alert("Data upload failed");
      return;
    }
    console.log("data upload completed");
    setIsUploading(false);
    setShowModal(true);
    setStatus("success");
  };

  return (
    <div className="App RegistrationPage">
      <div className="flex-col-center justify-content-start px-4 py-5">
        <h3 className="fs-4 text-black text-center mb-4">
          PLEASE REGISTER YOURSELF
        </h3>
        <form onSubmit={handleSubmit} className="w-100 p-1 p-md-3 p-lg-4">
          <div className="mb-3">
            <label className="form-label">Full Name*</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your name"
              className="form-control p-2 p-md-3 p-xl-2"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">E-mail*</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-control p-2 p-md-3 p-xl-2"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone No*</label>
            <input
              type="number"
              name="phone"
              placeholder="Enter your phone number"
              className="form-control p-2 p-md-3 p-xl-2"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category*</label>

            <select
              name="category"
              className="form-select p-2 p-md-3 p-xl-2"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="student">Student</option>
              <option value="professional">Professional</option>
              <option value="business">Business</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-5"
            disabled={isUploading}
          >
            {isUploading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <RegistrationStatusModal
        status={status}
        show={showModal}
        base64={b64Qr}
        onClose={() => {
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            category: "",
          });
          setShowModal(false);
        }}
      />
    </div>
  );
}
