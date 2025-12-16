import { tagCatalog } from "./tagCatalog.js";

export const DocumentTag = ({
	name,
	data,
	debug,
}: {
	name: string;
	data: string | Record<string, unknown> | Record<string, unknown>[] | string[];
	debug?: boolean;
}) => {
	if (Array.isArray(data)) {
		return (
			<>
				{data.map((item, index) => (
					<DocumentTag
						key={index}
						name={name}
						data={item as Record<string, unknown>}
					/>
				))}
			</>
		);
	}

	if (typeof data === "string") {
		return <p>{data}</p>;
	}

	const TagComponent = tagCatalog[name];
	if (TagComponent) {
		return <TagComponent data={data} />;
	}

	if (["TEI", "text", "body"].includes(name)) {
		return (
			<>
				{Object.entries(data).map(([key, value]) => (
					<DocumentTag
						key={key}
						name={key}
						data={value as Record<string, unknown>}
					/>
				))}
			</>
		);
	}

	console.warn(`Unsupported tag encountered:`, {
		name,
		data,
	});

	if (!debug) {
		return null;
	}

	if (typeof data === "object" && data !== null) {
		return (
			<div>
				{Object.entries(data as Record<string, unknown>).map(([key, value]) => (
					<DocumentTag
						key={key}
						name={key}
						data={value as Record<string, unknown>}
					/>
				))}
			</div>
		);
	}
	return (
		<div>
			<strong>{name}:</strong> {JSON.stringify(data)}
		</div>
	);
};
