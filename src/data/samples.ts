import type { FoamTreeDatum } from "../foamtree/types";

export const sampleData: FoamTreeDatum[] = [
  {
    id: "market",
    label: "Market",
    weight: 34,
    children: [
      {
        id: "market-segments",
        label: "Segments",
        weight: 13,
        children: [
          { id: "market-enterprise", label: "Enterprise", weight: 5 },
          { id: "market-midmarket", label: "Mid-market", weight: 4 },
          { id: "market-startups", label: "Startups", weight: 2 },
          { id: "market-public", label: "Public sector", weight: 2 }
        ]
      },
      {
        id: "market-regions",
        label: "Regions",
        weight: 11,
        children: [
          { id: "market-na", label: "North America", weight: 4 },
          { id: "market-emea", label: "EMEA", weight: 3 },
          { id: "market-apac", label: "APAC", weight: 3 },
          { id: "market-latam", label: "LATAM", weight: 1 }
        ]
      },
      { id: "market-competition", label: "Competition", weight: 6 },
      { id: "market-pricing", label: "Pricing pressure", weight: 4 }
    ]
  },
  {
    id: "product",
    label: "Product",
    weight: 31,
    children: [
      {
        id: "product-workflows",
        label: "Workflows",
        weight: 10,
        children: [
          { id: "product-onboarding", label: "Onboarding", weight: 3 },
          { id: "product-approvals", label: "Approvals", weight: 3 },
          { id: "product-reporting", label: "Reporting", weight: 2 },
          { id: "product-collab", label: "Collaboration", weight: 2 }
        ]
      },
      {
        id: "product-experience",
        label: "Experience",
        weight: 9,
        children: [
          { id: "product-navigation", label: "Navigation", weight: 3 },
          { id: "product-accessibility", label: "Accessibility", weight: 2 },
          { id: "product-mobile", label: "Mobile", weight: 2 },
          { id: "product-performance", label: "Perceived speed", weight: 2 }
        ]
      },
      { id: "product-integrations", label: "Integrations", weight: 7 },
      { id: "product-roadmap", label: "Roadmap", weight: 5 }
    ]
  },
  {
    id: "platform",
    label: "Platform",
    weight: 29,
    children: [
      {
        id: "platform-api",
        label: "API",
        weight: 9,
        children: [
          { id: "platform-rest", label: "REST", weight: 3 },
          { id: "platform-webhooks", label: "Webhooks", weight: 2 },
          { id: "platform-sdk", label: "SDKs", weight: 2 },
          { id: "platform-versioning", label: "Versioning", weight: 2 }
        ]
      },
      {
        id: "platform-data",
        label: "Data plane",
        weight: 8,
        children: [
          { id: "platform-ingest", label: "Ingestion", weight: 3 },
          { id: "platform-storage", label: "Storage", weight: 2 },
          { id: "platform-search", label: "Search", weight: 2 },
          { id: "platform-lineage", label: "Lineage", weight: 1 }
        ]
      },
      { id: "platform-reliability", label: "Reliability", weight: 6 },
      { id: "platform-observability", label: "Observability", weight: 4 },
      { id: "platform-cost", label: "Cost control", weight: 2 }
    ]
  },
  {
    id: "customers",
    label: "Customers",
    weight: 25,
    children: [
      {
        id: "customers-health",
        label: "Health",
        weight: 9,
        children: [
          { id: "customers-adoption", label: "Adoption", weight: 3 },
          { id: "customers-risk", label: "Risk", weight: 3 },
          { id: "customers-expansion", label: "Expansion", weight: 2 },
          { id: "customers-renewal", label: "Renewal", weight: 1 }
        ]
      },
      { id: "customers-feedback", label: "Feedback", weight: 7 },
      { id: "customers-support", label: "Support load", weight: 5 },
      { id: "customers-training", label: "Training", weight: 4 }
    ]
  },
  {
    id: "go-to-market",
    label: "Go-to-market",
    weight: 22,
    children: [
      { id: "gtm-pipeline", label: "Pipeline", weight: 7 },
      { id: "gtm-conversion", label: "Conversion", weight: 5 },
      { id: "gtm-campaigns", label: "Campaigns", weight: 4 },
      { id: "gtm-partners", label: "Partners", weight: 3 },
      { id: "gtm-enablement", label: "Enablement", weight: 3 }
    ]
  },
  {
    id: "security",
    label: "Security",
    weight: 17,
    children: [
      { id: "security-identity", label: "Identity", weight: 5 },
      { id: "security-compliance", label: "Compliance", weight: 4 },
      { id: "security-audit", label: "Audit trail", weight: 3 },
      { id: "security-privacy", label: "Privacy", weight: 3 },
      { id: "security-response", label: "Response", weight: 2 }
    ]
  },
  {
    id: "operations",
    label: "Operations",
    weight: 15,
    children: [
      { id: "ops-finance", label: "Finance", weight: 4 },
      { id: "ops-people", label: "People", weight: 4 },
      { id: "ops-legal", label: "Legal", weight: 3 },
      { id: "ops-procurement", label: "Procurement", weight: 2 },
      { id: "ops-facilities", label: "Facilities", weight: 2 }
    ]
  },
  { id: "research", label: "Research", weight: 11 },
  { id: "brand", label: "Brand", weight: 8 },
  { id: "ecosystem", label: "Ecosystem", weight: 6 }
];
