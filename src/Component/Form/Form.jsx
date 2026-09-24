import { useState } from "react";
import swal from "sweetalert";
import Style from "./Form.module.css";

const Form = ({ closeModal, saveFromHome, darkMode }) => {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("whiteCard");

  const priorityMap = {
    whiteCard: "white",
    greenCard: "green",
    orangeCard: "orange",
    redCard: "red",
  };

  const prvl = priorityMap[priority] || "white";

  const headingSet = (e) => {
    setHeading(e.target.value);
  };

  const descSet = (e) => {
    setDescription(e.target.value);
  };

  const priorSet = (e) => {
    setPriority(e.target.value);
  };

  const saveData = (e) => {
    e.preventDefault();

    if (description.trim() === "") {
      swal({
        title: "Description required",
        text: "Description can't be empty.",
        icon: "warning",
      });
      return;
    }

    const data = {
      id: Date.now(),
      title: heading,
      des: description,
      prio: priority,
    };

    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    notes.push(data);

    saveFromHome(notes);

    setHeading("");
    setDescription("");
    setPriority("whiteCard");

    closeModal();
  };

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center ${
        darkMode ? Style.darkModal : "bg-black/80 backdrop-blur-xl"
      }`}
    >

      <div
        className={`relative w-[92%] max-w-2xl rounded-3xl p-8 shadow-2xl ${
          darkMode ? Style.darkForm : "bg-[#D6D6D6]"
        }`}
      >

        <button
          onClick={closeModal}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-300 ${
            darkMode
              ? Style.closeBtn
              : "bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white"
          }`}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>


        <h2 className="text-2xl font-bold">Create New Note</h2>

        <p className="mt-1 text-sm">Organize your thoughts beautifully.</p>


        <form className="mt-8 space-y-6" onSubmit={saveData}>

          <div>
            <label className="mb-2 block text-sm font-semibold">Heading</label>

            <input
              type="text"
              placeholder="Enter note heading..."
              value={heading}
              onChange={headingSet}
              className={`w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 ${
                darkMode
                  ? Style.darkInput
                  : "border-gray-300 bg-[#B6B6B6] focus:border-[#4F5CFF] focus:bg-[#e6e6e6] focus:ring-4 focus:ring-blue-100"
              }`}
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-semibold">
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Write your note..."
              value={description}
              onChange={descSet}
              className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition-all duration-300 ${
                darkMode
                  ? Style.darkInput
                  : "border-gray-300 bg-[#B6B6B6] focus:border-[#4F5CFF] focus:bg-[#e4e4e4] focus:ring-4 focus:ring-blue-100"
              }`}
            ></textarea>
          </div>


          <div>
            <label className="mb-3 block text-sm font-semibold">Priority</label>

            <div className="grid grid-cols-4 gap-4 mt-3">

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="greenCard"
                  checked={priority === "greenCard"}
                  onChange={priorSet}
                  className="hidden peer"
                />

                <div
                  className={`h-12 rounded-xl transition-all duration-300 peer-checked:scale-110 ${
                    darkMode
                      ? Style.priorityGreen
                      : "bg-green-500 peer-checked:ring-4 peer-checked:ring-green-200"
                  }`}
                ></div>
              </label>


              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="orangeCard"
                  checked={priority === "orangeCard"}
                  onChange={priorSet}
                  className="hidden peer"
                />

                <div
                  className={`h-12 rounded-xl transition-all duration-300 peer-checked:scale-110 ${
                    darkMode
                      ? Style.priorityOrange
                      : "bg-orange-400 peer-checked:ring-4 peer-checked:ring-orange-200"
                  }`}
                ></div>
              </label>


              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="redCard"
                  checked={priority === "redCard"}
                  onChange={priorSet}
                  className="hidden peer"
                />

                <div
                  className={`h-12 rounded-xl transition-all duration-300 peer-checked:scale-110 ${
                    darkMode
                      ? Style.priorityRed
                      : "bg-red-500 peer-checked:ring-4 peer-checked:ring-red-200"
                  }`}
                ></div>
              </label>


              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="whiteCard"
                  checked={priority === "whiteCard"}
                  onChange={priorSet}
                  className="hidden peer"
                />

                <div
                  className={`h-12 rounded-xl transition-all duration-300 peer-checked:scale-110 ${
                    darkMode
                      ? Style.priorityWhite
                      : "border bg-gray-200 peer-checked:ring-4 peer-checked:ring-gray-300"
                  }`}
                ></div>
              </label>
            </div>


            <p className="mt-[10px] font-medium">
              Selected Priority :
              <span
                className={`ml-2 capitalize ${
                  darkMode ? Style.selectedPriority : "text-blue-600"
                }`}
              >
                {prvl}
              </span>
            </p>
          </div>


          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={closeModal}
              className={`rounded-xl px-6 py-2.5 font-medium transition-all duration-300 ${
                darkMode
                  ? Style.cancelBtn
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`rounded-xl px-6 py-2.5 font-medium text-white transition-all duration-300 ${
                darkMode
                  ? Style.saveBtn
                  : "bg-gradient-to-r from-[#8B2CF5] via-[#4F5CFF] to-[#2EB8FF] shadow-lg hover:scale-105"
              }`}
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
