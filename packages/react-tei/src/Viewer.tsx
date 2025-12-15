export function Viewer({ document }: ViewerProps) {
	return <pre>{document}</pre>;
}

export type ViewerProps = {
	document: string;
};
