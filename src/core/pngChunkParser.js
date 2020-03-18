/*
From https://stackoverflow.com/questions/28593763/how-to-extract-pixel-information-from-png-using-javascript-getimagedata-alterna

The only way to do this without using canvas and getImageData() is to load the PNG file as a binary typed array and parse the file in code "manually".

Prerequisites:

    For this you need the PNG specification which you can find here.
    You need to know how to use typed arrays (for this a DataView is the most suitable view).
    PNG files are chunk based and you will need to know how to parse chunks

A typical chunk based file has a four byte header called a FourCC identifier, followed by the size and misc. data depending on the file format definition.

Then chunks are placed right after this containing often a FOURCC (or four character code) and then the size of the chunk without the chunk header. In principle:

    MAGIC FOURCC
    SIZE/MISC    - depending on definition
    ...

    CHK1         - Chunk FourCC
    SIZE         - unsigned long
    .... data

    CHK2
    SIZE
    .... data

This format principle came originally from the Commodore Amiga platform and EA/IFF (Interleaved File Format) back in mid 80's.

But in modern days some vendors has extended or vary the chunk format, so for PNG chunks it will actually look like this:

Header (always 8 bytes and the same byte values):

‰PNG       (first byte is 0x89, see specs for reason)
CR + LF    0x0C0A
EOC + LF   0x1A0A

Chunks:

SIZE      (4 bytes, may be 0 (f.ex. IEND). Excl. chunk header and crc)
FOURCC    (4 bytes, ie. "IHDR", "IDAT")
[...data] (length: SIZE x bytes)
CRC32     (4 bytes representing the CRC-32 checksum of the data)

(see the referenced specification link above for details).

And the byte-order (endianess) for PNG is always big-endian ("network" order).

This makes it easy to parse through the file supporting only some (or all) chunks. For PNG you would need to support at least (source):

    IHDR must be the first chunk; it contains (in this order) the image's width, height, bit depth and color type.
    IDAT contains the image, which may be split between multiple IDAT chunks. Such splitting increases the file size slightly, but makes it easier to stream the PNG. The IDAT chunk contains the actual image data, which is the output stream of the compression algorithm.
    IEND marks the file end.

If you intend to support palette (color indexed) files you would also need to support the PLTE chunk. When you parse the IHDR chunk you will be able to see what color format is used (type 2 for RGB data, or 6 for RGBA and so on).

Parsing is itself easy so your biggest challenge would be supporting things like ICC profiles (when present in the iCCP chunk) to adjust the image color data. A typical chunk is the gamma chunk (gAMA) which contains a single gamma value you can apply to convert the data to linear format so that it displays correctly when display gamma is applied (there are also other special chunks related to colors).

The second biggest challenge would be the decompression which uses INFLATE. You can use a project such as PAKO zlib port to do this job for you and this port has performance close to native zlib. In addition to that, if you want to do error checking on the data (recommended) CRC-32 checking should also be supported.

For security reason you should always check that fields contain the data they're suppose to as well as that reserved space are initialized with either 0 or the defined data.

Hope this helps!

Example chunk parser: (note: won't run in IE).
*/

function pngParser(buffer) {

  var view = new DataView(buffer),
      len = buffer.byteLength,
      magic1, magic2,
      chunks = [],
      size, fourCC, crc, offset,
      pos = 0;  // current offset in buffer ("file")

  // check header
  magic1 = view.getUint32(pos); pos += 4;
  magic2 = view.getUint32(pos); pos += 4;

  if (magic1 === 0x89504E47 && magic2 === 0x0D0A1A0A) {

    // parse chunks
    while (pos < len) {

      // chunk header
      size = view.getUint32(pos);
      fourCC = getFourCC(view.getUint32(pos + 4));

      // data offset
      offset = pos + 8;
      pos = offset + size;

      // crc
      crc = view.getUint32(pos);
      pos += 4;

      // store chunk
      chunks.push({
        fourCC: fourCC,
        size: size,
        offset: offset,
        crc: crc
      })
    }

    return {chunks: chunks}
  } 
  else {
      return {error: "Not a PNG file."}
  }

  function getFourCC(int) {
    var c = String.fromCharCode;
    return c(int >>> 24) + c(int >>> 16 & 0xff) + c(int >>> 8 & 0xff) + c(int & 0xff);
  }
}

// USAGE: ------------------------------------------------

fetch("//i.imgur.com/GP6Q3v8.png")
  .then(function(resp) {return resp.arrayBuffer()}).then(function(buffer) {

  var info = pngParser(buffer);

  // parse each chunk here...
  for (var i = 0, chunks = info.chunks, chunk; chunk = chunks[i++];) {
    out("CHUNK : " + chunk.fourCC);
    out("SIZE  : " + chunk.size + " bytes");
    out("OFFSET: " + chunk.offset + " bytes");
    out("CRC   : 0x" + (chunk.crc>>>0).toString(16).toUpperCase());
    out("-------------------------------");
  }

  function out(txt) {document.getElementById("out").innerHTML += txt + "<br>"}
});


