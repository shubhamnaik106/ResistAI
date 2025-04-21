import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

export default function Trends() {
  const patientTypes = ["OPD", "IPD"];
  const specimenTypes = ["Urine", "Blood", "Stool", "Swab", "Pus"];
  const antibiotics = [
    "Amoxicillin/Clavulanic Acid",
    "Ciprofloxacin",
    "Nitrofurantoin",
    "Trimethoprim/Sulfamethoxazole",
    "Gentamicin",
    "Meropenem",
    // …your full list…
  ];

  const [patientType, setPatientType] = useState("");
  const [specimenType, setSpecimenType] = useState("");
  const [selectedAb, setSelectedAb] = useState("");
  const [chartData, setChartData] = useState([]);

  const handleGetTrends = () => {
    if (!patientType || !specimenType || !selectedAb) {
      alert("Please select patient type, specimen type and an antibiotic.");
      return;
    }
    // Hard‑coded sensitivities per year
    setChartData([
      { year: 2020, sensitivity: 25 },
      { year: 2021, sensitivity: 50 },
      { year: 2022, sensitivity: 75 },
      { year: 2023, sensitivity: 60 },
    ]);
  };

  return (
    <div className="w-full h-[600px] p-6 backdrop-blur-sm bg-white bg-opacity-10 rounded-3xl bg-clip-padding mt-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Antibiotic Resistance Trends</h2>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        {/* Patient Type */}
        <select
          value={patientType}
          onChange={(e) => setPatientType(e.target.value)}
          className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
        >
          <option value="" disabled>
            Select Patient Type
          </option>
          {patientTypes.map((pt) => (
            <option key={pt} value={pt}>
              {pt}
            </option>
          ))}
        </select>

        {/* Specimen Type */}
        <select
          value={specimenType}
          onChange={(e) => setSpecimenType(e.target.value)}
          className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
        >
          <option value="" disabled>
            Select Specimen Type
          </option>
          {specimenTypes.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        {/* Antibiotic */}
        <select
          value={selectedAb}
          onChange={(e) => setSelectedAb(e.target.value)}
          className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
        >
          <option value="" disabled>
            Select Antibiotic
          </option>
          {antibiotics.map((ab) => (
            <option key={ab} value={ab}>
              {ab}
            </option>
          ))}
        </select>

        {/* Button */}
        <button
          onClick={handleGetTrends}
          className="text-white bg-orange-500 rounded-full px-6 py-2"
        >
          Get Trends
        </button>
      </div>

      {/* Line Chart */}
      <div className="w-full h-[450px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#fff" }}
                label={{
                  value: "Year",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#fff",
                }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#fff" }}
                label={{
                  value: "Sensitivity (%)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#fff",
                }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                itemStyle={{ color: "#fff" }}
                formatter={(val) => `${val}%`}
              />
              <Line
                type="monotone"
                dataKey="sensitivity"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 5, fill: "#f97316" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-lg">
            {!selectedAb
              ? "Select Patient Type, Specimen, and Antibiotic above"
              : "Click Get Trends to show chart"}
          </div>
        )}
      </div>
    </div>
  );
}



// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// // 	BarChart,
// // 	Bar,
// // 	XAxis,
// // 	YAxis,
// // 	Tooltip,
// // 	ResponsiveContainer,
// // 	CartesianGrid,
// // 	LabelList,
// // } from "recharts";

// // function Trends() {
// // 	const [chartData, setChartData] = useState([]);

// // 	useEffect(() => {
// // 		const fetchData = async () => {
// // 			try {
// // 				const response = await axios.post("http://localhost:5005/", {
// // 					type: "IPD",
// // 					specimenType: "Urine",
// // 					gender: "Male",
// // 					age: 30,
// // 				});

// // 				if (response.data?.predictions) {
// // 					const formatted = response.data.predictions.map((item) => ({
// // 						antibiotic: item.antibiotic,
// // 						resistance: item.resistance,
// // 					}));
// // 					setChartData(formatted);
// // 				}
// // 			} catch (error) {
// // 				console.error("Error fetching trends:", error);
// // 			}
// // 		};

// // 		fetchData();
// // 	}, []);

// // 	return (
// // 		<div
// // 			className="w-full h-[500px] p-6 backdrop-blur-sm bg-white bg-opacity-10 rounded-3xl bg-clip-padding mt-4 text-white"
// // 			data-aos-easing="ease-out"
// // 			data-aos-duration="1000"
// // 		>
// // 			<h2 className="text-2xl font-bold mb-4">Antibiotic Resistance Trends</h2>
// // 			<ResponsiveContainer width="100%" height="100%">
// // 				<BarChart
// // 					data={chartData}
// // 					margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
// // 				>
// // 					<CartesianGrid strokeDasharray="3 3" />
// // 					<XAxis
// // 						dataKey="antibiotic"
// // 						angle={-45}
// // 						textAnchor="end"
// // 						interval={0}
// // 					/>
// // 					<YAxis
// // 						label={{
// // 							value: "Resistance (%)",
// // 							angle: -90,
// // 							position: "insideLeft",
// // 						}}
// // 					/>
// // 					<Tooltip />
// // 					<Bar dataKey="resistance" fill="#f97316">
// // 						<LabelList dataKey="resistance" position="top" />
// // 					</Bar>
// // 				</BarChart>
// // 			</ResponsiveContainer>
// // 		</div>
// // 	);
// // }

