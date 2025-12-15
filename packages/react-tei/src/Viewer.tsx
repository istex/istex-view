import { XMLParser } from "fast-xml-parser";

import { useMemo } from "react";

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "@",
});

const XMLNode = ({ name, data }: { name: string; data: any }) => {
	if (Array.isArray(data)) {
		return (
			<>
				{data.map((item, index) => (
					<XMLNode
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

	switch (name) {
		case "TEI": {
			return (
				<div>
					<h2>TEI Document</h2>
					{Object.entries(data).map(([key, value]) => (
						<XMLNode
							key={key}
							name={key}
							data={value as Record<string, unknown>}
						/>
					))}
				</div>
			);
		}
		case "teiHeader": {
			console.log({ teiHeaderData: data });
			return (
				<div>
					<h1>{data.fileDesc.titleStmt.title["#text"]}</h1>
				</div>
			);
		}
		case "text": {
			return (
				<div>
					{Object.entries(data).map(([key, value]) => (
						<XMLNode
							key={key}
							name={key}
							data={value as Record<string, unknown>}
						/>
					))}
				</div>
			);
		}
		case "body": {
			return (
				<div>
					{Object.entries(data).map(([key, value]) => (
						<XMLNode
							key={key}
							name={key}
							data={value as Record<string, unknown>}
						/>
					))}
				</div>
			);
		}
		case "p": {
			return <p id={data["@_xml:id"]}>{data["#text"]}</p>;
		}
		case "div": {
			return (
				<div>
					{Object.entries(data).map(([key, value]) => (
						<XMLNode
							key={key}
							name={key}
							data={value as Record<string, unknown>}
						/>
					))}
				</div>
			);
		}
		case "head": {
			if (typeof data === "string") {
				return <h2>{data}</h2>;
			}

			return Object.entries(data).map(([key, value]) => (
				<XMLNode key={key} name={key} data={value as Record<string, unknown>} />
			));
		}
		case "back": {
			return null;
		}
		case "figure": {
			return null;
		}
		case "ref": {
			return null;
		}
		case "#text": {
			return <>{data as string}</>;
		}
		default:
			if (typeof data === "object" && data !== null) {
				return (
					<div>
						<h5>{name} (Generic Object)</h5>
						{Object.entries(data as Record<string, unknown>).map(
							([key, value]) => (
								<XMLNode
									key={key}
									name={key}
									data={value as Record<string, unknown>}
								/>
							),
						)}
					</div>
				);
			}
			return (
				<div>
					<strong>{name}:</strong> {JSON.stringify(data)}
				</div>
			);
	}
};

export const Viewer = ({ document }: { document: string }) => {
	const jsonObj = useMemo(() => parser.parse(document), [document]);
	return <XMLNode name="TEI" data={jsonObj.TEI} />;
};
