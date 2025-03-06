import React from "react";

const Sidebar = ({ currentView, setCurrentView }) => {
  return (
    <div className="h-screen bg-gray-800 text-white p-4 w-64">
      <h2 className="text-2xl font-bold mb-6">내비게이션</h2>
      <ul>
        <li>
          <button
            onClick={() => setCurrentView("order")}
            className={`block w-full text-left py-2 px-4 rounded mb-2 transition-colors ${
              currentView === "order"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            주문 내역
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentView("user")}
            className={`block w-full text-left py-2 px-4 rounded mb-2 transition-colors ${
              currentView === "user"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            고객 관리
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentView("menu")}
            className={`block w-full text-left py-2 px-4 rounded mb-2 transition-colors ${
              currentView === "menu"
                ? "bg-gray-700"
                : "hover:bg-gray-700"
            }`}
          >
            메뉴 관리
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
