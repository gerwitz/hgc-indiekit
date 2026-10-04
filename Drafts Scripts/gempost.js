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

props["mp-gempost"] = true;

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

// Make objects readable in the Drafts log. String concatenation alone turns
// an object into the unhelpful string "[object Object]".
function logValue(value) {
    if (value === undefined) {
        return "<undefined>";
    }
    if (value === null) {
        return "null";
    }
    if (typeof value === "string") {
        return value.length > 0 ? value : "<empty>";
    }
    try {
        return JSON.stringify(value, null, 2);
    }
    catch (e) {
        return String(value);
    }
}

function logError(error) {
    if (error && (error.name || error.message || error.stack)) {
        var details = [];
        if (error.name) {
            details.push("name: " + error.name);
        }
        if (error.message) {
            details.push("message: " + error.message);
        }
        if (error.stack) {
            details.push("stack:\n" + error.stack);
        }
        return details.join("\n");
    }
    return logValue(error);
}

function redactedHeaders(headers) {
    var result = {};
    if (!headers) {
        return result;
    }

    for (var key in headers) {
        if (!headers.hasOwnProperty(key)) {
            continue;
        }

        var lowerKey = key.toLowerCase();
        if (lowerKey == "authorization" ||
            lowerKey == "cookie" ||
            lowerKey == "set-cookie" ||
            lowerKey == "x-api-key") {
            result[key] = "[REDACTED]";
        }
        else {
            result[key] = headers[key];
        }
    }
    return result;
}

function redactedURL(url) {
    if (!url) {
        return url;
    }
    return String(url).replace(
        /([?&](?:access_token|token)=)[^&]*/ig,
        "$1[REDACTED]"
    );
}

var requestForLog = {
    "url": redactedURL(request.url),
    "method": request.method,
    "encoding": request.encoding,
    "data": request.data,
    "headers": redactedHeaders(request.headers)
};
console.log("Micropub request:\n" + logValue(requestForLog));

// Create and post HTTP request
var http = HTTP.create();
var response;
try {
    response = http.request(request);
}
catch (error) {
    console.log("HTTP.request threw an exception:\n" + logError(error));
    context.fail();
}

// Log response and report any failures
if (!response) {
    console.log("No HTTP response object was returned.");
    context.fail();
}
else {
    console.log("Micropub response statusCode: " + logValue(response.statusCode));
    console.log("Micropub response success: " + logValue(response.success));
    console.log("Micropub response error: " + logValue(response.error));
    console.log("Micropub response headers:\n" + logValue(redactedHeaders(response.headers)));
    console.log("Micropub responseText:\n" + logValue(response.responseText));
    console.log("Micropub responseData:\n" + logValue(response.responseData));
    console.log("Micropub otherData:\n" + logValue(response.otherData));

    if (response.statusCode != 200 &&
        response.statusCode != 201 &&
        response.statusCode != 202) {
        // FAIL
        context.fail();
    }
}
