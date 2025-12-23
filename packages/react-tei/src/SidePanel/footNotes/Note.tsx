import { Link, Stack } from "@mui/material";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const Note = ({ data }: ComponentProps) => {
	return (
		<Stack direction="row" gap={1}>
			{data.attributes?.["@n"] && (
				<Link
					component="button"
					onClick={() => {
						// TODO: scroll toward attributes?.["@xml:id"]
					}}
					sx={{
						justifySelf: "start",
						alignSelf: "start",
					}}
				>
					{data.attributes["@n"]}
				</Link>
			)}
			<div>
				<Value data={data.value} />
			</div>
		</Stack>
	);
};
