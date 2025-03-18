// src/MenuManager.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

function MenuManager() {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });
  const [editingItem, setEditingItem] = useState(null);
  // 선택된 카테고리 필터 상태 (빈 문자열이면 전체 표시)
  const [selectedCategory, setSelectedCategory] = useState("");

  // 실시간으로 메뉴 데이터를 불러오기
  useEffect(() => {
    const colRef = collection(db, "menu");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenuItems(items);
    });
    return () => unsubscribe();
  }, []);

  // 새 메뉴 추가 함수
  const handleAddItem = async () => {
    try {
      const colRef = collection(db, "menu");
      await addDoc(colRef, {
        ...newItem,
        price: Number(newItem.price),
      });
      setNewItem({ name: "", category: "", price: "", description: "" });
    } catch (error) {
      console.error("메뉴 추가 오류:", error);
      alert("메뉴 추가에 실패했습니다.");
    }
  };

  // 메뉴 수정을 위한 상태 설정
  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  // 메뉴 업데이트 함수
  const handleUpdateItem = async () => {
    try {
      const docRef = doc(db, "menu", editingItem.id);
      await updateDoc(docRef, {
        name: editingItem.name,
        category: editingItem.category,
        price: Number(editingItem.price),
        description: editingItem.description,
      });
      setEditingItem(null);
    } catch (error) {
      console.error("메뉴 수정 오류:", error);
      alert("메뉴 수정에 실패했습니다.");
    }
  };

  // 메뉴 삭제 함수
  const handleDeleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "menu", id));
    } catch (error) {
      console.error("메뉴 삭제 오류:", error);
      alert("메뉴 삭제에 실패했습니다.");
    }
  };

  // 드롭다운 옵션 배열
  const categoryOptions = [
    { value: "세트메뉴", label: "세트메뉴" },
    { value: "면류", label: "면류" },
    { value: "밥류", label: "밥류" },
    { value: "요리류", label: "요리류" },
    { value: "사이드", label: "사이드" },
    { value: "음료", label: "음료" },
  ];

  // 선택된 카테고리에 따라 메뉴 필터링 (빈 문자열이면 전체)
  const filteredMenuItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">메뉴 관리</h1>
      
      {/* 새 메뉴 추가 영역 */}
      <div className="mb-4 p-4 border rounded bg-white">
        <h2 className="text-xl font-bold mb-2">새 메뉴 추가</h2>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="이름"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="border p-2 rounded w-48"
          />
          {/* 선택박스로 카테고리 선택 */}
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="border p-2 rounded w-48"
          >
            <option value="">카테고리 선택</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="가격"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="border p-2 rounded w-32"
          />
          <input
            type="text"
            placeholder="설명"
            value={newItem.description}
            onChange={(e) =>
              setNewItem({ ...newItem, description: e.target.value })
            }
            className="border p-2 rounded w-64"
          />
          <button
            onClick={handleAddItem}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            추가
          </button>
        </div>
      </div>

      {/* 메뉴 수정 영역 (편집 중인 메뉴가 있을 때) */}
      {editingItem && (
        <div className="mb-4 p-4 border rounded bg-white">
          <h2 className="text-xl font-bold mb-2">메뉴 수정</h2>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="이름"
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              className="border p-2 rounded w-48"
            />
            {/* 선택박스로 카테고리 선택 */}
            <select
              value={editingItem.category}
              onChange={(e) =>
                setEditingItem({ ...editingItem, category: e.target.value })
              }
              className="border p-2 rounded w-48"
            >
              <option value="">카테고리 선택</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="가격"
              value={editingItem.price}
              onChange={(e) =>
                setEditingItem({ ...editingItem, price: e.target.value })
              }
              className="border p-2 rounded w-32"
            />
            <input
              type="text"
              placeholder="설명"
              value={editingItem.description}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  description: e.target.value,
                })
              }
              className="border p-2 rounded w-64"
            />
            <button
              onClick={handleUpdateItem}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              수정
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 메뉴 리스트 필터링 드롭다운 */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="category-filter" className="font-medium">
          카테고리별 분류:
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">전체</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 메뉴 리스트 */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">메뉴 리스트</h2>
        <ul>
          {filteredMenuItems.map((item) => (
            <li
              key={item.id}
              className="border p-4 mb-2 rounded flex justify-between items-center bg-white"
            >
              <div>
                <p className="font-bold">{item.name}</p>
                <p>카테고리: {item.category}</p>
                <p>가격: ₩{Number(item.price).toLocaleString()}</p>
                <p>설명: {item.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditItem(item)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MenuManager;
