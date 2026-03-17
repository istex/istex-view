import {
	Box,
	Button,
	CircularProgress,
	TextField,
	Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useNavigation } from "react-router";

export default function ArkForm() {
	const { t } = useTranslation();
	const navigation = useNavigation();
	const navigate = useNavigate();
	const isLoading = navigation.state === "loading";

	const goToArkRoute = (formData: FormData) => {
		const ark = formData.get("ark");
		if (ark) {
			navigate(`/${encodeURIComponent(ark.toString().trim())}`);
		}
	};

	return (
		<Box component="form" autoComplete="off" action={goToArkRoute}>
			<Typography sx={{ mb: 2 }}>{t("home.ArkForm.head")}</Typography>

			<Box sx={{ display: "flex", gap: 2 }}>
				<TextField label="ARK" name="ark" required sx={{ flexGrow: 1 }} />
				<Button
					type="submit"
					variant="contained"
					disabled={isLoading}
					sx={{ position: "relative" }}
				>
					{t("home.ArkForm.submitButton")}
					{isLoading && <CircularProgress sx={{ position: "absolute" }} />}
				</Button>
			</Box>
		</Box>
	);
}
