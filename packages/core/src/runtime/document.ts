import type { ClientBuildAssets, DocumentConfig, RouteHead } from "./types.js";

/** Input required to assemble the final HTML document string. */
export interface RenderDocumentInput {
  appDocument?: DocumentConfig | undefined;
  body: string;
  head?: RouteHead | undefined;
  islandsRendered: boolean;
  assets?: ClientBuildAssets | undefined;
}

/**
 * Renders the full HTML document around a route body.
 *
 * Route head data overrides app-level defaults where both are present.
 */
export function renderDocument(input: RenderDocumentInput): string {
  const document = input.appDocument;
  const head = input.head;
  const title = applyTitleTemplate(head?.title ?? document?.title, document?.titleTemplate);
  const lang = head?.lang ?? document?.lang ?? "en";
  const htmlAttrs = renderAttributes({
    lang,
    ...document?.htmlAttrs,
    ...head?.htmlAttrs,
  });
  const bodyAttrs = renderAttributes({
    ...document?.bodyAttrs,
    ...head?.bodyAttrs,
  });
  const meta = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    ...renderTagCollection("meta", document?.meta),
    ...renderTagCollection("meta", head?.meta),
  ].join("");
  const links = [
    ...renderTagCollection("link", document?.links),
    ...renderTagCollection("link", head?.links),
    ...renderStyles(input.assets?.css),
  ].join("");
  const scripts = [
    ...renderScripts(document?.scripts),
    ...renderScripts(head?.scripts),
    ...renderClientEntry(input.assets?.entry, input.islandsRendered),
  ].join("");

  return [
    "<!DOCTYPE html>",
    `<html${htmlAttrs}>`,
    "<head>",
    meta,
    title ? `<title>${escapeHtml(title)}</title>` : "",
    document?.head ?? "",
    links,
    scripts,
    "</head>",
    `<body${bodyAttrs}>`,
    document?.bodyOpen ?? "",
    input.body,
    document?.bodyClose ?? "",
    "</body>",
    "</html>",
  ].join("");
}

function applyTitleTemplate(
  title: string | undefined,
  template: DocumentConfig["titleTemplate"],
): string | undefined {
  if (!template) {
    return title;
  }

  if (typeof template === "function") {
    return template(title);
  }

  return template.replace("%s", title ?? "");
}

function renderTagCollection(
  tagName: "meta" | "link",
  entries?: Array<Record<string, string>>,
): string[] {
  if (!entries?.length) {
    return [];
  }

  return entries.map((entry) => `<${tagName}${renderAttributes(entry)}>`);
}

function renderScripts(entries?: Array<Record<string, string> & { children?: string }>): string[] {
  if (!entries?.length) {
    return [];
  }

  return entries.map(({ children, ...attributes }) => {
    return `<script${renderAttributes(attributes)}>${
      children ? escapeScript(children) : ""
    }</script>`;
  });
}

function renderStyles(entries?: readonly string[]): string[] {
  if (!entries?.length) {
    return [];
  }

  return entries.map((href) => `<link rel="stylesheet" href="${escapeAttribute(href)}">`);
}

function renderClientEntry(entry: string | undefined, islandsRendered: boolean): string[] {
  if (!entry || !islandsRendered) {
    return [];
  }

  return [`<script type="module" src="${escapeAttribute(entry)}"></script>`];
}

function renderAttributes(attributes: Record<string, string | undefined>): string {
  const rendered = Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => ` ${key}="${escapeAttribute(value ?? "")}"`);

  return rendered.join("");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function escapeScript(value: string): string {
  return value
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}
