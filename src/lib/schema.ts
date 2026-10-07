import { organization } from "@config/organization";
import { site } from "@config/site";

export interface JsonLd {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

export function buildOrganizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": organization.name,
    "legalName": organization.legalName,
    "foundingDate": `${organization.foundingYear}-01-01`,
    "url": site.baseUrl,
    "sameAs": [organization.social.facebook, organization.social.instagram],
    "telephone": organization.contact.phone,
    "email": organization.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": organization.mailingAddress.poBox,
      "addressLocality": organization.mailingAddress.city,
      "addressRegion": organization.mailingAddress.region,
      "postalCode": organization.mailingAddress.postalCode,
      "addressCountry": "US",
    },
  };
}

export function buildEventSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${organization.name} ${new Date(organization.nextEvent.startDate).getFullYear()}`,
    "description": `${organization.tagline}. ${organization.nextEvent.displayDate}, ${organization.venue.city}, ${organization.venue.region}.`,
    "startDate": organization.nextEvent.startDate,
    "endDate": organization.nextEvent.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": organization.venue.name,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": organization.venue.streetAddress,
        "addressLocality": organization.venue.city,
        "addressRegion": organization.venue.region,
        "postalCode": organization.venue.postalCode,
        "addressCountry": organization.venue.country,
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": organization.venue.latitude,
        "longitude": organization.venue.longitude,
      },
    },
    "organizer": {
      "@type": "Organization",
      "name": organization.legalName,
      "url": site.baseUrl,
    },
  };
}

export function buildBreadcrumbSchema(
  items: ReadonlyArray<{ name: string; url: string }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

export function buildFaqSchema(
  items: ReadonlyArray<{ question: string; answer: string }>
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };
}

export function buildWebPageSchema(opts: {
  name: string;
  description: string;
  url: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": opts.name,
    "description": opts.description,
    "url": opts.url,
    "isPartOf": {
      "@type": "WebSite",
      "name": organization.name,
      "url": site.baseUrl,
    },
  };
}
