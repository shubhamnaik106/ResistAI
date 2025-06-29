import React, { useState } from "react";
import axios from "axios";

function Data() {
	const [file, setFile] = useState(null);
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);

	const handleFileChange = (event) => {
		setFile(event.target.files[0]);
		setStatus("");
	};

	const handleUpload = async () => {
		const validTypes = [
			"application/zip",
			"application/x-zip-compressed",
			"application/octet-stream",
			"",
		];
		if (!file || !validTypes.includes(file.type)) {
			alert("Please select a valid ZIP file.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		setLoading(true);
		try {
			const response = await axios.post(
				"http://localhost:5005/data_processing",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setStatus(response.data.message || "File uploaded successfully!");
		} catch (error) {
			console.error("Upload failed:", error);
			setStatus("Failed to upload ZIP file.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 mt-4 bg-white bg-opacity-10 rounded-3xl text-white">
			<h2 className="text-2xl font-bold mb-4">Upload Dataset ZIP File</h2>
			<input
				type="file"
				accept=".zip"
				onChange={handleFileChange}
				className="mb-4 block text-orange-500"
			/>
			<button
				onClick={handleUpload}
				className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600"
			>
				{loading ? "Processing..." : "Upload"}
			</button>

			{loading && (
				<div className="mt-4 flex items-center">
					<div className="w-5 h-5 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mr-2"></div>
					<p>Uploading and processing data...</p>
				</div>
			)}

			{status && !loading && <p className="mt-4">{status}</p>}
		</div>
	);
}

export default Data;
