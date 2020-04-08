/*
 *  TWIN: Tiny Web Image Nodes
 *  Copyright (C) 2019-2020  Jean-Christophe Taveau.
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

import {Draggable,dragStartNode,dragOverNode, dragEndNode,resizeStart,resizeMove, resizeEnd} from './draggable.js';
import {NodeFactory} from './nodeFactory.js';


export class Node extends Draggable {

  /**
   * @constructor
   */
  constructor(id,template,metadata) {
    super();
    this.id = id;
    this.template = template;
    this.element = document.createElement('section');

    this.hasLayers = template.properties.some( (p) => p.layer !== undefined);
    this.hasOutputs = template.properties.some( (p) => (p.layer !== undefined && p.layer.type === 'output') || p.output !== undefined);
    this.hasInputs  = template.properties.some( (p) => (p.layer !== undefined && p.layer.type === 'input')  || p.input !== undefined);

    this.createNode(template,id,metadata);
  }

  /*
   * Private
   * Create Node
   * @author Jean-Christophe Taveau
   */
  createNode(node,id,metadata) {

    // Main
    let nodeH = this.element;
    nodeH.id = 'node_'+id;
    nodeH.style.left = (metadata.pos) ? `${metadata.pos[0]}px`: `${Math.floor(Math.random() * 1000)}px`;
    nodeH.style.top  = (metadata.pos) ? `${metadata.pos[1]}px`: `${Math.floor(Math.random() * 600)}px`;

    // Head
    let head = this.createHeader(node,id,metadata);

    // Shrink
    let shrink = this.createShrinkArea(node,id,metadata);

    // Body
    let body = this.createBody(node,id,metadata);
    
    // Footer
    let foot = this.createFooter(node,id,metadata);

    // Append all the parts
    nodeH.appendChild(head);
    nodeH.appendChild(shrink);
    nodeH.appendChild(body);
    nodeH.appendChild(foot);

  }

  /*
   * Create Header
   *
   * @author Jean-Christophe Taveau
   */
  createHeader(node,id,metadata) {
  
    const shrinkExpand = (evt) => {
      console.log('SHRINK/EXPAND');

      // Hide body, footer
      let id = evt.target.parentNode.id.match(/\d+/)[0];
      let node = document.getElementById(`node_${id}`);
      console.log(evt.target.parentNode.id,id);
      console.log(node);
      node.classList.toggle('shrink');

      // Shrink mode is true
      TWIN.graph.updateEdges(node,node.classList.contains('shrink'));
      console.log(node);
      evt.preventDefault();
    }
    
    const openTools = (preview) => (event) => {
      console.log(event);
      console.log(NodeFactory.getNodeElement(event.target));
      
      let menu = document.querySelector('#hamburger');
      if (menu === null) {
        menu = document.createElement('div');
        menu.id = 'hamburger';
        document.body.appendChild(menu);
        menu.display = 'none';
      }
      menu.innerHTML = `<ul>
        <li>Help<span class="shortcut">H</span></li>
        <li>Inspect<span class="shortcut">I</span></li>
        ${preview ? '<li>Preview<span class="shortcut">V</span></li>' : ''} 
        <li>Close<span class="shortcut">X</span></li>
      </ul>`;
      menu.display = 'inline-block';
      menu.style.top = NodeFactory.getNodeElement(event.target).style.top; //`${event.clientX}px`;
      menu.style.right = NodeFactory.getNodeElement(event.target).style.left; // `${event.clientY}px`;
    }
    
    const button = (icon,title) => {
      let b = document.createElement('a');
      let i = document.createElement('i');
      i.className = `fa ${icon}`;
      i.ariaHidden = true;
      b.appendChild(i);
      b.href = '#';
      b.title = title;
      return b;
    }
    
    
    let nodeH = this.element;

    // Header
    let head = document.createElement('div'); head.className = 'header'; head.classList.add(node.class.replace('.','_').toLowerCase());
    let banner = document.createElement('p');
    banner.title = (node.help) ? node.help : "No Help";
    banner.dataset.nodeid = id;
    head.appendChild(banner);
    
    // Part I - Shrink/Expand Button
    let shrink = document.createElement('a');
    shrink.id = `expand_${id}`;
    shrink.href = '#';
    shrink.innerHTML = `<span class="expandB">&#9662;</span><span class="shrinkB">&#9656;</span>`;
    shrink.addEventListener('click', shrinkExpand);
    banner.appendChild(shrink);
    // Part II - Description
    banner.appendChild(document.createTextNode(node.description) );
    // Part III - Icons and Description
    let preview = node.preview ? button('fa-eye','Preview') : undefined;  //'<a title="Preview" href="#"><i class="fa fa-eye" aria-hidden="true"></i></a>' : '';
    let info = button('fa-info',"Information");
    let menu = button('fa-bars','Tools'); // fa-ellipsis-v
    menu.addEventListener( 'click', openTools(node.preview));
    // let desc =  node.description;
    let toolset = document.createElement('span');
    toolset.className = 'toolset';
    banner.appendChild(toolset);
    /*
    if (preview) {
      toolset.appendChild(preview); 
    }
    */
    // toolset.appendChild(info);
    toolset.appendChild(menu);
    
    // = `&nbsp;&nbsp;${desc} &nbsp;<span class="preview">${preview} ${info} ${close}</span>`;
        
    /*
      head.innerHTML = `
      <p title="${node.help ? node.help : "No Help"}" data-nodeid="${id}">
        <a href="#" id= onclick="shrinkExpand(event)">
          <span class="expandB">&#9662;</span>
          <span class="shrinkB">&#9656;</span>
        </a>
        
      </p>`;
    */
    
    this.draggable( head,dragStartNode,dragOverNode, dragEndNode);
    return head;
  }

  /*
   * Create Shrinkable View of node
   *
   * @author Jean-Christophe Taveau
   */
  createShrinkArea(node,id,metadata) {

    let shrink = document.createElement('div');
    shrink.className = 'shrinkdiv'; shrink.classList.add(node.class.replace('.','_').toLowerCase());
    shrink.innerHTML = (this.hasInputs) ? '<span class="in_socket"><i class="fa fa-chevron-circle-right"></i></span>': '';
    shrink.innerHTML += '<p>&nbsp;</p>';
    shrink.innerHTML += (this.hasOutputs) ? '<span class="out_socket"><i class="fa fa-chevron-circle-right"></i></span>' : '';
    return shrink;
  }


  /*
   * Create Body
   *
   * @author Jean-Christophe Taveau
   */
  createBody(node,id,metadata) {

    // Body
    let body = document.createElement('div');
    body.id = 'body_'+id;
    body.className = 'body';
    // Main content

    NodeFactory.createContent( node.properties,body,this.id, metadata);

    return body;
  }


  /*
   * Create the footer
   *
   * @author Jean-Christophe Taveau
   */
  createFooter(node,id,metadata) {
  
    const resizeStart = (event) => {
      event.preventDefault();
      console.log('EVENT',event.target.dataset.nodeid);
      let dragged = document.getElementById(`node_${event.target.dataset.nodeid}`);
      DRAG.width = dragged.getBoundingClientRect().width;
      DRAG.node = dragged;
      return dragged;
    }

    const resizeMove = (event) => {
      event.preventDefault();
      let dragged = DRAG.node;

      // Apply the inverse of transform matrix of `board`
      DRAG.node.style.width = DRAG.width + ((DRAG.BBox.x - TWIP.tx)/TWIP.zoom + DRAG.newDX/TWIP.zoom)  + 'px';
      DRAG.node.style.height  = ((DRAG.BBox.y - TWIP.ty)/TWIP.zoom + DRAG.newDY/TWIP.zoom)  + 'px';
    };

    const resizeEnd = (event) => {
      // Do nothing?
      event.preventDefault();
    };


    let foot = document.createElement('div');
    foot.className = 'footer';
    foot.innerHTML = `<span style="align:right;margin:2px">${node.class} #${node.id}</span>`;
    let link = document.createElement('a');
    foot.appendChild(link);
    link.dataset.nodeid = id;
    link.innerHTML = `
      <svg preserveAspectRatio="xMinYMin" viewBox="0 0 20 20">
        <circle cx="18" cy="6" r="2" stroke="none" fill="#777"/>
        <circle cx="12" cy="12" r="2" stroke="none" fill="#777"/>
        <circle cx="18" cy="12" r="2" stroke="none" fill="#777"/>
        <circle cx="6"  cy="18" r="2" stroke="none" fill="#777"/>
        <circle cx="12" cy="18" r="2" stroke="none" fill="#777"/>
        <circle cx="18" cy="18" r="2" stroke="none" fill="#777"/>
      </svg>`; 

    this.draggable( link,resizeStart,resizeMove, resizeEnd);
    return foot;
  }



} // End of class Node


