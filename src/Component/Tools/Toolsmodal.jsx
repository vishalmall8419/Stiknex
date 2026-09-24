import FormStyle from "../Form/Form.module.css";

const ToolModal = ({ title, subtitle, darkMode, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center p-4 ${
        darkMode ? FormStyle.darkModal : "bg-black/80 backdrop-blur-xl"
      }`}
    >
      <div
        className={`relative flex w-[95%] max-w-xl max-h-[88vh] flex-col rounded-3xl shadow-2xl ${
          darkMode ? FormStyle.darkForm : "bg-[#D6D6D6]"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-300 ${
            darkMode
              ? FormStyle.closeBtn
              : "bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white"
          }`}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="shrink-0 p-8 pb-0">
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="mt-1 text-sm opacity-80">{subtitle}</p>}
        </div>

        <div className="min-h-0 overflow-y-auto p-8 pt-6">{children}</div>
      </div>
    </div>
  );
};

export default ToolModal;