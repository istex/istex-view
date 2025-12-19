export type DocumentJson = {
	tag: string;
	attributes?: Record<string, string>;
	props?: Record<string, unknown>;
	value?: DocumentJson[] | string;
};
