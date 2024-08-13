import React, { useRef } from "react";
import "daisyui/dist/full.css"; // Import DaisyUI styles
import DrawerComponent from "./DrawerComponent";
import { User, User2, UserRoundPen } from "lucide-react";

const ProfileModal = ({ isAdmin, session }) => {
  const modalRef = useRef(null);

  const openModal = () => {
    modalRef.current.showModal();
  };

  const closeModal = () => {
    modalRef.current.close();
  };

  return (
    <>
      <div onClick={openModal}>
        <a className="flex items-center gap-1">
          <User2 size={20} />
          Profile
        </a>

        <dialog
          id="SignUpBtn"
          className="modal modal-top backdrop-blur-sm  sm:modal-middle"
          ref={modalRef}
        >
          <div className="modal-box flex flex-col gap-4 ring-2 ring-base-200">
            {/* Modal Heading */}
            <div className="flex items-center gap-2">
              {isAdmin ? <UserRoundPen /> : <User />}
              <h1 className="text-xl font-medium text-center">Profile</h1>
            </div>

            {/* Modal Content Section*/}
            <section>
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* row 1 */}
                    <tr>
                      <td>
                        <div className="flex items-center gap-3">
                          {/* <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                                alt="Avatar Tailwind CSS Component"
                              />
                            </div>
                          </div> */}
                          <div>
                            <div className="font-medium">
                              {session.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="font-medium">
                        {isAdmin ? "Admin" : "User"}
                      </td>
                    </tr>
                  </tbody>
                  {/* foot */}
                </table>
              </div>
            </section>

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
    </>
  );
};

export default ProfileModal;
