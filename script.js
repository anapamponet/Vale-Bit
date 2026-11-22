const ALBUNS = ["Processamento", "Memórias", "Comunicação", "Chips e núcleos"];
// Termos: [nome, álbum, pista]
const T = [
["CPU",0,"Cérebro do computador: busca, decodifica e executa as instruções dos programas."],
["ULA",0,"Circuito do processador que faz as contas e as comparações lógicas."],
["UC",0,"Dirige o processador: decide qual passo vem a seguir e coordena os demais blocos."],
["Registradores",0,"Pequenas posições dentro da CPU, as mais rápidas, que guardam dados em uso agora."],
["RAM",1,"Área volátil principal onde ficam dados e instruções em uso; perde tudo sem energia."],
["ROM",1,"Não volátil, vem gravada de fábrica e normalmente não se altera."],
["EEPROM",1,"Regravável, guarda configurações sem energia e permite alterar um único byte por vez."],
["Flash",1,"Não volátil e regravável, apaga por blocos; usada em pendrives e cartões de memória."],
["Cache",1,"Pequena e muito veloz, fica perto da CPU guardando cópias dos dados mais usados."],
["Memória de massa",1,"Guarda arquivos em grande quantidade e por muito tempo, como HD ou SSD."],
["DMA",2,"Recurso que transfere dados entre periféricos e RAM sem a CPU copiar cada byte."],
["Address bus",2,"Via que leva da CPU o número da posição a ser lida ou escrita."],
["Data bus",2,"Via de mão dupla que transporta o conteúdo trocado entre CPU e demais componentes."],
["Microcontrolador",3,"Chip único com processador, memórias e portas de entrada e saída, como no Arduino."],
["Dual core",3,"Processador com dois núcleos que podem trabalhar ao mesmo tempo."],
["Quad core",3,"Processador com quatro núcleos trabalhando em paralelo."]
];
const NPCS = [
 { id: "woz", nome: "Seu Woz", x: 10, y: 8, pal: { pele: "#f1c9a0", cabelo: "#ddd", camisa: "#4a6fa5", calca: "#555", barba: 1, oculos: 1 } },
 { id: "ada", nome: "Ada", x: 3, y: 4, album: 0, parte: "Processador", pal: { pele: "#e9b98f", cabelo: "#b5451b", camisa: "#d9572b", calca: "#4a3a6a" },
   intro: ["Sou a Ada, a ferreira dos processadores.", "Responda três perguntas e o processador é seu."],
   fim: "Você sabe como o processador pensa! Pode levar.", depois: "O processador está em boas mãos. Boa sorte!" },
 { id: "mem", nome: "Seu Mem", x: 8, y: 4, album: 1, parte: "Módulo de memória", pal: { pele: "#d9a273", cabelo: "#6b4423", camisa: "#3f8f4a", calca: "#3b5a9a", chapeu: "#e8c35a" },
   intro: ["Eu guardo de tudo no celeiro: o que uso hoje fica à mão, o resto vai para o fundo.", "Memória é comigo. Três perguntas e a peça é sua!"],
   fim: "Tem boa cabeça para guardar coisas. Leve o módulo!", depois: "Cuide bem desse módulo!" },
 { id: "bia", nome: "Bia", x: 13, y: 4, album: 2, parte: "Placa-mãe", pal: { pele: "#f1c9a0", cabelo: "#222", camisa: "#2d73d9", calca: "#2b2b3a", chapeu: "#2d73d9" },
   intro: ["Oi! Sou a Bia, do correio. Entrego tudo, de endereços a pacotes!", "Responda três perguntas sobre as vias e a placa-mãe é sua."],
   fim: "Entrega feita! Leve a placa-mãe.", depois: "Nada se perde nas minhas rotas!" },
 { id: "lina", nome: "Lina", x: 17, y: 4, album: 3, parte: "Módulo multinúcleo", pal: { pele: "#c98e66", cabelo: "#8a4fd0", camisa: "#f0f0f0", calca: "#3a3a4a", oculos: 1 },
   intro: ["Sou a Lina, da oficina de chips.", "Faço muito com pouco espaço. Prove que entende e o módulo multinúcleo é seu."],
   fim: "Impressionante! Leve o módulo.", depois: "Dois, quatro... quantos núcleos você quiser!" }
];
const woz = NPCS[0];
const WOZ_INTRO = ["Ora, ora! Você deve ser {nome}. Bem-vindo ao Vale Bit!", "Dizem por aí que você quer ser o novo Steve Jobs. Que sonho!", "Mas todo grande sonho começa com um computador, e os vizinhos guardam as peças.", "Fale com a Ada, o Seu Mem, a Bia e a Lina. Elas dão a peça se você provar que entende dela.", "Setas ou WASD para andar, E para conversar. Volte aqui com as 4 peças!"];
const ICON = ["🧠", "💾", "🔌", "⚙️"], PECAS = ["Processador", "Módulo de memória", "Placa-mãe", "Módulo multinúcleo"];
const SLOTS = [["Cérebro", "Onde a ULA e a UC buscam, decodificam e executam instruções."], ["Armazém", "Onde ficam os dados em uso e os arquivos guardados."], ["Estradas", "Por onde endereços e dados viajam entre os blocos."], ["Turbo", "Mais núcleos para trabalhar em paralelo, com um chip de controle."]];

