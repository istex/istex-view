import { Typography } from "@mui/material";
import type { DocumentJson } from "../parser/document.js";
import { Value } from "./Value.js";

type PersNameProps = {
	data: DocumentJson;
};

export const PersName = ({ data }: PersNameProps) => {
	if (!Array.isArray(data.value)) {
		console.warn("PersName data.value is not an array:", data.value);
		return null;
	}
	return (
		<Typography>
			{data.value.map((item, index) => (
				<Value key={index} data={item} />
			))}
		</Typography>
	);
};
