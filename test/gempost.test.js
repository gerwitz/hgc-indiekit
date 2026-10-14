import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { Indiekit } from "@indiekit/indiekit";
import { getInstalledPlugins } from "@indiekit/indiekit/lib/plugins.js";
import { getPostTypes } from "@indiekit/indiekit/lib/post-types.js";
import { postData } from "@indiekit/endpoint-micropub/lib/post-data.js";
import { getPostType } from "@indiekit/endpoint-micropub/lib/post-type-discovery.js";
import { getPostTemplateProperties } from "@indiekit/endpoint-micropub/lib/utils.js";
import nunjucks from "nunjucks";
import YAML from "yaml";

import config from "../indiekit.config.js";

const indiekit = new Indiekit({
  ...config,
  plugins: [
    "@indiekit/post-type-article",
    "@indiekit/post-type-note",
    "@indiekit/preset-eleventy",
    config.plugins.at(-1),
  ],
});
await getInstalledPlugins(indiekit);

const publication = {
  ...config.publication,
  postTypes: getPostTypes(indiekit),
  syndicationTargets: [],
};
const application = {
  locale: "en-US",
  timeZone: "Europe/Amsterdam",
};
const properties = {
  type: "entry",
  name: "A capsule post",
  content: "A **Markdown** body.",
  published: "2026-10-03T12:00:00+02:00",
  "mp-gempost": "true",
};

const getFrontMatter = (markdown) => YAML.parse(markdown.split("---\n")[1]);
const getBody = (markdown) => markdown.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/)[1];

test("gempost registers required fields and preserves ordinary post discovery", () =>
{
  const postType = publication.postTypes.gempost;
  assert.equal(postType.name, "Gempost");
  assert.equal(postType.h, "entry");
  assert.ok(postType["required-properties"].includes("name"));
  assert.ok(postType["required-properties"].includes("content"));
  assert.equal(getPostType(publication.postTypes, properties), "gempost");
  assert.equal(getPostType(publication.postTypes, { name: "Writing", content: "Body" }), "article");
  assert.equal(getPostType(publication.postTypes, { content: "Note" }), "note");
});

test("gempost form supplies its discovery marker for creation and editing", async () =>
{
  const template = await readFile(new URL(
    "../plugins/gempost/includes/post-types/mp-gempost-field.njk",
    import.meta.url,
  ), "utf8");
  const environment = new nunjucks.Environment();
  environment.addGlobal("input", (options) =>
  {
    assert.deepEqual(options, { name: "mp-gempost", type: "hidden", value: "true" });
    return "gempost marker";
  });
  assert.match(environment.renderString(template), /gempost marker/);
});

test("gempost creates dated Markdown with a canonical Gemini URL", async () =>
{
  const data = await postData.create(application, publication, { ...properties });
  assert.equal(data.path, "src/gemposts/2026-10-03-a-capsule-post.md");
  assert.equal(data.properties.url, "gemini://hans.gerwitz.com/gemlog/2026-10-03-a-capsule-post.gmi");
  assert.equal(data.properties["post-type"], "gempost");

  const markdown = publication.postTemplate(getPostTemplateProperties(data.properties));
  const frontMatter = getFrontMatter(markdown);
  assert.equal(frontMatter.title, properties.name);
  assert.ok(frontMatter.date);
  assert.equal(frontMatter.draft, undefined);
  assert.match(markdown, /A \*\*Markdown\*\* body\./);
  assert.doesNotMatch(markdown, /mpGempost|mp-gempost|postType|gemini:\/\//);
});

test("gempost respects drafts while Writing remains automatically drafted", async () =>
{
  const data = await postData.create(application, publication, { ...properties }, true);
  const markdown = publication.postTemplate(getPostTemplateProperties(data.properties));
  assert.equal(getFrontMatter(markdown).draft, true);

  const writing = publication.postTemplate({ type: "article", name: "Writing", content: "Body" });
  assert.equal(getFrontMatter(writing).draft, true);
});

test("Markdown articles omit an opening heading only when it matches the title", () =>
{
  for (const content of ["# Writing\n\nBody.", "\n\n  # Writing ###\r\n\r\nBody.", "# Writing\nBody."])
  {
    const markdown = publication.postTemplate({ type: "article", name: "Writing", content });
    assert.equal(getFrontMatter(markdown).title, "Writing");
    assert.equal(getFrontMatter(markdown).draft, true);
    assert.equal(getBody(markdown), "\nBody.\n");
  }

  const empty = publication.postTemplate({ type: "article", name: "Writing", content: { text: "# Writing", html: "<h1>Writing</h1>" } });
  assert.equal(getBody(empty), "\n");
});

test("real Micropub article discovery and normalized Markdown retain their title without duplicate content", async () =>
{
  const data = await postData.create(application, publication, {
    type: "entry", name: "Writing", content: "# Writing\n\n    indented code\n\nNext paragraph.",
    published: properties.published,
  });
  const before = structuredClone(data.properties);
  assert.equal(data.properties["post-type"], "article");
  const markdown = publication.postTemplate(getPostTemplateProperties(data.properties));
  assert.equal(getFrontMatter(markdown).title, "Writing");
  assert.equal(getBody(markdown), "\n    indented code\n\nNext paragraph.\n");
  assert.deepEqual(data.properties, before);

  const gempost = await postData.create(application, publication, { ...properties, content: "# A capsule post\n\nBody." });
  assert.equal(getBody(publication.postTemplate(getPostTemplateProperties(gempost.properties))), "\n# A capsule post\n\nBody.\n");
});

test("different headings, code, HTML, notes, and gemposts keep their opening content", () =>
{
  for (const content of ["# A different heading\n\nBody.", "## Writing\n\nBody.", "#Writing\n\nBody.", "    # Writing\n\nBody.", "```md\n# Writing\n```", "<h1>Writing</h1>\n<p>Body.</p>"])
  {
    assert.equal(getBody(publication.postTemplate({ type: "article", name: "Writing", content })), `\n${content}\n`);
  }

  const html = "<h1>Writing</h1>\n<p>Body.</p>";
  assert.equal(getBody(publication.postTemplate({ type: "article", name: "Writing", content: { html } })), `\n${html}\n`);

  for (const type of ["note", "gempost"])
  {
    assert.equal(getBody(publication.postTemplate({ type, name: "Writing", content: "# Writing\n\nBody." })), "\n# Writing\n\nBody.\n");
  }
});

test("every saved body has one empty line after front matter without losing indentation", () =>
{
  for (const type of ["article", "note", "gempost"])
  {
    const markdown = publication.postTemplate({ type, name: "Writing", content: "\r\n \t\r\n    code\n\nNext." });
    assert.equal(getBody(markdown), "\n    code\n\nNext.\n");
  }
});
