import { Box, Chip, Container, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import headerBackground from "../images/header-background.webp";
import istexLogo from "../images/istex.svg";

export default function Header() {
	const { t } = useTranslation();
	return (
		<Box
			component="header"
			sx={{
				backgroundImage: `url(${headerBackground})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
		>
			<Container sx={{ py: 2, pt: 4 }}>
				<Stack
					id="home-link"
					direction="row"
					spacing={1}
					component={Link}
					to="/"
					sx={{
						mb: 1,
						alignItems: "center",
						textDecoration: "none",
					}}
				>
					<img src={istexLogo} alt="Istex View" />
					<Typography
						component="div"
						variant="h3"
						sx={{
							color: "white",
							fontWeight: "normal",
							fontSize: "50px",
							position: "relative",
							top: "1px",
						}}
					>
						View{" "}
						<Chip
							label="BETA"
							color="secondary"
							sx={{ color: "colors.lightBlack" }}
						/>
					</Typography>
				</Stack>
				<Typography
					component={"strong"}
					sx={{ color: "white", mb: 2, fontWeight: "bold" }}
				>
					{t("header.subtitle")}
				</Typography>
				<Typography sx={{ color: "white" }}>
					{t("header.description")}
				</Typography>
			</Container>
		</Box>
	);
}
