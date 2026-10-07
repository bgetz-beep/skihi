export const organization = {
  name: "Ski-Hi Stampede",
  legalName: "San Luis Valley Ski-Hi Stampede",
  tagline: "Colorado's Oldest Pro Rodeo",
  foundingYear: 1919,
  prcaNominations: 4,
  volunteerCount: 200,
  annualAttendance: 10000,

  venue: {
    name: "Ski-Hi Complex",
    streetAddress: "2335 Sherman Ave",
    city: "Monte Vista",
    region: "CO",
    postalCode: "81144",
    country: "US",
    latitude: 37.5786,
    longitude: -106.1483,
  },

  ticketOffice: {
    streetAddress: "947 1st Ave",
    city: "Monte Vista",
    region: "CO",
    postalCode: "81144",
    hours: "9:00 AM to 5:00 PM, Monday through Friday",
    opensDate: "2026-06-22",
  },

  mailingAddress: {
    poBox: "PO Box 391",
    city: "Monte Vista",
    region: "CO",
    postalCode: "81144",
  },

  contact: {
    phone: "+1-719-852-2055",
    phoneDisplay: "(719) 852-2055",
    email: "info@skihistampede.com",
  },

  social: {
    facebook: "https://www.facebook.com/skihistampedeinc/",
    instagram: "https://www.instagram.com/skihistampede_rodeo100/",
  },

  nextEvent: {
    startDate: "2027-07-08",
    endDate: "2027-07-11",
    displayDate: "July 8 to 11, 2027",
  },
} as const;

export type Organization = typeof organization;
