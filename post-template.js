export const articleTemplate = (properties) => {
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
    (properties.postStatus === "draft" && { published: false }),
    date: properties.published,
    ...(properties.title && { title: properties.title }),
    ...(properties.category && { categories: properties.category }), // pluralized
  };
  let frontMatter = YAML.stringify(metadata, { lineWidth: 0 });
  frontMatter = `---\n${frontMatter}---\n`;

  return frontMatter + content;
};
