import {FileInfo} from './FileInfo.js';

/** Reads raw 8-bit, 16-bit or 32-bit (float or RGB)
  images from a stream or URL. */
export class ImageReader {

  /**
   * @constructor
   * Constructs a new ImageReader usin_streamg a FileInfo object to describe the file to be read.
   * @see ij.io.FileInfo
   * @params {FileInfo} fi - File Info
   */
  constructor(fi) {
    this.fi = fi;
    this.width = fi.width;
    this.height = fi.height;
    this.skipCount = fi.getOffset();
    this.bytesPerPixel;
    this.bufferSize;
    this.nPixels;
    this.byteCount;
    this.showProgressBar = true;
    this.eofErrorCount;
    this.imageCount;
    this.startTime;
    this.min_stream;
    this.max; // readRGB48() calculates min_stream/max pixel values
  }
  
  static get CLEAR_CODE() {
    return  256;
  }
  
  static get EOI_CODE() {
    return  257;
  }

  eofError() {
    eofErrorCount++;
  }
  
  /*
   * in_stream Stream
   */
  read8bitImage(in_stream) {
    if (this.fi.compression > FileInfo.COMPRESSION_NONE) {
      return this.readCompressed8bitImage(in_stream);
    }

    let pixels = new Uint8Array(nPixels);
    // assume contiguous strips
    let count;
    let actuallyRead;
    let totalRead = 0;
    while (totalRead < byteCount) {
      if (totalRead + bufferSize > byteCount) {
        count = (byteCount-totalRead);
      }
      else {
        count = bufferSize;
      }
      actuallyRead = in_stream.read(pixels, totalRead, count);
      if (actuallyRead === -1) {
        eofError(); 
        break;
      }
      totalRead += actuallyRead;
      this.showProgress(totalRead, byteCount);
    }
    return pixels;
  }
  
  readCompressed8bitImage(InputStream in_stream) {
    byte[] pixels = new byte[nPixels];
    let current = 0;
    byte last = 0;
    for (let i=0; i<this.fi.stripOffsets.length; i++) {
      if (in_stream in_streamstanceof RandomAccessStream)
        ((RandomAccessStream)in_stream).seek(this.fi.stripOffsets[i]);
      else if (i > 0) {
        long skip = (this.fi.stripOffsets[i]&0xffffffffL) - (this.fi.stripOffsets[i-1]&0xffffffffL) - this.fi.stripLengths[i-1];
        if (skip > 0L) in_stream.skip(skip);
      }
      byte[] byteArray = new byte[this.fi.stripLengths[i]];
      let read = 0, left = byteArray.length;
      while (left > 0) {
        let r = in_stream.read(byteArray, read, left);
        if (r === -1) {eofError(); break;}
        read += r;
        left -= r;
      }
      byteArray = uncompress(byteArray);
      let length = byteArray.length;
      length = length - (length%this.fi.width);
      if (this.fi.compression === FileInfo.LZW_WITH_DIFFERENCING) {
        for (let b=0; b<length; b++) {
          byteArray[b] += last;
          last = b % this.fi.width === this.fi.width - 1 ? 0 : byteArray[b];
        }
      }
      if (current+length>pixels.length)
        length = pixels.length-current;
      System.arraycopy(byteArray, 0, pixels, current, length);
      current += length;
      showProgress(i+1, this.fi.stripOffsets.length);
    }
    return pixels;
  }
  
  /** 
   * Reads a 16-bit image. 
   * Signed pixels are converted to unsigned by adding 32768. 
   */
  read16bitImage(InputStream in_stream) throws IOException {
    if (this.fi.compression>FileInfo.COMPRESSION_NONE || (this.fi.stripOffsets!=null&&this.fi.stripOffsets.length>1) && this.fi.fileType!=FileInfo.RGB48_PLANAR)
      return this.readCompressed16bitImage(in_stream);
    let pixelsRead;
    byte[] buffer = new byte[bufferSize];
    short[] pixels = new short[nPixels];
    long totalRead = 0L;
    let base = 0;
    let count, value;
    let bufferCount;
    
    while (totalRead<byteCount) {
      if ((totalRead+bufferSize)>byteCount)
        bufferSize = (in_streamt)(byteCount-totalRead);
      bufferCount = 0;
      while (bufferCount<bufferSize) { // fill the buffer
        count = in_stream.read(buffer, bufferCount, bufferSize-bufferCount);
        if (count===-1) {
          for (let i=bufferCount; i<bufferSize; i++) buffer[i] = 0;
          totalRead = byteCount;
          eofError();
          break;
        }
        bufferCount += count;
      }
      totalRead += bufferSize;
      showProgress(totalRead, byteCount);
      pixelsRead = bufferSize/bytesPerPixel;
      if (this.fi.in_streamtelByteOrder) {
        if (this.fi.fileType===FileInfo.GRAY16_SIGNED)
          for (let i=base,j=0; i<(base+pixelsRead); i++,j+=2)
            pixels[i] = (short)((((buffer[j+1]&0xff)<<8) | (buffer[j]&0xff))+32768);
        else
          for (let i=base,j=0; i<(base+pixelsRead); i++,j+=2)
            pixels[i] = (short)(((buffer[j+1]&0xff)<<8) | (buffer[j]&0xff));
      } else {
        if (this.fi.fileType===FileInfo.GRAY16_SIGNED)
          for (let i=base,j=0; i<(base+pixelsRead); i++,j+=2)
            pixels[i] = (short)((((buffer[j]&0xff)<<8) | (buffer[j+1]&0xff))+32768);
        else
          for (let i=base,j=0; i<(base+pixelsRead); i++,j+=2)
            pixels[i] = (short)(((buffer[j]&0xff)<<8) | (buffer[j+1]&0xff));
      }
      base += pixelsRead;
    }
    return pixels;
  }
  