const $ = (id) => document.getElementById(id);
const emb = (a) => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
const W = 20, H = 12, S = 16, V = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
let nome = "Aprendiz", partes = [], erros = 0, aprendidos = [], montado = false;

// ---------- som ----------
let ac, mudo = false, faixa = "vila", passo = 0;
const MEL = {
  vila: [72,0,76,0,79,0,76,0, 74,0,72,0,69,0,0,0, 67,0,72,0,76,0,74,0, 72,0,0,0,0,0,0,0],
  fim: [72,76,79,84,0,79,84,0, 74,77,81,86,0,81,86,0, 76,79,84,88,0,84,88,0, 84,0,79,0,84,0,0,0]
};
const BAIXO = {
  vila: [48,0,0,0,55,0,0,0, 53,0,0,0,48,0,0,0, 57,0,0,0,53,0,0,0, 55,0,0,0,48,0,0,0],
  fim: [48,0,48,0,55,0,55,0, 50,0,50,0,57,0,57,0, 52,0,52,0,59,0,59,0, 48,0,0,0,48,0,0,0]
};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
function tom(f, t, d, tipo, v) {
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = tipo; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + d);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d + .05);
}
function som(k) {
  if (!ac || mudo) return;
  const t = ac.currentTime, s = { ok: [[660, 0], [880, .1]], erro: [[160, 0], [120, .12]], item: [[523, 0], [659, .08], [784, .16], [1047, .24]], fala: [[420, 0]] }[k];
  s.forEach(([f, d]) => tom(f, t + d, k === "fala" ? .06 : .15, k === "erro" ? "sawtooth" : "square", .06));
}
setInterval(() => {
  if (!ac || mudo) return;
  const t = ac.currentTime + .05, m = MEL[faixa][passo % 32], b = BAIXO[faixa][passo % 32];
  if (m) tom(hz(m), t, .3, "triangle", .12);
  if (b) tom(hz(b), t, .45, "square", .035);
  passo++;
}, 200);
$("som").onclick = () => { mudo = !mudo; $("som").textContent = mudo ? "✕" : "♪"; };

// ---------- cenário ----------
const bloq = Array.from({ length: H }, () => Array(W).fill(false));
const bloquear = (x, y, w, h) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) bloq[j][i] = true; };
const CASAS = [[2, 1, "#b8452a", "#e8c48a", "Forja"], [7, 1, "#a33a3a", "#cf9b5a", "Celeiro"], [12, 1, "#2d73d9", "#e0d6b8", "Correio"], [16, 1, "#7d5ba6", "#d8d2c4", "Oficina"]];
CASAS.forEach(([x, y]) => bloquear(x, y, 3, 3));
bloquear(8, 9, 5, 3); bloquear(15, 8, 4, 3);
const ARV = [[0, 3], [6, 4], [11, 4], [15, 5], [19, 5], [1, 9], [5, 10], [14, 9]];
ARV.forEach(([x, y]) => bloquear(x, y, 1, 1));
const BUS = [[2,4],[4,4],[7,4],[9,4],[12,4],[14,4],[16,4],[18,4]];
BUS.forEach(([x, y]) => bloquear(x, y, 1, 1)); bloquear(0, 11, 7, 1);

