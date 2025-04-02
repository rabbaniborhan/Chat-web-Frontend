import { Image, Send, X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../store/useChatStore";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  // Memoize the image change handler
  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  // Memoize the remove image function
  const removeImage = useCallback(() => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // Optimized message handler
  const handleMessage = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmedText = text.trim();
      if (!trimmedText && !imagePreview) return;

      try {
        // Create a local copy of values before resetting
        const messageToSend = {
          text: trimmedText,
          image: imagePreview,
        };

        // Reset UI immediately for better perceived performance
        setText("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        // Send message after UI update
        await sendMessage(messageToSend);
      } catch (error) {
        console.error("Message send error:", error);
        // Optionally restore the message if sending failed
        setText(text);
        setImagePreview(imagePreview);
      }
    },
    [text, imagePreview, sendMessage]
  );

  // Handle Enter key more efficiently
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleMessage(e);
      }
    },
    [handleMessage]
  );

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              loading="lazy" // Add lazy loading for better performance
            />
            <button
              className="absolute cursor-pointer -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              onClick={removeImage}
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-sm btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={16} />
          </button>
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="btn btn-sm btn-circle"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default React.memo(ChatInput);
