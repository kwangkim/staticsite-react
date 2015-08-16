/**
 * @providesModule DocsLayout
*/
var React = require('React');
var Site = require('Site');
var Marked= require('Marked');
var DocsSidebar = require('DocsSidebar');
var DocsLayout = React.createClass({
  render: function() {
    var metadata = this.props.metadata;
    var content = this.props.children;
    var latex=`
<svg xmlns:xlink="http://www.w3.org/1999/xlink" style="vertical-align: -0.167ex; margin-left: 0ex; margin-right: 0ex; margin-bottom: 1px; margin-top: 1px;" width="2.333ex" height="2.167ex" viewBox="0 -904.8 1034.1 939.8" xmlns="http://www.w3.org/2000/svg">
<defs>
<path stroke-width="10" id="E1-MJMATHI-78" d="M52 289Q59 331 106 386T222 442Q257 442 286 424T329 379Q371 442 430 442Q467 442 494 420T522 361Q522 332 508 314T481 292T458 288Q439 288 427 299T415 328Q415 374 465 391Q454 404 425 404Q412 404 406 402Q368 386 350 336Q290 115 290 78Q290 50 306 38T341 26Q378 26 414 59T463 140Q466 150 469 151T485 153H489Q504 153 504 145Q504 144 502 134Q486 77 440 33T333 -11Q263 -11 227 52Q186 -10 133 -10H127Q78 -10 57 16T35 71Q35 103 54 123T99 143Q142 143 142 101Q142 81 130 66T107 46T94 41L91 40Q91 39 97 36T113 29T132 26Q168 26 194 71Q203 87 217 139T245 247T261 313Q266 340 266 352Q266 380 251 392T217 404Q177 404 142 372T93 290Q91 281 88 280T72 278H58Q52 284 52 289Z"></path>
<path stroke-width="10" id="E1-MJMAIN-32" d="M109 429Q82 429 66 447T50 491Q50 562 103 614T235 666Q326 666 387 610T449 465Q449 422 429 383T381 315T301 241Q265 210 201 149L142 93L218 92Q375 92 385 97Q392 99 409 186V189H449V186Q448 183 436 95T421 3V0H50V19V31Q50 38 56 46T86 81Q115 113 136 137Q145 147 170 174T204 211T233 244T261 278T284 308T305 340T320 369T333 401T340 431T343 464Q343 527 309 573T212 619Q179 619 154 602T119 569T109 550Q109 549 114 549Q132 549 151 535T170 489Q170 464 154 447T109 429Z"></path>
</defs>
<g stroke="currentColor" fill="currentColor" stroke-width="0" transform="matrix(1 0 0 -1 0 0)">
 <use xlink:href="#E1-MJMATHI-78" x="0" y="0"></use>
 <use transform="scale(0.707)" xlink:href="#E1-MJMAIN-32" x="816" y="583"></use>
</g>
</svg>
    `;
    return (
      <Site section="docs" math={metadata.math}>
        <section className="content wrap documentationContent">
          <DocsSidebar metadata={metadata} />
          <div className="inner-content">
            <a id="content"/>
            <h1>{metadata.title}</h1>
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
