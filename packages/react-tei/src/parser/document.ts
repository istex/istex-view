export type DocumentJson = {
	tag: string;
	attributes?: Record<string, string>;
	value?: DocumentJsonValue;
};

export type DocumentJsonValue = DocumentJson | DocumentJson[] | string;
