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

const fundo = document.createElement("canvas"); fundo.width = W * S; fundo.height = H * S;
const f = fundo.getContext("2d");
function pintarFundo() {
  let s = 7; const rnd = () => (s = s * 16807 % 2147483647) / 2147483647;
  f.fillStyle = "#6fbf4a"; f.fillRect(0, 0, 320, 192);
  for (let i = 0; i < 180; i++) { f.fillStyle = rnd() < .7 ? "#5aa83c" : "#86d15a"; f.fillRect(Math.floor(rnd() * 318), Math.floor(rnd() * 190), 2, 1); }
  const cam = (x, y, w, h) => {
    f.fillStyle = "#d9b36b"; f.fillRect(x * S, y * S, w * S, h * S); f.fillStyle = "#c79a52";
    for (let i = 0; i < w * h * 4; i++) f.fillRect(x * S + Math.floor(rnd() * w * S), y * S + Math.floor(rnd() * h * S), 2, 1);
  };
  cam(1, 6, 18, 1); [3, 8, 13, 17].forEach(x => cam(x, 4, 1, 2)); cam(10, 7, 1, 2);
  f.fillStyle = "#4aa3df"; f.fillRect(15 * S, 8 * S, 4 * S, 3 * S);
  f.fillStyle = "#8fd0f5"; [[17, 70], [40, 20], [52, 44]].forEach(([a, b]) => f.fillRect(15 * S + a, 8 * S + b % 40, 6, 1));
  [[1, 7], [5, 3], [9, 5], [15, 3], [19, 8], [6, 11], [13, 8], [0, 6]].forEach(([x, y]) => { f.fillStyle = "#fff"; f.fillRect(x * S + 5, y * S + 6, 2, 2); f.fillStyle = "#f2b632"; f.fillRect(x * S + 9, y * S + 9, 2, 2); });
  ARV.forEach(([x, y]) => {
    f.fillStyle = "#6b4423"; f.fillRect(x * S + 6, y * S + 9, 4, 7);
    f.fillStyle = "#2f8f3a"; f.fillRect(x * S + 3, y * S, 10, 11); f.fillRect(x * S + 1, y * S + 2, 14, 7);
    f.fillStyle = "#4bb04e"; f.fillRect(x * S + 4, y * S + 2, 4, 3);
  });
  f.font = "7px 'Pixelify Sans',monospace"; f.textAlign = "center";
  CASAS.forEach(([x, y, tel, par, nm]) => {
    f.fillStyle = tel; f.fillRect(x * S - 2, y * S, 3 * S + 4, 2 * S);
    f.fillStyle = "#0003"; for (let i = 1; i < 4; i++) f.fillRect(x * S - 2, y * S + i * 8, 3 * S + 4, 1);
    f.fillStyle = par; f.fillRect(x * S, (y + 2) * S, 3 * S, S);
    f.fillStyle = "#4a2f1a"; f.fillRect((x + 1) * S + 3, (y + 2) * S + 3, 10, 13);
    f.fillStyle = "#9dd8f2"; f.fillRect(x * S + 3, (y + 2) * S + 4, 7, 6); f.fillRect((x + 2) * S + 6, (y + 2) * S + 4, 7, 6);
    f.fillStyle = "#fff"; f.fillText(nm, x * S + 24, y * S + 14);
  });
  f.fillStyle = "#6b7a8f"; f.fillRect(8 * S - 2, 9 * S, 5 * S + 4, 2 * S);
  f.fillStyle = "#d8d2c4"; f.fillRect(8 * S, 11 * S, 5 * S, S);
  f.fillStyle = "#8d8d8d"; f.fillRect(9 * S + 8, 11 * S + 2, 3 * S, 14); f.fillStyle = "#6f6f6f"; for (let i = 0; i < 4; i++) f.fillRect(9 * S + 8, 11 * S + 5 + i * 3, 3 * S, 1);
  f.fillStyle = "#fff"; f.fillText("Garagem", 10 * S + 8, 9 * S + 14);
}
pintarFundo(); document.fonts.ready.then(pintarFundo);

function sprite(c, x, y, p, dir, fr, bob) {
  const R = (a, b, w, h, col) => { c.fillStyle = col; c.fillRect(x + a, y + b + bob, w, h); };
  c.fillStyle = "#0003"; c.fillRect(x + 4, y + 14, 8, 2);
  R(5, 12, 2, 3 - fr, p.calca); R(9, 12, 2, 2 + fr, p.calca);
  R(4, 7, 8, 5, p.camisa); R(3, 8, 1, 3, p.pele); R(12, 8, 1, 3, p.pele);
  R(5, 2, 6, 5, p.pele);
  if (p.barba) R(5, 6, 6, 2, "#eee");
  if (dir === "u") R(5, 1, 6, 5, p.cabelo);
  else {
    R(5, 1, 6, 2, p.cabelo); R(5, 3, 1, 2, p.cabelo); R(10, 3, 1, 2, p.cabelo);
    const ex = dir === "l" ? -1 : dir === "r" ? 1 : 0;
    if (p.oculos) R(5, 4, 6, 1, "#222");
    R(6 + ex, 4, 1, 1, "#111"); R(9 + ex, 4, 1, 1, "#111");
  }
  if (p.chapeu) { R(3, 1, 10, 1, p.chapeu); R(5, 0, 6, 1, p.chapeu); }
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
function quadro(t) {
  const dt = Math.min(50, t - last); last = t;
  if (mov) { mov.t += dt / 130; if (mov.t >= 1) { P.x = mov.tx; P.y = mov.ty; mov = null; } }
  if (!mov && !ocupado() && dirs.length) tentar(dirs[dirs.length - 1]);
  cx.drawImage(fundo, 0, 0);
  const px = mov ? P.x + (mov.tx - P.x) * mov.t : P.x, py = mov ? P.y + (mov.ty - P.y) * mov.t : P.y;
  [...NPCS.map(n => ({ y: n.y, d: () => { sprite(cx, n.x * S, n.y * S - 2, n.pal, "d", 0, 0); if (pendente(n)) { cx.fillStyle = "#f2b632"; cx.font = "bold 11px 'Pixelify Sans',monospace"; cx.textAlign = "center"; cx.fillText("!", n.x * S + 8, n.y * S - 6 + Math.sin(t / 180) * 1.5); } } })),
   { y: py, d: () => sprite(cx, px * S, py * S - 2, P.pal, P.dir, mov && mov.t > .5 ? 1 : 0, 0) }]
    .sort((a, b) => a.y - b.y).forEach(e => e.d());
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
