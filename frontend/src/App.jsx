import "./App.css";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Trends from "./Components/Trends";
import About from "./Components/About";
import Debug from "./Components/Debug";
import Manage from "./Components/Manage";
import Data from "./Components/Data";
import { useState } from "react";
import dnaImage from "./assets/dna.png";
import dnaShadow from "./assets/shadow.png";

function App() {
	const [activeSection, setActiveSection] = useState("home");

	return (
		<div
			id="sectionh"
			className="min-h-[100vh] bg-gradient-to-tr from-black via-black to-orange-900 px-8 md:px-14 lg:px-36 pb-10 bg-fixed"
		>
					
			<img
				src={dnaShadow}
				alt="DNA Shadow"
				className="absolute top-0 right-[20vw] w-[300px] opacity-100 pointer-events-none z-0"
			/>

			<img
				src={dnaImage}
				alt="DNA"
				className="absolute -top-16 right-[20vw] w-[240px] opacity-100 pointer-events-none z-5"
			/>

			<Header setActiveSection={setActiveSection} />

			{activeSection === "home" && <Hero />}
			{activeSection === "trends" && <Trends />}
			{activeSection === "debug" && <Debug />}
			{activeSection === "manage" && <Manage />}
			{activeSection === "about" && <About />}
			{activeSection === "data" && <Data />}
		</div>
	);
}

export default App;
