export default class GempostPostType
{
  name = "Gempost post type";

  get config()
  {
    return {
      name: "Gempost",
      h: "entry",
      // A Micropub command distinguishes titled gemposts from ordinary articles.
      discovery: "mp-gempost",
      fields: {
        "mp-gempost": { required: true },
        name: { required: true },
        content: { required: true },
        "post-status": {},
        published: { required: true },
        visibility: {},
      },
    };
  }

  init(indiekit)
  {
    indiekit.addPostType("gempost", this);
  }
}
