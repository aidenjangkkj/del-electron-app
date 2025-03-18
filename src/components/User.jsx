// src/User.js
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const User = ({ user, onUpdate, onCancel }) => {
  // 편집용 로컬 상태
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [points, setPoints] = useState(user.points || 0);

  const handleSave = async () => {
    try {
      // Firestore에서 해당 사용자 문서를 업데이트
      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, {
        phoneNumber,
        points: Number(points),
        orderCount: Number(orderCount),
      });
      // 부모 컴포넌트에 업데이트된 사용자 정보를 전달
      if (onUpdate) {
        onUpdate({ ...user, phoneNumber, points, orderCount });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("사용자 정보 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-2">사용자 정보 수정</h2>
      <div className="mb-2">
        <label className="block text-gray-700">전화번호</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">적립 포인트</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          저장
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default User;