const fundo = document.createElement("canvas"); fundo.width = W * S; fundo.height = H * S;
const f = fundo.getContext("2d");
const hex = h => { h = h.length === 4 ? "#" + [...h.slice(1)].map(c => c + c).join("") : h; return parseInt(h.slice(1), 16); };
const cor = (h, k) => { const n = hex(h); return `rgb(${[16, 8, 0].map(q => Math.min(255, ((n >> q) & 255) * k | 0))})`; };
const ret = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
const disco = (c, x, y, r, col) => { c.fillStyle = col; for (let j = -r; j <= r; j++) { const w = Math.floor(Math.sqrt(r * r - j * j + r)); c.fillRect(x - w, y + j, 2 * w + 1, 1); } };
const elipse = (c, x, y, rx, ry, col) => { c.fillStyle = col; for (let j = -ry; j <= ry; j++) { const w = Math.floor(rx * Math.sqrt(1 - (j * j) / (ry * ry + .01))); c.fillRect(x - w, y + j, 2 * w + 1, 1); } };
function pintarFundo() {
  let s = 7; const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
  ret(f, 0, 0, 320, 192, "#7cc24f");
  for (let i = 0; i < 60; i++) disco(f, rnd() * 320 | 0, rnd() * 192 | 0, 3 + (rnd() * 6 | 0), rnd() < .5 ? "#72b948" : "#86cc57");
  for (let i = 0; i < 260; i++) { const x = rnd() * 318 | 0, y = rnd() * 188 | 0, c = rnd() < .6 ? "#5aa33b" : "#9bdc66"; ret(f, x, y, 1, 2, c); ret(f, x + 2, y + 1, 1, 2, c); }
  const CAM = [[1,6,18,1],[3,4,1,2],[8,4,1,2],[13,4,1,2],[17,4,1,2],[10,7,1,2]];
  CAM.forEach(([x, y, w, h]) => ret(f, x * S - 1, y * S - 1, w * S + 2, h * S + 2, "#b58b4f"));
  CAM.forEach(([x, y, w, h]) => { ret(f, x * S, y * S, w * S, h * S, "#dcb775"); for (let i = 0; i < w * h * 7; i++) ret(f, x * S + (rnd() * (w * S - 1) | 0), y * S + (rnd() * (h * S - 1) | 0), 2, 1, rnd() < .5 ? "#c9a064" : "#ecd08f"); });
  elipse(f, 272, 152, 36, 28, "#e6cf93"); elipse(f, 272, 152, 32, 24, "#3f9bd8"); elipse(f, 272, 152, 24, 17, "#3589c4"); elipse(f, 266, 146, 12, 7, "#4aa8e2");
  disco(f, 258, 150, 3, "#3f9a4a"); disco(f, 284, 162, 3, "#3f9a4a"); ret(f, 258, 149, 2, 2, "#ff9ad5");
  [[1,7,"#ff7aa8"],[5,3,"#fff"],[9,5,"#ffd23f"],[15,3,"#8fb8ff"],[19,8,"#ff7aa8"],[6,11,"#ffd23f"],[13,8,"#fff"],[0,6,"#8fb8ff"],[14,11,"#ff7aa8"],[4,8,"#fff"]].forEach(([x, y, c]) => {
    const a = x * S + 6, b = y * S + 6; ret(f, a, b + 3, 1, 3, "#3f8f3a"); ret(f, a - 1, b + 1, 3, 1, c); ret(f, a, b, 1, 3, c); ret(f, a, b + 1, 1, 1, "#ffd23f");
  });
  for (let x = 0; x < 7 * S; x += 8) { ret(f, x + 2, 11 * S + 3, 3, 12, "#c8955a"); ret(f, x + 2, 11 * S + 3, 1, 12, "#e0b27a"); }
  ret(f, 0, 11 * S + 6, 7 * S, 2, "#b9824a"); ret(f, 0, 11 * S + 11, 7 * S, 2, "#b9824a");
  ARV.forEach(([x, y], i) => {
    const X = x * S + 8, Y = y * S; elipse(f, X + 1, Y + 15, 9, 3, "#0003");
    ret(f, X - 2, Y + 8, 4, 8, "#6b4423"); ret(f, X - 2, Y + 8, 1, 8, "#533419");
    const [a, b, c] = i % 3 === 1 ? ["#e58fb5", "#f3a6c8", "#fbd0e2"] : ["#2a7f3a", "#349a45", "#55bf62"];
    disco(f, X, Y + 5, 8, a); disco(f, X - 1, Y + 4, 7, b); disco(f, X - 3, Y + 2, 3, c); ret(f, X + 2, Y + 3, 2, 1, c);
  });
  BUS.forEach(([x, y]) => {
    const X = x * S + 8, Y = y * S + 10; elipse(f, X, Y + 5, 8, 2, "#0003");
    disco(f, X - 3, Y, 4, "#2f8f3a"); disco(f, X + 3, Y, 4, "#349a45"); disco(f, X, Y - 2, 4, "#3fa84b");
    [[-3, -1], [3, 1], [0, -3]].forEach(([a, b], k) => ret(f, X + a, Y + b, 2, 2, ["#ff7aa8", "#fff", "#ffd23f"][k]));
  });
  f.font = "bold 8px 'Pixelify Sans',monospace"; f.textAlign = "center";
  CASAS.forEach(([x, y, tel, par, nm]) => {
    const X = x * S, Y = y * S;
    elipse(f, X + 24, Y + 49, 30, 4, "#0003");
    ret(f, X + 34, Y - 2, 7, 12, "#8c4a3a"); ret(f, X + 33, Y - 3, 9, 2, "#6a3a2e");
    ret(f, X, Y + 30, 48, 18, par); ret(f, X, Y + 36, 48, 1, cor(par, .86)); ret(f, X, Y + 41, 48, 1, cor(par, .86)); ret(f, X, Y + 44, 48, 4, "#8f8f86");
    for (let r = 0; r < 7; r++) {
      const ins = [12, 8, 4, 0, 0, 0, 0][r], x0 = X - 3 + ins, w = 54 - 2 * ins, yy = Y + 4 + r * 4;
      ret(f, x0, yy, w, 4, tel); ret(f, x0, yy + 3, w, 1, cor(tel, .72));
      for (let q = x0 + (r % 2) * 4; q < x0 + w; q += 8) ret(f, q, yy, 1, 3, cor(tel, .86));
    }
    ret(f, X + 10, Y + 2, 28, 3, cor(tel, 1.25)); ret(f, X, Y + 33, 48, 2, "#0003");
    ret(f, X + 20, Y + 35, 9, 13, "#5b3a1f"); ret(f, X + 21, Y + 34, 7, 1, "#5b3a1f"); ret(f, X + 26, Y + 42, 1, 1, "#f2b632");
    [5, 33].forEach(w => { ret(f, X + w, Y + 35, 10, 8, "#3b2314"); ret(f, X + w + 1, Y + 36, 8, 6, "#ffe9a8"); ret(f, X + w + 4, Y + 36, 1, 6, "#3b2314"); ret(f, X + w + 1, Y + 38, 8, 1, "#3b2314"); ret(f, X + w - 1, Y + 43, 12, 2, "#7a4a22"); ret(f, X + w, Y + 42, 2, 1, "#ff7aa8"); ret(f, X + w + 4, Y + 42, 2, 1, "#fff"); ret(f, X + w + 8, Y + 42, 2, 1, "#ffd23f"); });
    f.fillStyle = "#0007"; f.fillText(nm, X + 25, Y + 21); f.fillStyle = "#fff"; f.fillText(nm, X + 24, Y + 20);
  });
  elipse(f, 168, 189, 44, 4, "#0003");
  ret(f, 125, 144, 86, 32, "#6b7a8f"); for (let i = 0; i < 8; i++) ret(f, 125, 146 + i * 4, 86, 1, "#5a6a80");
  ret(f, 128, 176, 80, 16, "#d9d3c4"); ret(f, 144, 178, 48, 14, "#8d97a3"); for (let i = 0; i < 4; i++) ret(f, 144, 181 + i * 3, 48, 1, "#6f7b88");
  ret(f, 197, 184, 8, 8, "#b98a4e"); ret(f, 197, 184, 8, 1, "#8a6030"); ret(f, 131, 184, 6, 8, "#4bb04e");
  f.fillStyle = "#0007"; f.fillText("Garagem", 169, 163); f.fillStyle = "#fff"; f.fillText("Garagem", 168, 162);
}
pintarFundo(); document.fonts.ready.then(pintarFundo);

