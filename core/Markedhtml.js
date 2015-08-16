/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 *
 * @providesModule Markedhtml
 * 
 * KWANG
 * 
 *  this.props for marked setOptions
 * There is 'key' issues for child in React! 
*/
var React = require('react');
var Prism = require('Prism');
var marked =require('marked');
var renderer=new marked.Renderer();
renderer.heading = function (text, level) {
  return <Prism line={this.token.line}>{this.token.text}</Prism>;
};
marked.setOptions({
  renderer: renderer()
});
/*KWANG :html support
It is very hard to add with safety. I need to umplement sanitizer very well.
*/
var Markedhtml= React.createClass({
  
  render: function() {
    console.log("Markedhtml:"+this.props);
    var content= marked(this.props.children,this.props);
    var createMarkup= function () { 
        return {__html: content };
    }
    return <div dangerouslySetInnerHTML={createMarkup()}/>;
    
  }
});
module.exports = Markedhtml;

