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

import {Socket} from './socket.js';


export class NodeFactory {

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static createOutputs(rows,nodeid) {
    let element;
  }

  /**
   * Create Content in Node's body
   *
   * @author Jean-Christophe Taveau
   */
  static createContent(rows,parent,id, metadata) {
    let nodeid = id;
    let outputs = 0;
    let inputs = 0;
    rows.forEach( (row,index) => {
      if (row.layer !== undefined) {
        let container = document.createElement('div');
        container.className = 'layer';
        container.id = `layer_${index}`;
        NodeFactory.createRows(row.properties,container,nodeid);
        parent.appendChild(container);
        container.style.display = (index === 0) ? 'block': 'none';
      }
      else {
        let container = NodeFactory.createRow(row,nodeid,metadata[row.name]);

        if (row.output !== undefined) {
          container.id = `o_${outputs++}`;
          container.classList.add('output');
        }
        else if (row.input !== undefined) {
          container.id = `i_${inputs++}`;
          container.classList.add('input');
        }

        parent.appendChild(container);
      }
    });
  }

  static createRows(rows,parent,id) {
    let nodeid = id;
    let outputs = 0;
    let inputs = 0;
    rows.forEach( row => {
      let container = NodeFactory.createRow(row,nodeid);
      if (row.output !== undefined) {
        container.id = `o_${outputs++}`;
        // container.classList.add('output');
      }
      else if (row.input !== undefined) {
        container.id = `i_${inputs++}`;
        // container.classList.add('input');
      }
      parent.appendChild(container);
    });
  }


  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static createRow(row,node_id, metadata) {
    // Extract widget type
    let cells = Object.keys(row).filter( prop => ['name','source','zip'].indexOf(prop) === -1);
    let numcolumns = cells.filter( type => ['collapsible','input','output','source','name','zip'].indexOf(type) === -1).length;
    let container = document.createElement('div');
    container.className = `row-${numcolumns}`;

    cells.forEach( type => {
      console.log(type,row);
      let widget = NodeFactory.createWidget(type,row,node_id,metadata);
      console.log(widget);
      container.appendChild(widget);
    });

    console.log(container);
    return container;
  }

  static createWidget(type,row,id,value) {
    let element;
    switch (type) {
      case 'button': element = NodeFactory.button(row,id,value); break;
      case 'canvas': element = NodeFactory.canvas(row,id,value); break;
      case 'checkbox': element = NodeFactory.checkbox(row,id,value); break;
      case 'collapsible': element = NodeFactory.collapsible(row,id,value); break;
      case 'file': element = NodeFactory.file(row,id,value); break;
      case 'flowcontrols': element = NodeFactory.flowcontrols(row,id,value); break;
      case 'input': element = NodeFactory.input_socket(row,id,value); break;
      case 'label': element = NodeFactory.label(row,id,value); break;
      case 'numerical': element = NodeFactory.numerical(row,id,value); break;
      case 'readonly': element = NodeFactory.readonly(row,id,value); break;
      case 'selectlayer': element = NodeFactory.selectlayer(row,id,value); break;
      case 'select': element = NodeFactory.select(row,id,value); break;
      case 'output': element = NodeFactory.output_socket(row,id,value); break;
      case 'text': element = NodeFactory.text(row,id,value); break;
      default: 
        alert(`Unknown widget ${type}`);
    }
    return element;
  }
  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static button(row,id,value) {
    // Create Label
    let container = document.createElement('div');
    container.className = 'flex-cell';
    let e = NodeFactory._button(row,id,value);
    container.appendChild(e);
    return container;
  }

