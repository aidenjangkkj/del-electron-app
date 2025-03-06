// src/OrderListWindow.js
import React, { useState } from "react";
import OrderList from "./OrderList";

// 오늘 날짜(YYYY-MM-DD 형식) 구하기
const getTodayDateString = () => {
  return new Date().toISOString().split("T")[0];
};

const OrderListWindow = ({ orders }) => {
  // 기본값을 오늘 날짜로 설정
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // 선택한 날짜에 해당하는 주문만 필터링
  const filteredOrders = selectedDate
    ? orders.filter((order) => {
        if (order.createdAt && order.createdAt.toDate) {
          const orderDate = order.createdAt.toDate().toISOString().split("T")[0];
          return orderDate === selectedDate;
        }
        return false;
      })
    : orders;

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">주문 내역 (실시간 업데이트)</h1>
      
      {/* 날짜 선택 입력 */}
      <div className="mb-4 flex items-center">
        <label htmlFor="date-picker" className="mr-2 font-medium">
          날짜 선택:
        </label>
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={handleDateChange}
          className="border border-gray-300 rounded p-1"
        />
        {selectedDate && (
          <button
            onClick={() => setSelectedDate(getTodayDateString())}
            className="ml-2 bg-blue-500 text-white p-1 rounded"
          >
            오늘 주문 보기
          </button>
        )}
      </div>

      {/* 날짜별 주문 내역 리스트 */}
      <OrderList orders={filteredOrders} />
    </div>
  );
};

export default OrderListWindow;
