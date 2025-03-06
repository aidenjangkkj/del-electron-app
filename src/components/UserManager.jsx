// src/UserManager.js
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import User from "./User";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 편집할 사용자를 저장하는 상태
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    // Firestore의 users 컬렉션에서 데이터 가져오기
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = [];
        querySnapshot.forEach((doc) => {
          userList.push({ id: doc.id, ...doc.data() });
        });
        setUsers(userList);
      } catch (err) {
        console.error("Error fetching users: ", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
        <p className="text-xl text-red-600">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">User Manager</h1>
      
      {editingUser ? (
        // 수정 중인 사용자가 있을 경우, User 컴포넌트 렌더링
        <User
          user={editingUser}
          onUpdate={(updatedUser) => {
            // 업데이트 후 리스트 갱신 및 편집 취소
            setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
            setEditingUser(null);
          }}
          onCancel={() => setEditingUser(null)}
        />
      ) : (
        // 사용자 리스트 렌더링
        <ul className="space-y-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
            >
              <p className="text-lg">
                <strong>전화번호:</strong> {user.phone || "정보 없음"}
              </p>
              <p className="text-lg">
                <strong>적립 포인트:</strong>{" "}
                {user.points !== undefined ? user.points : "정보 없음"}
              </p>
              <div className="mt-2">
                <button
                  onClick={() => setEditingUser(user)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  수정
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserManager;
