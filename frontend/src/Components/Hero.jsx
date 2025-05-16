import React, { useState } from "react";
import axios from "axios";

function Hero() {
	const [specimenType, setSpecimenType] = useState("");
	const [cultureType, setCultureType] = useState("");
	const [patientType, setPatientType] = useState("");
	const [gender, setGender] = useState("");
	const [age, setAge] = useState("");
	const [model, setmodel] = useState("");
	const [displayText, setDisplayText] = useState("Loading recommendations...");
	const [cultures, setCultures] = useState([]);
	


	const handleSubmit = async () => {
		if (!patientType || !gender || !age || !specimenType || !model) {
			alert("Please fill in all the fields before submitting.");
			return;
		}

		if (age <= 40 || age >= 80) {
			alert("Age must be between 40 and 80 for best results.");
			return;
		}

		try {
			const response = await axios.post("http://localhost:5005/predict_hero", {
				type: patientType,
				//cultureType: cultureType,
				specimenType: specimenType,
				gender: gender,
				culture: cultureType,
				model: model,
				age: parseInt(age, 10),
			});

			setDisplayText(
				<div className="overflow-auto max-h-96">
					<h2 className="text-2xl font-bold mb-4 text-white">
						Prediction Results
					</h2>
					<table className="min-w-full md:mb-0 mb- bg-transparent border border-orange-500 rounded-lg">
						<thead className="bg-white bg-opacity-10 text-white">
							<tr>
								<th className="py-2 px-4 border-b">Antibiotic</th>
								<th className="py-2 px-4 border-b">Status</th>
								<th className="py-2 px-4 border-b">Resistance (%)</th>
								<th className="py-2 px-4 border-b">Sensitive (%)</th>
								<th className="py-2 px-4 border-b">Antibiotic not used (%)</th>
								<th className="py-2 px-4 border-b">Resistant Count</th>
								<th className="py-2 px-4 border-b">Sensitive Count</th>
								<th className="py-2 px-4 border-b">
									Antibiotic not tested Count
								</th>
							</tr>
						</thead>
						<tbody>
							{response.data.predictions.map((item, index) => (
								<tr key={index} className="hover:bg-gray-700">
									<td className="py-2 px-4 border-b">{item.antibiotic}</td>
									<td className="py-2 px-4 border-b font-semibold">
										{item.resistance_status}
									</td>
									<td className="py-2 px-4 border-b bg-red-500 bg-opacity-50">
										{item.resistance}%
									</td>
									<td className="py-2 px-4 border-b bg-green-500 bg-opacity-50">
										{item.sensitive}%
									</td>
									<td className="py-2 px-4 border-b bg-yellow-500 bg-opacity-50">
										{item.notused}%
									</td>
									<td className="py-2 px-4 border-b">
										{item.total_resistant_patients}
									</td>
									<td className="py-2 px-4 border-b">
										{item.total_sensitive_patients}
									</td>
									<td className="py-2 px-4 border-b">
										{item.total_notused_patients}
									</td>
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
							<option value="IPD" disabled>
								IPD
							</option>
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
							<option value="Stool">Stool</option>
							<option value="Blood">Blood</option>
							<option value="Swab">Swab</option>
							<option value="Pus">Pus</option>
							<option value="Sputum">Sputum</option>
						</select>

						<p className="text-white text-xl mt-4">Enter Type of Culture</p>
						<select
							value={cultureType}
							onChange={(e) => setCultureType(e.target.value)}
							className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
						>
							<option value="" disabled>
								Select Culture
							</option>
							<option value="Escherichia coli">Escherichia Coli</option>
							<option value="Klebsiella pneumoniae">Klebsiella Pneumoniae</option>
							<option value="Yeast Candida">Yeast Candida</option>
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
							className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10 placeholder:text-orange-500"
							min="1"
							max="100"
						/>
						<p className="text-white text-xl mt-4">Enter Model</p>
						<select
							value={model}
							onChange={(e) => setmodel(e.target.value)}
							className="p-3 rounded-md text-orange-500 bg-orange-500 bg-opacity-10"
						>
							<option value="" disabled>
								Select Model
							</option>
							<option value="knn">KNN</option>
							<option value="svm">SVM</option>
							<option value="rf">Random Forest</option>
							<option value="lr">LR</option>
							<option value="xgb">XGboost</option>
						</select>

						<button
							onClick={handleSubmit}
							className="text-white bg-orange-500 mt-8 border-[2px] border-transparent rounded-full text-[15px] px-6 py-1 cursor-pointer disabled:opacity-35"
							disabled={
								!patientType || !specimenType || !gender || !age || !model
							}
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
