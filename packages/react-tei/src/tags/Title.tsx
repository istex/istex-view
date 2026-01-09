import { Typography } from "@mui/material";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const Title = ({ data }: ComponentProps) => {
	switch (data.attributes?.["@type"]) {
		case "main":
			return (
				<Typography fontWeight="bold" component="span">
					<Value data={data.value} />
				</Typography>
			);
		case "sub":
			return (
				<Typography variant="subtitle1" component="span">
					<Value data={data.value} />
				</Typography>
			);
		default:
			return <Value data={data.value} />;
	}
};
