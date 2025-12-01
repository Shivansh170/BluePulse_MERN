import { useEffect, useState } from "react";

export default function ManageSurveyors() {
  const [surveyors, setSurveyors] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Helper to auto-generate credentials
  function generateCredentials(name) {
    const username = name.toLowerCase().replace(/\s+/g, "");
    const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit
    const email = `${username}${randomNum}@bluePulse.ac.in`;
    const password = `${username}${randomNum}`;
    return { email, password };
  }

  useEffect(() => {
    const fetchAllSurveyors = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");

        const res = await fetch(
          "http://localhost:3000/api/admin/fetch-all-surveyors",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setSurveyors(data?.data?.surveyors || []);
      } catch (error) {
        console.log("Error fetching surveyors:", error.message);
      }
    };

    fetchAllSurveyors();
  }, []);

  const deleteSurveyor = async (id) => {
    try {
      const token = sessionStorage.getItem("accessToken");

      const res = await fetch(
        `http://localhost:3000/api/admin/surveyor/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      alert(data.message);

      setSurveyors((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.log("Error deleting surveyor:", error.message);
    }
  };

  const createSurveyor = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("accessToken");
      const user = JSON.parse(sessionStorage.getItem("user"));

      if (user.role !== "Admin") {
        alert("Only admins can create surveyors");
        return;
      }

      const res = await fetch("http://localhost:3000/api/admin/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: "Surveyor",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create surveyor");
        return;
      }

      alert(data.message);

      setShowModal(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");

      // REFETCH LIST SAFELY
      fetchAllSurveyors();
    } catch (error) {
      console.log("Error creating surveyor:", error.message);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#005c]">Manage Surveyors</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] text-white py-2 px-5 rounded-xl shadow-md hover:shadow-lg transition"
        >
          + Add New Surveyor
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-xl border border-[#005c]/20">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] text-white">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {surveyors.map((s, index) => (
              <tr
                key={s._id}
                className={`transition ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-[#24C6DC]/10`}
              >
                <td className="p-4 text-[#005c] font-medium">{s.name}</td>
                <td className="p-4">{s.email}</td>
                <td className="p-4 text-right">
                  <button
                    className="bg-linear-to-r from-red-500 to-red-600 text-white py-1 px-4 rounded-lg shadow hover:shadow-md transition"
                    onClick={() => deleteSurveyor(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {surveyors.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No surveyors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-[#005c] mb-4 text-center">
              Add New Surveyor
            </h3>

            <form className="flex flex-col gap-4" onSubmit={createSurveyor}>
              <input
                type="text"
                placeholder="Full Name"
                className="p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#005c]"
                value={newName}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewName(value);

                  if (value.trim().length > 0) {
                    const { email, password } = generateCredentials(value);
                    setNewEmail(email);
                    setNewPassword(password);
                  } else {
                    setNewEmail("");
                    setNewPassword("");
                  }
                }}
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                className="p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#005c]"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-[#005c]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <button className="bg-linear-to-r from-[#005c] via-[#363795] to-[#24C6DC] text-white py-3 rounded-xl shadow hover:shadow-lg transition">
                Create Surveyor
              </button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-center text-gray-600 mt-2 hover:underline"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
