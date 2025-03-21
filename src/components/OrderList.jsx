// src/OrderList.js
import React from "react";
import { addDoc, deleteDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const OrderList = ({ orders }) => {

  // 주문 내역을 날짜별(YYYY-MM-DD)로 그룹화
  const groupedOrders = orders.reduce((acc, order) => {
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

  // 주문을 완료 처리하는 함수:
  // 1. 해당 주문 데이터를 "completedOrders" 컬렉션에 추가
  // 2. 원래 "orders" 컬렉션에서는 삭제
  const handleCompleteOrder = async (order) => {
    try {
      // 완료 주문 컬렉션에 추가
      const completedOrdersRef = collection(db, "completedOrders");
      await addDoc(completedOrdersRef, order);
      // 기존 주문 컬렉션에서 삭제 (order.docId가 문서 ID라고 가정)
      await deleteDoc(doc(db, "orders", order.docId));
      // (선택사항) 완료 후 CompletedOrder 페이지로 이동하려면 아래 주석 해제
      // navigate("/CompletedOrder");
    } catch (error) {
      console.error("주문 완료 처리 오류:", error);
      alert("주문 완료 처리에 실패했습니다.");
    }
  };

  return (
    <div>
      {orders.length === 0 ? (
        <p className="text-gray-600">불러올 주문이 없습니다.</p>
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
                  <strong>결제 수단:</strong> {order.paymentMethod || "없음"}
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
                {/* 주문 완료 버튼 */}
                <div className="mt-4">
                  <button
                    onClick={() => handleCompleteOrder(order)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    완료
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;
