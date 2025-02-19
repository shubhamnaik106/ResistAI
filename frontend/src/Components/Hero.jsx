import React, { useState } from "react";
import axios from "axios";
function Hero() {
	const [specimenType, setSpecimenType] = useState("");
	const [patientType, setPatientType] = useState("");
	const [gender, setGender] = useState("");
	const [age, setAge] = useState("");
	const [displayText, setDisplayText] = useState("Recommendations !!!");

	const handleSubmit = async() => {
		if (!patientType || !gender || !age) {
			alert("Please fill in all the fields before submitting.");
			return;
		}

		if (age <= 0 || age >100) {
			alert("Age must range from 0-100.");
			return;
		}

        try {
            // Send POST request to Flask backend
            const response = await axios.post("http://localhost:5005/", {
                type: patientType,
                specimenType: specimenType,
                gender: gender,
                age: age
            });

            // Display the prediction result
            setDisplayText(
				<div className="overflow-auto max-h-96">
					<h2 className="text-2xl font-bold mb-4">Prediction Results</h2>
					<table className="min-w-full bg-white border border-gray-300 ">
						<thead className="bg-gray-200 text-black">
							<tr>
								<th className="py-2 px-4 border-b">Antibiotic</th>
								<th className="py-2 px-4 border-b">Resistance Status</th>
								<th className="py-2 px-4 border-b">Accuracy (%)</th>
								<th className="py-2 px-4 border-b">Sensitivity (%)</th>
							</tr>
						</thead>
						<tbody>
							{response.data.predictions.map((item, index) => (
								<tr key={index} className="hover:bg-gray-100 text-black">
									<td className="py-2 px-4 border-b">{item.antibiotic}</td>
									<td className="py-2 px-4 border-b">{item.resistance_status}</td>
									<td className="py-2 px-4 border-b">{item.accuracy}</td>
									<td className="py-2 px-4 border-b">{item.sensitivity}</td>
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
			<div
				className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-4 md:px-10 backdrop-blur-sm bg-white bg-opacity-10 rounded-3xl bg-clip-padding mt-4"
				data-aos="fade-down"
				data-aos-easing="ease-out"
				data-aos-duration="1000"
			>
				{/* Left Section */}
				<div
					className="mb-10 text-center md:text-left pt-10"
					data-aos="zoom-out"
					data-aos-delay="1000"
				>
					<div className="mt-4 flex flex-col gap-4">
						{/* Dropdown for Type of Patient */}
						<p className="text-white text-xl -mt-6">Enter Type of Patient</p>
						<select
							value={patientType}
							onChange={(e) => setPatientType(e.target.value)}
							className="p-2 border rounded-md text-gray-700"
						>
							<option value="" disabled>
								Select Type
							</option>
							<option value="IPD">IPD</option>
							<option value="OPD">OPD</option>
						</select>

						{/* Dropdown for Type of Specimen */}
						<p className="text-white text-xl mt-4">Enter Type of Specimen</p>
						<select
							value={specimenType}
							onChange={(e) => setSpecimenType(e.target.value)}
							className="p-2 border rounded-md text-gray-700"
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

						{/* Dropdown for Gender */}
						<p className="text-white text-xl mt-4">Enter Gender of Patient</p>
						<select
							value={gender}
							onChange={(e) => setGender(e.target.value)}
							className="p-2 border rounded-md text-gray-700"
						>
							<option value="" disabled>
								Select Gender
							</option>
							<option value="Male">Male</option>
							<option value="Female">Female</option>
						</select>

						{/* Input for Age */}
						<p className="text-white text-xl mt-4">Enter Age of Patient</p>
						<input
							type="number"
							value={age}
							onChange={(e) => setAge(e.target.value)}
							placeholder="Age (Years)"
							className="p-2 border rounded-md"
							min="1"
						/>

						{/* Submit Button */}
						<button
							onClick={handleSubmit}
							className="mt-8 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
						>
							Submit Info
						</button>
					</div>
				</div>

				{/* Right Section */}
				<div
					className="flex justify-center text-lg font-semibold text-white whitespace-pre-line"
					data-aos="zoom-out"
					data-aos-delay="1000"
				>
					{displayText}
				</div>
			</div>
		</>
	);
}

export default Hero;
