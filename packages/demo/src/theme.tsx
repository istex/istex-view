import { createTheme } from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";
import IncludeIcon from "./icons/IncludeIcon";
import IndeterminateIcon from "./icons/IndeterminateIcon";

const colors = {
	veryDarkGreen: "#667F00",
	darkGreen: "#a9bb1e",
	lightGreen: "#c4d733",
	veryLightGreen: "#E3EF63",
	blue: "#458ca5",
	variantBlue: "#5BC0DE",
	lightBlue: "#edf3f6",
	veryLightBlue: "#f6f9fa",
	lightRed: "#ff00001a",
	grey: "#8f8f8f",
	lightGrey: "#D9D9D9",
	darkBlack: "#1d1d1d",
	lightBlack: "#4a4a4a",
	veryLightBlack: "#4a4a4a33",
	red: "#d34315",
	white: "#f0f0f0",
} as const;

// Extend the PaletteOptions definition with our custom colors
declare module "@mui/material/styles" {
	interface Palette {
		colors: typeof colors;
	}

	interface PaletteOptions {
		colors: typeof colors;
	}
}

const theme = createTheme({
	palette: {
		colors,
		primary: {
			main: colors.blue,
		},
		secondary: {
			main: colors.lightGreen,
		},
		common: {
			black: colors.darkBlack,
			white: colors.white,
		},
		text: {
			primary: colors.lightBlack,
		},
		info: {
			main: colors.blue,
		},
		error: {
			main: colors.red,
		},
	},
});

export default createTheme(theme, {
	typography: {
		h1: {
			fontFamily: "Montserrat",
			fontSize: "2.5rem",
			lineHeight: "1.25",
			fontWeight: "bold",
		},
		h2: {
			fontFamily: "Montserrat",
			fontSize: "2.25rem",
			lineHeight: "1.25",
			fontWeight: "bold",
		},
		h3: {
			fontFamily: "Montserrat",
			fontSize: "2rem",
			lineHeight: "1.25",
			fontWeight: "bold",
		},
		h4: {
			fontFamily: "Montserrat",
			fontSize: "1.75rem",
			lineHeight: "1.25",
			fontWeight: "bold",
		},
		h5: {
			fontFamily: "Montserrat",
			fontSize: "1.5rem",
			lineHeight: "1.25",
			fontWeight: "bold",
		},
		h6: {
			fontFamily: "Montserrat",
			fontSize: "1.25rem",
			lineHeight: "1.25",
			fontWeight: "bold",
		},
		subtitle1: {
			fontFamily: "Open Sans, sans-serif",
		},
		body1: {
			fontFamily: "Open Sans, sans-serif",
			fontSize: "18px",
			fontWeight: "inherit",
		},
		body2: {
			fontFamily: "Open Sans, sans-serif",
			fontSize: "16px",
		},
		button: {
			fontFamily: "Open Sans, sans-serif",
			textTransform: "none",
			fontSize: "18px",
		},
	},
	components: {
		MuiCheckbox: {
			defaultProps: {
				checkedIcon: <IncludeIcon />,
				indeterminateIcon: <IndeterminateIcon />,
			},
			styleOverrides: {},
		},
		MuiTable: {
			styleOverrides: {
				root: {
					"& caption": {
						captionSide: "top",
						fontSize: "1rem",
					},
				},
			},
		},
		MuiAccordion: {
			styleOverrides: {
				root: {
					boxShadow: "none",
					"&.Mui-expanded": {
						margin: "0",
					},
				},
			},
		},
		MuiAccordionSummary: {
			styleOverrides: {
				root: {
					minHeight: "48px",
					"&.Mui-expanded": {
						minHeight: "48px",
					},
				},
				content: {
					color: theme.palette.primary.main,
					fontWeight: "bold",
					fontSize: "1.25rem",
					"&.Mui-expanded": {
						margin: "8px 0",
					},
				},
			},
		},
		MuiList: {
			styleOverrides: {
				dense: {
					paddingTop: 0,
					paddingBottom: 0,
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					display: "list-item",
					paddingLeft: 0,
					paddingRight: 0,
				},
				dense: {
					paddingTop: 0,
					paddingBottom: 0,
					fontSize: "1rem",
				},
			},
		},
	},
});