function sprite(c, x, y, p, dir, fr, bob) {
  const A = [[5,12,2,3-fr,p.calca],[9,12,2,2+fr,p.calca],[4,7,8,5,p.camisa],[3,8+fr,1,4,p.pele],[12,9-fr,1,4,p.pele],[5,2,6,5,p.pele],[5,1,6,3,p.cabelo]];
  if (p.chapeu) A.push([3,1,10,1,p.chapeu],[5,-1,6,2,p.chapeu]);
  ret(c, x + 4, y + 14, 8, 2, "#0003");
  c.fillStyle = "#2a1810"; A.forEach(([a, b, w, h]) => c.fillRect(x + a - 1, y + b + bob - 1, w + 2, h + 2));
  A.forEach(([a, b, w, h, col]) => ret(c, x + a, y + b + bob, w, h, col));
  ret(c, x + 4, y + 11 + bob, 8, 1, cor(p.camisa, .7)); ret(c, x + 5, y + 8 + bob, 2, 3, cor(p.camisa, 1.25));
  ret(c, x + 5, y + 5 + bob, 6, 1, cor(p.pele, .92));
  if (dir === "u") ret(c, x + 5, y + 2 + bob, 6, 5, p.cabelo);
  else {
    ret(c, x + 5, y + 3 + bob, 1, 2, p.cabelo); ret(c, x + 10, y + 3 + bob, 1, 2, p.cabelo);
    const ex = dir === "l" ? -1 : dir === "r" ? 1 : 0;
    if (p.oculos) ret(c, x + 5, y + 4 + bob, 6, 1, "#222");
    ret(c, x + 6 + ex, y + 4 + bob, 1, 1, "#111"); ret(c, x + 9 + ex, y + 4 + bob, 1, 1, "#111");
    if (p.barba) ret(c, x + 5, y + 6 + bob, 6, 2, "#eee");
  }
  if (p.chapeu) { ret(c, x + 3, y + 1 + bob, 10, 1, p.chapeu); ret(c, x + 5, y - 1 + bob, 6, 2, p.chapeu); ret(c, x + 3, y + 1 + bob, 10, 1, cor(p.chapeu, .8)); }
}
const P = { x: 10, y: 7, dir: "d", pal: { pele: "#f1c9a0", cabelo: "#4a2e1a", camisa: "#1d1d1d", calca: "#4a6fa5", oculos: 1 } };

