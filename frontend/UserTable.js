"use client";

import React from "react";

export default function UserTable({ users }) {
  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl text-center">
        No users found
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl mb-8 overflow-x-auto">
      <h2 className="text-xl mb-4 font-semibold">Users</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="py-2 px-4">ID</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Subscription</th>
            <th className="py-2 px-4">Charity %</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-700 hover:bg-gray-700 transition"
            >
              <td className="py-2 px-4">{user.id}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.subscription_status}</td>
              <td className="py-2 px-4">{user.charity_percentage || 10}%</td>
              <td className="py-2 px-4 space-x-2">
                <button className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
                  Edit
                </button>
                <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}