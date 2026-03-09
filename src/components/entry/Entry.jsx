import { useState, useEffect } from "react";
import "./entry.scss";
import { toast } from "react-toastify";
import { serverTimestamp } from "firebase/firestore";

import QrCodeScanner from "../qr-code-scanner/QrCodeScanner";
import UserDetailsModal from "./../modals/user-details-modal/UserDetailsModal";
import { getUserDataById } from "../../utils/getUserDataById";
import { getUserDataByMcid } from "../../utils/getUserDataById";
import updateUserDataById from "../../utils/updateUserDetailsById";
import { allDataFetch } from "../../utils/getUserDataById";
import FullPageLoader from "../full-page-loader/FullPageLoader";

import logo from "./../../assets/logo.png";

export default function Entry({ currentPage }) {
  const [scanResult, setScanResult] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isFullPageLoader, setIsFullPageLoader] = useState(false);

  const citiesArr = ["MUMBAI"];

  // fetch and update user data
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

        const matchedUser = data[0];
        // const matchedUser = data.find((userData) =>
        //   citiesArr.includes(userData.city),
        // );

        // Check if user is from any of the cities
        // if (!matchedUser) {
        //   toast.error(`User is not from ${citiesArr.join(", ")}`, {
        //     position: "top-center",
        //     autoClose: 2000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     theme: "light",
        //   });
        //   setScanResult(null);
        //   setIsFullPageLoader(false);
        //   return;
        // }

        setUserData(matchedUser);

        // Check if user has already scanned
        if (matchedUser?.entryTime) {
          // Convert Firestore Timestamp to JS Date
          const dateObj = matchedUser.entryTime.toDate();
          const formattedTime = dateObj.toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          });
          toast.warning(
            `${matchedUser.fullName}'s qr code has already scanned at ${formattedTime}`,
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

  // Fetch all data
  /*   useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await allDataFetch();

        if (allData) {
          const allCityDataLength = {};

          allData.map((data) => {
            if (!allCityDataLength[data.city]) {
              allCityDataLength[data.city] = 1;
            } else {
              allCityDataLength[data.city] = allCityDataLength[data.city] + 1;
            }
          });

          console.log("All Data", allData.length);

          console.log(allCityDataLength);

          console.log(
            "sum",
            Object.values(allCityDataLength).reduce((a, b) => a + b, 0)
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }); */

  return (
    <div className="Entry w-100 h-100  flex-col-center justify-content-start px-4 py-4">
      <img src={logo} alt="logo" className="logo" />
      <h1 className="text-center w-100">Scan at Entry Point</h1>
      <QrCodeScanner setScanResult={setScanResult} currentPage={currentPage} />
      {userData && !userData?.entryTime && (
        <UserDetailsModal
          onClose={() => {
            setScanResult(null);
            setUserData(null);
          }}
          userData={userData}
        />
      )}
      {isFullPageLoader && <FullPageLoader />}
    </div>
  );
}
