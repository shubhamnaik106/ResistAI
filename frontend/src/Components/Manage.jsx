import React, { useState, useEffect } from "react";
import axios from "axios";

function Manage() {
	const [antibiotics, setAntibiotics] = useState([]);
	const [organisms, setOrganisms] = useState([]);
	const [newAntibiotic, setNewAntibiotic] = useState("");
	const [newOrganism, setNewOrganism] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedOrganism, setSelectedOrganism] = useState("");
	const [assignedAntibiotics, setAssignedAntibiotics] = useState({});

	useEffect(() => {
		fetchAntibiotics();
		// Fetch organisms if you have a backend endpoint for it
	}, []);

	const fetchAntibiotics = async () => {
		try {
			const response = await axios.get("http://localhost:5005/get_antibiotics");
			setAntibiotics(response.data);
		} catch (error) {
			console.error("Error fetching antibiotics:", error);
		}
	};

	const handleAddAntibiotic = () => {
		if (!newAntibiotic.trim()) return;
		setAntibiotics([...antibiotics, newAntibiotic.trim()]);
		setNewAntibiotic("");
	};

	const handleDeleteAntibiotic = (name) => {
		setAntibiotics(antibiotics.filter((a) => a !== name));
	};

	const handleAssignAntibiotic = (org) => {
		if (!org || !newAntibiotic.trim()) return;
		setAssignedAntibiotics((prev) => ({
			...prev,
			[org]: [...(prev[org] || []), newAntibiotic.trim()],
		}));
		setNewAntibiotic("");
	};

	const filteredAntibiotics = antibiotics.filter((a) =>
		a.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="p-6 backdrop-blur-md bg-white bg-opacity-10 rounded-3xl text-white mt-4">
			<h2 className="text-3xl font-bold mb-4">
				Manage Antibiotics & Organisms
			</h2>

			{/* Antibiotic Search */}
			<input
				type="text"
				placeholder="Search Antibiotic"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				className="p-2 mb-4 text-orange-500 bg-orange-500 bg-opacity-10 placeholder:text-orange-500 rounded-md"
			/>

			{/* Antibiotic List */}
			<div className="mb-4">
				<h3 className="text-xl font-semibold mb-2">Antibiotics</h3>
				<ul className="mb-4">
					{filteredAntibiotics.map((antibiotic, index) => (
						<li key={index} className="flex justify-between">
							<span>{antibiotic}</span>
							<button
								onClick={() => handleDeleteAntibiotic(antibiotic)}
								className="text-red-400 hover:underline"
							>
								Delete
							</button>
						</li>
					))}
				</ul>

				{/* Add Antibiotic */}
				<div className="flex gap-2">
					<input
						type="text"
						placeholder="New Antibiotic"
						value={newAntibiotic}
						onChange={(e) => setNewAntibiotic(e.target.value)}
						className="p-2 rounded-md text-orange-500 bg-orange-500 bg-opacity-10 placeholder:text-orange-500"
					/>
					<button
						onClick={handleAddAntibiotic}
						className="bg-orange-500 px-4 py-2 rounded-md"
					>
						Add
					</button>
				</div>
			</div>

			{/* Organism Management */}
			<div className="mt-6">
				<h3 className="text-xl font-semibold mb-2">Organisms</h3>

				<input
					type="text"
					placeholder="New Organism"
					value={newOrganism}
					onChange={(e) => setNewOrganism(e.target.value)}
					className="p-2 rounded-md text-orange-500 bg-orange-500 bg-opacity-10 placeholder:text-orange-500 mr-2"
				/>
				<button
					onClick={() => {
						if (newOrganism.trim()) {
							setOrganisms([...organisms, newOrganism.trim()]);
							setNewOrganism("");
						}
					}}
					className="bg-orange-500 px-4 py-2 rounded-md"
				>
					Add Organism
				</button>

				{/* Assign Antibiotics to Organism */}
				<div className="mt-4">
					<select
						value={selectedOrganism}
						onChange={(e) => setSelectedOrganism(e.target.value)}
						className="p-2 rounded-md text-orange-500 bg-orange-500 bg-opacity-10 placeholder:text-orange-500 mb-2"
					>
						<option value="">Select Organism</option>
						{organisms.map((org, i) => (
							<option key={i} value={org}>
								{org}
							</option>
						))}
					</select>

					<button
						onClick={() => handleAssignAntibiotic(selectedOrganism)}
						className="bg-orange-500 px-4 py-2 rounded-md ml-2"
					>
						Assign Antibiotic
					</button>
				</div>

				{/* Assigned Antibiotics */}
				{Object.keys(assignedAntibiotics).map((org, idx) => (
					<div key={idx} className="mt-2">
						<h4 className="text-lg font-semibold">{org}</h4>
						<ul className="list-disc list-inside">
							{assignedAntibiotics[org].map((ab, i) => (
								<li key={i}>{ab}</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}

export default Manage;
