import { useCallback, useMemo } from "react";
import { kebabCasify } from "../../helper/kebabCasify";
import {
	DIRECTION_NEXT,
	DIRECTION_PREVIOUS,
} from "../../navigation/DocumentNavigationContext";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";

export function useUnitexAnnotationNavigation(term: string) {
	const { navigateToBodyTargetSelector } = useDocumentNavigation();

	const selector = useMemo(() => `[data-term="${kebabCasify(term)}"]`, [term]);

	const goToPrevious = useCallback(() => {
		navigateToBodyTargetSelector(selector, DIRECTION_PREVIOUS);
	}, [navigateToBodyTargetSelector, selector]);

	const goToNext = useCallback(() => {
		navigateToBodyTargetSelector(selector, DIRECTION_NEXT);
	}, [navigateToBodyTargetSelector, selector]);

	return useMemo(() => {
		return {
			goToPrevious,
			goToNext,
		};
	}, [goToPrevious, goToNext]);
}
