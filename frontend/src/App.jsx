import "./App.css";
import Header from "./Components/Header";
import Hero from "./Components/Hero";

function App() {
	return (
		<div
			id="sectionh"
			className="min-h-[100vh] bg-gradient-to-r from-black   to-black px-8 md:px-14 lg:px-36 pb-10 bg-fixed"
		>
			<Header />
			<Hero />
		</div>
	);
}

export default App;
