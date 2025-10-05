import process from "node:process";

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
  ],
  publication: {
    me: "https://hans.gerwitz.com",
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
    url: "https://fedi.gerwitz.com",
    user: "hans",
    // accessToken: process.env.MASTODON_ACCESS_TOKEN,
    characterLimit: 5000
  },
  "@indiekit/syndicator-bluesky": {
    checked: true,
    handle: "gerwitz.com"
    // password: process.env.BLUESKY_PASSWORD,
  }
};
