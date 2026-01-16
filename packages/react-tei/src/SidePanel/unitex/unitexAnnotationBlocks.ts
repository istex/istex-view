export const UNITEX_ANNOTATION_BLOCKS = [
	"date",
	"orgName",
	"orgNameFunder",
	"orgNameProvider",
	"refBibl",
	"refUrl",
	"persName",
	"placeName",
	"geogName",
] as const;

export type UnitexAnnotationBlockType =
	(typeof UNITEX_ANNOTATION_BLOCKS)[number];

export const chipColors: Record<UnitexAnnotationBlockType, string> = {
	date: "#8FBAC9",
	orgName: "#6BEAB2",
	orgNameFunder: "#34CE3B",
	orgNameProvider: "#C4D733",
	refBibl: "#FEACC1",
	refUrl: "#D57AC5",
	persName: "#F6C53E",
	placeName: "#D3926F",
	geogName: "#46D2EE",
};
