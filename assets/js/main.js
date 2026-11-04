(function () {
  document.documentElement.classList.add('js');
  // ===== Configuração — só dados confirmados =====
  var WHATSAPP_NUMERO = '5531985165569';
  var TELEFONE_NUMERO = '553132265509';
  var ENDERECO_ROTA   = 'Positiva Som e Acessórios, Av. Brigadeiro Eduardo Gomes, 1949 A - Glória, Belo Horizonte - MG, 30870-100';
  // De onde veio o contato: vira uma frase natural na mensagem do WhatsApp (sem código)
  var FRASES_ORIGEM   = { google: 'Vi o anúncio da Positiva no Google',
                          site:   'Vim pelo site da Positiva' };
  // Google Ads: rótulo de cada conversão, no formato 'AW-123456789/AbCdEfGhIjk'
  // (Google Ads → Metas → Conversões → abrir a ação → Configuração da tag → "Usar o Google Tag Manager" mostra o ID e o rótulo).
  // Enquanto tiver {{ }}, a conversão não é enviada.
  var CONVERSOES_ADS  = {
    whatsapp: '{{AW_ID}}/{{ROTULO_WHATSAPP}}',   // principal: é a que a campanha otimiza
    telefone: '{{AW_ID}}/{{ROTULO_TELEFONE}}',   // secundária: só observação
    rota:     '{{AW_ID}}/{{ROTULO_ROTA}}'        // secundária: só observação
  };
  // ===============================================

  // Textos do topo por serviço — usam frases que a própria Positiva publica no Instagram
  var SERVICOS = {
    geral:      { titulo: 'Seu carro também merece <span class="marca">um upgrade.</span>',
                  sub: 'Multimídia, insulfilm, som, Shift Power, estética automotiva e acessórios.',
                  msg: 'Olá! Vim pelo site da Positiva e quero fazer um orçamento.' },
    multimidia: { titulo: 'Seu painel também merece <span class="marca">upgrade.</span>',
                  sub: 'Central multimídia com espelhamento do celular e câmera.',
                  msg: 'Olá! Vim pelo site da Positiva e quero um orçamento de multimídia.' },
    insulfilm:  { titulo: 'Visibilidade e <span class="marca">proteção</span> no ponto certo.',
                  sub: 'Insulfilm com proteção UV, conforto térmico e privacidade, dentro das normas do CONTRAN.',
                  msg: 'Olá! Vim pelo site da Positiva e quero um orçamento de insulfilm.' },
    som:        { titulo: 'Conforto no carro não é luxo. <span class="marca">É rotina melhor.</span>',
                  sub: 'Instalação e recuperação de som automotivo: caixas de som, alto-falantes e mais.',
                  msg: 'Olá! Vim pelo site da Positiva e quero um orçamento de som.' },
    shiftpower: { titulo: 'Shift Power. <span class="marca">Pergunte se tem para o seu carro.</span>',
                  sub: 'Interface de performance da Faaftech que elimina o atraso do acelerador. Plug and play, sem alterar a originalidade do carro.',
                  msg: 'Olá! Vim pelo site da Positiva e quero saber do Shift Power.' },
    acessorios: { titulo: 'Tem detalhe que <span class="marca">muda o carro inteiro.</span>',
                  sub: 'Iluminação Full LED, alarme e antifurto, trava elétrica, engate e reboque.',
                  msg: 'Olá! Vim pelo site da Positiva e quero um orçamento de acessórios.' },
    estetica:   { titulo: 'Bonito por fora. <span class="marca">Bem cuidado por inteiro.</span>',
                  sub: 'Lavagem detalhada, polimento, vitrificação, higienização interna e martelinho de ouro.',
                  msg: 'Olá! Vim pelo site da Positiva e quero um orçamento de estética automotiva.' },
    martelinho: { titulo: 'Amassadinho na lataria? <span class="marca">Martelinho de ouro.</span>',
                  sub: 'Martelinho de ouro para pequenos amassados na lataria.',
                  msg: 'Olá! Vim pelo site da Positiva e quero um orçamento de martelinho de ouro.' },
    plotagem:   { titulo: 'Quer mudar o visual? <span class="marca">Plotagem.</span>',
                  sub: 'Plotagem para mudar o visual do seu carro.',
                  msg: 'Olá! Vim pelo site da Positiva e quero um orçamento de plotagem.' }
  };

  function limpar(v, max) { return String(v || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, max); }
  var busca = null;
  try { busca = new URLSearchParams(window.location.search); } catch (e) {}
  // Veio do Google Ads? O próprio Google acrescenta gclid/gbraid/wbraid ao link do anúncio.
  // Também vale ?o=google no link, para quando a marcação automática estiver desligada.
  var veioDoGoogle = !!(busca && (busca.get('gclid') || busca.get('gbraid') || busca.get('wbraid'))) ||
                     /^g(oogle|ads)/i.test(limpar(busca && busca.get('o'), 24));
  var ORIGEM = veioDoGoogle ? 'google' : 'site';
  var pedido = limpar(busca && busca.get('s'), 20).toLowerCase();              // ?s= qual serviço no topo
  var SERVICO_TOPO = SERVICOS[pedido] ? pedido : 'geral';

  // Cada clique em WhatsApp, telefone ou rota avisa o Analytics (observação) e o Google Ads (conversão)
  function registrar(canal, rotulo) {
    var evento = { whatsapp: 'clique_whatsapp', telefone: 'clique_telefone', rota: 'clique_rota' }[canal];
    if (typeof gtag === 'function') {
      gtag('event', evento, { botao: rotulo, origem: ORIGEM, versao_topo: SERVICO_TOPO });
      var conv = CONVERSOES_ADS[canal];
      if (conv && conv.indexOf('{{') === -1) gtag('event', 'conversion', { send_to: conv });
    }
    if (typeof fbq === 'function') {                        // só se o Pixel da Meta for ligado um dia
      fbq('track', canal === 'rota' ? 'FindLocation' : 'Contact', { content_name: ORIGEM, botao: rotulo, canal: canal });
    }
  }


  function linkWhats(chave, msg) {
    var texto = (msg || SERVICOS[chave].msg).replace(FRASES_ORIGEM.site, FRASES_ORIGEM[ORIGEM]);
    return 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(texto);
  }

  function atualizarLinks() {
    document.querySelectorAll('.zap').forEach(function (el) {
      var chave = el.getAttribute('data-servico') || SERVICO_TOPO;
      el.setAttribute('href', linkWhats(chave, el.getAttribute('data-msg')));
      el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener');
    });
  }

  // Celular: o carrossel de serviços abre no card do serviço do anúncio (?s=)
  function abrirCardDoServico(chave) {
    var grade = document.querySelector('.grade');
    if (!grade || grade.scrollWidth <= grade.clientWidth) return;   // computador: grade normal, nada a fazer
    var cards = grade.querySelectorAll(':scope > .card');
    var bt = grade.querySelector('.card > .btn[data-servico="' + chave + '"]');
    var alvo = bt ? bt.closest('.card') : cards[0];
    grade.scrollLeft = alvo.offsetLeft - cards[0].offsetLeft;
  }

  function aplicarTopo(chave) {
    SERVICO_TOPO = chave;
    document.getElementById('hero-titulo').innerHTML = SERVICOS[chave].titulo;
    document.getElementById('hero-sub').innerHTML = SERVICOS[chave].sub;
    atualizarLinks();
    abrirCardDoServico(chave);
  }

  document.querySelectorAll('.zap').forEach(function (el) {
    el.addEventListener('click', function () { registrar('whatsapp', el.getAttribute('data-botao') || 'sem-rotulo'); });
  });
  document.querySelectorAll('.tel').forEach(function (el) {
    el.setAttribute('href', 'tel:+' + TELEFONE_NUMERO);
    el.addEventListener('click', function () { registrar('telefone', el.getAttribute('data-botao') || 'sem-rotulo'); });
  });
  document.querySelectorAll('.rota').forEach(function (el) {
    el.setAttribute('href', 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(ENDERECO_ROTA));
    el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener');
    el.addEventListener('click', function () { registrar('rota', el.getAttribute('data-botao') || 'sem-rotulo'); });
  });


  aplicarTopo(SERVICO_TOPO);

  // Acessórios: "E muito mais" abre a lista extra dentro do card
  document.querySelectorAll('.abre-mais').forEach(function (bt) {
    var painel = document.getElementById(bt.getAttribute('aria-controls'));
    if (!painel) return;
    var voltar = painel.querySelector('.mais-voltar');
    bt.addEventListener('click', function () {
      painel.hidden = false; bt.setAttribute('aria-expanded', 'true'); if (voltar) voltar.focus();
    });
    if (voltar) voltar.addEventListener('click', function () {
      painel.hidden = true; bt.setAttribute('aria-expanded', 'false'); bt.focus();
    });
  });

  // Mini-galerias: setas e pontos trocam a foto dentro do card
  document.querySelectorAll('.galeria-card').forEach(function (g) {
    var fotos = g.querySelectorAll('.gc-foto'), pontos = g.querySelector('.gc-pontos'), conta = g.querySelector('.gc-conta'), atual = 0;
    if (fotos.length < 2) { g.querySelectorAll('.gc-ant,.gc-prox').forEach(function (b) { b.hidden = true; }); return; }
    fotos.forEach(function () { pontos.appendChild(document.createElement('i')); });
    function mostra(n) {
      atual = (n + fotos.length) % fotos.length;
      fotos.forEach(function (f, i) { f.classList.toggle('ativa', i === atual); });
      pontos.querySelectorAll('i').forEach(function (p, i) { p.classList.toggle('on', i === atual); });
      conta.textContent = 'Foto ' + (atual + 1) + ' de ' + fotos.length;
      var leg = g.querySelector('.gc-legenda');
      if (leg) { var t = fotos[atual].getAttribute('data-legenda'); leg.innerHTML = t ? '<span></span>' : ''; if (t) leg.firstChild.textContent = t; }
    }
    g.querySelector('.gc-ant').addEventListener('click', function () { mostra(atual - 1); });
    g.querySelector('.gc-prox').addEventListener('click', function () { mostra(atual + 1); });
    mostra(0);
  });

  // Antes e depois: troca a foto do card sem sair da página
  document.querySelectorAll('.antes-depois').forEach(function (fig) {
    fig.querySelectorAll('[data-ad]').forEach(function (b) {
      b.addEventListener('click', function () {
        var estado = b.getAttribute('data-ad');
        fig.setAttribute('data-estado', estado);
        fig.querySelectorAll('[data-ad]').forEach(function (o) {
          o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
        });
      });
    });
  });

  // Vídeo de fundo do topo
  var hv = document.querySelector('.hero-video video');
  var conexao = navigator.connection || {};
  var economia = conexao.saveData || /(^|-)2g$/.test(conexao.effectiveType || '');
  var menosMov = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (hv && !menosMov && !economia) {
    window.addEventListener('load', function () {
      var celular = window.matchMedia('(max-width: 719px)').matches;
      var mp4 = hv.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '';      // se o navegador não toca MP4, usa WebM
      hv.src = hv.getAttribute((celular ? 'data-mob' : 'data-desk') + (mp4 ? '' : '-webm'));
      var p = hv.play(); if (p && p.catch) p.catch(function () {});
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { var q = hv.play(); if (q && q.catch) q.catch(function () {}); } else { hv.pause(); } });
        }, { threshold: 0.05 }).observe(hv);
      }
    });
  }

  // Vídeos curtos: tocam só quando aparecem na tela; com "menos movimento", ficam parados com controles
  var menosMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('video.auto').forEach(function (v) {
    if (menosMovimento) { v.removeAttribute('autoplay'); v.pause(); v.controls = true; return; }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); }
        });
      }, { threshold: 0.25 }).observe(v);
    }
  });

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (i, n) {
        if (i.isIntersecting) {
          setTimeout(function () { i.target.classList.add('visivel'); }, n * 90);
          obs.unobserve(i.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.revela').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.revela').forEach(function (el) { el.classList.add('visivel'); });
  }
})();
