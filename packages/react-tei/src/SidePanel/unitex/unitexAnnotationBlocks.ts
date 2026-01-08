export const UNITEX_ANNOTATION_BLOCKS = [
	"date",
	"orgName",
	"persName",
	"placeName",
	"geogName",
] as const;

export type UnitexAnnotationBlockType =
	(typeof UNITEX_ANNOTATION_BLOCKS)[number];

export const chipColors: Record<UnitexAnnotationBlockType, string> = {
	date: "#31768F",
	orgName: "#2C6010",
	persName: "#8F317E",
	placeName: "#967714",
	geogName: "#8F3931",
};
