const hgcTemplate = require('./hgc-template.cjs');
const dotEnv = require('dotenv');

module.exports = {
  application: {
    name: "indiekit.gerwitz.com",
    url: "https://indiekit.gerwitz.com",
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
        path: "src/writing/{yyyy}/{yyyy}-{MM}-{dd}/{slug}.md",
        url: "{yyyy}/{MM}/{dd}/{slug}"
      },
      media: {
        path: "src/media/{yyyy}-{MM}-{dd}-{slug}/{originalname}",
        url: "media/{yyyy}-{MM}-{dd}-{slug}/{originalname}"
      }
    }, {
      type: "note",
      name: "Note",
      post: {
        path: "src/notes/{yyyy}/note-{t}.md",
        url: "{yyyy}/{MM}/{dd}/note-{t}"
      }
    }, {
      type: "photo",
      name: "Photo Note",
      post: {
        path: "src/notes/{yyyy}/note-{t}.md",
        url: "{yyyy}/{MM}/{dd}/note-{t}"
      },
      media: {
        path: "src/media/{yyyy}-{MM}/{originalname}",
        url: "media/{yyyy}-{MM}/{originalname}"
      }
    }],
    slugSeparator: "-",
    postTemplate: hgcTemplate,
  },

  "@indiekit/store-github": {
    user: "gerwitz",
    repo: "hgc-v12"
    branch: "main",
    token: process.env.GITHUB_TOKEN
  },
  "@indiekit/syndicator-mastodon": {
    checked: true,
    forced: false,
    url: "https://social.gerwitz.com",
    user: "gerwitz",
    accessToken: process.env.MASTODON_ACCESS_TOKEN
  },
};
