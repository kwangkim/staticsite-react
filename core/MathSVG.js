/**
 *
 * @providesModule MathSVG
 * 
 */
var React = require('React');
//var mjAPI = require("MathJax-node/lib/mj-single");
/*
var mjconfig={
    MathJax: {
        SVG: {
            font: "STIX-Web"
        },
        tex2jax: {
            preview: ["[math]"],
            processEscapes: true,
            processClass: ['math'],
            inlineMath: [ ['$','$'], ["\\(","\\)"] ],
            displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
            skipTags: ["script","noscript","style","textarea","pre","code"]
        },
        TeX: {
            noUndefined: {disabled: true},
            Macros: {
              mbox: ['{\\text{#1}}',1],
              mb: ['{\\mathbf{#1}}',1],
              mc: ['{\\mathcal{#1}}',1],
              mi: ['{\\mathit{#1}}',1],
              mr: ['{\\mathrm{#1}}',1],
              ms: ['{\\mathsf{#1}}',1],
              mt: ['{\\mathtt{#1}}',1]
            }
        }
    }
};
mjAPI.config(mjconfig);
*/
//https://facebook.github.io/react/tips/initial-ajax.html
//https://gist.github.com/pkra/0afe895183c32eb8477c
//https://github.com/tiarno/mathjax-server/blob/master/index.js

//https://viereck.ch/latex-to-svg/  It contains main idea.

var Mathjax=require('mathjax');
var LatexSVG=function(){
  
/*
  var glyphs = document.getElementById('MathJax_SVG_glyphs');
 	var span = document.getElementById(equation.root.inputID+'-Frame');
	var svg = span.firstChild;
	var svgString = '<' + '?xml version="1.0" encoding="UTF-8" standalone="no" ?' + '>\n';
	svgString += '<svg xmlns="http://www.w3.org/2000/svg"';
	for (var i = 0; i < svg.attributes.length; i++) svgString += ' ' + svg.attributes[i].name + '="' + svg.attributes[i].value + '"';
	svgString += '>\n';
	svgString += glyphs.outerHTML;
	svgString += '\n';
	svgString += svg.innerHTML;
	svgString += '\n</svg>';
*/
}

var MathSVG=React.createClass({  
  getInitialState: function(){
      return {
          content: this.props.children
      };
  },    
  /*
  componentDidMount: function() {
    console.log("\n content="+this.state.content+'\n');
    mjAPI.start();
    var start = Date.now(); 
    mjAPI.typeset({
      math: this.state.content,
      format: "TeX", // "inline-TeX", "MathML"
      svg: true
    }, function(data) {
        if (!data.errors) {
          if (this.isMounted()) {
            this.setStates({
               content:data.svg 
            });   
            console.log(Date.now() - start);
          }
          console.log("\n \n svg="+this.state.content+'\n');
        }
    }.bind(this));      
  },
  */
  render: function() {
    
    var content=this.state.content;
    var createMarkup= function() { return {__html : '<span>'+content+'</span>'}; };  
    console.log("MathSVG: content="+content+'\n');
    return <div dangerouslySetInnerHTML={createMarkup()}/>;
    //return <div>{this.state.content}</div>;
  }

/*
module.exports = MathSVG;
*/