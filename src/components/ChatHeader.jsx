import { X } from "lucide-react";
import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUser } = useAuthStore();
  return (
    <div className=" p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/avater.png"}
                alt={selectedUser?.fullName}
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium ">{selectedUser?.fullName}</h3>
            <p>
              {" "}
              {onlineUser?.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button
          className="cursor-pointer p-2 rounded-lg bg-base-300"
          onClick={() => setSelectedUser(null)}
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
