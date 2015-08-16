/**
 * @generated
 */
var React = require("React");
var Layout = require("DocsLayout");
var content = `
\`RelayQueryRequest\` encapsulates a query that Relay needs to send to the server. They are made available to network layers via the \`sendQueries\` method.

## Overview

*Methods*

<ul class="apiIndex">
  <li>
    <a href="#getquerystring">
      <pre>getQueryString()</pre>
    </a>
  </li>
  <li>
    <a href="#getvariables">
      <pre>getVariables()</pre>
    </a>
  </li>
  <li>
    <a href="#getid">
      <pre>getID()</pre>
    </a>
  </li>
  <li>
    <a href="#getdebugname">
      <pre>getDebugName()</pre>
    </a>
  </li>
</ul>


## Methods

### getQueryString

\`\`\`
getQueryString(): string
\`\`\`

Gets a string representation of the GraphQL query.

### getVariables

\`\`\`
getVariables(): {[name: string]: mixed}
\`\`\`

Gets the variables used by the query. These variables should be serialized and sent in the GraphQL request.

### getID

\`\`\`
getID(): string
\`\`\`

Gets a unique identifier for this query. These identifiers are useful for assigning response payloads to their corresponding queries when sent in a single GraphQL request.

### getDebugName

\`\`\`
getDebugName(): string
\`\`\`

Gets a string name used to refer to this request for printing debug output.
`
var Post = React.createClass({
  statics: {
    content: content
  },
  render: function() {
    return <Layout metadata={{"id":"interfaces-relay-query-request","title":"RelayQueryRequest","layout":"docs","category":"Interfaces","indent":true,"permalink":"docs/interfaces-relay-query-request.html","source":"Interfaces-QueryRequest.md"}}>{content}</Layout>;
  }
});
module.exports = Post;
