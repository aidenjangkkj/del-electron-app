// src/CompletedOrder.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const CompletedOrder = () => {
  const [completedOrders, setCompletedOrders] = useState([]);

  // 오늘 날짜(YYYY-MM-DD 형식) 구하기
  const getTodayDateString = () => new Date().toISOString().split("T")[0];
  // 기본값은 오늘
  const [selectedDate, setSelectedDate] = useState(getTodayDateString());

  // "completedOrders" 컬렉션에서 실시간 데이터 구독
  useEffect(() => {
    const colRef = collection(db, "completedOrders");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));
      setCompletedOrders(orders);
    });
    return () => unsubscribe();
  }, []);

  // 선택한 날짜에 해당하는 주문만 필터링
  const filteredOrders = selectedDate
    ? completedOrders.filter((order) => {
        if (order.createdAt && order.createdAt.toDate) {
          const orderDate = order.createdAt
            .toDate()
            .toISOString()
            .split("T")[0];
          return orderDate === selectedDate;
        }
        return false;
      })
    : completedOrders;

  // 주문 내역을 날짜별(YYYY-MM-DD)로 그룹화
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    let dateKey = "N/A";
    if (order.createdAt && order.createdAt.toDate) {
      dateKey = order.createdAt.toDate().toISOString().split("T")[0];
    }
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(order);
    return acc;
  }, {});

  // 날짜 그룹을 최신 순으로 정렬 ("N/A"는 가장 뒤로)
  const sortedDates = Object.keys(groupedOrders).sort((a, b) => {
    if (a === "N/A") return 1;
    if (b === "N/A") return -1;
    return new Date(b) - new Date(a);
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">완료된 주문 내역</h1>
      
      {/* 날짜 선택 필터 */}
      <div className="mb-4 flex items-center">
        <label htmlFor="date-picker" className="mr-2 font-medium">
          날짜 선택:
        </label>
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
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

      {filteredOrders.length === 0 ? (
        <p className="text-gray-600">해당 날짜의 완료된 주문이 없습니다.</p>
      ) : (
        sortedDates.map((date) => (
          <div key={date}>
            <h2 className="text-xl font-bold mt-6 mb-4">
              {date === "N/A"
                ? "날짜 정보 없음"
                : new Date(date).toLocaleDateString()}
            </h2>
            {groupedOrders[date].map((order) => (
              <div
                key={order.docId}
                className="border border-gray-300 rounded p-4 mb-4 bg-white"
              >
                <p className="text-lg">
                  <strong>주문 ID:</strong>{" "}
                  {order.orders && order.orders.length > 0
                    ? order.orders[0].id
                    : order.docId}
                </p>
                <p className="text-lg">
                  <strong>총 금액:</strong> ₩
                  {order.overallTotal?.toLocaleString()}
                </p>
                <p className="text-lg">
                  <strong>주문 시간:</strong>{" "}
                  {order.createdAt?.toDate
                    ? order.createdAt.toDate().toLocaleString()
                    : "N/A"}
                </p>
                <p className="text-lg">
                  <strong>배달 주소:</strong> {order.address}
                </p>
                <p className="text-lg">
                  <strong>연락처:</strong> {order.phone}
                </p>
                {/* 고객 요청 사항 추가 */}
                <p className="text-lg">
                  <strong>고객 요청 사항:</strong>{" "}
                  {order.customerRequest || "없음"}
                </p>
                {/* 결제 수단 추가 */}
                <p className="text-lg">
                  <strong>결제 수단:</strong>{" "}
                  {order.paymentMethod || "없음"}
                </p>
                <h3 className="text-xl font-bold mt-4 mb-2">주문 항목</h3>
                {order.orders &&
                  order.orders.map((orderItem) => (
                    <div key={orderItem.id} className="mb-2">
                      <ul className="list-disc list-inside">
                        {orderItem.items &&
                          orderItem.items.map((item) => (
                            <li key={item.id} className="text-gray-800">
                              {item.name} - 수량: {item.quantity} - 가격: ₩
                              {(item.price * item.quantity).toLocaleString()}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default CompletedOrder;