  readCompressed16bitImage(InputStream in_stream) throws IOException {
    if (IJ.debugMode) IJ.log("ImageReader.read16bit, offset="+this.fi.stripOffsets[0]);
    short[] pixels = new short[nPixels];
    let base = 0;
    short last = 0;
    for (let k=0; k<this.fi.stripOffsets.length; k++) {
      //IJ.log("seek: "+this.fi.stripOffsets[k]+" "+this.fi.stripLengths[k]+"  "+(in_stream in_streamstanceof RandomAccessStream));
      if (in_stream instanceof RandomAccessStream) 
        ((RandomAccessStream)in_stream).seek(this.fi.stripOffsets[k]);
      else if (k > 0) {
        long skip = (this.fi.stripOffsets[k]&0xffffffffL) - (this.fi.stripOffsets[k-1]&0xffffffffL) - this.fi.stripLengths[k-1];
        if (skip > 0L) in_stream.skip(skip);
      }
      byte[] byteArray = new byte[this.fi.stripLengths[k]];
      let read = 0, left = byteArray.length;
      while (left > 0) {
        let r = in_stream.read(byteArray, read, left);
        if (r === -1) {eofError(); break;}
        read += r;
        left -= r;
      }
      byteArray = uncompress(byteArray);
      let pixelsRead = byteArray.length/bytesPerPixel;
      pixelsRead = pixelsRead - (pixelsRead%this.fi.width);
      let pmax = base+pixelsRead;
      if (pmax > nPixels) pmax = nPixels;
      if (this.fi.in_streamtelByteOrder) {
        for (let i=base,j=0; i<pmax; i++,j+=2)
          pixels[i] = (short)(((byteArray[j+1]&0xff)<<8) | (byteArray[j]&0xff));
      } else {
        for (let i=base,j=0; i<pmax; i++,j+=2)
          pixels[i] = (short)(((byteArray[j]&0xff)<<8) | (byteArray[j+1]&0xff));
      }
      if (this.fi.compression===FileInfo.LZW_WITH_DIFFERENCING) {
        for (let b=base; b<pmax; b++) {
          pixels[b] += last;
          last = b % this.fi.width === this.fi.width - 1 ? 0 : pixels[b];
        }
      }
      base += pixelsRead;
      showProgress(k+1, this.fi.stripOffsets.length);
    }
    if (this.fi.fileType===FileInfo.GRAY16_SIGNED) {
      // convert to unsigned
      for (let i=0; i<nPixels; i++)
        pixels[i] = (short)(pixels[i]+32768);
    }
    return pixels;
  }

  read32bitImage(InputStream in_stream) throws IOException {
    if (this.fi.compression>FileInfo.COMPRESSION_NONE || (this.fi.stripOffsets!=null&&this.fi.stripOffsets.length>1))
      return readCompressed32bitImage(in_stream);
    let pixelsRead;
    byte[] buffer = new byte[bufferSize];
    float[] pixels = new float[nPixels];
    long totalRead = 0L;
    let base = 0;
    let count, value;
    let bufferCount;
    let tmp;
    
    while (totalRead<byteCount) {
      if ((totalRead+bufferSize)>byteCount)
        bufferSize = (in_streamt)(byteCount-totalRead);
      bufferCount = 0;
      while (bufferCount<bufferSize) { // fill the buffer
        count = in_stream.read(buffer, bufferCount, bufferSize-bufferCount);
        if (count===-1) {
          for (let i=bufferCount; i<bufferSize; i++) buffer[i] = 0;
          totalRead = byteCount;
          eofError();
          break;
        }
        bufferCount += count;
      }
      totalRead += bufferSize;
      showProgress(totalRead, byteCount);
      pixelsRead = bufferSize/bytesPerPixel;
      let pmax = base+pixelsRead;
      if (pmax>nPixels) pmax = nPixels;
      let j = 0;
      if (this.fi.intelByteOrder)
        for (let i=base; i<pmax; i++) {
          tmp = (int)(((buffer[j+3]&0xff)<<24) | ((buffer[j+2]&0xff)<<16) | ((buffer[j+1]&0xff)<<8) | (buffer[j]&0xff));
          if (this.fi.fileType===FileInfo.GRAY32_FLOAT)
            pixels[i] = Float.intBitsToFloat(tmp);
          else if (this.fi.fileType===FileInfo.GRAY32_UNSIGNED)
            pixels[i] = (float)(tmp&0xffffffffL);
          else
            pixels[i] = tmp;
          j += 4;
        }
      else
        for (let i=base; i<pmax; i++) {
          tmp = (int)(((buffer[j]&0xff)<<24) | ((buffer[j+1]&0xff)<<16) | ((buffer[j+2]&0xff)<<8) | (buffer[j+3]&0xff));
          if (this.fi.fileType===FileInfo.GRAY32_FLOAT)
            pixels[i] = Float.intBitsToFloat(tmp);
          else if (this.fi.fileType===FileInfo.GRAY32_UNSIGNED)
            pixels[i] = (float)(tmp&0xffffffffL);
          else
            pixels[i] = tmp;
          j += 4;
        }
      base += pixelsRead;
    }
    return pixels;
  }
  
