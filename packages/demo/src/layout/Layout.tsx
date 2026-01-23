import { Outlet } from "react-router";
import Header from "./Header";
import Navbar from "./NavBar";

export function Layout() {
	return (
		<>
			<Navbar />
			<Header />
			<Outlet />
		</>
	);
}
