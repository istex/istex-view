import Typography from "@mui/material/Typography";
import { DebugTag } from "../../debug/DebugTag";
import type { DocumentJson } from "../../parser/document";
import { Value } from "../../tags/Value";

type PersNameProps = {
	data: DocumentJson;
};

export function PersName({ data }: PersNameProps) {
	if (!Array.isArray(data.value)) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message={`PersName data.value is not an array`}
				payload={data.value}
			/>
		);
	}

	if (data.value.length === 0) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message={`PersName data.value is empty`}
			/>
		);
	}

	return (
		<Typography>
			{data.value.map((item, index) => (
				<Value key={index} data={item} />
			))}
		</Typography>
	);
}
