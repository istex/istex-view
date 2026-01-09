import Typography from "@mui/material/Typography";
import { InlineDebug } from "../../debug/InlineDebug";
import type { DocumentJson } from "../../parser/document";
import { Value } from "../../tags/Value";

type PersNameProps = {
	data: DocumentJson;
};

export function PersName({ data }: PersNameProps) {
	if (!Array.isArray(data.value)) {
		return (
			<InlineDebug
				message={`PersName data.value is not an array`}
				payload={data.value}
			/>
		);
	}

	if (data.value.length === 0) {
		return <InlineDebug message={`PersName data.value is empty`} />;
	}

	return (
		<Typography>
			{data.value.map((item, index) => (
				<Value key={index} data={item} />
			))}
		</Typography>
	);
}
