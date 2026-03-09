import { useEffect, useState } from "react";
import "./dinner.scss";

import { toast } from "react-toastify";
import { serverTimestamp } from "firebase/firestore";
import QrCodeScanner from "../qr-code-scanner/QrCodeScanner";
import UserDetailsModal from "../modals/user-details-modal/UserDetailsModal";
import { getUserDataByMcid } from "../../utils/getUserDataById";

import FullPageLoader from "../full-page-loader/FullPageLoader";

import updateUserDataById from "../../utils/updateUserDetailsById";
import ConfirmSubmitModal from "../modals/confirm-submit-modal/ConfirmSubmitModal";

import logo from "./../../assets/logo.png";

export default function Dinner() {
  const [scanResult, setScanResult] = useState(null);
  const [isFullPageLoader, setIsFullPageLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);

  const citiesArr = ["MUMBAI"];

  // fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!scanResult) return;

      console.log("scanResult", scanResult);

      setIsFullPageLoader(true);

      try {
        // const data = await getUserDataById(scanResult);
        const data = await getUserDataByMcid(scanResult);

        console.log(data);

        // Check if the user exists
        if (!Array.isArray(data)) {
          toast.error("User not found", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          setScanResult(null);
          setIsFullPageLoader(false);
          return;
        }

        // const matchedUser = data.find((userData) =>
        //   citiesArr.includes(userData.city),
        // );

        const matchedUser = data[0];

        // Check if user is from any of the cities
        if (!matchedUser) {
          toast.error(`User is not from ${citiesArr.join(", ")}`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          setScanResult(null);
          setIsFullPageLoader(false);
          return;
        }

        setUserData(matchedUser);

        // Check if user has already exited
        if (matchedUser?.dinnerTime) {
          // Convert Firestore Timestamp to JS Date
          const dateObj = matchedUser.dinnerTime.toDate();
          const formattedTime = dateObj.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          });
          toast.error(
            `${matchedUser.fullName} has already checked in for dinner.`,
            {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            },
          );
          setScanResult(null);
          setIsFullPageLoader(false);
          return;
        }

        // Check if user has already scanned
        if (!matchedUser?.entryTime) {
          toast.error(`${matchedUser.fullName}'s qr code has not scanned yet`, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
          setScanResult(null);
          setIsFullPageLoader(false);
          return;
        }

        setShowModal(true);
        setScanResult(null);
        setIsFullPageLoader(false);
      } catch (error) {
        console.error("Error fetching or updating user:", error);
        setScanResult(null);
        setIsFullPageLoader(false);
      }
    };

    fetchUserData();
  }, [scanResult]);

  // Submit data
  const submitData = () => {
    const updateUser = async () => {
      try {
        if (userData?.id && userData?.entryTime) {
          setIsFullPageLoader(true);

          // Update exit time
          await updateUserDataById(userData.id, {
            dinnerTime: serverTimestamp(),
          });
          console.log("Exit time updated");

          toast.success(
            `${userData.fullName} successfully checked in for dinner.`,
            {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            },
          );
          setShowModal(false);
          setScanResult(null);
          setTimeout(() => {
            setIsFullPageLoader(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching or updating user:", error);
        setScanResult(null);
        setIsFullPageLoader(false);
      }
    };

    updateUser();
  };

  return (
    <div className="Entry w-100 h-100  flex-col-center justify-content-start px-4 py-5">
      <img src={logo} alt="logo" className="logo" />
      <h1 className="text-center w-100">Scan at Dinner Point</h1>
      <QrCodeScanner setScanResult={setScanResult} />
      <ConfirmSubmitModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => submitData()}
        type={"dinner"}
      />
      {isFullPageLoader && <FullPageLoader />}
    </div>
  );
}
