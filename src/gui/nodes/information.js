/*
 *  TWIN: Tiny Web Image Processing Nodes
 *  Copyright (C) 2019-2020 Jean-Christophe Taveau.
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

/*
 * Get information of raster
 *
 */
class Information extends Node {
  constructor() {
    const infoGUI = {
      "id": 50,
      "class": "information",
      "name": "TWIN_INFO",
      "description": "Information",
      "help": "Basic information about the Raster",
      "properties": [
        {"label": "Width", "readonly": -1,"output": "value","name":"width"},
        {"label": "Height", "readonly": -1,"output": "value","name":"height"},
        {"label": "Depth", "readonly": -1,"output": "value","name":"depth"},
        {"label": "Bits/Pix", "readonly": -1,"output": "value","name":"bpp"},
        {"label": "Unit", "readonly": "px","output": "value","name":"unit"},
        {"label": "Pix.Size", "readonly": 1,"output": "value","name":"pixsize"},
        {"label": "Raster", "input": "raster"}
      ]
    };
    this.createGUI(infoGUI);
  }

  static async run(args) {
    args.width = args.input.width;
    args.height = args.input.height
    return args;
  };

} // End of class Information

