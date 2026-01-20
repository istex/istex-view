import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export function FileSelectorButton({
	placeholder,
	buttonLabel,
	onChange,
	dataTestId,
	required = false,
}: FileSelectorButtonProps) {
	const { t } = useTranslation();

	const inputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);

	const handleButtonClick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (!event.target.files?.length) {
				return setFile(null);
			}
			const file = event.target.files[0] ?? null;

			setFile(file);
			onChange(file);
		},
		[onChange],
	);

	const handleReset = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();

			if (!inputRef.current || required) {
				return;
			}

			inputRef.current.value = "";
			setFile(null);
			onChange(null);
		},
		[required, onChange],
	);

	return (
		<>
			<Stack
				direction={{
					xs: "column",
					md: "row",
				}}
				gap={2}
				onClick={handleButtonClick}
				sx={{
					width: "100%",
					padding: 1,
					alignItems: "center",
					border: (theme) => `1px solid ${theme.palette.divider}`,
					borderRadius: 1,
					cursor: "pointer",
					height: {
						xs: "fit-content",
						md: "48px",
					},
				}}
			>
				<Button
					role="button"
					color="primary"
					variant="contained"
					size="small"
					sx={{
						minWidth: { xs: "100%", md: "25%" },
						width: { xs: "100%", md: "25%" },
						height: "100%",
					}}
				>
					{buttonLabel ?? t("upload.selectFile")}
				</Button>
				{file ? (
					<>
						<Typography
							sx={{ flexGrow: 1, textAlign: { xs: "center", md: "initial" } }}
						>
							{file.name}
						</Typography>
						{!required && (
							<IconButton size="small" onClick={handleReset}>
								<ClearIcon />
							</IconButton>
						)}
					</>
				) : (
					<Typography
						color="text.secondary"
						sx={{
							flexGrow: 1,
							fontStyle: "italic",
							textAlign: { xs: "center", md: "initial" },
						}}
					>
						{placeholder ?? t("upload.noFileSelected")}
					</Typography>
				)}
			</Stack>

			<input
				type="file"
				style={{ display: "none" }}
				ref={inputRef}
				onChange={handleChange}
				accept="*.tei"
				data-testid={dataTestId}
				tabIndex={-1}
				aria-hidden="true"
			/>
		</>
	);
}

export type FileSelectorButtonProps = {
	placeholder?: string;
	buttonLabel?: string;
	onChange(file: File | null): void;
	dataTestId?: string;
	required?: boolean;
};
