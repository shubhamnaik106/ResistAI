import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Legend,
} from "recharts";

export default function Trends() {
  const patientTypes = ["OPD", "IPD"];
  const specimenTypes = ["Urine", "Blood", "Stool", "Swab", "Pus"];

  const [patientType, setPatientType] = useState("");
  const [specimenType, setSpecimenType] = useState("");
  const [selectedAb, setSelectedAb] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [chartData, setChartData] = useState([]);
  const [antibiotics, setAntibiotics] = useState([]);

  useEffect(() => {
    const fetchAntibiotics = async () => {
      try {
        const response = await axios.get("http://localhost:5005/get_antibiotics");
        setAntibiotics(response.data);
      } catch (error) {
        console.error("Error fetching antibiotics list:", error);
        alert("An error occurred while fetching the antibiotics list.");
      }
    };

    fetchAntibiotics();
  }, []);

  const handleGetTrends = async () => {
    if (age && (age <= 0 || age > 100)) {
      alert("Please enter a valid age (1-100).");
      return;
    }

    try {
      const requestData = {
        type: patientType,
        specimenType: specimenType,
        gender: gender || "",
        age: age ? parseInt(age, 10) : null,
        antibiotic: selectedAb,
      };

      const response = await axios.post("http://localhost:5005/predict_trends", requestData);

      if (response.data?.predictions?.length > 0) {
        const selectedPrediction = response.data.predictions.find(
          (ab) => ab.antibiotic === selectedAb
        );

        if (selectedPrediction && selectedPrediction.yearly_stats?.length >= 0) {
          const data = selectedPrediction.yearly_stats
            .sort((a, b) => a.year - b.year)
            .map((item) => ({
              year: item.year,
              sensitive: item.sensitive,
              resistant: item.resistant,
              notused: item.notused,
            }));
          setChartData(data);
        } else {
          alert("No trend data available for this antibiotic.");
          setChartData([]);
        }
      } else {
        alert("No predictions found.");
        setChartData([]);
      }
    } catch (error) {
      console.error("Error fetching trends:", error);
      alert("An error occurred while fetching trends.");
    }
  };

  return (
    <div className="w-full h-[650px] p-6 backdrop-blur-sm bg-white bg-opacity-10 rounded-3xl bg-clip-padding mt-4 text-white">
      <h2 className="text-2xl font-bold mb-4">Antibiotic Resistance Trends</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={patientType}
          onChange={(e) => setPatientType(e.target.value)}
          className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
        >
          <option value="" disabled>Select Patient Type</option>
          {patientTypes.map((pt) => (
            <option key={pt} value={pt}>{pt}</option>
          ))}
        </select>

        <select
          value={specimenType}
          onChange={(e) => setSpecimenType(e.target.value)}
          className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
        >
          <option value="" disabled>Select Specimen Type</option>
          {specimenTypes.map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>

        <select
          value={selectedAb}
          onChange={(e) => setSelectedAb(e.target.value)}
          className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
        >
          <option value="" disabled>Select Antibiotic</option>
          {antibiotics.map((ab) => (
            <option key={ab} value={ab}>{ab}</option>
          ))}
        </select>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
        >
          <option value="" disabled>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="number"
          placeholder="Enter Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10 w-32"
        />

        <button
          onClick={handleGetTrends}
          className="text-white bg-orange-500 rounded-full px-6 py-2 disabled:opacity-50"
          disabled={!patientType || !specimenType || !selectedAb}
        >
          Get Trends
        </button>
      </div>

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
                value: "Sensitive (%)",
                angle: -90,
                position: "insideLeft",
                fill: "#fff",
              }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#333", border: "none" }}
              itemStyle={{ color: "#fff" }}
              formatter={(val, name) => [`${val}%`, name]}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="sensitive"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10B981" }}
              name="Sensitive"
            />
          </LineChart>
        </ResponsiveContainer>
        
        ) : (
          <div className="flex items-center justify-center h-full text-lg">
            {selectedAb ? "Click Get Trends to show chart" : "Fill all details to show trends"}
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
// // 				const response = await axios.post("http://localhost:5005/predict_trends/", {
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
// 			const response = await axios.post("http://localhost:5005/predict_trends/", {
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
