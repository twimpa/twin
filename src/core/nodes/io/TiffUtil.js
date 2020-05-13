export class TiffUtil {

  static getInt(b1,b2,b3,b4) throws IOException {
    if (littleEndian)
      return ((b4 << 24) + (b3 << 16) + (b2 << 8) + (b1 << 0));
    else
      return ((b1 << 24) + (b2 << 16) + (b3 << 8) + b4);
  }

  static getUnsignedInt(b1,b2,b3,b4) throws IOException {
    return getInt(b1,b2,b3,b4) & 0xffffffffL;
  }

  static getShort(b1,b2) throws IOException {
    int b1 = in.read();
    int b2 = in.read();
    if (littleEndian)
      return ((b2<<8) + b1);
    else
      return ((b1<<8) + b2);
  }

  static readLong() throws IOException {
    if (littleEndian)
        return ((long)getInt()&0xffffffffL) + ((long)getInt()<<32);
      else
    return ((long)getInt()<<32) + ((long)getInt()&0xffffffffL);
        //return in.read()+(in.read()<<8)+(in.read()<<16)+(in.read()<<24)+(in.read()<<32)+(in.read()<<40)+(in.read()<<48)+(in.read()<<56);
  }

  static readDouble() throws IOException {
      return Double.longBitsToDouble(readLong());
  }
  
} // End of class TiffUtil