// // export default Trends;

// import React, { useState } from "react";
// import axios from "axios";
// import {
// 	BarChart,
// 	Bar,
// 	XAxis,
// 	YAxis,
// 	Tooltip,
// 	ResponsiveContainer,
// 	CartesianGrid,
// 	LabelList,
// } from "recharts";

// function Trends() {
// 	const [specimenType, setSpecimenType] = useState("");
// 	const [patientType, setPatientType] = useState("");
// 	const [gender, setGender] = useState("");
// 	const [age, setAge] = useState("");
// 	const [chartData, setChartData] = useState([]);

// 	const fetchTrends = async () => {
// 		if (!patientType || !specimenType || !gender || !age) {
// 			alert("Please fill in all the fields before submitting.");
// 			return;
// 		}
// 		if (age <= 0 || age > 100) {
// 			alert("Age must be between 1 and 100.");
// 			return;
// 		}

// 		try {
// 			const response = await axios.post("http://localhost:5005/", {
// 				type: patientType,
// 				specimenType: specimenType,
// 				gender: gender,
// 				age: parseInt(age, 10),
// 			});

// 			if (response.data?.predictions) {
// 				const formatted = response.data.predictions.map((item) => ({
// 					antibiotic: item.antibiotic,
// 					resistance: item.resistance,
// 					yearly_stats: item.yearly_stats.map((stat) => ({
// 						year: stat.year,
// 						sensitive: stat.sensitive,
// 						resistant: stat.resistant,
// 						notused: stat.notused,
// 						total_sensitive: stat.total_sensitive,
// 						total_resistant: stat.total_resistant,
// 						total_notused: stat.total_notused,
// 					})),

// 				}));
// 				setChartData(formatted);
// 			}
// 		} catch (error) {
// 			console.error("Error fetching trends:", error);
// 			alert("An error occurred while processing your request.");
// 		}
// 	};

// 	return (
// 		<div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-4 md:px-10 bg-white bg-opacity-10 rounded-3xl bg-clip-padding mt-4">
// 			{/* Left Section */}
// 			<div className="mb-10 text-center md:text-left pt-10">
// 				<div className="mt-4 flex flex-col gap-4">
// 					<p className="text-white text-xl -mt-6">Enter Type of Patient</p>
// 					<select
// 						value={patientType}
// 						onChange={(e) => setPatientType(e.target.value)}
// 						className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
// 					>
// 						<option value="" disabled>
// 							Select Type
// 						</option>
// 						<option value="IPD" disabled>
// 							IPD
// 						</option>
// 						<option value="OPD">OPD</option>
// 					</select>

// 					<p className="text-white text-xl mt-4">Enter Type of Specimen</p>
// 					<select
// 						value={specimenType}
// 						onChange={(e) => setSpecimenType(e.target.value)}
// 						className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
// 					>
// 						<option value="" disabled>
// 							Select Specimen
// 						</option>
// 						<option value="Urine">Urine</option>
// 						<option value="Stool" disabled>
// 							Stool
// 						</option>
// 						<option value="Blood" disabled>
// 							Blood
// 						</option>
// 						<option value="Swab" disabled>
// 							Swab
// 						</option>
// 						<option value="Pus" disabled>
// 							Pus
// 						</option>
// 					</select>

// 					<p className="text-white text-xl mt-4">Enter Gender of Patient</p>
// 					<select
// 						value={gender}
// 						onChange={(e) => setGender(e.target.value)}
// 						className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
// 					>
// 						<option value="" disabled>
// 							Select Gender
// 						</option>
// 						<option value="Male">Male</option>
// 						<option value="Female">Female</option>
// 					</select>

// 					<p className="text-white text-xl mt-4">Enter Age of Patient</p>
// 					<input
// 						type="number"
// 						value={age}
// 						onChange={(e) => setAge(e.target.value)}
// 						placeholder="Enter Age"
// 						className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
// 						min="1"
// 						max="100"
// 					/>

// 					<button
// 						onClick={fetchTrends}
// 						className="text-white bg-orange-500 mt-8 border-[2px] border-transparent rounded-full text-[15px] px-6 py-1 cursor-pointer"
// 					>
// 						Show Trends
// 					</button>
// 				</div>
// 			</div>

// 			{/* Right Section (Bar Chart) */}
// 			<div className="flex justify-center text-lg font-semibold text-white whitespace-pre-line w-full h-[500px]">
// 				{chartData.length > 0 ? (
// 					<ResponsiveContainer width="100%" height="100%">
// 						<BarChart
// 							data={chartData}
// 							margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
// 						>
// 							<CartesianGrid strokeDasharray="3 3" />
// 							<XAxis
// 								dataKey="antibiotic"
// 								angle={-45}
// 								textAnchor="end"
// 								interval={0}
// 							/>
// 							<YAxis
// 								label={{
// 									value: "Resistance (%)",
// 									angle: -90,
// 									position: "insideLeft",
// 								}}
// 							/>
// 							<Tooltip />
// 							<Bar dataKey="resistance" fill="#f97316">
// 								<LabelList dataKey="resistance" position="top" />
// 							</Bar>
// 						</BarChart>
// 					</ResponsiveContainer>
// 				) : (
// 					<div className="flex justify-center text-lg font-semibold text-white whitespace-pre-line mt-60">
// 						Loading Antibiotic Resistance Trends...
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

// export default Trends;
