type TeiHeaderProps = {
	data: {
		fileDesc: {
			titleStmt: {
				title: {
					"#text": string;
				};
			};
		};
	};
};

export const TeiHeader = ({ data }: TeiHeaderProps) => {
	return <h1>{data.fileDesc.titleStmt.title["#text"]}</h1>;
};
