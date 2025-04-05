import React, { useState, useEffect } from "react";
import axios from "axios";

function Hero() {
  const [specimenType, setSpecimenType] = useState("");
  const [patientType, setPatientType] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [displayText, setDisplayText] = useState("Loading recommendations...");

  const handleSubmit = async () => {
    if (!patientType || !gender || !age) {
      console.warn("Missing fields; using default values for demo.");
    }

    try {
      const response = await axios.post("http://localhost:5005/", {
        type: patientType,
        specimenType: specimenType,
        gender: gender,
        age: age,
      });

      setDisplayText(
        <div className="overflow-auto max-h-96">
          <h2 className="text-2xl font-bold mb-4 text-white">Prediction Results</h2>
          <table className="min-w-full md:mb-0 mb- bg-transparent border border-orange-500 rounded-lg">
            <thead className="bg-white bg-opacity-10 text-white">
              <tr>
                <th className="py-2 px-4 border-b border-orange-500">Antibiotic</th>
                <th className="py-2 px-4 border-b border-orange-500">Status</th>
                <th className="py-2 px-4 border-b border-orange-500">Resistance (%)</th>
                <th className="py-2 px-4 border-b border-orange-500">Sensitive (%)</th>
              </tr>
            </thead>
            <tbody>
              {response.data.predictions.slice(0, 5).map((item, index) => (
                <tr key={index} className="hover:bg-white hover:bg-opacity-20 text-white">
                  <td className="py-2 px-4 border-b border-orange-500">{item.antibiotic}</td>
                  <td className="py-2 px-4 border-b border-orange-500">{item.resistance_status}</td>
                  <td className="py-2 px-4 border-b border-orange-500">{item.resistance}</td>
                  <td className="py-2 px-4 border-b border-orange-500">{item.sensitive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } catch (error) {
      console.error("Error making prediction:", error);
      alert("An error occurred while processing your request.");
    }
  };

  // Call handleSubmit on component mount.
  useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-4 md:px-10 bg-white bg-opacity-10 rounded-3xl bg-clip-padding mt-4">
        {/* Left Section */}
        <div className="mb-10 text-center md:text-left pt-10">
          <div className="mt-4 flex flex-col gap-4">
            <p className="text-white text-xl -mt-6">Enter Type of Patient</p>
            <select
              value={patientType}
              onChange={(e) => setPatientType(e.target.value)}
              className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="IPD">IPD</option>
              <option value="OPD">OPD</option>
            </select>

            <p className="text-white text-xl mt-4">Enter Type of Specimen</p>
            <select
              value={specimenType}
              onChange={(e) => setSpecimenType(e.target.value)}
              className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
            >
              <option value="" disabled>
                Select Specimen
              </option>
              <option value="Urine">Urine</option>
              <option value="Stool" disabled>
                Stool
              </option>
              <option value="Blood" disabled>
                Blood
              </option>
              <option value="Swab" disabled>
                Swab
              </option>
              <option value="Pus" disabled>
                Pus
              </option>
            </select>

            <p className="text-white text-xl mt-4">Enter Gender of Patient</p>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <p className="text-white text-xl mt-4">Enter Age of Patient</p>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter Age"
              className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
              min="1"
              max="100"
            />

            <button
              onClick={handleSubmit}
              className="text-white bg-orange-500 mt-8 py-3 border-[2px] border-transparent rounded-full text-[15px] px-6 py-1 cursor-pointer"
            >
              Get Recommendations
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex justify-center text-lg font-semibold text-white whitespace-pre-line">
          {displayText}
        </div>
      </div>
    </>
  );
}

export default Hero;
