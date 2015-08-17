/**
 * @providesModule DocsLayout
*/
var React = require('React');
var Site = require('Site');
var Marked= require('Marked');
var Katex=require('Katex');
var DocsSidebar = require('DocsSidebar');
var DocsLayout = React.createClass({
  render: function() {
    var metadata = this.props.metadata;
    var content = this.props.children;
    return (
      <Site section="docs" math={metadata.math}>
        <section className="content wrap documentationContent">
          <DocsSidebar metadata={metadata} />
          <div className="inner-content">
            <a id="content"/>
            <h1>{metadata.title}</h1>
            <Katex md={true}>x^2+2x+1</Katex>
            <Marked>{content}</Marked>
            <div className="docs-prevnext">
              {metadata.previous && <a className="docs-prev" href={metadata.previous + '.html#content'}>&larr; Prev</a>}
              {metadata.next && <a className="docs-next" href={metadata.next + '.html#content'}>Next &rarr;</a>}
            </div>
          </div>
        </section>
      </Site>
    );
  }
});
module.exports = DocsLayout;