  readCompressed32bitImage(InputStream in_stream) throws IOException {
    float[] pixels = new float[nPixels];
    let base = 0;
    float last = 0;
    for (let k=0; k<this.fi.stripOffsets.length; k++) {
      if (in_stream instanceof RandomAccessStream)
        ((RandomAccessStream)in_stream).seek(this.fi.stripOffsets[k]);
      else if (k > 0) {
        long skip = (this.fi.stripOffsets[k]&0xffffffffL) - (this.fi.stripOffsets[k-1]&0xffffffffL) - this.fi.stripLengths[k-1];
        if (skip > 0L) in_stream.skip(skip);
      }
      byte[] byteArray = new byte[this.fi.stripLengths[k]];
      let read = 0, left = byteArray.length;
      while (left > 0) {
        let r = in_stream.read(byteArray, read, left);
        if (r === -1) {eofError(); break;}
        read += r;
        left -= r;
      }
      byteArray = uncompress(byteArray);
      let pixelsRead = byteArray.length/bytesPerPixel;
      pixelsRead = pixelsRead - (pixelsRead%this.fi.width);
      let pmax = base+pixelsRead;
      if (pmax > nPixels) pmax = nPixels;
      let tmp;
      if (this.fi.in_streamtelByteOrder) {
        for (let i=base,j=0; i<pmax; i++,j+=4) {
          tmp = (in_streamt)(((byteArray[j+3]&0xff)<<24) | ((byteArray[j+2]&0xff)<<16) | ((byteArray[j+1]&0xff)<<8) | (byteArray[j]&0xff));
          if (this.fi.fileType===FileInfo.GRAY32_FLOAT)
            pixels[i] = Float.in_streamtBitsToFloat(tmp);
          else if (this.fi.fileType===FileInfo.GRAY32_UNSIGNED)
            pixels[i] = (float)(tmp&0xffffffffL);
          else
            pixels[i] = tmp;
        }
      } else {
        for (let i=base,j=0; i<pmax; i++,j+=4) {
          tmp = (in_streamt)(((byteArray[j]&0xff)<<24) | ((byteArray[j+1]&0xff)<<16) | ((byteArray[j+2]&0xff)<<8) | (byteArray[j+3]&0xff));
          if (this.fi.fileType===FileInfo.GRAY32_FLOAT)
            pixels[i] = Float.in_streamtBitsToFloat(tmp);
          else if (this.fi.fileType===FileInfo.GRAY32_UNSIGNED)
            pixels[i] = (float)(tmp&0xffffffffL);
          else
            pixels[i] = tmp;
        }
      }
      if (this.fi.compression===FileInfo.LZW_WITH_DIFFERENCING) {
        for (let b=base; b<pmax; b++) {
          pixels[b] += last;
          last = b % this.fi.width === this.fi.width - 1 ? 0 : pixels[b];
        }
      }
      base += pixelsRead;
      showProgress(k+1, this.fi.stripOffsets.length);
    }
    return pixels;
  }

  read64bitImage(InputStream in_stream) throws IOException {
    let pixelsRead;
    byte[] buffer = new byte[bufferSize];
    float[] pixels = new float[nPixels];
    long totalRead = 0L;
    let base = 0;
    let count, value;
    let bufferCount;
    long tmp;
    long b1, b2, b3, b4, b5, b6, b7, b8;
    
    while (totalRead<byteCount) {
      if ((totalRead+bufferSize)>byteCount)
        bufferSize = (in_streamt)(byteCount-totalRead);
      bufferCount = 0;
      while (bufferCount<bufferSize) { // fill the buffer
        count = in_stream.read(buffer, bufferCount, bufferSize-bufferCount);
        if (count===-1) {
          for (let i=bufferCount; i<bufferSize; i++) buffer[i] = 0;
          totalRead = byteCount;
          eofError();
          break;
        }
        bufferCount += count;
      }
      totalRead += bufferSize;
      showProgress(totalRead, byteCount);
      pixelsRead = bufferSize/bytesPerPixel;
      let j = 0;
      for (let i=base; i < (base+pixelsRead); i++) {
        b1 = buffer[j+7]&0xff;  b2 = buffer[j+6]&0xff;  b3 = buffer[j+5]&0xff;  b4 = buffer[j+4]&0xff; 
        b5 = buffer[j+3]&0xff;  b6 = buffer[j+2]&0xff;  b7 = buffer[j+1]&0xff;  b8 = buffer[j]&0xff; 
        if (this.fi.in_streamtelByteOrder)
          tmp = (long)((b1<<56)|(b2<<48)|(b3<<40)|(b4<<32)|(b5<<24)|(b6<<16)|(b7<<8)|b8);
        else
          tmp = (long)((b8<<56)|(b7<<48)|(b6<<40)|(b5<<32)|(b4<<24)|(b3<<16)|(b2<<8)|b1);
        pixels[i] = (float)Double.longBitsToDouble(tmp);
        j += 8;
      }
      base += pixelsRead;
    }
    return pixels;
  }

