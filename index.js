const crypto = require('crypto');
const fs = require('fs');
const isImage = require('is-image');
const fileExtension = require('file-extension');
const fileType = require('stream-file-type');
const isGzip = require('is-gzip');
const zlib = require('zlib');

// const mmm = require('mmmagic'),
//       Magic = mmm.Magic;

const path = './07a8cffdfe1c4a2caeef64152b4e3a81';

const gzip = zlib.createGzip();
let oHash = crypto.createHash('md5');
const readstream = fs.createReadStream(path); // начало читающего стрима

// Проверка на картинку и сверка мейм тайпа
let ext = fileExtension(path);
if(isImage(path) === true){
    console.log('It is image');
    const detector = new fileType();

detector.on('file-type', (fileType) => {
    if (fileType === null) {
      console.log(`The mime type of ${path} could not be determined`)
    } else {
        if(ext === fileType.ext){
            console.log('ext-type corresponds to mime-type');
        }
        else{
            console.log('ext-type does not match mime-type');
        }
    }
  });
  readstream.pipe(detector).resume();
}

// Определение мейм тайпа через магические числа 
// let magic = new Magic(mmm.MAGIC_MIME_TYPE);
//   magic.detectFile(path, function(err, result) {
//       if (err) throw err;
//       console.log(result);
//   });

readstream.on('readable', function(){
    let data = readstream.read();
    if(data){
        oHash.update(data);
    }
    else{
        hesh = oHash.digest('hex');
    }
});
 
readstream.on('end', function(){
    console.log("ReadStream - THE END");
});

// Пишущий стрим
const writestream = fs.createWriteStream(`./temp`);

writestream.on('finish', () => {
    console.log('WriteStream - THE END');
    fs.rename('./temp', `./${hesh}`, () => { // переименование временного файла именем контрольной суммы
        console.log('The end');
    });
});

// Объединение стримов в один и проверка сжатый ли файл
if(isGzip(fs.readFileSync(path)))
{
    readstream.pipe(writestream);
}
else{
    readstream.pipe(gzip).pipe(writestream);
}

