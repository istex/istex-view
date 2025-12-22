import Typography from "@mui/material/Typography";
import type { DocumentJson } from "../../parser/document";
import { Value } from "../../tags/Value";

type PersNameProps = {
	data: DocumentJson;
};

export function PersName({ data }: PersNameProps) {
	if (!Array.isArray(data.value)) {
		console.warn("PersName data.value is not an array:", data.value);
		return null;
	}

	if (data.value.length === 0) {
		console.warn("PersName data.value is empty:", data);
		return null;
	}
	return (
		<Typography>
			{data.value.map((item, index) => (
				<Value key={index} data={item} />
			))}
		</Typography>
	);
}
