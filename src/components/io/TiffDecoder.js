/* Adapted from ImageJ TiffDecoder Java Class */

class RandomAccessStream {
  constructor(array_buffer) {
    this.offset = 0;
    this.buffer = array_buffer; // Uint8ClampedArray
  }
  
  getLongFilePointer() {
  
  }
  
  /**
   * @param {byte[]} bytes
   * @param {int} off
   * @param {int} len
   */
  read(bytes, off=0, len=1) {
  
  }
  
  readDouble() {
  
  }
  
  readFloat() {
  
  }
  
  readFloat() {
  
  }
  
  readInt() {
  
  }
  
  readShort() {
  
  }
  
  seek(offset) {
    this.offset += offset;
  }
} // End of class RandomAccessStream

/**
 * Decodes single and multi-image TIFF files. The LZW decompression
 * code was contributed by Curtis Rueden.
*/
export class TiffDecoder {

  /**
   * @constructor
   */
  constructor(array_buffer) {
    // this.name = name;
    this.url;
    this.in = new RandomAccessStream(array_buffer); // RandomAccessStream
    this.debugMode;
    this.littleEndian;
    this.dInfo;
    this.ifdCount;
    this.metaDataCounts;
    this.tiffMetadata;
    this.photoInterp;
  }

  /*
   * Open 8-byte Image File Header at start of file.
   * Returns the offset in bytes to the first IFD or -1
   * if this is not a valid tiff file.
   */
  openImageFileHeader() throws IOException {

    let byteOrder = this.in.readShort();
    if (byteOrder === 0x4949) {
      // "II" 
      this.littleEndian = true;
    }
    else if (byteOrder === 0x4d4d) {
      // "MM"
      this.littleEndian = false;
    }
    else {
      this.in.close();
      return -1;
    }
    let magicNumber = TiffUtil.getShort(); // 42
    let offset = (this.in.getInt())&0xffffffffL;
    return offset;
  }

  /*
   *
   */
  getValue(let fieldType, let count) throws IOException {
    let value = 0;
    let unused;
    if (fieldType == TIFF.SHORT && count==1) {
      value = TiffUtil.getShort();
      unused = TiffUtil.getShort();
    } else
      value = getInt();
    return value;
  }  
  
  /*
   *
   */
  getColorMap(long offset, FileInfo fi) throws IOException {
    byte[] colorTable16 = new byte[768*2];
    long saveLoc = this.in.getLongFilePointer();
    this.in.seek(offset);
    this.in.readFully(colorTable16);
    this.in.seek(saveLoc);
    fi.lutSize = 256;
    fi.reds = new byte[256];
    fi.greens = new byte[256];
    fi.blues = new byte[256];
    let j = 0;
    if (this.littleEndian) j++;
    let sum = 0;
    for (let i=0; i<256; i++) {
      fi.reds[i] = colorTable16[j];
      sum += fi.reds[i];
      fi.greens[i] = colorTable16[512+j];
      sum += fi.greens[i];
      fi.blues[i] = colorTable16[1024+j];
      sum += fi.blues[i];
      j += 2;
    }
    if (sum!=0 && fi.fileType==FileInfo.GRAY8)
      fi.fileType = FileInfo.COLOR8;
  }
  
  /*
   *
   */
   byte[] getString(let count, long offset) throws IOException {
    count--; // skip null byte at end of string
    if (count<=3)
      return null;
    byte[] bytes = new byte[count];
    long saveLoc = this.in.getLongFilePointer();
    this.in.seek(offset);
    this.in.readFully(bytes);
    this.in.seek(saveLoc);
    return bytes;
  }

