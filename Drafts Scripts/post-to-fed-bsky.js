/**
 * based on https://actions.getdrafts.com/a/1QC
 * Post to a Micropub endpoint.
 *
 * - On first run, you will be prompted for an IndieAuth token and a Micropub
 *   endpoint. These will be saved for future runs.
 * - Options supported include togging "private" visibility, a comma separated
 *   list of categories, and an in-reply-to URL.
 * - The first line of your Draft should be a top-level headline, which will
 *   be used as the title ("name" property) for the post.
 *
 * I find it easiest to steal an access token 
 * from https://quill.p3k.io/settings
 */

// Get IndieAuth Token and Micropub Endpoint on first run
var credential = Credential.create(
    "Micropub", 
    "Insert IndieAuth token and Micropub endpoint."
)

credential.addTextField("token", "token");
credential.addTextField("endpoint", "endpoint URL");
credential.authorize();

var token = credential.getValue("token");
var endpoint = credential.getValue("endpoint");

// Pull the post title off the content
var content = draft.content;
var array_of_content = draft.content.split("\n");
var post_title = "";
if (array_of_content[0].charAt(0) == "#") {
    post_title += array_of_content[0].slice(2);
    array_of_content.shift();
}

// Collect the rest of the content
var real_content = "";
for (i = 0; i < array_of_content.length; i++) {
    real_content += array_of_content[i] + "\n";
}

// Convert the content to HTML
// var mmd = MultiMarkdown.create()
// var rendered = mmd.render(real_content)

// Create MF2 properties
var props = {};
props["name"] = [post_title];
props["content"] = [real_content];

// Prompt for options
/**
var p = Prompt.create();

p.title = "Publish Options";
p.message = " characters";

p.addTextField("in-reply-to", "Reply To URL", "");
// p.addTextField("categories", "Categories", "");
p.addSwitch("private", "Private Post", false);

p.addButton("Publish");

var didSelect = p.show();

// var categories = p.fieldValues["categories"];
var is_private = p.fieldValues["private"];
var in_reply_to = p.fieldValues["in-reply-to"];

// Did the user decide to publish?
if (p.buttonPressed != "Publish") {
    context.cancel();
}
if (is_private) {
    props["visibility"] = ["private"];
}

if (categories) {
    props["category"] = [];
    categories.split(',').forEach(function(category) {
        props["category"].push(category.trim());
    })
}


if (in_reply_to) {
    props["in-reply-to"] = [in_reply_to];
}
*/

var request = {
    "url": endpoint,
    "method": "POST",
    "encoding": "json",
    "data": {
        "type": ["h-entry"],
        "properties": props
    },
    "headers": {
        "Authorization": "Bearer " + token
    }
};
console.log("Request: " + JSON.stringify(request));

// Create and post HTTP request
var http = HTTP.create();
var response = http.request(request);

// Log response and report any failures
console.log("Response: " + response.statusCode);

if (response.statusCode != 200 && 
    response.statusCode != 201 && 
    response.statusCode != 202) {
// FAIL
  context.fail();
}

