import React from "react";
import { useParams, Link } from "react-router-dom";
import { usersData } from "../../data/users";

export default function User() {
  const { userid } = useParams();
  const user = usersData.find((u) => u.id === Number(userid));

  if (!user) {
    return (
      <div className="py-20 text-center text-xl font-semibold text-red-600">
        User not found!
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* Profile Card */}
      <div className="bg-white border rounded-2xl shadow-lg p-8">
        {/* Avatar */}
        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded-full bg-orange-700 text-white flex items-center justify-center text-4xl font-bold shadow-md">
            {user.name.charAt(0)}
          </div>

          <h1 className="text-3xl font-bold mt-4">{user.name}</h1>
          <p className="text-gray-600 text-lg">{user.role}</p>
        </div>

        {/* Information */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 border rounded-xl bg-gray-50">
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>

          <div className="p-4 border rounded-xl bg-gray-50">
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="text-gray-900 font-medium">{user.phone}</p>
          </div>

          <div className="p-4 border rounded-xl bg-gray-50">
            <p className="text-gray-500 text-sm">Location</p>
            <p className="text-gray-900 font-medium">{user.location}</p>
          </div>

          <div className="p-4 border rounded-xl bg-gray-50">
            <p className="text-gray-500 text-sm">User ID</p>
            <p className="text-gray-900 font-medium">{user.id}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8 p-5 border rounded-xl bg-gray-50">
          <p className="text-gray-500 text-sm mb-1">Bio</p>
          <p className="text-gray-800 leading-relaxed">{user.bio}</p>
        </div>

        {/* Back Button */}
        <div className="text-center mt-10">
          <Link
            to="/users"
            className="px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Back to All Users
          </Link>
        </div>
      </div>
    </div>
  );
}
