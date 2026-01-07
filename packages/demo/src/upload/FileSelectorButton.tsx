import Button from "@mui/material/Button";
import { useRef } from "react";

export function FileSelectorButton({
	label,
	onChange,
}: FileSelectorButtonProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		inputRef.current?.click();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.length) {
			return onChange(null);
		}

		onChange(event.target.files[0] ?? null);
	};

	return (
		<>
			<Button
				role="button"
				onClick={handleButtonClick}
				sx={{
					width: "100%",
				}}
				color="primary"
				variant="contained"
			>
				{label}
			</Button>
			<input
				type="file"
				style={{ display: "none" }}
				ref={inputRef}
				onChange={handleChange}
				accept="*.tei"
				data-testid="file-selector-input"
				tabIndex={-1}
				aria-hidden="true"
			/>
		</>
	);
}

export type FileSelectorButtonProps = {
	label: string;
	onChange(file: File | null): void;
};
