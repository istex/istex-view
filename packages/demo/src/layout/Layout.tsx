import Header from "./Header";
import Navbar from "./NavBar";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			<Header />
			{children}
		</>
	);
}