  /** 
   * Save the image description in the specified FileInfo. ImageJ
   * saves spatial and density calibration data in this string. For
   * stacks, it also saves the number of images having to
   * decode an IFD for each image. 
   */
  saveImageDescription(byte[] description, FileInfo fi) {
    let id = new String(description);
    let createdByImageJ = id.startsWith("ImageJ");
    if (!createdByImageJ) {
      this.saveMetadata(getName(IMAGE_DESCRIPTION), id);
    }

    if (id.length < 7) return;
    fi.description = id;
    let index1 = id.indexOf("images=");
    if (index1>0 && createdByImageJ && id.charAt(7)!='\n') {
      let index2 = id.indexOf("\n", index1);
      if (index2>0) {
        let images = id.substring(index1+7,index2);
        let n = Tools.parseDouble(images, 0.0);
        if (n>1 && fi.compression === FileInfo.COMPRESSION_NONE) {
          fi.nImages = n;
        }
      }
    }
  }

  /*
   * @param {string} name
   * @param {string} data
   */
  saveMetadata(name, data) {
    if (data==null) {
      return;
    }
    String str = name+": "+data+"\n";
    if (this.tiffMetadata==null) {
      this.tiffMetadata = str;
    }
    else {
      this.tiffMetadata += str;
    }
  }

  /*
   *
   */
  decodeNIHImageHeader(let offset, FileInfo fi) throws IOException {
    long saveLoc = this.in.getLongFilePointer();
    
    this.in.seek(offset+12);
    let version = this.in.readShort();
    
    this.in.seek(offset+160);
    double scale = this.in.readDouble();
    if (version>106 && scale!=0.0) {
      fi.pixelWidth = 1.0/scale;
      fi.pixelHeight = fi.pixelWidth;
    } 

    // spatial calibration
    this.in.seek(offset+172);
    let units = this.in.readShort();
    if (version<=153) units += 5;
    switch (units) {
      case 5: fi.unit = "nanometer"; break;
      case 6: fi.unit = "micrometer"; break;
      case 7: fi.unit = "mm"; break;
      case 8: fi.unit = "cm"; break;
      case 9: fi.unit = "meter"; break;
      case 10: fi.unit = "km"; break;
      case 11: fi.unit = "inch"; break;
      case 12: fi.unit = "ft"; break;
      case 13: fi.unit = "mi"; break;
    }

    // density calibration
    this.in.seek(offset+182);
    let fitType = this.in.read();
    let unused = this.in.read();
    let nCoefficients = this.in.readShort();
    if (fitType==11) {
      fi.calibrationFunction = 21; //Calibration.UNCALIBRATED_OD
      fi.valueUnit = "U. OD";
    } else if (fitType>=0 && fitType<=8 && nCoefficients>=1 && nCoefficients<=5) {
      switch (fitType) {
        case TIFF.0: fi.calibrationFunction = 0; break; //Calibration.STRAIGHT_LINE
        case TIFF.1: fi.calibrationFunction = 1; break; //Calibration.POLY2
        case TIFF.2: fi.calibrationFunction = 2; break; //Calibration.POLY3
        case TIFF.3: fi.calibrationFunction = 3; break; //Calibration.POLY4
        case TIFF.5: fi.calibrationFunction = 4; break; //Calibration.EXPONENTIAL
        case TIFF.6: fi.calibrationFunction = 5; break; //Calibration.POWER
        case TIFF.7: fi.calibrationFunction = 6; break; //Calibration.LOG
        case TIFF.8: fi.calibrationFunction = 10; break; //Calibration.RODBARD2 (NIH Image)
      }
      fi.coefficients = new double[nCoefficients];
      for (let i=0; i<nCoefficients; i++) {
        fi.coefficients[i] = this.in.readDouble();
      }
      this.in.seek(offset+234);
      let size = this.in.read();
      StringBuffer sb = new StringBuffer();
      if (size>=1 && size<=16) {
        for (let i=0; i<size; i++)
          sb.append((char)(this.in.read()));
        fi.valueUnit = new String(sb);
      } else
        fi.valueUnit = " ";
    }
      
    this.in.seek(offset+260);
    let nImages = this.in.readShort();
    if (nImages>=2 && (fi.fileType==FileInfo.GRAY8||fi.fileType==FileInfo.COLOR8)) {
      fi.nImages = nImages;
      fi.pixelDepth = this.in.readFloat();  //SliceSpacing
      let skip = this.in.readShort();    //CurrentSlice
      fi.frameInterval = this.in.readFloat();
    }
      
    this.in.seek(offset+272);
    float aspectRatio = this.in.readFloat();
    if (version>140 && aspectRatio!=0.0)
      fi.pixelHeight = fi.pixelWidth/aspectRatio;
    
    this.in.seek(saveLoc);
  }

