import React from "react";

function About() {
	return (
		<>
			<div
				className="grid grid-cols-1 md:grid-cols-1 items-center gap-6 px-4 md:px-10 backdrop-blur-sm bg-white bg-opacity-10 rounded-3xl bg-clip-padding mt-4"
				data-aos-easing="ease-out"
				data-aos-duration="1000"
			>
				<h2 className="text-4xl text-white font-bold">About ResistAI</h2>
				<p className=" text-slate-200">
					ResistAI is an intelligent clinical decision support tool designed to
					fight antimicrobial resistance (AMR).
				</p>
				<p className=" text-slate-200">
					It uses real-time data analysis and machine learning to recommend
					effective antibiotics tailored to patient profiles.
				</p>
				<p className="mb-2 text-slate-200">
					This project empowers doctors with data-driven insights to ensure
					smarter antibiotic prescriptions.
				</p>
			</div>
		</>
	);
}

export default About;
