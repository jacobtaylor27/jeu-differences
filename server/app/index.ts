// WARNING : Make sure to always import 'reflect-metadata' and 'module-alias/register' first
import 'reflect-metadata';
import 'module-alias/register';
import { Server } from '@app/server';
import { Container } from 'typedi';
import { BmpDecoder } from '@app/classes/bmp-decoder/bmp-decoder';
import { BmpCoordinate } from '@app/classes/bmp-coordinate/bmp-coordinate';
import { DifferenceInterpreter } from '@app/classes/difference-interpreter/difference-interpreter';

const filepath = './assets/test-bmp/ten_difference.bmp';
BmpDecoder.decode(filepath).then((bmpDecoded) => {
    const differences: BmpCoordinate[][] = DifferenceInterpreter.getCoordinates(bmpDecoded);
    console.log(differences);
})

const server: Server = Container.get(Server);
server.init();
