import React, { useState } from "react";
import axios from "axios";

function Hero() {
	const [specimenType, setSpecimenType] = useState("");
	const [patientType, setPatientType] = useState("");
	const [gender, setGender] = useState("");
	const [age, setAge] = useState("");
	const [displayText, setDisplayText] = useState("Recommendations !!!");

	const handleSubmit = async () => {
		if (!patientType || !gender || !age || !specimenType) {
			alert("Please fill in all the fields before submitting.");
			return;
		}

		if (age <= 0 || age > 100) {
			alert("Age must be between 1 and 100.");
			return;
		}

		try {
			// Send POST request to Flask backend
			const response = await axios.post("http://localhost:5005/", {
				type: patientType,
				specimenType: specimenType,
				gender: gender,
				age: parseInt(age, 10),
			});

			// Display the prediction result
			setDisplayText(
				<div className="overflow-auto max-h-96 p-4 bg-gray-900 text-white rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold mb-4">Prediction Results</h2>
					<table className="min-w-full bg-gray-800 border border-gray-600 text-white">
						<thead className="bg-gray-700">
							<tr>
								<th className="py-2 px-4 border-b">Antibiotic</th>
								<th className="py-2 px-4 border-b">Status</th>
								<th className="py-2 px-4 border-b">Resistance (%)</th>
								<th className="py-2 px-4 border-b">Sensitive (%)</th>
								<th className="py-2 px-4 border-b">Antibiotic not used (%)</th>
								<th className="py-2 px-4 border-b">Resistant Count</th>
								<th className="py-2 px-4 border-b">Sensitive Count</th>
								<th className="py-2 px-4 border-b">Antibiotic not tested Count</th>
							</tr>
						</thead>
						<tbody>
							{response.data.predictions.map((item, index) => (
								<tr key={index} className="hover:bg-gray-700">
									<td className="py-2 px-4 border-b">{item.antibiotic}</td>
									<td className="py-2 px-4 border-b font-semibold">{item.resistance_status}</td>
									<td className="py-2 px-4 border-b">{item.resistance}%</td>
									<td className="py-2 px-4 border-b">{item.sensitive}%</td>
									<td className="py-2 px-4 border-b">{item.notused}%</td>
									<td className="py-2 px-4 border-b">{item.total_resistant_patients}</td>
									<td className="py-2 px-4 border-b">{item.total_sensitive_patients}</td>
									<td className="py-2 px-4 border-b">{item.total_notused_patients}</td>
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

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-4 md:px-10 backdrop-blur-sm bg-white bg-opacity-10 rounded-3xl mt-4">
			{/* Left Section */}
			<div className="mb-10 text-center md:text-left pt-10">
				<div className="mt-4 flex flex-col gap-4">
					<p className="text-white text-xl">Enter Type of Patient</p>
					<select
						value={patientType}
						onChange={(e) => setPatientType(e.target.value)}
						className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
					>
						<option value="" disabled>Select Type</option>
						<option value="IPD">IPD</option>
						<option value="OPD">OPD</option>
					</select>

					<p className="text-white text-xl mt-4">Enter Type of Specimen</p>
					<select
						value={specimenType}
						onChange={(e) => setSpecimenType(e.target.value)}
						className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
					>
						<option value="" disabled>Select Specimen</option>
						<option value="Urine">Urine</option>
						<option value="Stool">Stool</option>
						<option value="Blood">Blood</option>
						<option value="Swab">Swab</option>
						<option value="Pus">Pus</option>
					</select>

					<p className="text-white text-xl mt-4">Enter Gender of Patient</p>
					<select
						value={gender}
						onChange={(e) => setGender(e.target.value)}
						className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
					>
						<option value="" disabled>Select Gender</option>
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
						className="text-white bg-orange-500 mt-8 py-3 transition-transform duration-500 hover:scale-110 border-2 border-transparent hover:border-white rounded-full text-[15px] px-6 cursor-pointer"
					>
						Get Recommendations
					</button>
				</div>
			</div>

			{/* Right Section */}
			<div className="flex justify-center text-lg font-semibold text-white">
				{displayText}
			</div>
		</div>
	);
}

export default Hero;
