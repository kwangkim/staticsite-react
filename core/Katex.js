/**
 * For math rendered using KaTex and/or MathJax. Use me like <TeX>2x + 3</TeX>.
 *
 * 
 * 
 * @providesModule Katex
 * 
 */
// TODO(joel) - require MathJax / katex so they don't have to be global
// Kwang Turn off katexA11y

//Check https://github.com/iamdanfox/react-katex/blob/gh-pages/Katex.cjsx
var React = require('react');
var katex= require('katex'); //KWANG
// Make content only visible to screen readers.
var Katex = React.createClass({
    getDefaultProps: function() {
        return {
            // Called after math is rendered or re-rendered
            onClick: null,
            md: false,
        };
    },
    generateHtml: function(){ // https://github.com/talyssonoc/react-katex/blob/master/src/react-katex.jsx#L22-L25
        return katex.renderToString(this.props.tex || this.props.children, {
            displayMode: this.props.md
        });
    },
    render: function() {
        var html=this.generateHtml();
        return (
            <span style={this.props.style} onClick={this.props.onClick} dangerouslySetInnerHTML={{__html: html}}/>
        );
    }
});
module.exports = Katex;
