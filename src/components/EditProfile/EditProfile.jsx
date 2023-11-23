import { useEffect, useState } from "react";
import InputSection from "../Ui/InputSection";
import Button from "../Ui/Button";
import LoadingIndicator from "../Ui/LoadingIndicator";
import { toast } from "react-toastify";
import { updateProfilePic } from "../../services/user.service";
import { updateUser } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import ImageWithLoading from "../helper/ImageWithLoading";
import useFirebaseAuth from "../../hooks/useFirebaseAuth";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function EditProfile() {
  const { user } = useFirebaseAuth();
  const { phone, username, firstName, lastName, userProfile, profileLoading } =
    useUserProfile(user);

  const [editedPhone, setEditedPhone] = useState("");
  const [editedUsername, setEditedUsername] = useState("");
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");

  const navigate = useNavigate();

  const usernameChangeHandler = (event) => {
    setEditedUsername(event.target.value);
  };

  const phoneChangeHandler = (event) => {
    setEditedPhone(event.target.value);
  };

  const firstNameChangeHandler = (event) => {
    setEditedFirstName(event.target.value);
  };

  const lastNameChangeHandler = (event) => {
    setEditedLastName(event.target.value);
  };

  const updateHandler = async (event) => {
    event.preventDefault();

    try {
      const content = {
        phone: editedPhone,
        firstName: editedFirstName,
        lastName: editedLastName,
      };
      await updateUser(username, content);
      toast.success("Successfully updated profile!");
      navigate("/profile");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!userProfile) return;

    setEditedPhone(phone);
    setEditedUsername(username);
    setEditedFirstName(firstName);
    setEditedLastName(lastName);
  }, [profileLoading]);

  const updateImageHandler = async (event) => {
    event.preventDefault();

    // setIsPictureReady(true);
    const file = event.target.files[0];

    try {
      await updateProfilePic(file, userProfile);
      toast.success("Successfully uploaded profile picture!");
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }

    // setIsPictureReady(false);
  };

  return (
    <>
      {profileLoading && <LoadingIndicator />}
      {!profileLoading && (
        <div>
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-gray-700 shadow-md sm:max-w-lg sm:rounded-lg">
            <form>
              <div className="mb-4">
                <div className="mb-4">
                  <InputSection
                    onChange={firstNameChangeHandler}
                    label="First Name"
                    type="text"
                    value={editedFirstName}
                  />
                </div>
                <InputSection
                  onChange={lastNameChangeHandler}
                  label="Last Name"
                  type="text"
                  value={editedLastName}
                />
              </div>
              <div>
                <InputSection
                  onChange={usernameChangeHandler}
                  label="Username"
                  type="text"
                  value={editedUsername}
                />
              </div>
              <div className="mb-4">
                <InputSection
                  onChange={phoneChangeHandler}
                  label="Phone"
                  type="text"
                  value={editedPhone}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ImageWithLoading
                  key={userProfile.profilePictureURL}
                  className="w-24 h-24 mb-3 rounded-full shadow-lg"
                  src={
                    userProfile.profilePictureURL ||
                    "/src/assets/empty_profile_pic.webp"
                  }
                  width="6rem"
                  height="6rem"
                />
                <div className="flex flex-col items-start">
                  <input
                    type="file"
                    id="fileInput"
                    onChange={updateImageHandler}
                  />
                </div>
              </div>
              <Button
                title="Update"
                onClick={updateHandler}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
