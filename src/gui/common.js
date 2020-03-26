/*
 *  TWIN: Tiny Web Image Nodes
 *  Copyright (C) 2019  Jean-Christophe Taveau.
 *
 *  This file is part of TWIN
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TWIN.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

'use strict';


export const xmlns = "http://www.w3.org/2000/svg";

/**
 * Return Numerical ID used by graph from node ID (in DOM)
 *
 * @author Jean-Christophe Taveau
 */
export const getID = (nodeid) => nodeid.match(/\d+/)[0];






/*
const TWIN = {
  version: "0.1",
  author: "Jean-Christophe Taveau",
  graph: new Graph(),
  zoom: 1.0,
  translate: {x:0,y:0},
  tx: 0,
  ty: 0,
  init: function() {
    console.log('INIT ',document.querySelector('#board'));
    document.querySelector('#board').style.transform = `translate(50%,50%) scale(1) translate(-50%,-50%)`;
    draggable(document.querySelector('#board'),translStart,translOver,translEnd);
  }
}
*/


/*
window.addEventListener("mousedown", event => {
    if (event.which === 2) {
      console.log('middle button');
      TWIN.translate.x +=1;
      TWIN.translate.y +=0.5;

      let mainTransform = document.querySelector('main').style.transform;
      let regex = /translate\([^\)]*\)/gi;
      if (regex.test(mainTransform) ) {
        document.querySelector('main').style.transform = mainTransform.replace(regex, `translate(${TWIN.translate.x}px,${TWIN.translate.y}px)`);
      }
      else {
        document.querySelector('main').style.transform += ` translate(${TWIN.translate.x}px,${TWIN.translate.y}px)`;
      }
      event.preventDefault();
    }

});
*/

