import React, { useEffect, useRef } from "react";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const messagesEndRef = useRef(null);
  const { authUser } = useAuthStore();
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    getMessages,
    selectedUser._id,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <ChatInput />
      </div>
    );
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div
        style={{ scrollBehavior: "smooth" }}
        className="flex-1 overflow-y-auto p-4 space-y-4 "
      >
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`chat ${
              message?.senderId === authUser?._id ||
              message?.newMessage?.senderId === authUser?._id
                ? "chat-end"
                : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border ">
                <img
                  src={
                    message?.senderId === authUser?._id ||
                    message?.newMessage?.senderId === authUser?._id
                      ? authUser?.profilePic || "/avater.png"
                      : selectedUser?.profilePic || "/avater.png"
                  }
                  alt="Profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(
                  message?.newMessage
                    ? message?.newMessage?.createdAt
                    : message?.createdAt
                )}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {(message?.image || message?.newMessage?.image) && (
                <img
                  src={
                    message?.newMessage
                      ? message?.newMessage?.image
                      : message?.image
                  }
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {(message?.text || message?.newMessage?.text) && (
                <p>
                  {message?.newMessage
                    ? message?.newMessage?.text
                    : message?.text}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatContainer;
