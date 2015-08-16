/**
 * @generated
 */
var React = require("React");
var Layout = require("DocsLayout");
var content = `\\\\[x^2\\\\] \\\\(x\\\\) $$x^5$$

\`\`\`
<strong>a</strong> 

\`\`\`

In this tutorial, we will build a game using GraphQL mutations. The object of the game will be to guess where in a grid of 9 squares is hidden some treasure. We will give players three tries to find the treasure. This should give us an end-to-end look at Relay – from the GraphQL schema on the server, to the React application on the client.

## Warm up

Let's start a project using the Relay Starter Kit as a base.

\`\`\`
git clone git@github.com:facebook/relay-starter-kit.git relay-treasurehunt
cd relay-treasurehunt
npm install
\`\`\`

## A simple database

We need a place to hide our treasure, a way to check hiding spots for treasure, and a way to track our turns remaining. For the purposes of this tutorial, we'll hide these data in memory.

\`\`\`
/**
 * ./data/database.js
 */

// Model types
class Game extends Object {}
class HidingSpot extends Object {}

// Mock data
var game = new Game();
game.id = '1';

var hidingSpots = [];
(function() {
  var hidingSpot;
  var indexOfSpotWithTreasure = Math.floor(Math.random() * 9);
  for (var i = 0; i < 9; i++) {
    hidingSpot = new HidingSpot();
    hidingSpot.id = \`\${i}\`;
    hidingSpot.hasTreasure = (i === indexOfSpotWithTreasure);
    hidingSpot.hasBeenChecked = false;
    hidingSpots.push(hidingSpot);
  }
})();

var turnsRemaining = 3;

export function checkHidingSpotForTreasure(id) {
  if (hidingSpots.some(hs => hs.hasTreasure && hs.hasBeenChecked)) {
    return;
  }
  turnsRemaining--;
  var hidingSpot = getHidingSpot(id);
  hidingSpot.hasBeenChecked = true;
};
export function getHidingSpot(id) {
  return hidingSpots.find(hs => hs.id === id)
}
export function getGame() { return game; }
export function getHidingSpots() { return hidingSpots; }
export function getTurnsRemaining() { return turnsRemaining; }
\`\`\`

What we have written here is a mock database interface. We can imagine hooking this up to a real database, but for now let's move on.

## Authoring a schema

A GraphQL schema describes your data model, and provides a GraphQL server with
an associated set of resolve methods that know how to fetch data. We will use
[graphql-js](https://github.com/graphql/graphql-js) and
[graphql-relay-js](https://github.com/graphql/graphql-relay-js) to build our
schema.

Let's open up the starter kit's schema, and replace the database imports with the ones we just created:

\`\`\`
/**
 * ./data/schema.js
 */

/* ... */

import {
  Game,
  HidingSpot,
  checkHidingSpotForTreasure,
  getGame,
  getHidingSpot,
  getHidingSpots,
  getTurnsRemaining,
} from './database';
\`\`\`

At this point, you can delete everything up until \`queryType\` in \`./data/schema.js\`.

Next, let's define a node interface and type. We need only provide a way for Relay to map from an object to the GraphQL type associated with that object, and from a global ID to the object it points to:

\`\`\`
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Game') {
      return getGame(id);
    } else if (type === 'HidingSpot') {
      return getHidingSpot(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Game) {
      return gameType;
    } else if (obj instanceof HidingSpot)  {
      return hidingSpotType;
    } else {
      return null;
    }
  }
);
\`\`\`

Next, let's define our game and hiding spot types, and the fields that are available on each.

\`\`\`
var gameType = new GraphQLObjectType({
  name: 'Game',
  description: 'A treasure search game',
  fields: () => ({
    id: globalIdField('Game'),
    hidingSpots: {
      type: hidingSpotConnection,
      description: 'Places where treasure might be hidden',
      args: connectionArgs,
      resolve: (game, args) => connectionFromArray(getHidingSpots(), args),
    },
    turnsRemaining: {
      type: GraphQLInt,
      description: 'The number of turns a player has left to find the treasure',
      resolve: () => getTurnsRemaining(),
    },
  }),
  interfaces: [nodeInterface],
});

var hidingSpotType = new GraphQLObjectType({
  name: 'HidingSpot',
  description: 'A place where you might find treasure',
  fields: () => ({
    id: globalIdField('HidingSpot'),
    hasBeenChecked: {
      type: GraphQLBoolean,
      description: 'True this spot has already been checked for treasure',
      resolve: (hidingSpot) => hidingSpot.hasBeenChecked,
    },
    hasTreasure: {
      type: GraphQLBoolean,
      description: 'True if this hiding spot holds treasure',
      resolve: (hidingSpot) => {
        if (hidingSpot.hasBeenChecked) {
          return hidingSpot.hasTreasure;
        } else {
          return null;  // Shh... it's a secret!
        }
      },
    },
  }),
  interfaces: [nodeInterface],
});
\`\`\`

Since one game can have many hiding spots, we need to create a connection that we can use to link them together.

\`\`\`
var {connectionType: hidingSpotConnection} =
  connectionDefinitions({name: 'HidingSpot', nodeType: hidingSpotType});
\`\`\`

Now let's associate these types with the root query type.

\`\`\`
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    game: {
      type: gameType,
      resolve: () => getGame(),
    },
  }),
});
\`\`\`

With the queries out of the way, let's start in on our only mutation: the one that spends a turn by checking a spot for treasure. Here, we define the input to the mutation (the id of a spot to check for treasure) and a list of all of the possible fields that the client might want updates about after the mutation has taken place. Finally, we implement a method that performs the underlying mutation.

\`\`\`
var CheckHidingSpotForTreasureMutation = mutationWithClientMutationId({
  name: 'CheckHidingSpotForTreasure',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    hidingSpot: {
      type: hidingSpotType,
      resolve: ({localHidingSpotId}) => getHidingSpot(localHidingSpotId),
    },
    game: {
      type: gameType,
      resolve: () => getGame(),
    },
  },
  mutateAndGetPayload: ({id, text}) => {
    var localHidingSpotId = fromGlobalId(id).id;
    checkHidingSpotForTreasure(localHidingSpotId);
    return {localHidingSpotId};
  },
});
\`\`\`

Let's associate the mutation we just created with the root mutation type:

\`\`\`
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    checkHidingSpotForTreasure: CheckHidingSpotForTreasureMutation,
  }),
});
\`\`\`

Finally, we construct our schema (whose starting query type is the query type we defined above) and export it.

\`\`\`
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
\`\`\`

## Processing the schema

Before going any further, we need to serialize our executable schema to JSON for use by the Relay.QL transpiler, then start up the server. From the command line:

\`\`\`
./scripts/updateSchema.js
npm start
\`\`\`

## Writing the game

Let's tweak the file \`./routes/AppHomeRoute.js\` to anchor our game to the \`game\` root field of the schema:

\`\`\`
export default class extends Relay.Route {
  static path = '/';
  static queries = {
    game: (Component) => Relay.QL\`
      query {
        game {
          \${Component.getFragment('game')},
        },
      }
    \`,
  };
  static routeName = 'AppHomeRoute';
}
\`\`\`

Next, let's create a file in \`./mutations/CheckHidingSpotForTreasureMutation.js\` and create subclass of \`Relay.Mutation\` called \`CheckHidingSpotForTreasureMutation\` to hold our mutation implementation:

\`\`\`
export default class CheckHidingSpotForTreasureMutation extends Relay.Mutation {
  static fragments = {
    game: () => Relay.QL\`
      fragment on Game {
        id,
        turnsRemaining,
      }
    \`,
    hidingSpot: () => Relay.QL\`
      fragment on HidingSpot {
        id,
      }
    \`,
  };
  getMutation() {
    return Relay.QL\`mutation{checkHidingSpotForTreasure}\`;
  }
  getCollisionKey() {
    return \`check_\${this.props.game.id}\`;
  }
  getFatQuery() {
    return Relay.QL\`
      fragment on CheckHidingSpotForTreasurePayload {
        hidingSpot {
          hasBeenChecked,
          hasTreasure,
        },
        game {
          turnsRemaining,
        },
      }
    \`;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        hidingSpot: this.props.hidingSpot.id,
        game: this.props.game.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.hidingSpot.id,
    };
  }
  getOptimisticResponse() {
    return {
      game: {
        turnsRemaining: this.props.game.turnsRemaining - 1,
      },
      hidingSpot: {
        id: this.props.hidingSpot.id,
        hasBeenChecked: true,
      },
    };
  }
}
\`\`\`

Finally, let's tie it all together in \`./components/App.js\`:

\`\`\`
import CheckHidingSpotForTreasureMutation from '../mutations/CheckHidingSpotForTreasureMutation';

class App extends React.Component {
  _getHidingSpotStyle(hidingSpot) {
    var color;
    if (this.props.relay.hasOptimisticUpdate(hidingSpot)) {
      color = 'lightGrey';
    } else if (hidingSpot.hasBeenChecked) {
      if (hidingSpot.hasTreasure) {
        color = 'green';
      } else {
        color = 'red';
      }
    } else {
      color = 'black';
    }
    return {
      backgroundColor: color,
      cursor: this._isGameOver() ? null : 'pointer',
      display: 'inline-block',
      height: 100,
      marginRight: 10,
      width: 100,
    };
  }
  _handleHidingSpotClick(hidingSpot) {
    if (this._isGameOver()) {
      return;
    }
    Relay.Store.update(
      new CheckHidingSpotForTreasureMutation({
        game: this.props.game,
        hidingSpot,
      })
    );
  }
  _hasFoundTreasure() {
    return (
      this.props.game.hidingSpots.edges.some(edge => edge.node.hasTreasure)
    );
  }
  _isGameOver() {
    return !this.props.game.turnsRemaining || this._hasFoundTreasure();
  }
  renderGameBoard() {
    return this.props.game.hidingSpots.edges.map(edge => {
      return (
        <div
          onClick={this._handleHidingSpotClick.bind(this, edge.node)}
          style={this._getHidingSpotStyle(edge.node)}
        />
      );
    });
  }
  render() {
    var headerText;
    if (this.props.relay.getPendingTransactions(this.props.game)) {
      headerText = '\\u2026';
    } else if (this._hasFoundTreasure()) {
      headerText = 'You win!';
    } else if (this._isGameOver()) {
      headerText = 'Game over!';
    } else {
      headerText = 'Find the treasure!';
    }
    return (
      <div>
        <h1>{headerText}</h1>
        {this.renderGameBoard()}
        <p>Turns remaining: {this.props.game.turnsRemaining}</p>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    game: () => Relay.QL\`
      fragment on Game {
        turnsRemaining,
        hidingSpots(first: 9) {
          edges {
            node {
              hasBeenChecked,
              hasTreasure,
              id,
              \${CheckHidingSpotForTreasureMutation.getFragment('hidingSpot')},
            }
          }
        },
        \${CheckHidingSpotForTreasureMutation.getFragment('game')},
      }
    \`,
  },
});
\`\`\`

A working copy of the treasure hunt can be found in the \`./examples/\` directory.

Now that we've gone end-to-end with Relay, let's dive into more detail in the guides section.
---
id: tutorial
title: Tutorial
layout: docs
category: Quick Start
permalink: docs/tutorial.html
next: videos
math: mathjax
---
<h3> KWANG </h3>
\\(x^2\\)
<strong>hi</strong> <h3>2</h3>

In this tutorial, we will build a game using GraphQL mutations. The object of the game will be to guess where in a grid of 9 squares is hidden some treasure. We will give players three tries to find the treasure. This should give us an end-to-end look at Relay – from the GraphQL schema on the server, to the React application on the client.

## Warm up

Let's start a project using the Relay Starter Kit as a base.

\`\`\`
git clone git@github.com:facebook/relay-starter-kit.git relay-treasurehunt
cd relay-treasurehunt
npm install
\`\`\`

## A simple database

We need a place to hide our treasure, a way to check hiding spots for treasure, and a way to track our turns remaining. For the purposes of this tutorial, we'll hide these data in memory.

\`\`\`
/**
 * ./data/database.js
 */

// Model types
class Game extends Object {}
class HidingSpot extends Object {}

// Mock data
var game = new Game();
game.id = '1';

var hidingSpots = [];
(function() {
  var hidingSpot;
  var indexOfSpotWithTreasure = Math.floor(Math.random() * 9);
  for (var i = 0; i < 9; i++) {
    hidingSpot = new HidingSpot();
    hidingSpot.id = \`\${i}\`;
    hidingSpot.hasTreasure = (i === indexOfSpotWithTreasure);
    hidingSpot.hasBeenChecked = false;
    hidingSpots.push(hidingSpot);
  }
})();

var turnsRemaining = 3;

export function checkHidingSpotForTreasure(id) {
  if (hidingSpots.some(hs => hs.hasTreasure && hs.hasBeenChecked)) {
    return;
  }
  turnsRemaining--;
  var hidingSpot = getHidingSpot(id);
  hidingSpot.hasBeenChecked = true;
};
export function getHidingSpot(id) {
  return hidingSpots.find(hs => hs.id === id)
}
export function getGame() { return game; }
export function getHidingSpots() { return hidingSpots; }
export function getTurnsRemaining() { return turnsRemaining; }
\`\`\`

What we have written here is a mock database interface. We can imagine hooking this up to a real database, but for now let's move on.

## Authoring a schema

A GraphQL schema describes your data model, and provides a GraphQL server with
an associated set of resolve methods that know how to fetch data. We will use
[graphql-js](https://github.com/graphql/graphql-js) and
[graphql-relay-js](https://github.com/graphql/graphql-relay-js) to build our
schema.

Let's open up the starter kit's schema, and replace the database imports with the ones we just created:

\`\`\`
/**
 * ./data/schema.js
 */

/* ... */

import {
  Game,
  HidingSpot,
  checkHidingSpotForTreasure,
  getGame,
  getHidingSpot,
  getHidingSpots,
  getTurnsRemaining,
} from './database';
\`\`\`

At this point, you can delete everything up until \`queryType\` in \`./data/schema.js\`.

Next, let's define a node interface and type. We need only provide a way for Relay to map from an object to the GraphQL type associated with that object, and from a global ID to the object it points to:

\`\`\`
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Game') {
      return getGame(id);
    } else if (type === 'HidingSpot') {
      return getHidingSpot(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Game) {
      return gameType;
    } else if (obj instanceof HidingSpot)  {
      return hidingSpotType;
    } else {
      return null;
    }
  }
);
\`\`\`

Next, let's define our game and hiding spot types, and the fields that are available on each.

\`\`\`
var gameType = new GraphQLObjectType({
  name: 'Game',
  description: 'A treasure search game',
  fields: () => ({
    id: globalIdField('Game'),
    hidingSpots: {
      type: hidingSpotConnection,
      description: 'Places where treasure might be hidden',
      args: connectionArgs,
      resolve: (game, args) => connectionFromArray(getHidingSpots(), args),
    },
    turnsRemaining: {
      type: GraphQLInt,
      description: 'The number of turns a player has left to find the treasure',
      resolve: () => getTurnsRemaining(),
    },
  }),
  interfaces: [nodeInterface],
});

var hidingSpotType = new GraphQLObjectType({
  name: 'HidingSpot',
  description: 'A place where you might find treasure',
  fields: () => ({
    id: globalIdField('HidingSpot'),
    hasBeenChecked: {
      type: GraphQLBoolean,
      description: 'True this spot has already been checked for treasure',
      resolve: (hidingSpot) => hidingSpot.hasBeenChecked,
    },
    hasTreasure: {
      type: GraphQLBoolean,
      description: 'True if this hiding spot holds treasure',
      resolve: (hidingSpot) => {
        if (hidingSpot.hasBeenChecked) {
          return hidingSpot.hasTreasure;
        } else {
          return null;  // Shh... it's a secret!
        }
      },
    },
  }),
  interfaces: [nodeInterface],
});
\`\`\`

Since one game can have many hiding spots, we need to create a connection that we can use to link them together.

\`\`\`
var {connectionType: hidingSpotConnection} =
  connectionDefinitions({name: 'HidingSpot', nodeType: hidingSpotType});
\`\`\`

Now let's associate these types with the root query type.

\`\`\`
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    game: {
      type: gameType,
      resolve: () => getGame(),
    },
  }),
});
\`\`\`

With the queries out of the way, let's start in on our only mutation: the one that spends a turn by checking a spot for treasure. Here, we define the input to the mutation (the id of a spot to check for treasure) and a list of all of the possible fields that the client might want updates about after the mutation has taken place. Finally, we implement a method that performs the underlying mutation.

\`\`\`
var CheckHidingSpotForTreasureMutation = mutationWithClientMutationId({
  name: 'CheckHidingSpotForTreasure',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    hidingSpot: {
      type: hidingSpotType,
      resolve: ({localHidingSpotId}) => getHidingSpot(localHidingSpotId),
    },
    game: {
      type: gameType,
      resolve: () => getGame(),
    },
  },
  mutateAndGetPayload: ({id, text}) => {
    var localHidingSpotId = fromGlobalId(id).id;
    checkHidingSpotForTreasure(localHidingSpotId);
    return {localHidingSpotId};
  },
});
\`\`\`

Let's associate the mutation we just created with the root mutation type:

\`\`\`
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    checkHidingSpotForTreasure: CheckHidingSpotForTreasureMutation,
  }),
});
\`\`\`

Finally, we construct our schema (whose starting query type is the query type we defined above) and export it.

\`\`\`
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
\`\`\`

## Processing the schema

Before going any further, we need to serialize our executable schema to JSON for use by the Relay.QL transpiler, then start up the server. From the command line:

\`\`\`
./scripts/updateSchema.js
npm start
\`\`\`

## Writing the game

Let's tweak the file \`./routes/AppHomeRoute.js\` to anchor our game to the \`game\` root field of the schema:

\`\`\`
export default class extends Relay.Route {
  static path = '/';
  static queries = {
    game: (Component) => Relay.QL\`
      query {
        game {
          \${Component.getFragment('game')},
        },
      }
    \`,
  };
  static routeName = 'AppHomeRoute';
}
\`\`\`

Next, let's create a file in \`./mutations/CheckHidingSpotForTreasureMutation.js\` and create subclass of \`Relay.Mutation\` called \`CheckHidingSpotForTreasureMutation\` to hold our mutation implementation:

\`\`\`
export default class CheckHidingSpotForTreasureMutation extends Relay.Mutation {
  static fragments = {
    game: () => Relay.QL\`
      fragment on Game {
        id,
        turnsRemaining,
      }
    \`,
    hidingSpot: () => Relay.QL\`
      fragment on HidingSpot {
        id,
      }
    \`,
  };
  getMutation() {
    return Relay.QL\`mutation{checkHidingSpotForTreasure}\`;
  }
  getCollisionKey() {
    return \`check_\${this.props.game.id}\`;
  }
  getFatQuery() {
    return Relay.QL\`
      fragment on CheckHidingSpotForTreasurePayload {
        hidingSpot {
          hasBeenChecked,
          hasTreasure,
        },
        game {
          turnsRemaining,
        },
      }
    \`;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        hidingSpot: this.props.hidingSpot.id,
        game: this.props.game.id,
      },
    }];
  }
  getVariables() {
    return {
      id: this.props.hidingSpot.id,
    };
  }
  getOptimisticResponse() {
    return {
      game: {
        turnsRemaining: this.props.game.turnsRemaining - 1,
      },
      hidingSpot: {
        id: this.props.hidingSpot.id,
        hasBeenChecked: true,
      },
    };
  }
}
\`\`\`

Finally, let's tie it all together in \`./components/App.js\`:

\`\`\`
import CheckHidingSpotForTreasureMutation from '../mutations/CheckHidingSpotForTreasureMutation';

class App extends React.Component {
  _getHidingSpotStyle(hidingSpot) {
    var color;
    if (this.props.relay.hasOptimisticUpdate(hidingSpot)) {
      color = 'lightGrey';
    } else if (hidingSpot.hasBeenChecked) {
      if (hidingSpot.hasTreasure) {
        color = 'green';
      } else {
        color = 'red';
      }
    } else {
      color = 'black';
    }
    return {
      backgroundColor: color,
      cursor: this._isGameOver() ? null : 'pointer',
      display: 'inline-block',
      height: 100,
      marginRight: 10,
      width: 100,
    };
  }
  _handleHidingSpotClick(hidingSpot) {
    if (this._isGameOver()) {
      return;
    }
    Relay.Store.update(
      new CheckHidingSpotForTreasureMutation({
        game: this.props.game,
        hidingSpot,
      })
    );
  }
  _hasFoundTreasure() {
    return (
      this.props.game.hidingSpots.edges.some(edge => edge.node.hasTreasure)
    );
  }
  _isGameOver() {
    return !this.props.game.turnsRemaining || this._hasFoundTreasure();
  }
  renderGameBoard() {
    return this.props.game.hidingSpots.edges.map(edge => {
      return (
        <div
          onClick={this._handleHidingSpotClick.bind(this, edge.node)}
          style={this._getHidingSpotStyle(edge.node)}
        />
      );
    });
  }
  render() {
    var headerText;
    if (this.props.relay.getPendingTransactions(this.props.game)) {
      headerText = '\\u2026';
    } else if (this._hasFoundTreasure()) {
      headerText = 'You win!';
    } else if (this._isGameOver()) {
      headerText = 'Game over!';
    } else {
      headerText = 'Find the treasure!';
    }
    return (
      <div>
        <h1>{headerText}</h1>
        {this.renderGameBoard()}
        <p>Turns remaining: {this.props.game.turnsRemaining}</p>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    game: () => Relay.QL\`
      fragment on Game {
        turnsRemaining,
        hidingSpots(first: 9) {
          edges {
            node {
              hasBeenChecked,
              hasTreasure,
              id,
              \${CheckHidingSpotForTreasureMutation.getFragment('hidingSpot')},
            }
          }
        },
        \${CheckHidingSpotForTreasureMutation.getFragment('game')},
      }
    \`,
  },
});
\`\`\`

A working copy of the treasure hunt can be found in the \`./examples/\` directory.

Now that we've gone end-to-end with Relay, let's dive into more detail in the guides section.
`
var Post = React.createClass({
  statics: {
    content: content
  },
  render: function() {
    return <Layout metadata={{"id":"tutorial","title":"Tutorial","layout":"docs","category":"Quick Start","permalink":"docs/tutorial.html","next":"videos","math":"mathjax","source":"QuickStart-Tutorial.md"}}>{content}</Layout>;
  }
});
module.exports = Post;
