import { Bell, Send } from "lucide-react";
import { useState } from "react";

const SEND_TO_OPTIONS = [
  "All Members",
  "Active Members Only",
  "Event Registrants",
  "Executive Board",
  "Custom Selection",
];

export default function Notification() {
  const [form, setForm] = useState({
    sendTo: "All Members",
    title: "",
    message: "",
    priority: "normal",
    schedule: false,
    date: "",
    time: "",
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(type) {
    const payload = {
      ...form,
      status: type,
    };
    console.log("Notification Payload", payload);
  }
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white max-w-4xl mx-auto rounded-xl shadow-md p-8">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-[#383F78] mb-6">Send Notification</h1>

        <div className="grid grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-5">
            {/* Send To */}
            <div>
              <label className="font-medium text-sm">
                Send To <span className="text-red-500">*</span>
              </label>
              <select
                name="sendTo"
                value={form.sendTo}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-md bg-gray-50"
              >
                {SEND_TO_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="font-medium text-sm">
                Notification Title <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="eg: New Event Alert"
                className="w-full mt-1 p-3 border rounded-md bg-gray-50"
              />
            </div>

            {/* Message */}
            <div>
              <label className="font-medium text-sm">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                maxLength={500}
                rows={5}
                placeholder="Your notification message..."
                className="w-full mt-1 p-3 border rounded-md bg-gray-50"
              />
              <p className="text-gray-500 mt-1 text-xs">{form.message.length}/500 characters</p>
            </div>

            {/* Priority */}
            <div>
              <label className="font-medium text-sm">Priority</label>
              <div className="flex gap-3 mt-2">
                {["low", "normal", "high"].map((p) => (
                  <button
                    key={p}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, priority: p }))
                    }
                    className={`px-4 py-2 rounded-md capitalize border ${
                      form.priority === p
                        ? "bg-[#383F78] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="schedule"
                  checked={form.schedule}
                  onChange={handleChange}
                />
                Schedule for later
              </label>

              {form.schedule && (
                <div className="flex gap-4 mt-4">
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="p-3 border rounded-md bg-gray-50"
                  />
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="p-3 border rounded-md bg-gray-50"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview*/}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Preview</h3>

            <div className="bg-white p-4 rounded-lg shadow-sm flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#383F78] flex items-center justify-center text-white">
                <Bell />
              </div>

              <div>
                <p className="font-medium">{form.title || "Notification Title"}</p>
                <p className="text-sm text-gray-600">
                  {form.message ||
                    "Your notification message will appear here..."}
                </p>
                <p className="text-xs text-gray-400 mt-1">Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/*Action Buttons */}
        <div className="flex gap-4 mt-8">
            <button
            onClick={()=> handleSubmit("sent")}
            className="bg-[#383F78] flex-1 flex items-center justify-center gap-2 text-white py-3 rounded-md">
                <Send size={18}/>
                Send Notification
            </button>

            <button
            onClick={()=> handleSubmit("draft")}
            className="flex-1 border border-[#383F78] text-[#383F78] py-3 rounded-md">
                Save as Draft
            </button>
        </div>
      </div>
    </div>
  );
}
