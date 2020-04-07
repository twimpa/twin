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

import {NodeFactory} from './nodeFactory.js';
import {Draggable,translStart,translOver,translEnd} from './draggable.js';
import {Graph} from './graph.js';
import {xmlns} from './common.js';


export class Board extends Draggable {

  /**
   * @constructor
   */
  constructor(parent,templates) {
    super();
    this.parent = parent;
    this.boardgame;
    this._templates = templates;
    this.graph = new Graph();
    this.zoom = 1.0;
    this.translate = {x:0,y:0};
    this.tx = 0;
    this.ty = 0;
    
  }
  
  set templates(nodeTemplates) {
    this._templates = nodeTemplates;
  }
  
  get templates() {
    return this._templates;
  }
  
  addEvents() {
    // Zoom Event with mouse wheel scroll
    window.addEventListener("wheel", event => {
      const delta = Math.sign(event.deltaY);
      TWIN.zoom += 0.05*(-delta);
      console.info(delta,this.zoom);
      document.querySelector('#board').style.transform = `
        translate(50%,50%) 
        scale(${TWIN.zoom}) 
        translate(${TWIN.translate.x}px,${TWIN.translate.y}px) 
        translate(-50%,-50%) 
      `;
      this.graph.updateAllEdges(document.querySelectorAll('section'));
      event.preventDefault();
    });
    console.log('RUN ',document.querySelector('#board'));
    // document.querySelector('#board').style.transform = `translate(50%,50%) scale(1) translate(-50%,-50%)`;
    this.draggable(document.querySelector('#board'),translStart,translOver,translEnd);
    this.boardgame.addEventListener('change', (ev) => {
      console.log('something changed');
      console.log(ev);
      console.log(NodeFactory.getNodeElement(ev.target));
      console.log(JSON.stringify(NodeFactory.getNodeElement(ev.target).dataset.file));
    });
    
  }
  
  /**
   * Load a graph defined as JSON
   *
   * @author Jean-Christophe Taveau
   */
  load(graph) {
    
     // Create Edges
    let svg = document.createElementNS(xmlns,'svg');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','100%');

    this.parent.prepend(svg);
    this.boardgame = document.createElement('div');
    this.boardgame.id = 'board';
    this.boardgame.className = 'board';
    this.parent.appendChild(this.boardgame);
    
    this.graph.setTemplates(this._templates);
    this.graph.setRootNode(this.boardgame);
    this.graph.setGraphicsContext(svg);
    
    // Create Nodes
    TWIN.graph = this.graph;
    this.graph.build(graph);
    this.graph.show();
    
    this.addEvents();
  }
  
  run() {
    // TODO
    console.log(this.graph);
  }
  
} // End of class Board

