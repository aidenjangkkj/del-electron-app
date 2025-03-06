// src/OrderList.js
import React from "react";

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

export default OrderList;
