import process from "node:process";

export default {
  application: {
    name: "indiekit.gerwitz.com",
    url: "https://indiekit.gerwitz.com",
    timeZone: "Europe/Amsterdam",
    mongodbUrl: process.env.MONGO_URL,
    themeColor: "#00852B",
  },
  plugins: [
    "@indiekit/store-github",
    "@indiekit/syndicator-mastodon",
  ],
  publication: {
    me: "https://hans.gerwitz.com",
    authorizationEndpoint: "https://indieauth.com/auth",
    locale: "en-US",
    timeZone: "Europe/Amsterdam",
    categories: ["personal", "culture", "work"],
    postTypes: [{
      type: "article",
      name: "Writing",
      post: {
        path: "src/writing/{yyyy}/{yyyy}-{MM}-{dd}-{slug}.md",
        url: "{yyyy}/{MM}/{dd}/{slug}"
      },
      media: {
        path: "src/media/{yyyy}-{MM}-{dd}-{slug}/{filename}",
        url: "media/{yyyy}-{MM}-{dd}-{slug}/{filename}"
      }
    }, {
      type: "note",
      name: "Note",
      post: {
        path: "src/notes/{yyyy}/{yyyy}-{MM}-{dd}-{n}.md",
        url: "{yyyy}/{MM}/{dd}/{slug}.html"
      }
    }, {
      type: "photo",
      name: "Photo Note",
      post: {
        path: "src/notes/{yyyy}/{yyyy}-{MM}-{dd}-{n}.md",
        url: "{yyyy}/{MM}/{dd}/{slug}.html"
      },
      media: {
        path: "src/media/{yyyy}-{MM}/{filename}",
        url: "media/{yyyy}-{MM}/{filename}"
      }
    }],
    slugSeparator: "-",
    postTemplate: hgcTemplate,
  },

  "@indiekit/store-github": {
    user: "gerwitz",
    repo: "hgc-v12",
    branch: "main",
    token: process.env.GITHUB_TOKEN
  },
  "@indiekit/syndicator-mastodon": {
    checked: true,
    forced: true,
    url: "https://fedi.gerwitz.com",
    user: "hans",
    accessToken: process.env.MASTODON_ACCESS_TOKEN,
    characterLimit: 5000
  },
};
