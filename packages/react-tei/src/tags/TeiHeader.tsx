import { Box, Typography } from "@mui/material";

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
	return (
		<Box sx={{ margin: 8 }}>
			<Typography variant="h1">
				{data.fileDesc.titleStmt.title["#text"]}
			</Typography>
		</Box>
	);
};
