/**
 * @providesModule Site
**/
var React = require('React');
var HeaderLinks = require('HeaderLinks');
var metatitle='Relay | A JavaScript framework for building data-driven React applications';
var title=metatitle;
var metaurl="http://facebook.github.io/relay/index.html";
var metadesc="A JavaScript framework for building data-driven React applications";
var path='/relay/';
var cssname='relay.css';
var footer='KWANG KIM';
var Mathhead = React.createClass({
  render: function(){
    // To avoid Adjacent JSX elements problem. https://github.com/facebook/react/issues/2127
    if(typeof this.props.math != 'undefined') {
      if(this.props.math==='katex'){
          return (
            <head>
              <meta charSet="utf-8" />
              <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
              <title>{title}</title>
              <meta name="viewport" content="width=device-width" />
              <meta property="og:title" content={metatitle} />
              <meta property="og:type" content="website" />
              <meta property="og:url" content={metaurl} />
              <meta property="og:description" content={metadesc} />
              <link rel="shortcut icon" href={path+"img/favicon.png"} />
              <link rel="stylesheet" href={path+"css/"+cssname} />
              <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min.css"/>
          </head>
          );        
      }
      if(this.props.math==='mathjax'){
          return (
          <head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <title>{title}</title>
            <meta name="viewport" content="width=device-width" />
            <meta property="og:title" content={metatitle} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={metaurl} />
            <meta property="og:description" content={metadesc} />
            <link rel="shortcut icon" href={path+"img/favicon.png"} />
            <link rel="stylesheet" href={path+"css/"+cssname} />
            <script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>  
          </head>
          );
      }
    }
    return (
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <title>{title}</title>
          <meta name="viewport" content="width=device-width" />
          <meta property="og:title" content={metatitle} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={metaurl} />
          <meta property="og:description" content={metadesc} />
          <link rel="shortcut icon" href={path+"img/favicon.png"} />
          <link rel="stylesheet" href={path+"css/"+cssname} />
        </head>
    ); 
  }
});
var Site = React.createClass({
  propTypes: {//KWANG
    section: React.PropTypes.string, 
    math: React.PropTypes.string,
  },
  render: function() {
    return (
      <html>
        <Mathhead math={this.props.math}/>         
        <body>
          <div className="container">
            <div className="nav-main">
              <div className="wrap">
                <a className="nav-home" href={path}>
                  <img className="nav-logo" src={path+"img/logo.svg"} width="50" height="50" />
                  Relay
                </a>
                <HeaderLinks section={this.props.section} />
              </div>
            </div>
            {this.props.children}
            <footer className="wrap">
              <div className="right">{footer}</div>
            </footer>
          </div>
          <div id="fb-root" />
        </body>
      </html>
    );
  }
});
module.exports = Site;
