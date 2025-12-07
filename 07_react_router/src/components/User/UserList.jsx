import React from "react";
import { Link } from "react-router-dom";

export default function UserList() {
  const users = [
    { id: 1, name: "Jeel Dobariya", role: "Frontend Developer" },
    { id: 2, name: "Smeet Patel", role: "UI Designer" },
    { id: 3, name: "Ravi Kumar", role: "Backend Developer" },
    { id: 4, name: "Arjun Rana", role: "Full Stack Developer" },
    { id: 5, name: "Mihir Shah", role: "React Developer" },
    { id: 6, name: "Krisha Mehta", role: "Software Engineer" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10">
        All Users
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-lg transition"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-orange-700 text-white flex items-center justify-center text-xl font-bold shadow-md">
                {user.name.charAt(0)}
              </div>

              <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.role}</p>

              <Link
                to={`/user/${user.id}`}
                className="mt-5 inline-block px-5 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-600 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