  static _button(row,id,value) {
    let e = document.createElement('a');
    e.id = `${row.name || 'unknown'}__AT__${id}`;
    e.className = 'button';
    e.setAttribute('href','#');
    e.innerHTML = row.button;
    return e;
  }
  
  
  
  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static canvas(row,id,value) {
    // <div class="graphics"><canvas></canvas></div>
    // Check if canvas is already created TODO
    let container = document.createElement('div');
    container.className = 'graphics';
    container.appendChild(document.createElement('canvas'));
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static checkbox(row,id,value) {
   let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.id = `${row.name || 'unknown'}__AT__${id}`;
    input.className = "check";
    input.setAttribute("type", "checkbox");
    input.setAttribute('name',row.name || 'unknown');
    input.setAttribute('value',value || row.checkbox);
    input.checked = row.checkbox;
    container.appendChild(input);

    // TODO Add event onchanged
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static collapsible(row,id,value) {
    let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.id = `collapsible_${id}`;
    input.className = "toggle";
    input.setAttribute("type", "checkbox");
    input.setAttribute('name',row.name || 'unknown');
    input.checked = false;
    container.appendChild(input);
    
    // Create Label
    let label = document.createElement('label');
    label.className = 'lbl-toggle';
    label.setAttribute('for',`collapsible_${id}`);
    label.innerHTML = row.collapsible.label;
    container.appendChild(label);

    let content = document.createElement('div');
    content.className = 'collapsible-content';
    container.appendChild(content);
    row.collapsible.section.forEach( section_row => {
      let widgets_row = NodeFactory.createRow(section_row,id,value);
      content.appendChild(widgets_row);
    });

    return container;
  /*

  <label for="collapsible" class="lbl-toggle">Advanced</label>
  <input class="collapsible toggle" type="checkbox">
  <div class="collapsible-content">

  </div>
  */
  } 
  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static file(row,id,value) {
    // Create File Widget
   let container = document.createElement('div');
    container.className = 'flex-cell';
    // From MDN
    // https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications
    let inp = document.createElement('input');
    inp.id = `${row.name || 'unknown'}__AT__${id}`;
    inp.className = "visually-hidden";
    inp.setAttribute("type", "file");
    
    inp.addEventListener("change", (event) => {
      let files = event.target.files;
      let root = NodeFactory.getNodeElement(event.target);
      root.dataset.file = files[0].name;
      // Preview
      let c = document.querySelector(`#node_${id} canvas`);
      let ctx = c.getContext("2d");
      ctx.beginPath();
      ctx.arc(100, 75, 50, 0, 2 * Math.PI);
      ctx.stroke(); 
    });
    // <input type="file" id="fileElem" multiple accept="image/*" class="visually-hidden">
    let e = document.createElement('label');
    e.className = 'button';
    e.setAttribute('for',inp.id);
    e.innerHTML = row.file;
    container.appendChild(inp);
    container.appendChild(e);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static flowcontrols(row,id,value) {
    let buttons = row.flowcontrols;
    let container = document.createElement('div');
    container.className = 'flex-cell';
    let controls = document.createElement('div');
    controls.className = 'flowcontrols';
    container.appendChild(controls);
    [...buttons].forEach ( (b,index) => {
      let button = NodeFactory._button(row,id,value);
      button.id = `${b || 'unknown'}__AT__${id}`;
      button.classList.add("square");
      button.classList.add(b);
      button.innerHTML = `<i class="fa fa-${b}"></i>`;
      controls.appendChild(button);
    });

    return container;
  }

  /*
   * Create an input socket
   *
   * @author Jean-Christophe Taveau
   */
  static input_socket(row,id,value) {

    // Create Input Socket
    let container = document.createElement('div');
    container.className = 'input';
    let socket = new Socket(id,'input');
    container.appendChild(socket.button);
    return container;
  }
  
  
  /*
   * 
   * @author Jean-Christophe Taveau
   */
  static label(row,id,value) {
    let container = document.createElement('div');
    container.className = 'flex-cell';
    let e = document.createElement('label');
    e.innerHTML = row.label;
    if (row.output === undefined && row.input === undefined) {
      e.innerHTML += '&nbsp;';
    }
    else {
      // e.title = metadata.input || metadata.output;
    }
    container.appendChild(e);
    return container;
  }

  
  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static numerical(row,id,value) {

    // Create Numerical
   let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.id = `${row.name || 'unknown'}__AT__${id}`;
    input.className = "numerical";
    input.setAttribute("type", "text");
    input.setAttribute('name',row.name || 'unknown');
    input.setAttribute('minlength',4);
    input.setAttribute('maxlength',40);
    // input.setAttribute('size',10);
    input.setAttribute('value',value || row.numerical);
    input.addEventListener('input',(event)=> {
      let value = event.srcElement.value;
      event.srcElement.value = /^\d*\.?\d*$/.test(event.srcElement.value) ? value : value.slice(0,-1);
      return false;
    });
    input.addEventListener('blur',(event) => console.info(`Add the ${event.srcElement.value} in queue`));
    container.appendChild(input);
    // TODO Add event onchanged
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static readonly(row,id,value) {
   let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.className = "readonly";
    input.readOnly = true;
    input.setAttribute("type", "text");
    input.setAttribute('name',row.name || 'unknown');
    input.setAttribute('minlength',4);
    input.setAttribute('maxlength',40);
    // input.setAttribute('size',10);
    input.setAttribute('value',value || row.readonly);

    container.appendChild(input);
    // TODO Add event onchanged
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static select(row,id,value) {
    let container = document.createElement('div');
    container.className = "flex-cell select-container";
    let select = document.createElement('select');
    let options = row.select.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
    select.innerHTML = options;
    container.appendChild(select);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static selectlayer(row,id,value) {
    let container = document.createElement('div');
    container.className = "flex-cell select-container";
    let select = document.createElement('select');
    select.id = `selectlayer_${id}`;
    let options = row.selectlayer.reduce( (html,item,index) => html + `<option value="${index}">${item}</option>`,'');
    select.innerHTML = options;
    select.addEventListener("change",displayLayer);
    
    container.appendChild(select);
    return container;
  }

  /**
   * 
   * @author Jean-Christophe Taveau
   */
  static text(row,id,value) {
   let container = document.createElement('div');
    container.className = 'flex-cell';

    let input = document.createElement('input');
    input.className = "numerical";
    input.setAttribute("type", "text");
    input.setAttribute('name',row.name || 'unknown');
    input.setAttribute('minlength',4);
    input.setAttribute('maxlength',40);
    //input.setAttribute('size',10);
    input.setAttribute('value',value || row.text);
    
    // Create a `dummy` div to compute width
    /*
    let div = document.querySelector('#input-helper');
    if (!div) {
      div = document.createElement("div");
      div.id = "input-helper";
      document.body.appendChild(div);
    }

    input.addEventListener("keyup", () => {
        div.textContent = event.target.value;
        console.info('keypup',event.target.value);
        input.style.width = div.offsetWidth + 15 + "px";
    });
    */
    /* 
     CSS
     
      overflow: hidden;
      text-overflow: ellipsis;
      
      input,
      #input-helper {
          display: inline;
          font-size: 14px;
          font-family: serif;
          line-height: 16px;
      }

      #input-helper {
          position: absolute;
          top: -10000px;
      }
     */

    container.appendChild(input);
    // TODO Add event onchanged
    return container;
  }



  /*
   * Create an output socket
   * 
   * @author Jean-Christophe Taveau
   */
  static output_socket(row,id,value) {

    // Create Output Socket
    let container = document.createElement('div');
    container.className = 'output';
    let socket = new Socket(id,'output');
    container.appendChild(socket.button);

    return container;
  }

  static getNodeElement(child) {
    let el = child;
    while (el.tagName !== 'SECTION' && el.tagName !== 'BODY') {
      el = el.parentNode;
    }
    return el;
  }
} // End of class NodeFactory



