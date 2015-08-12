/**
 * @generated
 */
var React = require("React");
var Layout = require("DocsLayout");
var content = `
# Getting Started

The three core assumptions that Relay makes on a GraphQL server are that
it provides a mechanism for refetching an object, a description of how
to page through connections, and a structure around mutations to make
them predictable. This example demonstrates all three of these assumptions.

This example is not comprehensive, but it is designed to quickly introduce
these core assumptions, to provide some context before diving into
the more detailed specification or the library.

The premise of the example is that we want to use GraphQL to query for
information about ships and factions in the original Star Wars
trilogy.

It is assumed that the reader is already familiar with GraphQL; if not,
the README for [GraphQL.js](https://github.com/graphql/graphql-js) is a
good place to start.

It is also assumed that the reader is already familiar with Star Wars; if not,
the 1977 version of Star Wars is a good place to start, though the 1997
Special Edition will serve for the purposes of this document.

## Schema

The schema described below will be used to demonstrate the functionality
that a GraphQL server used by Relay should implement. The two core types
are a faction and a ship in the Star Wars universe, where a faction
has many ships associated with it. The schema below is the output of the
GraphQL.js \`schemaPrinter\`.

\`\`\`
interface Node {
  id: ID!
}

type Faction : Node {
  id: ID!
  name: String
  ships: ShipConnection
}

type Ship : Node {
  id: ID!
  name: String
}

type ShipConnection {
  edges: [ShipEdge]
  pageInfo: PageInfo!
}

type ShipEdge {
  cursor: String!
  node: Ship
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  rebels: Faction
  empire: Faction
  node(id: ID!): Node
}

input IntroduceShipInput {
  factionId: String!
  shipNamed: String!
  clientMutationId: String!
}

type IntroduceShipPayload {
  faction: Faction
  ship: Ship
  clientMutationId: String!
}

type Mutation {
  introduceShip(input: IntroduceShipInput!): IntroduceShipPayload
}
\`\`\`
`
var Post = React.createClass({
  statics: {
    content: content
  },
  render: function() {
    return <Layout metadata={{"id":"graphql-relay-specification","title":"GraphQL Relay Specification","layout":"docs","category":"GraphQL","permalink":"docs/graphql-relay-specification.html","next":"graphql-object-identification","source":"GraphQL-RelaySpecification.md"}}>{content}</Layout>;
  }
});
module.exports = Post;
