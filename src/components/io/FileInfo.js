/* Adapted from ImageJ FileInfo Java Class */

/** This class consists of public fields that describe an image file. */
export class FileInfo {

  /** 8-bit unsigned integer (0-255). */
  static get GRAY8() {
    return 0;
  }
  
  /**  16-bit signed integer (-32768-32767). Imported signed images
    are converted to unsigned by adding 32768. */
  static get GRAY16_SIGNED() {
    return 1;
  }
  
  /** 16-bit unsigned integer (0-65535). */
  static get GRAY16_UNSIGNED() {
    return 2;
  }
  
  /**  32-bit signed integer. Imported 32-bit integer images are
    converted to floating-point. */
  static get GRAY32_INT() {
    return 3;
  }
  
  /** 32-bit floating-point. */
  static get GRAY32_FLOAT() {
    return 4;
  }
  
  /** 8-bit unsigned integer with color lookup table. */
  static get COLOR8() {
    return 5;
  }
  
  /** 24-bit interleaved RGB. Import/export only. */
  static get RGB() {
    return 6;
  }
  
  /** 24-bit planer RGB. Import only. */
  static get RGB_PLANAR() {
    return 7;
  }
  
  /** 1-bit black and white. Import only. */
  static get BITMAP() {
    return 8;
  }
  
  /** 32-bit interleaved ARGB. Import only. */
  static get ARGB() {
    return 9;
  }
  
  /** 24-bit interleaved BGR. Import only. */
  static get BGR() {
    return 10;
  }
  
  /**  32-bit unsigned integer. Imported 32-bit integer images are
    converted to floating-point. */
  static get GRAY32_UNSIGNED() {
    return 11;
  }
  
  /** 48-bit interleaved RGB. */
  static get RGB48() {
    return 12;
  }

  /** 12-bit unsigned integer (0-4095). Import only. */
  static get GRAY12_UNSIGNED() {
    return 13;
  }

  /** 24-bit unsigned integer. Import only. */
  static get GRAY24_UNSIGNED() {
    return 14;
  }

  /** 32-bit interleaved BARG (MCID). Import only. */
  static get BARG() {
    return 15;
  }

  /** 64-bit floating-point. Import only.*/
  static get GRAY64_FLOAT() {
    return 16;
  }

  /** 48-bit planar RGB. Import only. */
  static get RGB48_PLANAR() {
    return 17;
  }

  /** 32-bit interleaved ABGR. Import only. */
  static get ABGR() {
    return 18;
  }

  /** 32-bit interleaved CMYK. Import only. */
  static get CMYK() {
    return 19;
  }

  // File formats
  static get UNKNOWN() {
    return 0;
  }
  
  static get RAW() {
    return 1;
  }
  
  static get TIFF() {
    return 2;
  }
  
  static get GIF_OR_JPG() {
    return 3;
  }
  
  static get FITS() {
    return 4;
  }
  
  static get BMP() {
    return 5;
  }
  
  static get DICOM() {
    return 6;
  }
  
  static get ZIP_ARCHIVE() {
    return 7;
  }
  
  static get PGM() {
    return 8;
  }
  
  static get IMAGEIO() {
    return 9;
  }
  
  // Compression modes
  static get COMPRESSION_UNKNOWN() {
    return 0;
  }
  
  static get COMPRESSION_NONE() {
    return 1;
  }
  
  static get LZW() {
    return 2;
  }
  
  static get LZW_WITH_DIFFERENCING() {
    return 3;
  }
  
  static get JPEG() {
    return 4;
  }
  
  static get PACK_BITS() {
    return 5;
  }
  
  static get ZIP() {
    return 6;
  }
  
    
  /** 
   * @constructor
   * Creates a FileInfo object with all of its fields set to their default value. 
   */
  constructor() {

    /* File format (TIFF, GIF_OR_JPG, BMP, etc.). Used by the File/Revert command */
    this.fileFormat = FileInfo.UNKNOWN;
  
    /* File type (GRAY8, GRAY_16_UNSIGNED, RGB, etc.) */
    this.fileType = FileInfo.GRAY8;  
    this.fileName = "Untitled";
    this.directory = '';
    this.url = '';
    this.width;
    this.height;
    this.offset = 0;  // Use getOffset() to read
    this.nImages = 1;
    this.gapBetweenImages; // Use getGap() to read
    this.whiteIsZero;
    this.intelByteOrder;
    this.compression = FileInfo.COMPRESSION_NONE;
    this.stripOffsets = []; // int[]
    this.stripLengths = []; // int[]
    this.rowsPerStrip;
    this.lutSize;
    this.reds = []; // byte[]
    this.greens = []; // byte[]
    this.blues = []; // byte[]
    this.pixels;
    this.debugInfo;
    this.sliceLabels = []; // String[]
    this.info;
    this.inputStream; // InputStream 
    this.virtualStack; // VirtualStack 
    this.sliceNumber; // used by FileInfoVirtualStack
  
    this.pixelWidth=1.0;
    this.pixelHeight=1.0;
    this.pixelDepth=1.0;
    this.unit;
    this.calibrationFunction;
    this.coefficients = []; // double[]
    this.valueUnit;
    this.frameInterval;
    this.description;
    // Use <i>longOffset</i> instead of <i>offset</i> when offset>2147483647.
    this.longOffset;  // Use getOffset() to read
    // Use <i>longGap</i> instead of <i>gapBetweenImages</i> when gap>2147483647.
    this.longGap;  // Use getGap() to read
    
    // Extra metadata to be stored in the TIFF header
    this.metaDataTypes; // int[]  - must be < 0xffffff
    this.metaData; // byte[][] 
    this.displayRanges; // double[] 
    this.channelLuts; // byte[][] 
    this.plot;      // byte[]  serialized plot
    this.roi;      // byte[] serialized roi
    this.overlay;  // byte[][] serialized overlay objects
    this.samplesPerPixel = 1;
    this.openNextDir;
    this.openNextName;
  }

  /* private */
  getType() {
    const descriptions = [
      "byte","short", "ushort", "int", "uint", "float", 
      "byte(lut)", "RGB", "RGB(p)", "RGB48", "bitmap",
      "ARGB","ABGR","BGR","BARG","CMYK","double","RGB48(p)"
    ];
    return descriptions[this.fileType] || '';

  }


} // End of class FileInfo

