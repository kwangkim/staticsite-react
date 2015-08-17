/**
 * @generated
 */
var React = require("React");
var Layout = require("DocsLayout");
var content = `\\[x^2\\]

\\(x^7\\)

$$x^8$$
   **$$x^2$$** 
   
   \`$x\` is y and. \`$z\`
**x^10**
\`\`\`
$$x^2$$
\`\`\`
\\\\[x^3\\\\]
\\\\[x^4\\\\]
<div>
  <span id="1">x^4+2x</span>
</div>


\`\`\`javascript{2-3}
<div>
<img height=50 src="http://orem.alpineschools.org/wp-content/uploads/sites/37/2011/08/Math.jpg">
</div>
\`\`\`
*$$x*$$

`
var Post = React.createClass({
  statics: {
    content: content
  },
  render: function() {
    return <Layout metadata={{"id":"getting-started","title":"Getting Started","layout":"docs","category":"Quick Start","permalink":"docs/getting-started.html","next":"tutorial","math":"katex","source":"QuickStart-GettingStarted.md"}}>{content}</Layout>;
  }
});
module.exports = Post;
