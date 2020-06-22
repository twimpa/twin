export class Stream {
  static get ui8() {
    return new Uint8Array(8);
  }
  
  static to_i16(ui8_data) {
    return new Int16Array(ui8_data.buffer);
  }
  
  static to_i32(ui8_data) {
    return new Int32Array(ui8_data.buffer);
  }
  
  static to_ui32(ui8_data) {
    return new Uint32Array(ui8_data.buffer);
  }
  
  static to_float32(ui8_data) {
    return new Float32Array(ui8_data.buffer);
  }
  
  static to_float64(ui8_data) {
    return new Float64Array(ui8_data.buffer);
  }
} // End of class (File)Stream


// Little Endian Low-level Stream
export class StreamLittleEndian extends Stream {
  // TODO
}


// Big Endian Low-level Stream
export class StreamBigEndian extends Stream {

  constructor(buffer) {
    //TODO
    this.buff = buffer;
  }
  
  seek(pos) {
  
  }
  
  read() {
  
  }
  
  static nextZero(data, o) {
    while(data[o]!=0) o++;  
    return o;  
  };
  
  static readUshort(buff, p) {
     return (buff[p]<< 8) | buff[p+1];
  }
  
  static readShort(buff, p) {  
    let a= Stream.ui8;
    a[0]=buff[p+1];
    a[1]=buff[p+0];
    return Stream.to_i16(a)[0];
  }
  
  static readInt(buff, p) {
    let a= Stream.ui8;
    a[0]=buff[p+3];
    a[1]=buff[p+2];
    a[2]=buff[p+1];
    a[3]=buff[p+0];
    return Stream.to_i32(a)[0];
  }
  
  static readUint(buff, p) {
    let a = Stream.ui8;  
    a[0]=buff[p+3];  
    a[1]=buff[p+2];  
    a[2]=buff[p+1];  
    a[3]=buff[p+0];  
    return Stream.to_ui32(a)[0];  
  }
  
  static readASCII(buff, p, l) {
    let s = '' 
    for(let i=0; i<l; i++) {
      s += String.fromCharCode(buff[p+i]);
    }
   return s; 
  }
  
  static readFloat(buff, p) {
    let a = Stream.ui8;
    for(let i=0;i<4;i++) {
      a[i] = buff[p+3-i];
    }
    return Stream.to_float32(a)[0];  
  }
  
  static readDouble(buff, p) {
    let a=Stream.ui8;  
    for(let i=0;i<8;i++) {
      a[i] = buff[p+7-i];
    }
    return Stream.to_float64(a)[0];  
  }

/*
  static writeUshort(buff, p, n) {  buff[p] = (n>> 8)&255;  buff[p+1] =  n&255;  },
  static writeInt(buff, p, n) {  let a=UTIF._binBE.ui8;  UTIF._binBE.i32[0]=n;  buff[p+3]=a[0];  buff[p+2]=a[1];  buff[p+1]=a[2];  buff[p+0]=a[3];  },
  static writeUint(buff, p, n) {  buff[p] = (n>>24)&255;  buff[p+1] = (n>>16)&255;  buff[p+2] = (n>>8)&255;  buff[p+3] = (n>>0)&255;  },
  static writeASCIIn(buff, p, s) {  for(let i = 0; i < s.length; i++)  buff[p+i] = s.charCodeAt(i);  },
  static writeDouble(buff, p, n) {
    UTIF._binBE.fl64[0] = n;
    for (let i = 0; i < 8; i++) buff[p + i] = UTIF._binBE.ui8[7 - i];
  }
  */
  

  
} // End of class (File)StreamBigEndian


