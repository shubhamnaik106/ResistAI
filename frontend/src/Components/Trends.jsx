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

function Trends() {
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
				const response = await axios.get(
					"http://localhost:5005/get_antibiotics"
				);
				setAntibiotics(response.data);
			} catch (error) {
				console.error("Error fetching antibiotics list:", error);
				alert("An error occurred while fetching the antibiotics list.");
			}
		};

		fetchAntibiotics();
	}, []);

	const handleGetTrends = async () => {
		if (age && (age <= 40 || age >= 80)) {
			alert("Age must be between 40 and 80 for best results.");
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

			const response = await axios.post(
				"http://localhost:5005/predict_trends",
				requestData
			);

			if (response.data?.predictions?.length > 0) {
				const selectedPrediction = response.data.predictions.find(
					(ab) => ab.antibiotic === selectedAb
				);

				if (
					selectedPrediction &&
					selectedPrediction.yearly_stats?.length >= 0
				) {
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
					<option value="" disabled>
						Select Patient Type
					</option>
					{patientTypes.map((pt) => (
						<option key={pt} value={pt}>
							{pt}
						</option>
					))}
				</select>

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

				<input
					type="number"
					placeholder="Enter Age"
					value={age}
					onChange={(e) => setAge(e.target.value)}
					className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10 w-32 placeholder:text-orange-500"
				/>

				<button
					onClick={handleGetTrends}
					className="text-white bg-orange-500 rounded-full px-6 py-2 disabled:opacity-35"
					disabled={!patientType || !specimenType || !selectedAb}
				>
					Get Trends
				</button>
			</div>

			<div className="w-full h-[300px] md:h-[450px]">
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
						Loading trends...
					</div>
				)}
			</div>
		</div>
	);
}

export default Trends;
