/**
 * User Settings Types
 * Defines the shape of user preferences stored in localStorage
 */

export type AccordionMode = "multiple" | "single";

export interface UserSettings {
  /** Controls how ship cards expand - multiple at once or one at a time */
  accordionMode: AccordionMode;
  /** Enable cascade animation effect on fleet collapse/expand */
  cascadeAnimation: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  accordionMode: "multiple",
  cascadeAnimation: true,
};
