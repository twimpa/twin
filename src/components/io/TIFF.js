export class TIFF {

  // tags
  static NEW_SUBFILE_TYPE = 254;
  static IMAGE_WIDTH = 256;
  static IMAGE_LENGTH = 257;
  static BITS_PER_SAMPLE = 258;
  static COMPRESSION = 259;
  static PHOTO_INTERP = 262;
  static IMAGE_DESCRIPTION = 270;
  static STRIP_OFFSETS = 273;
  static ORIENTATION = 274;
  static SAMPLES_PER_PIXEL = 277;
  static ROWS_PER_STRIP = 278;
  static STRIP_BYTE_COUNT = 279;
  static X_RESOLUTION = 282;
  static Y_RESOLUTION = 283;
  static PLANAR_CONFIGURATION = 284;
  static RESOLUTION_UNIT = 296;
  static SOFTWARE = 305;
  static DATE_TIME = 306;
  static ARTEST = 315;
  static HOST_COMPUTER = 316;
  static PREDICTOR = 317;
  static COLOR_MAP = 320;
  static TILE_WIDTH = 322;
  static SAMPLE_FORMAT = 339;
  static JPEG_TABLES = 347;
  static METAMORPH1 = 33628;
  static METAMORPH2 = 33629;
  static IPLAB = 34122;
  static NIH_IMAGE_HDR = 43314;
  static META_DATA_BYTE_COUNTS = 50838; // private tag registered with Adobe
  static META_DATA = 50839; // private tag registered with Adobe
  
  //constants
  static UNSIGNED = 1;
  static SIGNED = 2;
  static FLOATING_POINT = 3;

  //field types
  static SHORT = 3;
  static LONG = 4;

  // metadata types
  static MAGIC_NUMBER = 0x494a494a;  // "IJIJ"
  static INFO = 0x696e666f;  // "info" (Info image property)
  static LABELS = 0x6c61626c;  // "labl" (slice labels)
  static RANGES = 0x72616e67;  // "rang" (display ranges)
  static LUTS = 0x6c757473;    // "luts" (channel LUTs)
  static PLOT = 0x706c6f74;    // "plot" (serialized plot)
  static ROI = 0x726f6920;     // "roi " (ROI)
  static OVERLAY = 0x6f766572; // "over" (overlay)
  
  

} // End of class TIFF