  /*
   * @param {int} tag
   * @param {int} count
   * @param {int} value
   * @param {FileInfo} fi
   */
  dumpTag( tag, count, value, fi) {
    long lvalue = ((long)value)&0xffffffffL;
    let name = getName(tag); // String
    let cs = (count==1)?"":", count=" + count; // String
    this.dInfo += "    " + tag + ", \"" + name + "\", value=" + lvalue + cs + "\n";
    //ij.IJ.log(tag + ", \"" + name + "\", value=" + value + cs + "\n");
  }

  /*
   *
   */
  getName(tag) {
    let name;
    switch (tag) {
      case TIFF.NEW_SUBFILE_TYPE: name="NewSubfileType"; break;
      case TIFF.IMAGE_WIDTH: name="ImageWidth"; break;
      case TIFF.IMAGE_LENGTH: name="ImageLength"; break;
      case TIFF.STRIP_OFFSETS: name="StripOffsets"; break;
      case TIFF.ORIENTATION: name="Orientation"; break;
      case TIFF.PHOTO_INTERP: name="PhotoInterp"; break;
      case TIFF.IMAGE_DESCRIPTION: name="ImageDescription"; break;
      case TIFF.BITS_PER_SAMPLE: name="BitsPerSample"; break;
      case TIFF.SAMPLES_PER_PIXEL: name="SamplesPerPixel"; break;
      case TIFF.ROWS_PER_STRIP: name="RowsPerStrip"; break;
      case TIFF.STRIP_BYTE_COUNT: name="StripByteCount"; break;
      case TIFF.X_RESOLUTION: name="XResolution"; break;
      case TIFF.Y_RESOLUTION: name="YResolution"; break;
      case TIFF.RESOLUTION_UNIT: name="ResolutionUnit"; break;
      case TIFF.SOFTWARE: name="Software"; break;
      case TIFF.DATE_TIME: name="DateTime"; break;
      case TIFF.ARTEST: name="Artest"; break;
      case TIFF.HOST_COMPUTER: name="HostComputer"; break;
      case TIFF.PLANAR_CONFIGURATION: name="PlanarConfiguration"; break;
      case TIFF.COMPRESSION: name="Compression"; break; 
      case TIFF.PREDICTOR: name="Predictor"; break; 
      case TIFF.COLOR_MAP: name="ColorMap"; break; 
      case TIFF.SAMPLE_FORMAT: name="SampleFormat"; break; 
      case TIFF.JPEG_TABLES: name="JPEGTables"; break; 
      case TIFF.NIH_IMAGE_HDR: name="NIHImageHeader"; break; 
      case TIFF.META_DATA_BYTE_COUNTS: name="MetaDataByteCounts"; break; 
      case TIFF.META_DATA: name="MetaData"; break; 
      default: name="???"; break;
    }
    return name;
  }

  /*
   * @returns {double}
   */
  getRational(long loc) throws IOException {
    long saveLoc = this.in.getLongFilePointer();
    this.in.seek(loc);
    let numerator = TiffUtil.getUnsignedInt();
    let denominator = TiffUtil.getUnsignedInt();
    this.in.seek(saveLoc);
    if (denominator!=0.0)
      return numerator/denominator;
    else
      return 0.0;
  }

