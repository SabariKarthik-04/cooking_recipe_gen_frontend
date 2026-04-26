import { useRef, useState } from 'react';

export default function IngredientInput({
  inputVal,
  setInputVal,
  isGenerating,
  onSendMessage,
  onStop,
  selectedImage,
  setSelectedImage
}) {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (inputVal.trim() || selectedImage) {
      onSendMessage(inputVal.trim() || "Check this image", selectedImage);
      setInputVal("");
      setSelectedImage(null);
      inputRef.current?.focus();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="flex-shrink-0 border-t border-gray-600 bg-gray-800 p-4"
      style={{ background: "#1f2937" }}
    >
      {selectedImage && (
        <div className="mb-3 flex items-center gap-2 p-2 bg-gray-700 rounded-lg">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            className="h-12 w-12 rounded object-cover"
          />
          <div className="flex-1">
            <p className="text-xs text-gray-300 truncate">{selectedImage.name}</p>
            <p className="text-xs text-gray-400">{(selectedImage.size / 1024).toFixed(2)} KB</p>
          </div>
          <button
            onClick={removeImage}
            className="text-gray-400 hover:text-red-400 transition text-lg"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type your message or upload an image..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-500 bg-gray-700 text-gray-100 outline-none focus:ring-2 focus:ring-amber-400 placeholder-gray-400"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isGenerating}
          className="px-3 py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          style={{
            background: isGenerating ? "#6b7280" : "linear-gradient(135deg, #92400e, #d97706)",
          }}
          title="Upload Image"
        >
          📷
        </button>
        {isGenerating ? (
          <button
            onClick={onStop}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 transition"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!inputVal.trim() && !selectedImage}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: (inputVal.trim() || selectedImage)
                ? "linear-gradient(135deg, #92400e, #d97706)"
                : "#6b7280",
            }}
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}