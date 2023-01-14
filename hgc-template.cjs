// import YAML from 'yaml'
const YAML = require('yaml');

module.exports = function(properties){
  let content;
  if (properties.content) {
    content =
      properties.content.text ||
      properties.content.html ||
      properties.content;
    content = `${content}\n`;
  } else {
    content = "";
  }

  metadata = {
    date: properties.published,
    ...(properties.updated && { updated: properties.updated }),
    ...(properties.title && { title: properties.title }),
    ...(properties.slug && { slug: properties.slug }),
    ...(properties.category && { categories: [properties.category] }), // pluralized
    ...(properties.location && { location: properties.location }),
    ...(properties.syndication && { syndication: properties.syndication }),
    ...(properties["mp-syndicate-to"] && { "mp-syndicate-to": properties["mp-syndicate-to"] }),
    ...(properties.postStatus === "draft" && { draft: true }),
};

  let frontMatter = YAML.stringify(metadata, { lineWidth: 0 });
  frontMatter = `---\n${frontMatter}---\n`;

  return frontMatter + content;
};
