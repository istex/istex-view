import type { ComponentType } from "react";
import type { ComponentProps } from "./type";

export type TagCatalog = Record<string, ComponentType<ComponentProps>>;
