import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import ArkForm from "./ArkForm";
import Examples from "./Examples";

export default function HomePage() {
	const { t } = useTranslation();

	return (
		<Container sx={{ pt: 4 }}>
			<Stack spacing={4}>
				<Box component="section">
					<Typography sx={{ mb: 2 }}>{t("home.headline")}</Typography>
					<Typography>
						<Trans
							i18nKey="home.paragraph"
							components={{
								istexLink: (
									<Link
										href="https://www.istex.fr/"
										target="_blank"
										rel="noreferrer"
									/>
								),
								enrichmentProcessLink: (
									<Link
										href="https://data.istex.fr/instance/enrichment-process/"
										target="_blank"
										rel="noreferrer"
									/>
								),
							}}
						/>
					</Typography>
				</Box>

				<Examples />

				<ArkForm />
			</Stack>
		</Container>
	);
}
