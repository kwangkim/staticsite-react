/**
 * @generated
 */
var React = require("React");
var Layout = require("DocsLayout");
var content = `
## React.js Conf
\\\\(x^2\\\\) $$\\frac{x}{y}$$
<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/9sc8Pyc51uU?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>


<a href="#update-static-method">
Initiate processing of a mutation.
</a>



## React Europe

<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/IrgHurBjQbg?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
`
var Post = React.createClass({
  statics: {
    content: content
  },
  render: function() {
    return <Layout metadata={{"id":"videos","title":"Videos","layout":"docs","category":"Quick Start","permalink":"docs/videos.html","next":"guides-containers","math":"mathjax","source":"QuickStart-Videos.md"}}>{content}</Layout>;
  }
});
module.exports = Post;