// ---------- diálogo ----------
let linhas = [], li = 0, fala = "", tim = null, fimCb = null, digitando = false;
const dlg = $("dlg");
function abrir(n) {
  $("quem").textContent = n.nome;
  const c = $("retrato").getContext("2d"); c.clearRect(0, 0, 16, 16); sprite(c, 0, 0, n.pal, "d", 0, 0);
  dlg.hidden = false;
}
function digitar(txt) {
  clearInterval(tim); fala = txt; const el = $("texto"); el.textContent = ""; let i = 0; digitando = true;
  tim = setInterval(() => { el.textContent = txt.slice(0, ++i); if (i >= txt.length) { clearInterval(tim); digitando = false; } }, 22);
}
function mostrar() { $("escolhas").replaceChildren(); digitar(linhas[li].replace("{nome}", nome)); som("fala"); }
function dialogo(n, ls, fim) { linhas = ls; li = 0; fimCb = fim; abrir(n); mostrar(); }
function avancar() {
  if (dlg.hidden || $("escolhas").children.length) return;
  if (digitando) { clearInterval(tim); $("texto").textContent = fala; digitando = false; return; }
  if (++li < linhas.length) return mostrar();
  dlg.hidden = true; const c = fimCb; fimCb = null; if (c) c();
}
dlg.onclick = avancar;
function escolher(n, txt, ops, cb) {
  abrir(n); clearInterval(tim); digitando = false; $("texto").textContent = txt;
  $("escolhas").replaceChildren(...ops.map((o, k) => {
    const b = document.createElement("button"); b.textContent = `${k + 1}. ${o}`;
    b.onclick = (e) => { e.stopPropagation(); cb(k); }; return b;
  }));
  $("escolhas").firstChild.focus();
}

