import { time } from 'console';
import { promises as fs } from 'fs';

const times = [];

init();

async function init() {
  try {
    const rodadas = JSON.parse(await fs.readFile('2003.json'));
    //inicializar array de times
    rodadas[0].partidas.forEach((partida) => {
      times.push({ time: partida.mandante, pontuacao: 0 });
      times.push({ time: partida.visitante, pontuacao: 0 });
    });

    //preencher a pontuacao dos times do array
    rodadas.forEach((rodada) => {
      rodada.partidas.forEach((partida) => {
        const timeMandante = times.find(
          (item) => item.time === partida.mandante
        );
        const timeVisitante = times.find(
          (item) => item.time === partida.visitante
        );

        if (partida.placar_mandante > partida.placar_visitante) {
          //+ 3 pontos
          timeMandante.pontuacao += 3;
        } else if (partida.placar_visitante > partida.placar_mandante) {
          //+3 pontos
          timeVisitante.pontuacao += 3;
        } else {
          timeVisitante.pontuacao += 1;
          timeMandante.pontuacao += 1;
        }
      });
      times.sort((a, b) => {
        return b.pontuacao - a.pontuacao;
      });
    });
    await salvaTimes();
    await SalvaQuatroPrimeiros();

    let timeMaiorNome = '';
    let timeMenorNome = times[0].time;
    times.forEach((item) => {
      if (item.time.length > timeMaiorNome.length) {
        timeMaiorNome = item.time;
      }
      if (item.time.length < timeMenorNome.length) {
        timeMenorNome = item.time;
      }
    });
    console.log(timeMaiorNome);
    console.log(timeMenorNome);
  } catch (err) {
    console.log(err);
  }
}
//salva times
async function salvaTimes() {
  await fs.writeFile('times.json', JSON.stringify(times, null, 2));
}

//salva os 4 primeiros times

async function SalvaQuatroPrimeiros() {
  await fs.writeFile(
    'quatroPrimeiros.json',
    JSON.stringify(times.slice(0, 4), null, 2)
  );
}