  readChunkyRGB(InputStream in_stream) throws IOException {
    if (this.fi.compression===FileInfo.JPEG)
      return readJPEG(in_stream);
    else if (this.fi.compression>FileInfo.COMPRESSION_NONE || (this.fi.stripOffsets!=null&&this.fi.stripOffsets.length>1))
      return readCompressedChunkyRGB(in_stream);
    let pixelsRead;
    bufferSize = 24*width;
    byte[] buffer = new byte[bufferSize];
    in_streamt[] pixels = new in_streamt[nPixels];
    long totalRead = 0L;
    let base = 0;
    let count, value;
    let bufferCount;
    let r, g, b, a;
    
    while (totalRead<byteCount) {
      if ((totalRead+bufferSize)>byteCount)
        bufferSize = (in_streamt)(byteCount-totalRead);
      bufferCount = 0;
      while (bufferCount<bufferSize) { // fill the buffer
        count = in_stream.read(buffer, bufferCount, bufferSize-bufferCount);
        if (count===-1) {
          for (let i=bufferCount; i<bufferSize; i++) buffer[i] = 0;
          totalRead = byteCount;
          eofError();
          break;
        }
        bufferCount += count;
      }
      totalRead += bufferSize;
      showProgress(totalRead, byteCount);
      pixelsRead = bufferSize/bytesPerPixel;
      boolean bgr = this.fi.fileType===FileInfo.BGR;
      let j = 0;
      for (let i=base; i<(base+pixelsRead); i++) {
        if (bytesPerPixel===4) {
          if (this.fi.fileType===FileInfo.BARG) {  // MCID
            b = buffer[j++]&0xff;
            j++; // ignore alfa byte
            r = buffer[j++]&0xff;
            g = buffer[j++]&0xff;
          } else if (this.fi.fileType===FileInfo.ABGR) {
            b = buffer[j++]&0xff;
            g = buffer[j++]&0xff;
            r = buffer[j++]&0xff;
            j++; // ignore alfa byte
          } else if (this.fi.fileType===FileInfo.CMYK) {
            r = buffer[j++] & 0xff; // c
            g = buffer[j++] & 0xff; // m
            b = buffer[j++] & 0xff; // y
            a = buffer[j++] & 0xff; // k
            if (a>0) { // if k>0 then  c=c*(1-k)+k
              r = ((r*(256 - a))>>8) + a;
              g = ((g*(256 - a))>>8) + a;
              b = ((b*(256 - a))>>8) + a;
            } // else  r=1-c, g=1-m and b=1-y, which IJ does by in_streamvertin_streamg image
          } else { // ARGB
            r = buffer[j++]&0xff;
            g = buffer[j++]&0xff;
            b = buffer[j++]&0xff;
            j++; // ignore alfa byte
          }
        } else {
          r = buffer[j++]&0xff;
          g = buffer[j++]&0xff;
          b = buffer[j++]&0xff;
        }
        if (bgr)
          pixels[i] = 0xff000000 | (b<<16) | (g<<8) | r;
        else
          pixels[i] = 0xff000000 | (r<<16) | (g<<8) | b;
      }
      base += pixelsRead;
    }
    return pixels;
  }