// ---------- missões ----------
function opcoes(t) {
  const a = emb(T.filter(x => x !== t && x[1] === t[1])), b = emb(T.filter(x => x[1] !== t[1]));
  return emb([t, ...[...a, ...b].slice(0, 3)]);
}
function missao(n) {
  const qs = emb(T.filter(t => t[1] === n.album)).slice(0, 3), elogio = ["Isso mesmo!", "Boa! Você entende do assunto.", "Perfeito!"];
  let i = 0;
  const perg = () => {
    const t = qs[i];
    const ask = (o, pre) => escolher(n, `${pre}Qual termo é este?\n${t[2]}`, o.map(x => x[0]), k => {
      if (o[k] === t) {
        som("ok"); aprendidos.push(t[0]);
        if (++i < qs.length) dialogo(n, [elogio[i - 1]], perg);
        else { partes.push(n.album); som("item"); hud(); dialogo(n, [n.fim, `Você ganhou: ${n.parte}!`], () => { n.feito = true; }); }
      } else { erros++; som("erro"); ask(o.filter((_, j) => j !== k), "Hmm, não é esse. "); }
    });
    ask(opcoes(t), "");
  };
  perg();
}
const pendente = (n) => n.id === "woz" ? (!n.visto || (partes.length === 4 && !montado)) : !n.feito;
function conversar(n) {
  if (n.id === "woz") {
    if (!n.visto) { n.visto = 1; return dialogo(n, WOZ_INTRO); }
    if (partes.length < 4) return dialogo(n, [`Faltam ${4 - partes.length} peças, {nome}. Fale com Ada, Seu Mem, Bia e Lina.`]);
    return dialogo(n, ["Você trouxe tudo! Vamos para a garagem montar essa máquina."], montar);
  }
  n.feito ? dialogo(n, [n.depois]) : dialogo(n, n.intro, () => missao(n));
}
function hud() { $("pecas").innerHTML = ICON.map((ic, i) => `<span class="${partes.includes(i) ? "tem" : ""}">${ic}</span>`).join(""); }