  /*
   * @returns {FileInfo}
   */
   openIFD() throws IOException {
  // Get Image File Directory data
    let tag, fieldType, count, value;
    let nEntries = TiffUtil.TiffUtil.getShort();
    if (nEntries<1 || nEntries>1000)
      return null;
    ifdCount++;
    if ((ifdCount%50)==0 && ifdCount>0)
      ij.IJ.showStatus("Opening IFDs: "+ifdCount);
    FileInfo fi = new FileInfo();
    fi.fileType = FileInfo.BITMAP;  //BitsPerSample defaults to 1
    for (let i=0; i<nEntries; i++) {
      tag = getShort();
      fieldType = TiffUtil.getShort();
      count = TiffUtil.getInt();
      value = TiffUtil.getValue(fieldType, count);
      long lvalue = ((long)value)&0xffffffffL;
      if (debugMode && ifdCount<10) dumpTag(tag, count, value, fi);
      switch (tag) {
        case TIFF.IMAGE_WIDTH: 
          fi.width = value;
          fi.intelByteOrder = this.littleEndian;
          break;
        case TIFF.IMAGE_LENGTH: 
          fi.height = value;
          break;
         case TIFF.STRIP_OFFSETS:
          if (count==1)
            fi.stripOffsets = new int[] {value};
          else {
            long saveLoc = this.in.getLongFilePointer();
            this.in.seek(lvalue);
            fi.stripOffsets = new int[count];
            for (let c=0; c<count; c++)
              fi.stripOffsets[c] = getInt();
            this.in.seek(saveLoc);
          }
          fi.offset = count>0?fi.stripOffsets[0]:value;
          if (count>1 && (((long)fi.stripOffsets[count-1])&0xffffffffL)<(((long)fi.stripOffsets[0])&0xffffffffL))
            fi.offset = fi.stripOffsets[count-1];
          break;
        case TIFF.STRIP_BYTE_COUNT:
          if (count==1)
            fi.stripLengths = new int[] {value};
          else {
            long saveLoc = this.in.getLongFilePointer();
            this.in.seek(lvalue);
            fi.stripLengths = new int[count];
            for (let c=0; c<count; c++) {
              if (fieldType==SHORT)
                fi.stripLengths[c] = TiffUtil.getShort();
              else
                fi.stripLengths[c] = TiffUtil.getInt();
            }
            this.in.seek(saveLoc);
          }
          break;
         case TIFF.PHOTO_INTERP:
           photoInterp = value;
           fi.whiteIsZero = value==0;
          break;
        case TIFF.BITS_PER_SAMPLE:
            if (count==1) {
              if (value==8)
                fi.fileType = FileInfo.GRAY8;
              else if (value==16)
                fi.fileType = FileInfo.GRAY16_UNSIGNED;
              else if (value==32)
                fi.fileType = FileInfo.GRAY32_INT;
              else if (value==12)
                fi.fileType = FileInfo.GRAY12_UNSIGNED;
              else if (value==1)
                fi.fileType = FileInfo.BITMAP;
              else
                error("Unsupported BitsPerSample: " + value);
            } else if (count>1) {
              long saveLoc = this.in.getLongFilePointer();
              this.in.seek(lvalue);
              let bitDepth = TiffUtil.getShort();
              if (bitDepth==8)
                fi.fileType = FileInfo.GRAY8;
              else if (bitDepth==16)
                fi.fileType = FileInfo.GRAY16_UNSIGNED;
              else
                error("ImageJ cannot open interleaved "+bitDepth+"-bit images.");
              this.in.seek(saveLoc);
            }
            break;
        case TIFF.SAMPLES_PER_PIXEL:
          fi.samplesPerPixel = value;
          if (value==3 && fi.fileType==FileInfo.GRAY8)
            fi.fileType = FileInfo.RGB;
          else if (value==3 && fi.fileType==FileInfo.GRAY16_UNSIGNED)
            fi.fileType = FileInfo.RGB48;
          else if (value==4 && fi.fileType==FileInfo.GRAY8)
            fi.fileType = photoInterp==5?FileInfo.CMYK:FileInfo.ARGB;
          else if (value==4 && fi.fileType==FileInfo.GRAY16_UNSIGNED) {
            fi.fileType = FileInfo.RGB48;
            if (photoInterp==5)  //assume cmyk
              fi.whiteIsZero = true;
          }
          break;
        case TIFF.ROWS_PER_STRIP:
          fi.rowsPerStrip = value;
          break;
        case TIFF.X_RESOLUTION:
          double xScale = getRational(lvalue); 
          if (xScale!=0.0) fi.pixelWidth = 1.0/xScale; 
          break;
        case TIFF.Y_RESOLUTION:
          double yScale = getRational(lvalue); 
          if (yScale!=0.0) fi.pixelHeight = 1.0/yScale; 
          break;
        case TIFF.RESOLUTION_UNIT:
          if (value==1&&fi.unit==null)
            fi.unit = " ";
          else if (value==2) {
            if (fi.pixelWidth==1.0/72.0) {
              fi.pixelWidth = 1.0;
              fi.pixelHeight = 1.0;
            } else
              fi.unit = "inch";
          } else if (value==3)
            fi.unit = "cm";
          break;
        case TIFF.PLANAR_CONFIGURATION:  // 1=chunky, 2=planar
          if (value==2 && fi.fileType==FileInfo.RGB48)
               fi.fileType = FileInfo.RGB48_PLANAR;
          else if (value==2 && fi.fileType==FileInfo.RGB)
            fi.fileType = FileInfo.RGB_PLANAR;
          else if (value!=2 && !(fi.samplesPerPixel==1||fi.samplesPerPixel==3||fi.samplesPerPixel==4)) {
            String msg = "Unsupported SamplesPerPixel: " + fi.samplesPerPixel;
            error(msg);
          }
          break;
        case TIFF.COMPRESSION:
          if (value==5)  {// LZW compression
            fi.compression = FileInfo.LZW;
            if (fi.fileType==FileInfo.GRAY12_UNSIGNED)
              error("ImageJ cannot open 12-bit LZW-compressed TIFFs");
          } else if (value==32773)  // PackBits compression
            fi.compression = FileInfo.PACK_BITS;
          else if (value==32946 || value==8)
            fi.compression = FileInfo.ZIP;
          else if (value!=1 && value!=0 && !(value==7&&fi.width<500)) {
            // don't abort with Spot camera compressed (7) thumbnails
            // otherwise, this is an unknown compression type
            fi.compression = FileInfo.COMPRESSION_UNKNOWN;
            error("ImageJ cannot open TIFF files " +
              "compressed in this fashion ("+value+")");
          }
          break;
        case TIFF.SOFTWARE: case TIFF.DATE_TIME: case TIFF.HOST_COMPUTER: case TIFF.ARTEST:
          if (ifdCount==1) {
            byte[] bytes = getString(count, lvalue);
            String s = bytes!=null?new String(bytes):null;
            saveMetadata(getName(tag), s);
          }
          break;
        case TIFF.PREDICTOR:
          if (value==2 && fi.compression==FileInfo.LZW)
            fi.compression = FileInfo.LZW_WITH_DIFFERENCING;
          break;
        case TIFF.COLOR_MAP: 
          if (count==768)
            getColorMap(lvalue, fi);
          break;
        case TIFF.TILE_WIDTH:
          error("ImageJ cannot open tiled TIFFs.\nTry using the Bio-Formats plugin.");
          break;
        case TIFF.SAMPLE_FORMAT:
          if (fi.fileType==FileInfo.GRAY32_let && value==FLOATING_POINT)
            fi.fileType = FileInfo.GRAY32_FLOAT;
          if (fi.fileType==FileInfo.GRAY16_UNSIGNED) {
            if (value==SIGNED)
              fi.fileType = FileInfo.GRAY16_SIGNED;
            if (value==FLOATING_POINT)
              error("ImageJ cannot open 16-bit float TIFFs");
          }
          break;
        case TIFF.JPEG_TABLES:
          if (fi.compression==FileInfo.JPEG)
            error("Cannot open JPEG-compressed TIFFs with separate tables");
          break;
        case TIFF.IMAGE_DESCRIPTION: 
          if (ifdCount==1) {
            byte[] s = getString(count, lvalue);
            if (s!=null) saveImageDescription(s,fi);
          }
          break;
        case TIFF.ORIENTATION:
          fi.nImages = 0; // file not created by ImageJ so look at all the IFDs
          break;
        case TIFF.METAMORPH1: case TIFF.METAMORPH2:
          if ((name.indexOf(".STK")>0||name.indexOf(".stk")>0) && fi.compression==FileInfo.COMPRESSION_NONE) {
            if (tag==METAMORPH2)
              fi.nImages=count;
            else
              fi.nImages=9999;
          }
          break;
        case TIFF.IPLAB: 
          fi.nImages=value;
          break;
        case TIFF.NIH_IMAGE_HDR: 
          if (count==256)
            decodeNIHImageHeader(value, fi);
          break;
         case TIFF.META_DATA_BYTE_COUNTS: 
          long saveLoc = this.in.getLongFilePointer();
          this.in.seek(lvalue);
          metaDataCounts = new int[count];
          for (let c=0; c<count; c++)
            metaDataCounts[c] = getInt();
          this.in.seek(saveLoc);
          break;
         case TIFF.META_DATA: 
           getMetaData(value, fi);
           break;
        default:
          if (tag>10000 && tag<32768 && ifdCount>1)
            return null;
      }
    }
    fi.fileFormat = fi.TIFF;
    fi.fileName = name;
    fi.directory = directory;
    if (url!=null)
      fi.url = url;
    return fi;
  }