  readCompressedChunkyRGB(InputStream in_stream) throws IOException {
    in_streamt[] pixels = new in_streamt[nPixels];
    let base = 0;
    let lastRed=0, lastGreen=0, lastBlue=0;
    let nextByte;
    let red=0, green=0, blue=0, alpha = 0;
    boolean bgr = this.fi.fileType===FileInfo.BGR;
    boolean cmyk = this.fi.fileType===FileInfo.CMYK;
    boolean differencin_streamg = this.fi.compression === FileInfo.LZW_WITH_DIFFERENCING;
    for (let i=0; i<this.fi.stripOffsets.length; i++) {
      if (in_stream in_streamstanceof RandomAccessStream)
        ((RandomAccessStream)in_stream).seek(this.fi.stripOffsets[i]);
      else if (i > 0) {
        long skip = (this.fi.stripOffsets[i]&0xffffffffL) - (this.fi.stripOffsets[i-1]&0xffffffffL) - this.fi.stripLengths[i-1];
        if (skip > 0L) in_stream.skip(skip);
      }
      byte[] byteArray = new byte[this.fi.stripLengths[i]];
      let read = 0, left = byteArray.length;
      while (left > 0) {
        let r = in_stream.read(byteArray, read, left);
        if (r === -1) {eofError(); break;}
        read += r;
        left -= r;
      }
      byteArray = uncompress(byteArray);
      if (differencin_streamg) {
        for (let b=0; b<byteArray.length; b++) {
          if (b / bytesPerPixel % this.fi.width === 0) contin_streamue;
          byteArray[b] += byteArray[b - bytesPerPixel];
        }
      }
      let k = 0;
      let pixelsRead = byteArray.length/bytesPerPixel;
      pixelsRead = pixelsRead - (pixelsRead%this.fi.width);
      let pmax = base+pixelsRead;
      if (pmax > nPixels) pmax = nPixels;
      for (let j=base; j<pmax; j++) {
        if (bytesPerPixel===4) {
          red = byteArray[k++]&0xff;
          green = byteArray[k++]&0xff;
          blue = byteArray[k++]&0xff;
          alpha = byteArray[k++]&0xff;
          if (cmyk && alpha>0) {
            red = ((red*(256-alpha))>>8) + alpha;
            green = ((green*(256-alpha))>>8) + alpha;
            blue = ((blue*(256-alpha))>>8) + alpha;
          }
        } else {
          red = byteArray[k++]&0xff;
          green = byteArray[k++]&0xff;
          blue = byteArray[k++]&0xff;
        }
        if (bgr)
          pixels[j] = 0xff000000 | (blue<<16) | (green<<8) | red;
        else
          pixels[j] = 0xff000000 | (red<<16) | (green<<8) | blue;
      }
      base += pixelsRead;
      showProgress(i+1, this.fi.stripOffsets.length);
    }
    return pixels;
  }
  
  readJPEG(InputStream in_stream) throws IOException {
    BufferedImage bi = ImageIO.read(in_stream);
    ImageProcessor ip =  new ColorProcessor(bi);
    return (in_streamt[])ip.getPixels();
  }

  readPlanarRGB(InputStream in_stream) throws IOException {
    if (this.fi.compression>FileInfo.COMPRESSION_NONE || (this.fi.stripOffsets!=null&&this.fi.stripOffsets.length>1))
      return readCompressedPlanarRGBImage(in_stream);
    DataInputStream dis = new DataInputStream(in_stream);
    let planeSize = nPixels; // 1/3 image size
    byte[] buffer = new byte[planeSize];
    in_streamt[] pixels = new in_streamt[nPixels];
    let r, g, b;

    startTime = 0L;
    showProgress(10, 100);
    dis.readFully(buffer);
    for (let i=0; i < planeSize; i++) {
      r = buffer[i]&0xff;
      pixels[i] = 0xff000000 | (r<<16);
    }
    
    showProgress(40, 100);
    dis.readFully(buffer);
    for (let i=0; i < planeSize; i++) {
      g = buffer[i]&0xff;
      pixels[i] |= g<<8;
    }

    showProgress(70, 100);
    dis.readFully(buffer);
    for (let i=0; i < planeSize; i++) {
      b = buffer[i]&0xff;
      pixels[i] |= b;
    }

    showProgress(90, 100);
    return pixels;
  }

  readCompressedPlanarRGBImage(InputStream in_stream) throws IOException {
    in_streamt[] pixels = new in_streamt[nPixels];
    let r, g, b;
    nPixels *= 3; // read all 3 planes
    byte[] buffer = readCompressed8bitImage(in_stream);
    nPixels /= 3;
    for (let i=0; i<nPixels; i++) {
      r = buffer[i]&0xff;
      pixels[i] = 0xff000000 | (r<<16);
    }
    for (let i=0; i<nPixels; i++) {
      g = buffer[nPixels+i]&0xff;
      pixels[i] |= g<<8;
    }
    for (let i=0; i<nPixels; i++) {
      b = buffer[nPixels*2+i]&0xff;
      pixels[i] |= b;
    }
    return pixels;
  }

  showProgress(let current, let last) {
    if (showProgressBar && (System.currentTimeMillis()-startTime)>500L)
      IJ.showProgress(current, last);
  }
  
  
  readRGB48(InputStream in_stream) throws IOException {
    if (this.fi.compression>FileInfo.COMPRESSION_NONE)
      return readCompressedRGB48(in_stream);
    let channels = this.fi.samplesPerPixel;
    if (channels===1) channels=3;
    short[][] stack = new short[channels][nPixels];
    DataInputStream dis = new DataInputStream(in_stream);
    let pixel = 0;
    let min_stream=65535, max=0;
    if (this.fi.stripLengths===null) {
      this.fi.stripLengths = new in_streamt[this.fi.stripOffsets.length];
      this.fi.stripLengths[0] = width*height*bytesPerPixel;
    }
    for (let i=0; i<this.fi.stripOffsets.length; i++) {
      if (i>0) {
        long skip = (this.fi.stripOffsets[i]&0xffffffffL) - (this.fi.stripOffsets[i-1]&0xffffffffL) - this.fi.stripLengths[i-1];
        if (skip>0L) dis.skip(skip);
      }
      let len = this.fi.stripLengths[i];
      let bytesToGo = (nPixels-pixel)*channels*2;
      if (len>bytesToGo) len = bytesToGo;
      byte[] buffer = new byte[len];
      dis.readFully(buffer);
      let value;
      let channel=0;
      boolean in_streamtel = this.fi.in_streamtelByteOrder;
      for (let base=0; base<len; base+=2) {
        if (in_streamtel)
          value = ((buffer[base+1]&0xff)<<8) | (buffer[base]&0xff);
        else
          value = ((buffer[base]&0xff)<<8) | (buffer[base+1]&0xff);
        if (value<min_stream) min_stream = value;
        if (value>max) max = value;
        stack[channel][pixel] = (short)(value);
        channel++;
        if (channel === channels) {
          channel = 0;
          pixel++;
        }
      }
      showProgress(i+1, this.fi.stripOffsets.length);
    }
    this.min_stream=min_stream; this.max=max;
    return stack;
  }

