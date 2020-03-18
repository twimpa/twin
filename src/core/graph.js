      const nodes = [
        {
          id: 0,
          type: 'load',
          x: 0,
          y: 0,
          inputs: {},
          outputs:{raster:1},
          args: {}
        },
        {
          id: 10,
          type: 'info',
          inputs: {raster: 0},
          outputs:{width: ['nRows@2','width@3','height@3']},
          args: {}
        },
        {
          id: 1,
          type: 'toStack',
          inputs: {raster: 0, nRows: 'width@10'},
          outputs:{stack: 2},
          args: {nRows: 180, nCols: 1, border: 0}
        },
        {
          id: 2,
          type: 'forEach',
          inputs: {stack:1},
          outputs:{image:3},
          args: {}
        },
        {
          id: 3,
          type: 'resize',
          inputs: {raster: 2, width: 'width@2',height: 'width@2'},
          outputs:{raster: 4},
          args: {width: 256, height: 256}
        },
        {
          id: 4,
          type: 'range',
          inputs: {},
          outputs:{array:5},
          args: {start: 0, end: -180, step: -1}
        },
        {
          id: 5,
          type: 'rotate',
          inputs: {raster: 3,angles: 'array@4'},
          outputs:{raster: 6},
          args: {
            angles:[
                0,  -1,  -2,  -3,  -4,  -5,  -6,  -7,  -8,  -9, 
              -10, -11, -12, -13, -14, -15, -16, -17, -18, -19, 
              -20, -21, -22, -23, -24, -25, -26, -27, -28, -29, 
              -30, -31, -32, -33, -34, -35, -36, -37, -38, -39, 
              -40, -41, -42, -43, -44, -45, -46, -47, -48, -49, 
              -50, -51, -52, -53, -54, -55, -56, -57, -58, -59, 
              -60, -61, -62, -63, -64, -65, -66, -67, -68, -69, 
              -70, -71, -72, -73, -74, -75, -76, -77, -78, -79, 
              -80, -81, -82, -83, -84, -85, -86, -87, -88, -89, 
              -90, -91, -92, -93, -94, -95, -96, -97, -98, -99, 
              -100, -101, -102, -103, -104, -105, -106, -107, -108, -109, 
              -110, -111, -112, -113, -114, -115, -116, -117, -118, -119, 
              -120, -121, -122, -123, -124, -125, -126, -127, -128, -129, 
              -130, -131, -132, -133, -134, -135, -136, -137, -138, -139, 
              -140, -141, -142, -143, -144, -145, -146, -147, -148, -149, 
              -150, -151, -152, -153, -154, -155, -156, -157, -158, -159, 
              -160, -161, -162, -163, -164, -165, -166, -167, -168, -169, 
              -170, -171, -172, -173, -174, -175, -176, -177, -178, -179],
            mode: 10
          }
        },
        {
          id: 6,
          type: 'saveInStack',
          inputs: {raster:5},
          outputs:{stack: 7}
        },
        {
          id: 7,
          type: 'zproject',
          inputs: {stack:6},
          outputs:{raster:8},
          args: {op: 'average'}
        },
        {
          id: 8,
          type: 'normalize',
          inputs: {raster: 7},
          outputs:{raster: 9},
          args: {roi:{cx: 0.5,cy: 0.5,radius:0.4}}
        },
        {
          id: 9,
          type: 'show',
          inputs: {raster:8},
          outputs:{},
          args: {}
        }
      ];
