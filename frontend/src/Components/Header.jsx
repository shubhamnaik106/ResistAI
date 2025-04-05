import React, { useState, useEffect } from "react";

function Header({ setActiveSection }) {
	const [toggle, setToggle] = useState(false);

	useEffect(() => {
		if (toggle) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
	}, [toggle]);

	const menuList = [
		{
			id: 1,
			title: "HOME",
			onClick: () => setActiveSection("home"),
		},
		{
			id: 2,
			title: "TRENDS",
			onClick: () => setActiveSection("trends"),
		},
		{
			id: 3,
			title: "ABOUT",
			onClick: () => setActiveSection("about"),
		},
	];

	const handleClose = () => {
		console.log("Menu item clicked, closing menu");
		setToggle(false);
	};

	return (
		<>
			<div className="flex items-center justify-end md:justify-center sticky top-0 pt-5 z-10">
				<p className="text-orange-500 text-5xl font-bold mr-auto">ResistAI</p>
				<div className="hidden md:flex gap-4 backdrop-blur-lg bg-white shadow-xl sm:rounded-3xl py-2 px-4 bg-clip-padding bg-opacity-10">
					{menuList.map((item) => (
						<div key={item.id}>
							<h2
								onClick={item.onClick}
								className="text-light_cyan transition-transform duration-500 hover:scale-110 border-[2px] border-transparent hover:border-[2px] hover:bg-orange-500 hover:border-white rounded-full text-[15px] px-6 py-1 cursor-pointer text-white font-normal"
							>
								{item.title}
							</h2>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default Header;
