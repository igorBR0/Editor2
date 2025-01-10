import * as fs from 'fs';
import { readerCiff } from './Class/ReaderCiff';
import multer from 'multer';
import path from 'path';
import express from 'express';
import { Console } from 'console';
import { Builder } from 'xml2js';
import { Leitor } from '..class/Leitor';
import { off } from 'process';


//const xmlData: string = fs.readFileSync('ex.ciff', { encoding: 'utf16le' });
let xmlall:string;
let dataArchiveCiff:any;
let data_teste:any
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // save the uploaded file in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // to ensure file name uniqueness
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // create a unique filename
  },
});


const upload = multer({ storage: storage });

const app = express();
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.set('view engine', 'ejs');  // Definindo o motor de template como EJS
app.set('views', path.join(__dirname, 'Views'));  // Definindo a pasta de visualizações



app.get('/', (req, res) => {

  res.render('index_up');
});
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;

  xmlall = fs.readFileSync(filePath, { encoding: 'utf-16le' });
  
 
const ArchiveCiff = new readerCiff();

ArchiveCiff.WriteXML(xmlall);
data_teste = ArchiveCiff.readXML();
dataArchiveCiff= data_teste.ImageDesign.SubImage[0]


let tipo = data_teste.ImageDesign.Header[0].DateOffset[0].CurrentOffset[0]; 

let keyName = Object.keys(tipo)[0];


let valor_offset = Object.values(tipo)[0];



interface Campo {
    nome: string;
     valor: string;
     x: number   ;
     y: number;
     w:number;
     h:number;
     Offset_validade_type : string,
     offset_validade_valor : any,
  }
  var campos: Campo[] = []
for (let i = 0; i < dataArchiveCiff.Field.length; i++) {

// if (dataArchiveCiff.Field[i].$.Name == "Campo00" ||
// dataArchiveCiff.Field[i].$.Name == "Field09" || dataArchiveCiff.Field[i].$.Name == "STX"
// || dataArchiveCiff.Field[i].$.Name == "ETX"
// || dataArchiveCiff.Field[i].$.Name == "90" ||
// dataArchiveCiff.Field[i].$.Name == "11" ||
// dataArchiveCiff.Field[i].$.Name == "15" ||
// dataArchiveCiff.Field[i].$.Name == "10" ||
// dataArchiveCiff.Field[i].$.Name == "Campo01"||
// dataArchiveCiff.Field[i].$.Name == "Copy of codigo"||
// dataArchiveCiff.Field[i].$.Name == "FAB1"||
// dataArchiveCiff.Field[i].$.Name == "VAL1"|| 
// dataArchiveCiff.Field[i].$.Name == "Campo03"||
// dataArchiveCiff.Field[i].$.Name == "codigo"||
// dataArchiveCiff.Field[i].$.Name == "Copy of Lote"
// )
// {


// }else{


  campos.push({nome : dataArchiveCiff.Field[i].$.Name,
    Offset_validade_type:keyName,
    offset_validade_valor:valor_offset,
    valor : dataArchiveCiff.Field[i].CalcData[0],
    //  x : dataArchiveCiff.Field[i].X/120 ,
    //  y : dataArchiveCiff.Field[i].Y/120,
     x : dataArchiveCiff.Field[i].x,
     y : dataArchiveCiff.Field[i].y,
    h : dataArchiveCiff.Field[i].H/1200,
    w : dataArchiveCiff.Field[i].W/1200,
    


    });


   
       

    

  // }


  
}


 for (let i in campos){

    //  console.log(campos[i]);
}


res.render('index', { campos});
});


app.post('/submit', (req, res) => {
  const camposAlterados = req.body;  // Isso conterá os campos enviados pelo formulário
  //console.log(camposAlterados);  // Aqui você pode processar os dados

  // Redirecionar ou renderizar uma resposta
//  res.send('Campos atualizados com sucesso!');

const obj = camposAlterados;
console.log(Object.values(obj));  // { a: 1, b: 2, c: 3 }
// Converte para um array de valores
const valuesArray = Object.values(obj);
const valuesArray2 = Object.keys(obj); 

for (let i = 0; i < valuesArray2.length; i++) {
  const key = valuesArray2[i]; // A chave
  const value = obj[key]; // O valor correspondente à chave

  
  if (key === 'Day') {
   data_teste.ImageDesign.Header[0].DateOffset[0].CurrentOffset[0].Day= value;
   
  }else{

    data_teste.ImageDesign.Header[0].DateOffset[0].CurrentOffset[0].Year= value;
  }
}
// Converte para um array de chaves
const keysArray = Object.keys(obj);
//console.log(keysArray);  // ['a', 'b', 'c']
for (let i = 0; i < dataArchiveCiff.Field.length; i++){
  dataArchiveCiff.Field[i].$.Name = keysArray[i];
  dataArchiveCiff.Field[i].CalcData[0] = valuesArray[i];

} 


   // console.log(dataArchiveCiff)
   



  
   
  const makexml = new readerCiff();
  const result = makexml.builderxml(data_teste.ImageDesign )
  
  
  
    // Definir o caminho onde o XML será salvo
    const filePath = path.join(__dirname, 'meu_arquivo.xml');
  
    // Salvando o XML em um arquivo
    makexml.saveXmlToFile(result, filePath);
  
    // Enviar o arquivo para o cliente
    res.download(filePath, 'meu_arquivo.xml', (err) => {
      if (err) {
        console.error('Erro ao enviar arquivo:', err);
        res.status(500).send('Erro ao gerar o arquivo XML');
      }
   


 
});
});





//const teste: string = fs.readFileSync('ex.ciff', { encoding: 'utf16le' });
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
