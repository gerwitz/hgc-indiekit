Configuration for [IndieKit](https://getindiekit.com/)

Following the sample at https://github.com/getindiekit/example-config/
Using Docker Compose to bring a MongoDB container along for the ride

## Article formatting

When saving an article, a leading Markdown `#` heading is omitted from the body
only if it matches the Micropub title. The front-matter title is retained. This
uses Indiekit's Markdown text representation; HTML tags are not processed, and
note and gempost headings are preserved.

Saved files have one blank line after the closing front-matter delimiter. Body
indentation and spacing between paragraphs are preserved.

## Gemposts

The local Gempost post type creates titled Markdown posts in
`src/gemposts/YYYY-MM-DD-slug.md`, published only in Gemini at
`gemini://hans.gerwitz.com/gemlog/YYYY-MM-DD-slug.gmi`.

Choose **Gempost** in Indiekit's new-post interface. Third-party Micropub clients
can create a gempost by sending `mp-gempost=true` alongside `name` and `content`.
The marker is omitted from the saved Markdown. Gemposts support published and
draft status; Writing's existing automatic draft behavior is unchanged.

Environment variables expected:
- GITHUB_TOKEN
- MASTODON_ACCESS_TOKEN
- BLUESKY_PASSWORD
- MONGO_INITDB_ROOT_USERNAME
- MONGO_INITDB_ROOT_PASSWORD
- PASSWORD_SECRET
- SECRET
