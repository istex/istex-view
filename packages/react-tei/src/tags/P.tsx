export const P = ({
	data,
}: {
	data: {
		"@_xml:id": string;
		"#text": string;
	};
}) => {
	return <p id={data["@_xml:id"]}>{data["#text"]}</p>;
};
