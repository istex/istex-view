import { DocumentTag } from "./DocumentTag.js";

export const Div = ({ data }: { data: Record<string, unknown>[] }) => {
	return (
		<div>
			{Object.entries(data).map(([key, value]) => (
				<DocumentTag
					key={key}
					name={key}
					data={value as Record<string, unknown>}
				/>
			))}
		</div>
	);
};
