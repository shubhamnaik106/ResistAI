import "./App.css";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Trends from "./Components/Trends";
import About from "./Components/About";
import Debug from "./Components/Debug";
import Manage from "./Components/Manage";
import { useState } from "react";

function App() {
	const [activeSection, setActiveSection] = useState("home");

	return (
		<div
			id="sectionh"
			className="min-h-[100vh] bg-gradient-to-tr from-black via-black to-orange-900 px-8 md:px-14 lg:px-36 pb-10 bg-fixed"
		>
			<Header setActiveSection={setActiveSection} />

			{activeSection === "home" && <Hero />}
			{activeSection === "trends" && <Trends />}
			{activeSection === "debug" && <Debug />}
			{activeSection === "manage" && <Manage />}
			{activeSection === "about" && <About />}
		</div>
	);
}

export default App;
