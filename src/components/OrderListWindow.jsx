import React, { useState, useEffect } from "react";
import OrderList from "./OrderList";

const getTodayDateString = () => {
  return new Date().toISOString().split("T")[0];
};

const OrderListWindow = ({ orders }) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  
  // 주문 목록 필터링
  const filteredOrders = selectedDate
    ? orders.filter((order) => {
        if (order.createdAt && order.createdAt.toDate) {
          const orderDate = order.createdAt.toDate().toISOString().split("T")[0];
          return orderDate === selectedDate;
        }
        return false;
      })
    : orders;
  
  // filteredOrders가 변경될 때마다 사운드 재생
  useEffect(() => {
    if (filteredOrders.length > 0) {
      const audio = new Audio("../../public/sound.wav");
      audio.play().catch((error) => {
        console.error("사운드 재생 실패:", error);
      });
    }
  }, [filteredOrders]);
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">주문 내역 (실시간 업데이트)</h1>
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
      <OrderList orders={filteredOrders} />
    </div>
  );
};

export default OrderListWindow;
