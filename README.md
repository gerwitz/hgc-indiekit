Configuration for [IndieKit](https://getindiekit.com/)

Following the sample at https://github.com/getindiekit/example-config/
Using Docker Compose to bring a MongoDB container along for the ride

## Gemposts

The local Gempost post type creates titled Markdown posts in
`src/gemposts/YYYY-MM-DD-slug.md`, published only in Gemini at
`gemini://hans.gerwitz.com/posts/YYYY-MM-DD-slug.gmi`.

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
