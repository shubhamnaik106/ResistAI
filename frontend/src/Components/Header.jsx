import React, { useState, useEffect } from "react";
import { HiBars3BottomRight, HiOutlineXMark } from "react-icons/hi2";
import MenuOverlay from "./MenuOverlay";

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
			action: () => setActiveSection("home"),
		},
		{
			id: 2,
			title: "TRENDS",
			action: () => setActiveSection("trends"),
		},
		{
			id: 3,
			title: "DEBUG",
			action: () => setActiveSection("debug"),
		},
		{
			id: 4,
			title: "MANAGE",
			action: () => setActiveSection("manage"),
		},
		{
			id: 5,
			title: "ABOUT",
			action: () => setActiveSection("about"),
		},
	];

	const handleClose = () => {
		console.log("Menu item clicked, closing menu");
		setToggle(false);
	};

	return (
		<div className="flex items-center justify-end md:justify-center sticky top-0 pt-5 z-10">
			<p className="text-orange-500 text-5xl font-bold mr-auto">ResistAI</p>
			<div className="hidden md:flex gap-4 backdrop-blur-lg bg-white shadow-xl sm:rounded-3xl py-2 px-4 bg-clip-padding bg-opacity-10">
				{menuList.map((item) => (
					<div key={item.id}>
						<h2
							onClick={() => {
								item.action();
								handleClose();
							}}
							className="text-light_cyan transition-transform duration-500 hover:scale-110 border-[2px] border-transparent hover:border-[2px] hover:bg-orange-500 hover:border-white rounded-full text-[15px] px-6 py-1 cursor-pointer"
						>
							{item.title}
						</h2>
					</div>
				))}
			</div>
			<div className="md:hidden">
				{!toggle ? (
					<HiBars3BottomRight
						onClick={() => setToggle(!toggle)}
						className="text-orange-500 text-[22px] cursor-pointer"
					/>
				) : (
					<HiOutlineXMark
						onClick={() => setToggle(!toggle)}
						className="text-orange-500 text-[22px] cursor-pointer"
					/>
				)}
				{toggle && (
					<MenuOverlay menuList={menuList} handleClose={handleClose} />
				)}
			</div>
		</div>
	);
}

export default Header;
