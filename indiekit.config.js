import process from "node:process";
import { fileURLToPath } from "node:url";
import { getPostType } from "@indiekit/endpoint-micropub/lib/post-type-discovery.js";
import { getPostTemplate } from "@indiekit/preset-eleventy/lib/post-template.js";

const stripDuplicateArticleHeading = (properties) =>
{
  const { content, name, type, url } = properties;
  const markdown = typeof content === "string" ? content : content?.text;

  if (typeof markdown !== "string" || typeof name !== "string" || !name.trim())
  {
    return content;
  }

  // Micropub removes post-type metadata before this hook; capsule URLs distinguish gemposts.
  const isArticle = type === "article"
    || (type === "entry" && !url?.startsWith("gemini:") && getPostType({}, properties) === "article");

  if (!isArticle)
  {
    return content;
  }

  // Inspect Markdown only; a different heading or an HTML heading is intentional content.
  const heading = markdown.match(/^(?:[ \t]*\r?\n)* {0,3}#[ \t]+([^\r\n]*)(?:\r?\n|$)/);
  const headingTitle = heading?.[1].replace(/[ \t]+#+[ \t]*$/, "").trim();

  return headingTitle === name.trim() ? markdown.slice(heading[0].length) : content;
};

export default {
  application: {
    name: "indiekit.gerwitz.com",
    url: "https://indiekit.gerwitz.com",
    port: 3001,
    timeZone: "Europe/Amsterdam",
    mongodbUrl: process.env.MONGO_URL,
    themeColor: "#00852B",
  },
  plugins: [
    "@indiekit/store-github",
    "@indiekit/syndicator-bluesky",
    "@indiekit/syndicator-mastodon",
    "@indiekit/preset-eleventy",
    fileURLToPath(new URL("./plugins/gempost/index.js", import.meta.url)),
  ],
  publication: {
    me: "https://hans.gerwitz.com",
    postTemplate: (properties) =>
    {
      const templateProperties = {
        ...properties,
        ...(properties.type === "article" && { draft: true }),
        content: stripDuplicateArticleHeading(properties),
      };

      // Keep one empty line after front matter, including when stripping leaves no body.
      return getPostTemplate(templateProperties).replace(/(\n---\n)(?:[ \t]*\r?\n)*/, "$1\n");
    },
    authorizationEndpoint: "https://indieauth.com/auth",
    locale: "en-US",
    timeZone: "Europe/Amsterdam",
    categories: ["personal", "culture", "work"],
    postTypes: {
      article: {
        name: "Writing",
        post: {
          path: "src/writing/{yyyy}/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "{yyyy}/{MM}/{dd}/{slug}"
        },
        media: {
          path: "src/media/{yyyy}-{MM}-{dd}-{slug}/{filename}",
          url: "media/{yyyy}-{MM}-{dd}-{slug}/{filename}"
        }
      },
      gempost: {
        name: "Gempost",
        post: {
          path: "src/gemposts/{yyyy}-{MM}-{dd}-{slug}.md",
          url: "gemini://hans.gerwitz.com/gemlog/{yyyy}-{MM}-{dd}-{slug}.gmi"
        }
      },
      note: {
        name: "Note",
        post: {
          path: "src/notes/{yyyy}/{yyyy}-{MM}-{dd}-{n}.md",
          url: "{yyyy}/{MM}/{dd}/{slug}.html"
        }
      }
    },
    slugSeparator: "-"
  },
  "@indiekit/post-type-article": {
    fields: {
      name: { required: true },
      content: { required: true },
      summary: {},
      category: {},
      tags: {},
      location: {},
      published: { required: true },
      visibility: {},
    },
  },
  "@indiekit/store-github": {
    user: "gerwitz",
    repo: "hgc-v12",
    branch: "main",
    // token: process.env.GITHUB_TOKEN
  },
  "@indiekit/syndicator-mastodon": {
    checked: false,
    url: "https://chaos.social",
    user: "gerwitz",
    // accessToken: process.env.MASTODON_ACCESS_TOKEN,
    characterLimit: 5000
  },
  "@indiekit/syndicator-bluesky": {
    checked: true,
    handle: "gerwitz.com"
    // password: process.env.BLUESKY_PASSWORD,
  }
};
