/**
 * For math rendered using KaTex and/or MathJax. Use me like <TeX>2x + 3</TeX>.
 *
 * 
 * 
 * @providesModule Katexclient
 * 
 */
// TODO(joel) - require MathJax / katex so they don't have to be global
// Kwang Turn off katexA11y

//Check https://github.com/iamdanfox/react-katex/blob/gh-pages/Katex.cjsx
var React = require('react');
var katex= require('katex'); //KWANG
// Make content only visible to screen readers.
var Katexclient = React.createClass({
    getDefaultProps: function() {
        return {
            // Called after math is rendered or re-rendered
            onRender: function() {},
            onClick: null
        };
    },
    render: function() {
        return <span
                style={this.props.style}
                onClick={this.props.onClick}>
            <span ref="katex" />
        </span>;
    },

    componentDidMount: function() {
        console.log("componentDidMount");
        var text = this.props.children;
        
        var onRender = this.props.onRender;
        var katexHolder = this.refs.katex.getDOMNode();
        katexHolder.removeAttribute("aria-hidden");

        try {
            katex.render(text, katexHolder);//Direct manipulation
            onRender();
            console.log("render!");
            return;
        } 
        catch (e) {
            if (e.__proto__ !== katex.ParseError.prototype) {
            /* jshint +W103 */
               throw e;
            }
        }
    },
    //I guess they used componentDidUpdate to keep same principle for patch.
    // initial: render->componentDidMount
    // Update:  render->componentDidUpdate
    componentDidUpdate: function(prevProps, prevState) { 
        var oldText = prevProps.children;
        var newText = this.props.children;
        var onRender = this.props.onRender;

        if (oldText !== newText) {
            var katexHolder = this.refs.katex.getDOMNode();
            katexHolder.removeAttribute("aria-hidden");

            try {
                katex.render(newText, katexHolder);
                onRender();
                return;
            } catch (e) {
                /* jshint -W103 */
                if (e.__proto__ !== katex.ParseError.prototype) {
                /* jshint +W103 */
                   throw e;
                }
            }
            this.emptyNode(this.refs.katex.getDOMNode());// Why? To make it clean?
        }
    },
    emptyNode: function(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
});
module.exports = Katexclient;
