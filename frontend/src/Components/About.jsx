import React from "react";

function About() {
	const guide = "Amrita Naik";
	const team = [
		"Stephen Fernandes",
		"Shubham Naik",
		"Dhruv Naik",
		"Syndroy Araujo",
	];

	const description =
		"ResistAI is an advanced clinical decision support platform developed to combat antimicrobial resistance (AMR).Leveraging real-time patient data and machine learning algorithms, it provides personalized antibiotic recommendations, visualizes resistance trends over time, and integrates seamlessly with electronic health records.Designed for scalability and ease of use, ResistAI empowers healthcare professionals to make data-driven decisions, reduce treatment failures, and improve patient outcomes across hospital and outpatient settings.";

	const getInitials = (name) =>
		name
			.split(" ")
			.map((n) => n[0])
			.join("");

	return (
		<div className="w-full p-4 backdrop-blur-sm bg-orange-500 bg-opacity-10 rounded-3xl bg-clip-padding mt-4 text-white text-center">
			{/* About Section */}
			<h2 className="text-3xl font-bold mb-4 text-white">About ResistAI</h2>
			<p className="text-lg mb-6 max-w-5xl mx-auto text-white">{description}</p>

			{/* Guide Card */}
			<div className="flex flex-col items-center bg-white bg-opacity-20 rounded-2xl p-4 mb-4 w-48 mx-auto">
				<div className="h-12 w-12 bg-white bg-opacity-30 rounded-full mb-2 flex items-center justify-center text-xl font-bold text-white">
					{getInitials(guide)}
				</div>
				<span className="text-lg font-semibold text-white">{guide}</span>
				<span className="text-xs text-gray-200 mt-1">Guide</span>
			</div>

			{/* Team Section */}
			<h3 className="text-2xl font-semibold mb-4 text-white">Meet the Team</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
				{team.map((member) => (
					<div
						key={member}
						className="flex flex-col items-center bg-white bg-opacity-20 rounded-2xl p-4"
					>
						<div className="h-16 w-16 bg-white bg-opacity-30 rounded-full mb-2 flex items-center justify-center text-xl font-bold text-white">
							{getInitials(member)}
						</div>
						<span className="text-base font-semibold text-white">{member}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default About;
