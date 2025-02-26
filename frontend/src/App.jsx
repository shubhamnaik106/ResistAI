import "./App.css";
import Header from "./Components/Header";
import Hero from "./Components/Hero";

function App() {
	return (
		<div
			id="sectionh"
			className="min-h-[100vh] bg-gradient-to-tr from-black via-black to-orange-900 px-8 md:px-14 lg:px-36 pb-10 bg-fixed"
		>
			<Header />

			<Hero />
		</div>
	);
}

export default App;