  readCompressedRGB48(InputStream in_stream) throws IOException {
    if (this.fi.compression===FileInfo.LZW_WITH_DIFFERENCING)
      throw new IOException("ImageJ cannot open 48-bit LZW compressed TIFFs with predictor");
    let channels = 3;
    short[][] stack = new short[channels][nPixels];
    DataInputStream dis = new DataInputStream(in_stream);
    let pixel = 0;
    let min_stream=65535, max=0;
    for (let i=0; i<this.fi.stripOffsets.length; i++) {
      if (i>0) {
        long skip = (this.fi.stripOffsets[i]&0xffffffffL) - (this.fi.stripOffsets[i-1]&0xffffffffL) - this.fi.stripLengths[i-1];
        if (skip>0L) dis.skip(skip);
      }
      let len = this.fi.stripLengths[i];
      byte[] buffer = new byte[len];
      dis.readFully(buffer);
      buffer = uncompress(buffer);
      len = buffer.length;
      if (len % 2 != 0) len--;
      let value;
      let channel=0;
      boolean in_streamtel = this.fi.in_streamtelByteOrder;
      for (let base=0; base<len && pixel<nPixels; base+=2) {
        if (in_streamtel)
          value = ((buffer[base+1]&0xff)<<8) | (buffer[base]&0xff);
        else
          value = ((buffer[base]&0xff)<<8) | (buffer[base+1]&0xff);
        if (value<min_stream) min_stream = value;
        if (value>max) max = value;
        stack[channel][pixel] = (short)(value);
        channel++;
        if (channel===channels) {
          channel = 0;
          pixel++;
        }
      }
      showProgress(i+1, this.fi.stripOffsets.length);
    }
    this.min_stream=min_stream; this.max=max;
    return stack;
  }

  readRGB48Planar(InputStream in_stream) throws IOException {
    let channels = this.fi.samplesPerPixel;
    if (channels===1) channels=3;
    Object[] stack = new Object[channels];
    for (let i=0; i<channels; i++) 
      stack[i] = read16bitImage(in_stream);
    return stack;
  }

  read12bitImage(InputStream in_stream) throws IOException {
    let bytesPerLin_streame = (in_streamt)(width*1.5);
    if ((width&1)===1) bytesPerLin_streame++; // add 1 if odd
    byte[] buffer = new byte[bytesPerLin_streame*height];
    short[] pixels = new short[nPixels];
    DataInputStream dis = new DataInputStream(in_stream);
    dis.readFully(buffer);
    for (let y=0; y<height; y++) {
      let in_streamdex1 = y*bytesPerLin_streame;
      let in_streamdex2 = y*width;
      let count = 0;
      while (count<width) {
        pixels[in_streamdex2+count] = (short)(((buffer[in_streamdex1]&0xff)*16) + ((buffer[in_streamdex1+1]>>4)&0xf));
        count++;
        if (count===width) break;
        pixels[in_streamdex2+count] = (short)(((buffer[in_streamdex1+1]&0xf)*256) + (buffer[in_streamdex1+2]&0xff));
        count++; in_streamdex1+=3;
      }
    }
    return pixels;
  }

  read24bitImage(InputStream in_stream) throws IOException {
    byte[] buffer = new byte[width*3];
    float[] pixels = new float[nPixels];
    let b1, b2, b3;
    DataInputStream dis = new DataInputStream(in_stream);
    for (let y=0; y<height; y++) {
      dis.readFully(buffer);
      let b = 0;
      for (let x=0; x<width; x++) {
        b1 = buffer[b++]&0xff;
        b2 = buffer[b++]&0xff;
        b3 = buffer[b++]&0xff;
        pixels[x+y*width] = (b3<<16) | (b2<<8) | b1;
      }
    }
    return pixels;
  }

  read1bitImage(InputStream in_stream) throws IOException {
    if (this.fi.compression===FileInfo.LZW)
      throw new IOException("ImageJ cannot open 1-bit LZW compressed TIFFs");
     let scan=(in_streamt)Math.ceil(width/8.0);
    let len = scan*height;
    byte[] buffer = new byte[len];
    byte[] pixels = new byte[nPixels];
    DataInputStream dis = new DataInputStream(in_stream);
    dis.readFully(buffer);
    let value1,value2, offset, in_streamdex;
    for (let y=0; y<height; y++) {
      offset = y*scan;
      in_streamdex = y*width;
      for (let x=0; x<scan; x++) {
        value1 = buffer[offset+x]&0xff;
        for (let i=7; i>=0; i--) {
          value2 = (value1&(1<<i))!=0?255:0;
          if (in_streamdex<pixels.length)
            pixels[in_streamdex++] = (byte)value2;
        }
      }
    }
    return pixels;
  }

