import React, { useEffect, useState } from "react";
import "./user-details-modal.scss";
import { arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

import { listenToUserDataById } from "../../../utils/getUserDataById";
import updateUserDataById from "../../../utils/updateUserDetailsById";
import Stepper from "../../stepper/Stepper";
import ConfirmSubmitModal from "../confirm-submit-modal/ConfirmSubmitModal";
import FullPageLoader from "../../full-page-loader/FullPageLoader";

export default function UserDetailsModal({ onClose, userData }) {
  const [nameInput, setNameInput] = useState("");
  const [people, setPeople] = useState([]);
  const [noOfPeople, setNoOfPeople] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isShowFullPageLoader, setIsShowFullPageLoader] = useState(false);
  console.log("usermodal", userData);
  useEffect(() => {
    console.log(userData.id);
  }, [userData]);

  // handle form submission
  /* const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData?.id || !nameInput.trim()) return;

    try {
      await updateUserDataById(userData.id, {
        people: arrayUnion(nameInput.trim()),
      });

      setNameInput("");
    } catch (error) {
      console.error("Error updating people array:", error);
    }
  }; */

  // Realtime listener for people array
  /* useEffect(() => {
    if (!userData?.id) return;

    const unsubscribe = listenToUserDataById(userData?.id, (data) => {
      setPeople(data.people || []);
    });

    return () => unsubscribe && unsubscribe();
  }, [userData?.id]); */

  // Delete name from people array
  /* const handleDelete = async (name) => {
    if (!userData?.id || !name) return;

    try {
      await updateUserDataById(userData.id, {
        people: arrayRemove(name),
      });
    } catch (error) {
      console.error("Error removing name:", error);
    }
  }; */

  // Update no of people
  const submitData = async (value) => {
    setShowModal(false);

    // if (value === undefined || !userData?.id) return;
    if (!userData?.id) return;

    setIsShowFullPageLoader(true);

    try {
      await updateUserDataById(userData.id, {
        // noOfPeople: value,
        entryTime: serverTimestamp(),
      });
      console.log(" updated");
      toast.success(`Entry recorded successfully.`, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setTimeout(() => {
        setIsShowFullPageLoader(false);
        onClose();
      }, 2500);
    } catch (error) {
      console.error("Error updating:", error);
      setIsShowFullPageLoader(false);
    }
  };

  return (
    <section className="UserDetailsModal flex-row-center position-fixed top-0 start-0 h-100 w-100">
      {userData?.id ? (
        <div className="contentWrapper flex-col-center bg-light py-4 px-3 px-md-4 overflow-auto">
          <div className="flex-row-center justify-content-between w-100">
            <h2 className="font-weight-bold text-black fs-2">User Details</h2>

            <button className="btn btn-danger" onClick={onClose}>
              Close
            </button>
          </div>

          {/* User details */}
          <div className="table-responsive w-100">
            <table className="table table-striped table-bordered bg-white w-100 mt-3">
              <tbody>
                <tr>
                  <th scope="row">Full Name</th>
                  <td>{userData?.fullName}</td>
                </tr>
                <tr>
                  <th scope="row">Email</th>
                  <td>{userData?.email}</td>
                </tr>
                {userData?.phone && (
                  <tr>
                    <th scope="row">Phone</th>
                    <td>{userData?.phone}</td>
                  </tr>
                )}
                {userData?.category && (
                  <tr>
                    <th scope="row">Category</th>
                    <td>{userData?.category}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* No of people */}
          <section className="d-flex flex-column gap-3 mt-3 me-auto">
            {/* <h2 className="font-weight-bold text-black fs-2">No. of People</h2>
            <Stepper
              min={0}
              max={100}
              step={1}
              initial={userData?.noOfPeople || 0}
              onChange={(val) => setNoOfPeople(val)}
            /> */}
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              Submit
            </button>
            <ConfirmSubmitModal
              show={showModal}
              onClose={() => setShowModal(false)}
              onConfirm={() => submitData(noOfPeople)}
              type={"entry"}
            />
            {isShowFullPageLoader && <FullPageLoader />}
          </section>
        </div>
      ) : (
        <FullPageLoader />
      )}
    </section>
  );
}
