import { createTheme } from "@mui/material/styles";
import type {} from "@mui/material/themeCssVarsAugmentation";

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
			font: "montserrat",
			fontSize: "2.5rem",
			lineHeight: "3.75rem",
			fontWeight: "bold",
		},
		h2: {
			font: "montserrat",
			fontSize: "2.25rem",
			lineHeight: "3.375rem",
			fontWeight: "bold",
		},
		h3: {
			font: "montserrat",
			fontSize: "2rem",
			lineHeight: "3rem",
			fontWeight: "bold",
		},
		h4: {
			font: "montserrat",
			fontSize: "1.75rem",
			lineHeight: "2.625rem",
			fontWeight: "bold",
		},
		h5: {
			font: "montserrat",
			fontSize: "1.5rem",
			lineHeight: "2.25rem",
			fontWeight: "bold",
		},
		h6: {
			font: "montserrat",
			fontSize: "1.25rem",
			lineHeight: "1.875rem",
			fontWeight: "bold",
		},
		body1: {
			fontFamily: "open sans, sans-serif",
			fontSize: "1rem",
		},
		body2: {
			fontFamily: "open sans, sans-serif",
			fontSize: "1rem",
		},
	},
	components: {
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
	},
});
