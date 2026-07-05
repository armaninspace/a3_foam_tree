import type { FoamTreeGraph } from "../foamtree/types";

const columns = ["Q1 adoption", "Q2 adoption", "Q3 adoption", "Q4 adoption"];

export const metricColumns = columns;

export const graphFixture: FoamTreeGraph = {
  roots: ["market", "product", "platform", "customers", "operations"],
  nodes: [
    node("market", "Market", 34, [0.31, 0.44, 0.52, 0.61]),
    node("market-segments", "Segments", 13, [0.55, 0.6, 0.67, 0.73]),
    node("market-enterprise", "Enterprise", 5, [0.68, 0.71, 0.75, 0.8]),
    node("market-midmarket", "Mid-market", 4, [0.42, 0.51, 0.56, 0.64]),
    node("market-public", "Public sector", 2, [0.18, 0.22, 0.29, 0.34]),
    node("market-competition", "Competition", 6, [0.72, 0.66, 0.61, 0.58]),
    node("market-pricing", "Pricing pressure", 4, [0.81, 0.74, 0.68, 0.63]),

    node("product", "Product", 31, [0.49, 0.57, 0.65, 0.72]),
    node("product-workflows", "Workflows", 10, [0.62, 0.66, 0.74, 0.79]),
    node("product-onboarding", "Onboarding", 3, [0.48, 0.55, 0.68, 0.76]),
    node("product-approvals", "Approvals", 3, [0.52, 0.58, 0.61, 0.7]),
    node("product-reporting", "Reporting", 2, [0.36, 0.46, 0.55, 0.62]),
    node("product-experience", "Experience", 9, [0.58, 0.67, 0.71, 0.77]),
    node("product-mobile", "Mobile", 2, [0.24, 0.34, 0.5, 0.58]),
    node("product-integrations", "Integrations", 7, [0.5, 0.56, 0.6, 0.69]),
    node("product-roadmap", "Roadmap", 5, [0.43, 0.52, 0.66, 0.78]),

    node("platform", "Platform", 29, [0.37, 0.45, 0.54, 0.62]),
    node("platform-api", "API", 9, [0.44, 0.53, 0.59, 0.65]),
    node("platform-webhooks", "Webhooks", 2, [0.32, 0.4, 0.48, 0.57]),
    node("platform-sdk", "SDKs", 2, [0.46, 0.55, 0.64, 0.71]),
    node("platform-data", "Data plane", 8, [0.34, 0.43, 0.52, 0.61]),
    node("platform-reliability", "Reliability", 6, [0.76, 0.72, 0.68, 0.6]),
    node("platform-observability", "Observability", 4, [0.4, 0.47, 0.55, 0.63]),
    node("platform-cost", "Cost control", 2, [0.7, 0.67, 0.59, 0.51]),

    node("customers", "Customers", 25, [0.57, 0.61, 0.66, 0.7]),
    node("customers-health", "Health", 9, [0.62, 0.65, 0.69, 0.73]),
    node("customers-risk", "Risk", 3, [0.8, 0.72, 0.65, 0.58]),
    node("customers-expansion", "Expansion", 2, [0.34, 0.45, 0.57, 0.68]),
    node("customers-feedback", "Feedback", 7, [0.49, 0.54, 0.6, 0.66]),
    node("customers-support", "Support load", 5, [0.74, 0.7, 0.64, 0.56]),

    node("operations", "Operations", 15, [0.33, 0.38, 0.43, 0.47]),
    node("ops-finance", "Finance", 4, [0.27, 0.34, 0.39, 0.45]),
    node("ops-people", "People", 4, [0.42, 0.46, 0.5, 0.56]),
    node("ops-legal", "Legal", 3, [0.63, 0.59, 0.54, 0.48]),
    node("ops-procurement", "Procurement", 2, [0.3, 0.37, 0.43, 0.5])
  ],
  edges: [
    edge("market", "market-segments"),
    edge("market-segments", "market-enterprise"),
    edge("market-segments", "market-midmarket"),
    edge("market-segments", "market-public"),
    edge("market", "market-competition"),
    edge("market", "market-pricing"),
    edge("product", "product-workflows"),
    edge("product-workflows", "product-onboarding"),
    edge("product-workflows", "product-approvals"),
    edge("product-workflows", "product-reporting"),
    edge("product", "product-experience"),
    edge("product-experience", "product-mobile"),
    edge("product", "product-integrations"),
    edge("product", "product-roadmap"),
    edge("platform", "platform-api"),
    edge("platform-api", "platform-webhooks"),
    edge("platform-api", "platform-sdk"),
    edge("platform", "platform-data"),
    edge("platform", "platform-reliability"),
    edge("platform", "platform-observability"),
    edge("platform", "platform-cost"),
    edge("customers", "customers-health"),
    edge("customers-health", "customers-risk"),
    edge("customers-health", "customers-expansion"),
    edge("customers", "customers-feedback"),
    edge("customers", "customers-support"),
    edge("operations", "ops-finance"),
    edge("operations", "ops-people"),
    edge("operations", "ops-legal"),
    edge("operations", "ops-procurement")
  ]
};

function node(id: string, label: string, weight: number, values: number[]) {
  return {
    id,
    label,
    weight,
    url: `#/clusters/${id}`,
    metrics: Object.fromEntries(columns.map((column, index) => [column, values[index]]))
  };
}

function edge(from: string, to: string) {
  return { from, to };
}
