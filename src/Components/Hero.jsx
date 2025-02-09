import React, { useState } from "react";

function Hero() {
	const [patientType, setPatientType] = useState("");
	const [gender, setGender] = useState("");
	const [age, setAge] = useState("");
	const [displayText, setDisplayText] = useState("Recommendations !!!");

	const handleSubmit = () => {
		if (!patientType || !gender || !age) {
			alert("Please fill in all the fields before submitting.");
			return;
		}

		if (age <= 0) {
			alert("Age must be greater than 0.");
			return;
		}

		setDisplayText(
			<div>
				<p className="mr-4 mb-4">
					Predicted Culture/Bacteria : Escherichia coli
				</p>
				<p className="mb-4">Recommended Antibiotic Class : PENICILLINS</p>
				<p className="mr-36 mb-2">Recommended Antibiotics :</p>
				<p>Oxacillian (92.8% Accuracy) (Safe for Children, Pregnant Woman)</p>
				<p>Ticarcillian (85.2% Accuracy) (Safe for Children, Pregnant Woman)</p>
				<p>Ampicillin (81.9% Accuracy) (Safe for Children, Pregnant Woman)</p>
			</div>
		);
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
						<p className="text-white text-xl">Enter Type of Patient</p>
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

						{/* Dropdown for Gender */}
						<p className="text-white text-xl mt-8">Enter Gender of Patient</p>
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
						<p className="text-white text-xl mt-8">Enter Age of Patient</p>
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
							className="mt-10 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
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
