import {postTemplate } from "./post-template.js";

export default = {
  application: {
    url: "http://indiekit.gerwitz.com",
    // mongodbUrl: process.env.MONGO_URL,
  },
  plugins: [
    "@indiekit/store-github",
    // "@indiekit/syndicator-twitter",
  ],
  publication: {
    me: "https://hans.gerwitz.com",
    authorizationEndpoint: "https://indieauth.com/auth",
    locale: "en",
    timeZone: "Europe/Amsterdam",
    categories: ["personal", "culture", "work"],
    slugSeparator: "-",
    postTemplate: postTemplate,
    postTypes:  [{
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
    }]
  },
  "@indiekit/store-github": {
    user: "gerwitz",
    repo: "hgc-v12"
  },
  // "@indiekit/syndicator-twitter": {
  //   checked: true,
  //   forced: false,
  //   user: "gerwitz",
  // },
};