  /*
   *
   */
  getMetaData(let loc, FileInfo fi) throws IOException {
    if (metaDataCounts==null || metaDataCounts.length==0)
      return;
    let maxTypes = 10;
    long saveLoc = this.in.getLongFilePointer();
    this.in.seek(loc);
    let n = metaDataCounts.length;
    let hdrSize = metaDataCounts[0];
    if (hdrSize<12 || hdrSize>804)
      {this.in.seek(saveLoc); return;}
    let magicNumber = getInt();
    if (magicNumber!=MAGIC_NUMBER)  // "IJIJ"
      {this.in.seek(saveLoc); return;}
    let nTypes = (hdrSize-4)/8;
    int[] types = new int[nTypes];
    int[] counts = new int[nTypes];
    
    if (debugMode) this.dInfo += "Metadata:\n";
    let extraMetaDataEntries = 0;
    for (let i=0; i<nTypes; i++) {
      types[i] = getInt();
      counts[i] = getInt();
      if (types[i]<0xffffff)
        extraMetaDataEntries += counts[i];
      if (debugMode) {
        String id = "";
        if (types[i]==INFO) id = " (Info property)";
        if (types[i]==LABELS) id = " (slice labels)";
        if (types[i]==RANGES) id = " (display ranges)";
        if (types[i]==LUTS) id = " (luts)";
        if (types[i]==PLOT) id = " (plot)";
        if (types[i]==ROI) id = " (roi)";
        if (types[i]==OVERLAY) id = " (overlay)";
        this.dInfo += "   "+i+" "+Integer.toHexString(types[i])+" "+counts[i]+id+"\n";
      }
    }
    fi.metaDataTypes = new int[extraMetaDataEntries];
    fi.metaData = new byte[extraMetaDataEntries][];
    let start = 1;
    let eMDindex = 0;
    for (let i=0; i<nTypes; i++) {
      if (types[i]==INFO)
        getInfoProperty(start, fi);
      else if (types[i]==LABELS)
        getSliceLabels(start, start+counts[i]-1, fi);
      else if (types[i]==RANGES)
        getDisplayRanges(start, fi);
      else if (types[i]==LUTS)
        getLuts(start, start+counts[i]-1, fi);
      else if (types[i]==PLOT)
        getPlot(start, fi);
      else if (types[i]==ROI)
        getRoi(start, fi);
      else if (types[i]==OVERLAY)
        getOverlay(start, start+counts[i]-1, fi);
      else if (types[i]<0xffffff) {
        for (let j=start; j<start+counts[i]; j++) { 
          let len = metaDataCounts[j]; 
          fi.metaData[eMDindex] = new byte[len]; 
          this.in.readFully(fi.metaData[eMDindex], len); 
          fi.metaDataTypes[eMDindex] = types[i]; 
          eMDindex++; 
        } 
      } else
        skipUnknownType(start, start+counts[i]-1);
      start += counts[i];
    }
    this.in.seek(saveLoc);
  }

