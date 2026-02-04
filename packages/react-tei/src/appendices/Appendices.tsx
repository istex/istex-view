import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { Value } from "../tags/Value";
import { useDocumentAppendices } from "./useDocumentAppendices";

export function Appendices() {
	const { t } = useTranslation();

	const appendices = useDocumentAppendices();

	if (!appendices) {
		return null;
	}

	return (
		<Stack
			component="section"
			sx={{
				gap: 2,
				padding: {
					xs: 2,
					md: 8,
				},
				backgroundColor: "white",
			}}
			id="appendices"
		>
			<Typography
				variant="h3"
				sx={{
					minHeight: "48px",
					display: "flex",
					alignItems: "center",
					fontSize: "1.25rem",
					fontWeight: 700,
					color(theme) {
						return theme.palette.primary.main;
					},
				}}
			>
				{t("appendices.title")}
			</Typography>
			<Value data={appendices} />
		</Stack>
	);
}
