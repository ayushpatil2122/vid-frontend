import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";

export default function ProfilePage() {
  const { freelancerId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get(`users/${freelancerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [freelancerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium">Loading profile data...</div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium text-red-600">{error || "User data not available"}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-full p-4 mr-4">
            {userData.profilePicture ? (
              <img 
                src={userData.profilePicture} 
                alt={`${userData.firstname} ${userData.lastname}`} 
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                {userData.firstname?.[0]}{userData.lastname?.[0]}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {userData.firstname} {userData.lastname}
            </h1>
            <p className="text-gray-600">{userData.email}</p>
            <div className="flex items-center mt-2">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {userData.role}
              </span>
              {userData.country && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {userData.country}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Profile Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="font-medium">{userData.username || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profile Completion:</span>
                <span className="font-medium">{userData.isProfileComplete ? "Complete" : "Incomplete"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Status:</span>
                <span className="font-medium">{userData.isActive ? "Active" : "Inactive"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verification:</span>
                <span className="font-medium">{userData.isVerified ? "Verified" : "Not Verified"}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Professional Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Company:</span>
                <span className="font-medium">{userData.company || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Company Email:</span>
                <span className="font-medium">{userData.companyEmail || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">{userData.rating || "No ratings yet"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate:</span>
                <span className="font-medium">{userData.successRate || "No data"}%</span>
              </div>
            </div>
          </div>

          {userData.role === "FREELANCER" && (
            <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold mb-3">Freelancing Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold">{userData.totalJobs || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <p className="text-gray-600">Total Hours</p>
                  <p className="text-2xl font-bold">{userData.totalHours || 0}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold mb-3">Bio</h2>
            <p className="text-gray-700">{userData.bio || "No bio provided."}</p>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Member since: {new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
