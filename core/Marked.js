/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 *
 * @providesModule Marked 
 * 
 * KWANG
 * Not working  : this.props.html===true for html code
 * Not working : this.props.options for marked setOptions
 * There is 'key' issues for child in React! 
*/
var React = require('react');
var Marked = React.createClass({
  render: function() {
    var props=this.props.options; 
    if (typeof this.props.html!='undefined' && this.props.html === true ){
      var Markedhtml = require('Markedhtml');
      return <Markedhtml {...props}>{ this.props.children }</Markedhtml>;
    } else{
      var Markedreact = require('Markedreact');
      return <Markedreact {...props}>{ this.props.children }</Markedreact>;
    }
    
  }
});
module.exports = Marked;