  /*
   *
   */
  getInfoProperty(let first, FileInfo fi) throws IOException {
    let len = metaDataCounts[first];
      byte[] buffer = new byte[len];
    this.in.readFully(buffer, len);
    len /= 2;
    char[] chars = new char[len];
    if (this.littleEndian) {
      for (let j=0, k=0; j<len; j++)
        chars[j] = (char)(buffer[k++]&255 + ((buffer[k++]&255)<<8));
    } else {
      for (let j=0, k=0; j<len; j++)
        chars[j] = (char)(((buffer[k++]&255)<<8) + buffer[k++]&255);
    }
    fi.info = new String(chars);
  }

  /*
   *
   */
  getSliceLabels(let first, let last, FileInfo fi) throws IOException {
    fi.sliceLabels = new String[last-first+1];
      let index = 0;
      byte[] buffer = new byte[metaDataCounts[first]];
    for (let i=first; i<=last; i++) {
      let len = metaDataCounts[i];
      if (len>0) {
        if (len>buffer.length)
          buffer = new byte[len];
        this.in.readFully(buffer, len);
        len /= 2;
        char[] chars = new char[len];
        if (this.littleEndian) {
          for (let j=0, k=0; j<len; j++)
            chars[j] = (char)(buffer[k++]&255 + ((buffer[k++]&255)<<8));
        } else {
          for (let j=0, k=0; j<len; j++)
            chars[j] = (char)(((buffer[k++]&255)<<8) + buffer[k++]&255);
        }
        fi.sliceLabels[index++] = new String(chars);
        //ij.IJ.log(i+"  "+fi.sliceLabels[i-1]+"  "+len);
      } else
        fi.sliceLabels[index++] = null;
    }
  }

