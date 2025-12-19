export type DocumentJson = {
	tag: string;
	attributes?: Record<string, string>;
	props?: Record<string, unknown>;
	value?: DocumentJsonValue;
};

export type DocumentJsonValue = DocumentJson[] | string | number | undefined;
