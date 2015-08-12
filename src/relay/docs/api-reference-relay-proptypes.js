/**
 * @generated
 */
var React = require("React");
var Layout = require("DocsLayout");
var content = `
Relay introduces two new classes of objects: \`RelayContainer\` and \`Relay.Route\`. \`Relay.PropTypes\` provides prop validators used to assert that props are of these types.

## Overview

*Properties*

<ul class="apiIndex">
  <li>
    <a href="#example">
      <pre>static Container: ReactPropTypeValidator</pre>
      A prop type validator asserting that a prop is a valid Relay container.
    </a>
  </li>
  <li>
    <a href="#example">
      <pre>static QueryConfig: ReactPropTypeValidator</pre>
      A prop type validator asserting that a prop is a valid route.
    </a>
  </li>
</ul>

## Example

\`\`\`
class MyApplication extends React.Component {
  static propTypes = {
    // Warns if \`Component\` is not a valid RelayContainer.
    Component: Relay.PropTypes.Container.isRequired,
    // Warns if \`route\` is not a valid route.
    route: Relay.PropTypes.QueryConfig.isRequired,
  };
  render() {
    return (
      <Relay.RootContainer
        Component={this.props.Component}
        route={this.props.route}
      />
    );
  }
}
\`\`\`
`
var Post = React.createClass({
  statics: {
    content: content
  },
  render: function() {
    return <Layout metadata={{"id":"api-reference-relay-proptypes","title":"Relay.PropTypes","layout":"docs","category":"API Reference","permalink":"docs/api-reference-relay-proptypes.html","next":"api-reference-relay-store","source":"APIReference-PropTypes.md"}}>{content}</Layout>;
  }
});
module.exports = Post;