// ---------- montagem e final ----------
function montar() {
  const el = $("montagem"); el.hidden = false; let sel = null, msg = "Escolha uma peça e depois o espaço onde encaixar.";
  const inst = [];
  const desenhar = () => {
    el.innerHTML = `<h2>Garagem do Seu Woz</h2><p id="m"></p><div class="mont"><div class="inv">${PECAS.map((p, i) => inst.includes(i) ? "" : `<button data-p="${i}" class="${sel === i ? "sel" : ""}">${ICON[i]} ${p}</button>`).join("")}</div><div class="slots">${SLOTS.map((s, i) => `<button data-s="${i}" class="${inst.includes(i) ? "ok" : ""}"><b>${inst.includes(i) ? ICON[i] + " " + PECAS[i] : s[0]}</b><small>${s[1]}</small></button>`).join("")}</div></div>`;
    $("m").textContent = msg;
    el.querySelectorAll("[data-p]").forEach(b => b.onclick = () => { sel = +b.dataset.p; msg = "Agora clique no espaço certo."; desenhar(); });
    el.querySelectorAll("[data-s]").forEach(b => b.onclick = () => {
      const i = +b.dataset.s; if (inst.includes(i)) return;
      if (sel === null) msg = "Escolha uma peça antes.";
      else if (sel === i) { inst.push(i); sel = null; som("item"); msg = "Encaixou!"; if (inst.length === 4) { desenhar(); return setTimeout(boot, 700); } }
      else { erros++; som("erro"); msg = "Essa peça não serve aqui. Leia a dica de cada espaço."; }
      desenhar();
    });
  };
  desenhar();
}
function boot() {
  const el = $("montagem"); el.innerHTML = `<pre id="boot"></pre>`;
  const ls = [`Ligando o computador de ${nome}...`, "UC buscando instrução... ok", "ULA calculando... ok", "Registradores e cache... ok", "RAM e memória de massa... ok", "Barramentos de endereço e dados... ok", "Núcleos acordando... ok", "Sistema iniciado."];
  let i = 0; const t = setInterval(() => { $("boot").textContent += ls[i++] + "\n"; som("fala"); if (i >= ls.length) { clearInterval(t); setTimeout(final, 1100); } }, 550);
}
function final() {
  montado = true; faixa = "fim"; passo = 0;
  const el = $("montagem"); el.className = "tela fim";
  el.innerHTML = `<h1>${"Novo Steve Jobs"}</h1><h2></h2>
    <p>As luzes do palco se apagam. Você ergue o computador que montou com as próprias mãos e diz: “Mais uma coisa…”</p>
    <p>Erros pelo caminho: ${erros}. Termos que você dominou:</p><ul>${aprendidos.map(a => `<li></li>`).join("")}</ul>
    <button class="grande" onclick="location.reload()">Jogar de novo</button>`;
  el.querySelector("h2").textContent = `${nome}, a plateia é sua.`;
  el.querySelectorAll("li").forEach((li, i) => { li.textContent = aprendidos[i]; });
}

