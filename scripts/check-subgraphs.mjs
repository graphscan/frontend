import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import {
  buildClientSchema,
  getIntrospectionQuery,
  parse,
  validate,
} from "graphql";

// Validate the application's actual templates, including imported fragments,
// against each configured deployment, then execute small read-only samples.
try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const endpoints = {
  MAIN: process.env.NEXT_PUBLIC_SUBGRAPH_MAIN_URL,
  ANALYTICS: process.env.NEXT_PUBLIC_SUBGRAPH_ANALYTICS_URL,
  ENS: process.env.NEXT_PUBLIC_ENS_URL,
};
const headers = {
  "Content-Type": "application/json",
  ...(process.env.NEXT_PUBLIC_GRAPH_API_KEY
    ? { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}` }
    : {}),
  ...(process.env.GRAPH_API_ORIGIN
    ? { Origin: process.env.GRAPH_API_ORIGIN }
    : {}),
};
async function request(backend, query) {
  if (!endpoints[backend]) throw Error(`Missing ${backend} endpoint`);
  const response = await fetch(endpoints[backend], {
    method: "POST",
    headers,
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw Error(`HTTP ${response.status}`);
  const result = await response.json();
  if (result.errors?.length)
    throw Error(result.errors.map((error) => error.message).join("; "));
  if (!result.data) throw Error("Missing GraphQL data");
  return result.data;
}

const schemas = {};
const metadata = {};
for (const backend of Object.keys(endpoints)) {
  const meta = (
    await request(
      backend,
      "{ _meta { deployment hasIndexingErrors block { number timestamp } } }",
    )
  )._meta;
  if (meta.hasIndexingErrors) throw Error(`${backend} has indexing errors`);
  console.log(
    `${backend}: ${meta.deployment}, block ${meta.block.number}, ${new Date(meta.block.timestamp * 1000).toISOString()}`,
  );
  metadata[backend] = meta;
  schemas[backend] = buildClientSchema(
    await request(backend, getIntrospectionQuery()),
  );
}
const sample = await request(
  "MAIN",
  `{
  _meta { block { number } }
  graphNetwork(id: "1") { gns currentEpoch }
  indexers(first: 1, orderBy: delegatedTokens, orderDirection: desc, where: { allocatedTokens_gt: "0" }) { id }
  delegators(first: 1, orderBy: totalStakedTokens, orderDirection: desc, where: { activeStakesCount_gt: 0 }) { id }
  curators(first: 1, orderBy: totalSignalledTokens, orderDirection: desc) { id }
  subgraphs(first: 1, where: { active: true, currentVersion_not: null }) { id currentVersion { id subgraphDeployment { id } } }
}`,
);
for (const key of ["indexers", "delegators", "curators", "subgraphs"]) {
  if (!sample[key]?.length) throw Error(`No live ${key} sample`);
}
const version = sample.subgraphs[0].currentVersion;
const entries = [];
const named = new Map();
for (const file of fs
  .readdirSync("src", { recursive: true })
  .filter((file) => file.endsWith(".service.ts"))) {
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(`src/${file}`, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  function walk(node) {
    if (
      ts.isTaggedTemplateExpression(node) &&
      node.tag.getText(source) === "gql"
    ) {
      const entry = {
        file,
        source,
        node,
        line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      };
      entries.push(entry);
      if (ts.isVariableDeclaration(node.parent))
        named.set(node.parent.name.getText(source), entry);
    }
    ts.forEachChild(node, walk);
  }
  walk(source);
}
function context(file) {
  const id =
    file.includes("subgraph") && !file.includes("subgraph-owner")
      ? version.id
      : file.includes("delegator-details") ||
          file.includes("delegator-delegations") ||
          file.includes("profile-cards")
        ? sample.delegators[0].id
        : file.includes("curator")
          ? sample.curators[0].id
          : sample.indexers[0].id;
  return {
    JSON,
    id,
    REQUEST_LIMIT: 2,
    skip: 0,
    perPage: 2,
    currentPage: 1,
    indexerId: sample.indexers[0].id,
    indexer: { id: sample.indexers[0].id },
    blockNumber:
      file === "services/historic-apy.service.ts"
        ? metadata.ANALYTICS.block.number
        : sample._meta.block.number,
    ...Object.fromEntries(
      [0, 30, 60, 180, 360].map((days) => [
        days === 0 ? "endTimestamp" : `start${days}`,
        Math.floor(metadata.ANALYTICS.block.timestamp / 86400) * 86400 -
          days * 86400,
      ]),
    ),
    subgraphId: sample.subgraphs[0].id,
    deploymentId: version.subgraphDeployment.id,
    versionId: version.id,
    currentEpoch: Number(sample.graphNetwork.currentEpoch),
    gns: sample.graphNetwork.gns,
    entity: "NameSignal",
    idFilters: null,
    sortParams: { orderBy: "id", orderDirection: "desc" },
    orderBy: "id",
    orderDirection: "desc",
    searchTerm: sample.indexers[0].id.slice(2, 10),
    lowercaseIds: [sample.curators[0].id],
    indexers: [sample.indexers[0].id],
    first: 2,
    period: [
      Math.floor(Date.now() / 1000) - 28 * 86400,
      Math.floor(Date.now() / 1000),
    ],
  };
}
function render(entry, values) {
  const template = entry.node.template;
  if (ts.isNoSubstitutionTemplateLiteral(template)) return template.text;
  return (
    template.head.text +
    template.templateSpans
      .map((span) => {
        const expression = span.expression.getText(entry.source);
        let value;
        if (named.has(expression))
          value = render(named.get(expression), values);
        else if (
          ts.isCallExpression(span.expression) &&
          span.expression.expression.getText(entry.source) ===
            "createBaseSignalFragment"
        ) {
          const fragment = entries.find(
            (item) =>
              item.file === entry.file &&
              item.node.template
                .getText(item.source)
                .includes("fragment SignalFragment on"),
          );
          value = render(fragment, {
            ...values,
            entity: span.expression.arguments[0].text,
          });
        } else {
          // Only evaluate checked-in template expressions with explicit sample inputs.
          value = vm.runInNewContext(expression, values, { timeout: 1000 });
        }
        return value + span.literal.text;
      })
      .join("")
  );
}
let passed = 0;
let failures = 0;
for (const entry of entries) {
  const label = `src/${entry.file}:${entry.line}`;
  try {
    const query = render(entry, context(entry.file));
    const document = parse(query);
    if (
      !document.definitions.some(
        (definition) => definition.kind === "OperationDefinition",
      )
    )
      continue;
    let call = entry.node.parent;
    while (call && !ts.isCallExpression(call)) call = call.parent;
    const requestName = call?.expression.getText(entry.source);
    const backend = {
      request: "MAIN",
      requestAnalytics: "ANALYTICS",
      requestEns: "ENS",
    }[requestName];
    if (!backend) throw Error(`Unknown request function ${requestName}`);
    const errors = validate(schemas[backend], document);
    if (errors.length)
      throw Error(errors.map((error) => error.message).join("; "));
    const data = await request(backend, query);
    // Detail samples must resolve to a real entity, not a superficially successful null.
    for (const field of [
      "indexer",
      "delegator",
      "curator",
      "subgraphVersion",
      "graphAccount",
    ]) {
      if (Object.hasOwn(data, field) && !data[field])
        throw Error(`Sample ${field} was null`);
    }
    passed++;
    console.log(`PASS ${backend} ${label}`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${label}: ${error.message}`);
  }
}
console.log(`${passed} queries passed; ${failures} failed.`);
process.exitCode = failures ? 1 : 0;
