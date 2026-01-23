import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";

export function Loader() {
	return (
		<Container
			maxWidth="sm"
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexGrow: 1,
			}}
		>
			<CircularProgress size={48} />
		</Container>
	);
}