// ---------- movimento e laço ----------
const cv = $("mapa"), cx = cv.getContext("2d");
let mov = null, dirs = [], last = 0;
const ocupado = () => !dlg.hidden || !$("montagem").hidden || !$("titulo").hidden;
const livre = (x, y) => x >= 0 && y >= 0 && x < W && y < H && !bloq[y][x] && !NPCS.some(n => n.x === x && n.y === y);
function tentar(d) {
  P.dir = d; const nx = P.x + V[d][0], ny = P.y + V[d][1];
  if (livre(nx, ny)) mov = { tx: nx, ty: ny, t: 0 };
}
function agir() {
  if (mov || ocupado()) return;
  const n = NPCS.find(n => Math.abs(n.x - P.x) + Math.abs(n.y - P.y) === 1); if (n) conversar(n);
}
const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
const luz = (() => { const g = cx.createRadialGradient(160, 96, 60, 160, 96, 200); g.addColorStop(0, "rgba(255,230,160,.06)"); g.addColorStop(1, "rgba(40,20,80,.32)"); return g; })();
function bolha(x, y, t) {
  const b = y - 12 + (calmo ? 0 : Math.sin(t / 180) * 1.5 | 0);
  ret(cx, x + 3, b, 10, 9, "#2a1810"); ret(cx, x + 4, b + 1, 8, 7, "#fff6d8"); ret(cx, x + 7, b + 9, 3, 2, "#2a1810"); ret(cx, x + 8, b + 8, 1, 1, "#fff6d8");
  ret(cx, x + 7, b + 2, 2, 3, "#d98a1a"); ret(cx, x + 7, b + 6, 2, 1, "#d98a1a");
}
function efeitos(t) {
  for (let i = 0; i < 12; i++) {
    const x = 240 + ((i * 29 + t / 50) % 60), y = 132 + (i * 17 % 40);
    if (((x - 272) / 30) ** 2 + ((y - 152) / 22) ** 2 < 1) ret(cx, x | 0, y | 0, 4, 1, "#ffffff80");
  }
  CASAS.forEach(([x, y], j) => { for (let k = 0; k < 3; k++) {
    const ph = ((t / 1500) + k / 3 + j * .2) % 1;
    disco(cx, x * S + 37 + (Math.sin(ph * 7 + k) * 2 | 0), y * S - 4 - (ph * 20 | 0), 1 + (ph * 2 | 0), `rgba(255,255,255,${.55 * (1 - ph)})`);
  } });
  if (!calmo) {
    [[60, 40, "#ff9ad5"], [200, 110, "#ffe066"], [120, 150, "#8fd8ff"]].forEach(([bx, by, col], i) => {
      const x = bx + Math.sin(t / 900 + i * 2) * 28 + Math.sin(t / 330 + i) * 4, y = by + Math.cos(t / 700 + i * 3) * 16, w = Math.sin(t / 60 + i * 5) > 0 ? 1 : 2;
      ret(cx, x | 0, y | 0, 1, 1, "#222"); ret(cx, (x - w) | 0, (y - 1) | 0, w, 2, col); ret(cx, (x + 1) | 0, (y - 1) | 0, w, 2, col);
    });
    for (let i = 0; i < 8; i++) ret(cx, ((i * 61 + t / 35) % 340 - 10) | 0, ((i * 29 + t / 70) % 200 - 4) | 0, 2, 1, "#ffc2dc");
  }
  cx.fillStyle = luz; cx.fillRect(0, 0, 320, 192);
}
function quadro(t) {
  const dt = Math.min(50, t - last); last = t;
  if (mov) { mov.t += dt / 130; if (mov.t >= 1) { P.x = mov.tx; P.y = mov.ty; mov = null; } }
  if (!mov && !ocupado() && dirs.length) tentar(dirs[dirs.length - 1]);
  cx.drawImage(fundo, 0, 0);
  const px = mov ? P.x + (mov.tx - P.x) * mov.t : P.x, py = mov ? P.y + (mov.ty - P.y) * mov.t : P.y;
  const ents = NPCS.map(n => ({ y: n.y, d: () => {
    const dx = P.x - n.x, dy = P.y - n.y, perto = Math.abs(dx) + Math.abs(dy) <= 2;
    const dr = perto && Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "r" : "l") : "d";
    sprite(cx, n.x * S, n.y * S - 2, n.pal, dr, 0, !calmo && Math.sin(t / 450 + n.x) > .8 ? -1 : 0);
    if (pendente(n)) bolha(n.x * S, n.y * S - 2, t);
  } }));
  ents.push({ y: py, d: () => sprite(cx, px * S, py * S - 2, P.pal, P.dir, mov && mov.t > .5 ? 1 : 0, 0) });
  ents.sort((a, b) => a.y - b.y).forEach(e => e.d());
  efeitos(t);
  requestAnimationFrame(quadro);
}
const TECLAS = { ArrowUp: "u", w: "u", ArrowDown: "d", s: "d", ArrowLeft: "l", a: "l", ArrowRight: "r", d: "r" };
document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") return;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key, d = TECLAS[k];
  if (d) { e.preventDefault(); if (!dirs.includes(d)) dirs.push(d); return; }
  if (/^[1-4]$/.test(k) && $("escolhas").children.length) return $("escolhas").children[+k - 1]?.click();
  if (e.target.tagName === "BUTTON") return;
  if (k === "e" || k === "Enter" || k === " ") { e.preventDefault(); dlg.hidden ? agir() : avancar(); }
});
document.addEventListener("keyup", e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; dirs = dirs.filter(d => d !== TECLAS[k]); });
document.querySelectorAll("#pad [data-d]").forEach(b => {
  b.onpointerdown = () => { if (!dirs.includes(b.dataset.d)) dirs.push(b.dataset.d); };
  b.onpointerup = b.onpointerleave = () => { dirs = dirs.filter(d => d !== b.dataset.d); };
});
$("agir").onclick = () => (dlg.hidden ? agir() : avancar());
$("jogar").onclick = () => {
  nome = $("nome").value.trim() || "Aprendiz";
  ac = new (window.AudioContext || window.webkitAudioContext)();
  $("titulo").hidden = true; hud(); conversar(woz);
};
hud(); requestAnimationFrame(quadro);