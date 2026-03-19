import { Box, Grid, Link, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link as ReactRouterLink } from "react-router";

const examples = [
	{
		ark: "ark:/67375/80W-WHRC7KXT-R",
		title: "Le placebo à l’hôpital",
	},
	{
		ark: "ark:/67375/6H6-72C586J9-W",
		title:
			"Atom-based stochastic and non-stochastic 3D-chiral bilinear indices and their applications to central chirality codification",
	},
	{
		ark: "ark:/67375/6H6-95DLFQ4Z-C",
		title:
			"The influences of carcass weight and depot on the fatty acid composition of fats of suckling Manchego lambs",
	},
	{
		ark: "ark:/67375/6H6-PHL203VD-J",
		title: "The economics of native plants in residential landscape designs",
	},
	{
		ark: "ark:/67375/6H6-TZD7ZQS2-9",
		title: "Environmental risk assessment of hydrofluoroethers (HFEs)",
	},
	{
		ark: "ark:/67375/6H6-LNXQBNSQ-K",
		title:
			"The single-machine total tardiness scheduling problem: Review and extensions",
	},
];

export default function Examples() {
	const { t } = useTranslation();

	return (
		<Box component="section">
			<Typography sx={{ mb: 2 }}>{t("home.examples")}</Typography>
			<Grid container spacing={2} sx={{ px: 4 }}>
				{examples.map(({ ark, title }) => (
					<Grid key={ark} size={6}>
						<Paper
							elevation={0}
							sx={{ p: 2, bgcolor: "colors.white", height: "100%" }}
						>
							<Link
								component={ReactRouterLink}
								underline="hover"
								to={`/${encodeURIComponent(ark)}`}
								sx={{
									fontFamily: "Montserrat",
									fontSize: "1rem",
								}}
							>
								{title}
							</Link>
						</Paper>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