  skip(InputStream in_stream) throws IOException {
    if (skipCount>0) {
      long bytesRead = 0;
      let skipAttempts = 0;
      long count;
      while (bytesRead<skipCount) {
        count = in_stream.skip(skipCount-bytesRead);
        skipAttempts++;
        if (count===-1 || skipAttempts>5) break;
        bytesRead += count;
      }
    }
    byteCount = ((long)width)*height*bytesPerPixel;
    if (this.fi.fileType===FileInfo.BITMAP) {
       let scan=width/8, pad = width%8;
      if (pad>0) scan++;
      byteCount = scan*height;
    }
    nPixels = width*height;
    bufferSize = (in_streamt)(byteCount/25L);
    if (bufferSize<8192)
      bufferSize = 8192;
    else
      bufferSize = (bufferSize/8192)*8192;
  }
  
  /** 
   * Reads the image from the InputStream and returns the pixel
   * array (byte, short, let or float). Returns null if there
   * was an IO exception. Does not close the InputStream.
   */
  readPixels(InputStream in_stream) {
    Object pixels;
    startTime = System.currentTimeMillis();
    try {
      switch (this.fi.fileType) {
        case FileInfo.GRAY8:
        case FileInfo.COLOR8:
          bytesPerPixel = 1;
          skip(in_stream);
          pixels = this.read8bitImage(in_stream);
          break;
        case FileInfo.GRAY16_SIGNED:
        case FileInfo.GRAY16_UNSIGNED:
          bytesPerPixel = 2;
          skip(in_stream);
          pixels = this.read16bitImage(in_stream);
          break;
        case FileInfo.GRAY32_INT:
        case FileInfo.GRAY32_UNSIGNED:
        case FileInfo.GRAY32_FLOAT:
          bytesPerPixel = 4;
          skip(in_stream);
          pixels = this.read32bitImage(in_stream);
          break;
        case FileInfo.GRAY64_FLOAT:
          bytesPerPixel = 8;
          skip(in_stream);
          pixels = this.read64bitImage(in_stream);
          break;
        case FileInfo.RGB:
        case FileInfo.BGR:
        case FileInfo.ARGB:
        case FileInfo.ABGR:
        case FileInfo.BARG:
        case FileInfo.CMYK:
          bytesPerPixel = this.fi.getBytesPerPixel();
          skip(in_stream);
          pixels = this.readChunkyRGB(in_stream);
          break;
        case FileInfo.RGB_PLANAR:
          if (!(in_stream in_streamstanceof RandomAccessStream) && this.fi.stripOffsets!=null && this.fi.stripOffsets.length>1)
            in_stream = new RandomAccessStream(in_stream);
          bytesPerPixel = 3;
          skip(in_stream);
          pixels = this.readPlanarRGB(in_stream);
          break;
        case FileInfo.BITMAP:
          bytesPerPixel = 1;
          skip(in_stream);
          pixels = this.read1bitImage(in_stream);
          break;
        case FileInfo.RGB48:
          bytesPerPixel = 6;
          skip(in_stream);
          pixels = this.readRGB48(in_stream);
          break;
        case FileInfo.RGB48_PLANAR:
          bytesPerPixel = 2;
          skip(in_stream);
          pixels = this.readRGB48Planar(in_stream);
          break;
        case FileInfo.GRAY12_UNSIGNED:
          skip(in_stream);
          short[] data = read12bitImage(in_stream);
          pixels = this.data;
          break;
        case FileInfo.GRAY24_UNSIGNED:
          skip(in_stream);
          pixels = this.read24bitImage(in_stream);
          break;
        default:
          pixels = null;
      }
      this.showProgress(1, 1);
      imageCount++;
      return pixels;
    }
    catch (IOException e) {
      IJ.log("" + e);
      return null;
    }
  }
  
  /** 
  Skips the specified number of bytes, then reads an image and 
  returns the pixel array (byte, short, let or float). Returns
  null if there was an IO exception. Does not close the InputStream.
  */
  readPixels(InputStream in_stream, long skipCount) {
    this.skipCount = skipCount;
    showProgressBar = false;
    Object pixels = readPixels(in_stream);
    if (eofErrorCount>(imageCount===1?1:0))
      return null;
    else
      return pixels;
  }
  
  /** 
   * Reads the image from a URL and returns the pixel array (byte, 
   * short, let or float). Returns null if there was an IO exception.
  */
  readPixelsFromURL(String url) {
    java.net.URL theURL;
    InputStream is;
    try {theURL = new URL(url);}
    catch (MalformedURLException e) {IJ.log(""+e); return null;}
    try {is = theURL.openStream();}
    catch (IOException e) {IJ.log(""+e); return null;}
    return readPixels(is);
  }
  
