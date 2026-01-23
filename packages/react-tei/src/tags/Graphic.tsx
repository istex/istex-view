import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import type { ComponentProps } from "./type";

export function Graphic({ data: _data }: ComponentProps) {
	const { t } = useTranslation();
	return (
		<Box
			component="span"
			sx={{
				background: (theme) => theme.palette.grey[100],
				padding: (theme) => theme.spacing(0.5, 2),
			}}
		>
			{t("figure.unloaded")}
		</Box>
	);
}
