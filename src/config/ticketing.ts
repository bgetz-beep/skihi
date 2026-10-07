export type TicketingMode = "placeholder" | "embed" | "link";

export interface TicketingConfig {
  mode: TicketingMode;
  buyTicketsUrl: string;
  embedScriptSrc: string;
  embedContainerId: string;
  embedAttributes: Readonly<Record<string, string>>;
  perEventUrls: Readonly<Record<string, string>>;
}

export const ticketing: TicketingConfig = {
  mode: "placeholder",
  buyTicketsUrl: "",
  embedScriptSrc: "",
  embedContainerId: "",
  embedAttributes: {},
  perEventUrls: {
    "rodeo-thursday": "",
    "rodeo-friday": "",
    "rodeo-saturday": "",
    "rodeo-sunday": "",
    "parade": "",
    "mutton-busting": "",
  },
};
