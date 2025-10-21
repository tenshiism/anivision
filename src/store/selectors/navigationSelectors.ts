import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

/**
 * Navigation Selectors
 * Memoized selectors for navigation state
 */

// Base selectors
const selectNavigationState = (state: RootState) => state.navigation;

/**
 * Select navigation stack
 */
export const selectNavigationStack = createSelector(
  [selectNavigationState],
  (navigation) => navigation.stack
);

/**
 * Select current route
 */
export const selectCurrentRoute = createSelector(
  [selectNavigationState],
  (navigation) => navigation.currentRoute
);

/**
 * Select current screen name
 */
export const selectCurrentScreenName = createSelector(
  [selectCurrentRoute],
  (currentRoute) => currentRoute?.name || null
);

/**
 * Select current route parameters
 */
export const selectNavigationParams = createSelector(
  [selectNavigationState],
  (navigation) => navigation.params
);

/**
 * Select specific parameter by key
 */
export const selectParamByKey = (key: string) =>
  createSelector([selectNavigationParams], (params) => params[key] || null);

/**
 * Select if can go back
 */
export const selectCanGoBack = createSelector(
  [selectNavigationState],
  (navigation) => navigation.canGoBack
);

/**
 * Select navigation history
 */
export const selectNavigationHistory = createSelector(
  [selectNavigationState],
  (navigation) => navigation.history
);

/**
 * Select stack depth
 */
export const selectStackDepth = createSelector(
  [selectNavigationStack],
  (stack) => stack.length
);

/**
 * Select previous route
 */
export const selectPreviousRoute = createSelector(
  [selectNavigationStack],
  (stack) => {
    if (stack.length < 2) return null;
    return stack[stack.length - 2];
  }
);

/**
 * Select previous screen name
 */
export const selectPreviousScreenName = createSelector(
  [selectPreviousRoute],
  (previousRoute) => previousRoute?.name || null
);

/**
 * Select root route (first in stack)
 */
export const selectRootRoute = createSelector(
  [selectNavigationStack],
  (stack) => {
    if (stack.length === 0) return null;
    return stack[0];
  }
);

/**
 * Select if currently on specific screen
 */
export const selectIsOnScreen = (screenName: string) =>
  createSelector(
    [selectCurrentScreenName],
    (currentScreenName) => currentScreenName === screenName
  );

/**
 * Select if screen is in stack
 */
export const selectIsScreenInStack = (screenName: string) =>
  createSelector([selectNavigationStack], (stack) =>
    stack.some((route) => route.name === screenName)
  );

/**
 * Select route by screen name
 */
export const selectRouteByScreenName = (screenName: string) =>
  createSelector([selectNavigationStack], (stack) =>
    stack.find((route) => route.name === screenName)
  );

/**
 * Select recent history (last 10 entries)
 */
export const selectRecentHistory = createSelector(
  [selectNavigationHistory],
  (history) => history.slice(-10)
);

/**
 * Select most visited screens
 */
export const selectMostVisitedScreens = createSelector(
  [selectNavigationHistory],
  (history) => {
    const screenCounts: Record<string, number> = {};

    history.forEach((route) => {
      screenCounts[route.name] = (screenCounts[route.name] || 0) + 1;
    });

    return Object.entries(screenCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }
);

/**
 * Select navigation breadcrumbs (stack as breadcrumb trail)
 */
export const selectBreadcrumbs = createSelector(
  [selectNavigationStack],
  (stack) =>
    stack.map((route, index) => ({
      name: route.name,
      params: route.params,
      isLast: index === stack.length - 1,
      index,
    }))
);

/**
 * Select if navigation stack is at root
 */
export const selectIsAtRoot = createSelector(
  [selectStackDepth],
  (depth) => depth <= 1
);

/**
 * Select current route timestamp
 */
export const selectCurrentRouteTimestamp = createSelector(
  [selectCurrentRoute],
  (currentRoute) => currentRoute?.timestamp || null
);

/**
 * Select time on current screen (in milliseconds)
 */
export const selectTimeOnCurrentScreen = createSelector(
  [selectCurrentRouteTimestamp],
  (timestamp) => {
    if (!timestamp) return 0;
    return Date.now() - timestamp;
  }
);
