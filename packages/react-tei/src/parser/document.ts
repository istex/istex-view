export type DocumentJson = {
	tag: string;
	attributes?: Record<string, string | undefined>;
	props?: Record<string, unknown>;
	value?: DocumentJsonValue;
};

export type DocumentJsonValue = DocumentJson[] | string | undefined;