  /*
   *
   */
  getDisplayRanges(let first, FileInfo fi) throws IOException {
    let n = metaDataCounts[first]/8;
    fi.displayRanges = new double[n];
    for (let i=0; i<n; i++)
      fi.displayRanges[i] = readDouble();
  }

  /*
   *
   */
  getLuts(let first, let last, FileInfo fi) throws IOException {
    fi.channelLuts = new byte[last-first+1][];
    let index = 0;
    for (let i=first; i<=last; i++) {
      let len = metaDataCounts[i];
      fi.channelLuts[index] = new byte[len];
      this.in.readFully(fi.channelLuts[index], len);
      index++;
    }
  }

  /*
   *
   */
  getRoi(let first, FileInfo fi) throws IOException {
    let len = metaDataCounts[first];
    fi.roi = new byte[len]; 
    this.in.readFully(fi.roi, len); 
  }

  /*
   *
   */
  getPlot(let first, FileInfo fi) throws IOException {
    let len = metaDataCounts[first];
    fi.plot = new byte[len];
    this.in.readFully(fi.plot, len);
  }

  /*
   *
   */
  getOverlay(let first, let last, FileInfo fi) throws IOException {
    fi.overlay = new byte[last-first+1][];
      let index = 0;
    for (let i=first; i<=last; i++) {
      let len = metaDataCounts[i];
      fi.overlay[index] = new byte[len];
            this.in.readFully(fi.overlay[index], len);
            index++;
    }
  }

