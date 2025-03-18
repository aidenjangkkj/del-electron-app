import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import MenuManager from "./components/MenuManager";
import OrderListWindow from "./components/OrderListWindow";
import { db } from "./firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import UserManager from "./components/UserManager";
import CompletedOrder from "./components/CompletedOrder";

function App() {
  const [currentView, setCurrentView] = useState("order");
  // 주문 데이터를 저장할 상태 (OrderListWindow에서 사용)
  const [orders, setOrders] = useState([]);
  const initialLoad = useRef(true);

  // Firestore의 "orders" 컬렉션을 실시간 업데이트로 구독
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (initialLoad.current) {
          initialLoad.current = false;
        } else {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              // 새 주문이 추가되었을 때 알림을 발생시킬 수 있음 (예: Notification API)
              new Notification("새 주문 알림", {
                body: "새로운 주문이 추가되었습니다.",
              });
            }
          });
        }
        const ordersData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            docId: doc.id, // Firestore 자동 생성 문서 ID
            ...data,
          };
        });
        setOrders(ordersData);
      },
      (error) => console.error("실시간 업데이트 오류:", error)
    );

    return () => unsubscribe();
  }, []);

  return (
    // 전체 화면 높이를 고정하고, 부모 컨테이너에 overflow-hidden 적용
    <div className="flex h-screen overflow-hidden">
      {/* 왼쪽 사이드바 */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* 오른쪽 메인 컨텐츠 영역에 overflow-auto 적용 */}
      <div className="flex-1 p-4 bg-gray-100 overflow-auto">
        {currentView === "menu" && <MenuManager />}
        {currentView === "order" && <OrderListWindow orders={orders} />}
        {currentView === "user" && <UserManager />}
        {currentView === "completed" && <CompletedOrder />}
      </div>
    </div>
  );
}

export default App;
