import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FullScreenButton } from "../fullscreen/FullScreenButton";
import type { DocumentJson } from "../parser/document";
import { Value } from "./Value";

export function TableCaption({ id, label, titles }: TableCaptionProps) {
	const title = titles && titles.length > 0 ? titles[0] : undefined;
	const rest = titles && titles.length > 1 ? titles.slice(1) : [];

	return (
		<Typography
			component="caption"
			id={id}
			sx={{
				"&&": {
					padding: 0,
				},
			}}
		>
			<Stack direction="row" gap={2} alignItems="center">
				<FullScreenButton />
				<Stack gap={1} flexGrow={1}>
					<Box component="span">
						{label?.value && (
							<Typography
								component="span"
								sx={{ fontWeight: "bold", marginRight: 1 }}
							>
								<Value data={label.value} />{" "}
							</Typography>
						)}
						{title?.value && <Value data={title.value} />}
					</Box>
					{rest.map((t, index) => (
						<Box component="div" key={index}>
							<Value data={t.value} />
						</Box>
					))}
				</Stack>
			</Stack>
		</Typography>
	);
}

export type TableCaptionProps = {
	id: string;
	label?: DocumentJson;
	titles?: DocumentJson[];
};
