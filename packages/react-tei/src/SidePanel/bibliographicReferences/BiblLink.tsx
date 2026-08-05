import ArrowDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowUpIcon from "@mui/icons-material/ArrowDropUp";
import type { ChipProps } from "@mui/material";
import Box, { type BoxProps } from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { memo, type ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Badge from "../../components/Badge";
import { DebugTag } from "../../debug/DebugTag";
import {
	buildDataSelector,
	DIRECTION_NEXT,
	DIRECTION_PREVIOUS,
	DOCUMENT_CONTAINER_SELECTOR,
	getReactRootElement,
} from "../../navigation/DocumentNavigationContext";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type {
	EnrichedReference,
	ReferenceValidationStatus,
} from "./enrichReferences";

const noteSx: BoxProps["sx"] = {
	fontSize: "1rem",
	display: "grid",
	gridTemplateColumns: "subgrid",
	gridColumn: "1 / span 2",
	alignItems: "flex-start",
};

export const BiblLink = memo(
	({ data, children }: { data: EnrichedReference; children: ReactNode }) => {
		const { t } = useTranslation();
		const [targetedElementCount, setTargetedElementCount] = useState(0);

		const { navigateToBibliographicReferenceRef } = useDocumentNavigation();
		const { tag, attributes } = data;

		const referenceId = useMemo(() => {
			return attributes?.["@xml:id"] || null;
		}, [attributes]);

		useEffect(() => {
			if (!referenceId) {
				return;
			}

			const targets = getReactRootElement().querySelectorAll(
				`${DOCUMENT_CONTAINER_SELECTOR} ${buildDataSelector(referenceId, "bibref")}`,
			);

			setTargetedElementCount(targets.length);
		}, [referenceId]);

		if (!referenceId) {
			return (
				<DebugTag
					tag={tag}
					attributes={attributes}
					message="No xml:id attribute found for bibliographic reference"
					payload={data}
					inline
				>
					<Box sx={noteSx} role="note">
						<Box
							sx={{
								contain: "style paint inline-size",
							}}
						>
							{children}
						</Box>
						<Box></Box>
					</Box>
				</DebugTag>
			);
		}

		const id = `bibl-ref-${referenceId}`;

		return (
			<Box
				sx={noteSx}
				role="note"
				aria-labelledby={id}
				data-bibref-id={referenceId}
			>
				<Box
					id={id}
					sx={{
						contain: "style paint inline-size",
					}}
				>
					<Box
						component="span"
						sx={{
							mr: 1,
						}}
					>
						{children}
					</Box>
					{getValidationStateChip(data.validationStatus)}
				</Box>
				<Stack gap={0.5} direction="row">
					<Tooltip title={t(`termEnrichment.next`)} placement="top">
						<span>
							<IconButton
								size="small"
								disabled={targetedElementCount === 0}
								aria-label={t(`termEnrichment.next`)}
								onClick={() =>
									navigateToBibliographicReferenceRef(
										referenceId,
										DIRECTION_NEXT,
									)
								}
							>
								<ArrowDownIcon />
							</IconButton>
						</span>
					</Tooltip>
					{targetedElementCount > 1 && (
						<Tooltip title={t(`termEnrichment.previous`)} placement="top">
							<span>
								<IconButton
									size="small"
									disabled={targetedElementCount === 0}
									aria-label={t(`termEnrichment.previous`)}
									onClick={() =>
										navigateToBibliographicReferenceRef(
											referenceId,
											DIRECTION_PREVIOUS,
										)
									}
								>
									<ArrowUpIcon />
								</IconButton>
							</span>
						</Tooltip>
					)}
				</Stack>
			</Box>
		);
	},
);

function getValidationStateChip(validationStatus?: ReferenceValidationStatus) {
	const { t } = useTranslation();

	// We don't display a chip when the reference is found
	if (validationStatus == null || validationStatus === "found") {
		return null;
	}

	let color: ChipProps["color"];
	switch (validationStatus) {
		case "not_found":
			color = "info";
			break;
		case "to_be_verified":
			color = "warning";
			break;
		case "retracted":
			color = "error";
			break;
	}

	return (
		<Tooltip
			title={t(
				`sidePanel.bibliographicReferences.validationStatus.${validationStatus}.tooltip`,
			)}
		>
			<Badge
				severity={color}
				label={t(
					`sidePanel.bibliographicReferences.validationStatus.${validationStatus}.label`,
				)}
				sx={{
					fontSize: "0.7rem",
					height: "20px",
				}}
			/>
		</Tooltip>
	);
}
