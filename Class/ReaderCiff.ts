import fs from 'fs';
import path from 'path';
import * as xml2js from 'xml2js';
import { Builder } from 'xml2js';
export class readerCiff {
  private xml2js: typeof xml2js;
  private parsedData: any;
  private xmlString: string | null;

  constructor() {
    this.xml2js = xml2js;
    this.parsedData = null;
    this.xmlString = null;
  }

  WriteXML(xmlString: string): void {
    this.xmlString = xmlString;
    // const parser = new this.xml2js.Parser({ explicitArray: true });
    const parser = new this.xml2js.Parser();

    parser.parseString(this.xmlString, (err: Error | null, result: any) => {
      if (err) {
        console.error('Erro ao processar o XML:', err);
      } else {
        this.parsedData = result;
        //console.log (result)
      }
    });
  }

  readXML(): any {
    return this.parsedData;
  }

  builderxml(xml1:any){


    const builder = new Builder();
    const xml = builder.buildObject(xml1);
    return xml
  }
  saveXmlToFile(xmlData: string, filePath: string) {
    fs.writeFileSync(filePath, xmlData, { encoding: 'utf16le' });
  }
  
}
