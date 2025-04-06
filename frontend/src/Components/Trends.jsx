import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	LabelList,
} from "recharts";

function Trends() {
	const [chartData, setChartData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.post("http://localhost:5005/", {
					type: "IPD",
					specimenType: "Urine",
					gender: "Male",
					age: 30,
				});

				if (response.data?.predictions) {
					const formatted = response.data.predictions.map((item) => ({
						antibiotic: item.antibiotic,
						resistance: item.resistance,
					}));
					setChartData(formatted);
				}
			} catch (error) {
				console.error("Error fetching trends:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div
			className="w-full h-[500px] p-6 backdrop-blur-sm bg-white bg-opacity-10 rounded-3xl bg-clip-padding mt-4 text-white"
			data-aos-easing="ease-out"
			data-aos-duration="1000"
		>
			<h2 className="text-2xl font-bold mb-4">Antibiotic Resistance Trends</h2>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart
					data={chartData}
					margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="antibiotic"
						angle={-45}
						textAnchor="end"
						interval={0}
					/>
					<YAxis
						label={{
							value: "Resistance (%)",
							angle: -90,
							position: "insideLeft",
						}}
					/>
					<Tooltip />
					<Bar dataKey="resistance" fill="#f97316">
						<LabelList dataKey="resistance" position="top" />
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

export default Trends;