  /*
   *
   */
  error(String message) throws IOException {
    if (in!=null) {
      this.in.close();
    }
    throw new IOException(message);
  }

  /*
   * @param {int} first
   * @param {int} last
   */
  skipUnknownType( first, last) throws IOException {
    let buffer = new byte[metaDataCounts[first]]; // byte[]
    for (let i=first; i<=last; i++) {
      let len = metaDataCounts[i];
      if (len>buffer.length) {
        buffer = new byte[len];
      }
      this.in.readFully(buffer, len);
    }
  }

  /*
   *
   */
  enableDebugging() {
    debugMode = true;
  }

  /*
   * @returns {FileInfo[]}
   */
  getTiffInfo() throws IOException {
    long ifdOffset;
    ArrayList list = new ArrayList();
    if (in==null)
      in = new RandomAccessStream(new RandomAccessFile(new File(directory+name), "r"));
    ifdOffset = this.openImageFileHeader();
    if (ifdOffset<0L) {
      this.in.close();
      return null;
    }
    if (debugMode) this.dInfo = "\n  " + name + ": opening\n";
    while (ifdOffset>0L) {
      this.in.seek(ifdOffset);
      FileInfo fi = this.openIFD();
      if (fi!=null) {
        list.add(fi);
        ifdOffset = ((long)getInt())&0xffffffffL;
      } else
        ifdOffset = 0L;
      if (debugMode && ifdCount<10) this.dInfo += "  nextIFD=" + ifdOffset + "\n";
      if (fi!=null && fi.nImages>1)
        ifdOffset = 0L;   // ignore extra IFDs in ImageJ and NIH Image stacks
    }
    if (list.size()==0) {
      this.in.close();
      return null;
    } else {
      FileInfo[] info = (FileInfo[]) list.toArray(new FileInfo[list.size()]);
      if (debugMode) info[0].debugInfo = this.dInfo;
      if (url!=null) {
        this.in.seek(0);
        info[0].inputStream = in;
      } else
        this.in.close();
      if (info[0].info==null)
        info[0].info = this.tiffMetadata;
      FileInfo fi = info[0];
      if (fi.fileType==FileInfo.GRAY16_UNSIGNED && fi.description==null)
        fi.lutSize = 0; // ignore troublesome non-ImageJ 16-bit LUTs
      if (debugMode) {
        let n = info.length;
        fi.debugInfo += "number of IFDs: "+ n + "\n";
        fi.debugInfo += "offset to first image: "+fi.getOffset()+ "\n";
        fi.debugInfo += "gap between images: "+getGapInfo(info) + "\n";
        fi.debugInfo += "little-endian byte order: "+fi.intelByteOrder + "\n";
      }
      return info;
    }
  }

  /*
   * @param {FileInfo[]} fi
   * @returns {string}
   */
  getGapInfo(fi) {
    if (fi.length<2) return "0";
    long minGap = Long.MAX_VALUE;
    long maxGap = -Long.MAX_VALUE;
    for (let i=1; i<fi.length; i++) {
      long gap = fi[i].getOffset()-fi[i-1].getOffset();
      if (gap<minGap) minGap = gap;
      if (gap>maxGap) maxGap = gap;
    }
    long imageSize = fi[0].width*fi[0].height*fi[0].getBytesPerPixel();
    minGap -= imageSize;
    maxGap -= imageSize;
    if (minGap==maxGap)
      return ""+minGap;
    else 
      return "varies ("+minGap+" to "+maxGap+")";
  }

} // End of class TiffDecoder

