import React, { useRef } from "react";
import "daisyui/dist/full.css"; // Import DaisyUI styles

const ProfileModal = () => {
  const modalRef = useRef(null);

  const openModal = () => {
    modalRef.current.showModal();
  };

  const closeModal = () => {
    modalRef.current.close();
  };

  return (
    <div onClick={openModal}>
      <a>Profile</a>

      <dialog
        id="SignUpBtn"
        className="modal modal-bottom backdrop-blur-sm sm:modal-middle"
        ref={modalRef}
      >
        <div className="modal-box flex flex-col gap-4 ring-2 ring-base-200">
          <h1 class="text-center text-2xl font-bold">Download App</h1>

          <div class="divider">OR</div>
          <h1 className="text-center font-medium text-gray-500">
            Scan to download
          </h1>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop ">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ProfileModal;