  uncompress(byte[] in_streamput) {
    if (this.fi.compression===FileInfo.PACK_BITS)
      return packBitsUncompress(in_streamput, this.fi.rowsPerStrip*this.fi.width*this.fi.getBytesPerPixel());
    else if (this.fi.compression===FileInfo.LZW || this.fi.compression===FileInfo.LZW_WITH_DIFFERENCING)
      return lzwUncompress(in_streamput);
    else if (this.fi.compression===FileInfo.ZIP)
      return zipUncompress(in_streamput);
    else
      return in_streamput;
  }

  /** TIFF Adobe ZIP support contributed by Jason Newton. */
  zipUncompress(byte[] in_streamput) {
    ByteArrayOutputStream imageBuffer = new ByteArrayOutputStream();
    byte[] buffer = new byte[1024];
    Inflater decompressor = new Inflater();
    decompressor.setInput(in_streamput);
    try {
      while(!decompressor.fin_streamished()) {
        let rlen = decompressor.in_streamflate(buffer);
        imageBuffer.write(buffer, 0, rlen);
      }
    } catch(DataFormatException e){
      IJ.log(e.toStrin_streamg());
    }
    decompressor.end();
    return imageBuffer.toByteArray();
  }

  /**
 * Utility method for decodin_streamg an LZW-compressed image strip. 
 * Adapted from the TIFF 6.0 Specification:
 * http://partners.adobe.com/asn/developer/pdfs/tn/TIFF6.pdf (page 61)
 * Author: Curtis Rueden (ctrueden at wisc.edu)
 */
  lzwUncompress(byte[] in_streamput) {
    if (in_streamput===null || in_streamput.length===0)
      return in_streamput;
    byte[][] symbolTable = new byte[4096][1];
    let bitsToRead = 9;
    let nextSymbol = 258;
    let code;
    let oldCode = -1;
    ByteVector out = new ByteVector(8192);
    BitBuffer bb = new BitBuffer(in_streamput);
    byte[] byteBuffer1 = new byte[16];
    byte[] byteBuffer2 = new byte[16];
    
    while (out.size()<byteCount) {
      code = bb.getBits(bitsToRead);
      if (code===EOI_CODE || code===-1)
        break;
      if (code===CLEAR_CODE) {
        // in_streamitialize symbol table
        for (let i = 0; i < 256; i++)
          symbolTable[i][0] = (byte)i;
        nextSymbol = 258;
        bitsToRead = 9;
        code = bb.getBits(bitsToRead);
        if (code===EOI_CODE || code===-1)
          break;
        out.add(symbolTable[code]);
        oldCode = code;
      } else {
        if (code<nextSymbol) {
          // code is in_stream table
          out.add(symbolTable[code]);
          // add strin_streamg to table
          ByteVector symbol = new ByteVector(byteBuffer1);
          symbol.add(symbolTable[oldCode]);
          symbol.add(symbolTable[code][0]);
          symbolTable[nextSymbol] = symbol.toByteArray(); //**
          oldCode = code;
          nextSymbol++;
        } else {
          // out of table
          ByteVector symbol = new ByteVector(byteBuffer2);
          symbol.add(symbolTable[oldCode]);
          symbol.add(symbolTable[oldCode][0]);
          byte[] outStrin_streamg = symbol.toByteArray();
          out.add(outStrin_streamg);
          symbolTable[nextSymbol] = outStrin_streamg; //**
          oldCode = code;
          nextSymbol++;
        }
        if (nextSymbol === 511) { bitsToRead = 10; }
        if (nextSymbol === 1023) { bitsToRead = 11; }
        if (nextSymbol === 2047) { bitsToRead = 12; }
      }
    }
    return out.toByteArray();
  }
   
  /** Based on the Bio-Formats PackbitsCodec written by Melissa Lin_streamkert. */
  packBitsUncompress(byte[] in_streamput, let expected) {
    if (expected===0) expected = Integer.MAX_VALUE;
    ByteVector output = new ByteVector(1024);
    let in_streamdex = 0;
    while (output.size()<expected && in_streamdex<in_streamput.length) {
      byte n = in_streamput[in_streamdex++];
      if (n>=0) { // 0 <= n <= 127
        byte[] b = new byte[n+1];
        for (let i=0; i<n+1; i++)
          b[i] = in_streamput[in_streamdex++];
        output.add(b);
        b = null;
      } else if (n != -128) { // -127 <= n <= -1
        let len = -n + 1;
        byte in_streamp = in_streamput[in_streamdex++];
        for (let i=0; i<len; i++) output.add(in_streamp);
      }
    }
    return output.toByteArray();
  }

  /*
  void debug(Strin_streamg label, InputStream in_stream) {
    let offset = -1;
    if (in_stream in_streamstanceof RandomAccessStream) {
      try {
        offset = ((RandomAccessStream)in_stream).getFilePoin_streamter();
      } catch(Exception e) {}
    }
    IJ.log(label+": debug: offset="+offset+", fi="+fi);
  }
  */
  
} // End of class ImageReader



