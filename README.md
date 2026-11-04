# LP Positiva Som e Estética Automotiva

Landing page de campanha (Google Ads) da Positiva, no Glória, em Belo Horizonte.
Uma página só, com o WhatsApp como única ação. Versão de 04/11/2026, **ainda não publicada**.

## Como abrir

1. No VS Code: **Arquivo → Abrir pasta** e escolha esta pasta.
2. Para ver no navegador: dê dois cliques no `index.html`, ou use a extensão **Live Server**
   (botão direito no `index.html` → *Open with Live Server*). O Live Server é o mais próximo
   do site publicado.

## Estrutura

```
index.html               conteúdo da página (textos, seções, botões)
assets/css/style.css     visual (cores, fontes, tamanhos) — cores no topo, em :root
assets/js/main.js        comportamento (WhatsApp, topo por anúncio, galerias, carrossel, vídeo)
assets/img/              fotos (WebP), logo, ícone da aba e imagem de compartilhamento
assets/video/            vídeo de fundo do topo (MP4 e WebM, computador e celular)
assets/fonts/            fontes Anton e Barlow (licença OFL, arquivos de licença junto)
```

A página não depende de nenhum servidor de fora para texto, foto ou vídeo: está tudo na pasta.

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| Textos das seções, cards, dúvidas frequentes | `index.html` |
| Título e subtítulo do topo de cada versão por anúncio | `assets/js/main.js` → objeto `SERVICOS` |
| Mensagem que chega no WhatsApp | `assets/js/main.js` → campo `msg` de cada serviço; nos cards, atributo `data-msg` no `index.html` |
| Número do WhatsApp | `assets/js/main.js` → `WHATSAPP_NUMERO` (só dígitos, com 55 e DDD) |
| Cores | `assets/css/style.css` → bloco `:root` |

## Versões do topo por anúncio (`?s=`)

O topo muda conforme o link do anúncio. Sem parâmetro, abre a versão geral.
No celular, o carrossel de serviços também abre no card do serviço do link.

| Link | Topo | Carrossel abre em |
|---|---|---|
| `index.html` | Geral | Multimídia |
| `index.html?s=multimidia` | Multimídia | Multimídia |
| `index.html?s=insulfilm` | Insulfilm | Insulfilm |
| `index.html?s=som` | Som | Som |
| `index.html?s=shiftpower` | Shift Power | Shift Power |
| `index.html?s=acessorios` | Acessórios | Acessórios |
| `index.html?s=estetica` | Estética automotiva | Multimídia |
| `index.html?s=martelinho` | Martelinho de ouro | Multimídia |
| `index.html?s=plotagem` | Plotagem | Multimídia |

## De onde veio o contato

A mensagem do WhatsApp diz a origem numa frase natural, sem código:

| Quem chega | Mensagem |
|---|---|
| Pelo anúncio do Google | "Olá! Vi o anúncio da Positiva no Google e quero um orçamento de insulfilm." |
| Direto no site | "Olá! Vim pelo site da Positiva e quero um orçamento de insulfilm." |

A página reconhece o anúncio do Google sozinha, pelo identificador que o Google Ads acrescenta
ao link (`gclid`, com a marcação automática ligada). Se a marcação automática estiver
desligada, acrescente `o=google` ao link do anúncio: `index.html?s=insulfilm&o=google`.
O serviço já vem na frase, então quem atende anota na planilha: origem + serviço.

## Antes de publicar

**Conteúdo**
- [ ] Avaliações: conferir o número no Google na semana da publicação (139 em 04/11)
- [ ] Vídeo do topo: confirmar a origem (provável Pexels, vídeo 13796032)

**Técnico**
- [ ] Trocar `{{DOMINIO}}` no `index.html` (imagem de compartilhamento e endereço da página)
- [ ] Testar no PageSpeed (celular) e num celular real, em rede móvel
- [ ] Clicar em cada botão e conferir se o WhatsApp abre com a mensagem certa

**Rastreamento (só Google)**

Contas da Positiva, separadas de qualquer outra empresa; o Denis entra como administrador.

| Onde | O que fazer |
|---|---|
| Google Ads | Criar 3 ações de conversão de site, configuradas "manualmente com código", contagem **Uma**: **Clique no WhatsApp** (principal), **Clique no telefone** e **Clique em Ver como chegar** (secundárias). Deixar a marcação automática ligada. |
| Google Analytics | Criar a propriedade e o fluxo de dados da web. Registrar as dimensões personalizadas `botao`, `origem` e `versao_topo` (sem isso os relatórios dessas informações ficam vazios). Vincular ao Google Ads. **Não** importar eventos do Analytics como conversão no Ads (contaria duas vezes). |
| `index.html` | Ligar o bloco "RASTREAMENTO GOOGLE" e trocar `{{GA4_ID}}` e `{{AW_ID}}`. |
| `assets/js/main.js` | Em `CONVERSOES_ADS`, trocar `{{AW_ID}}` e os três `{{ROTULO_...}}` pelos rótulos de cada conversão. Enquanto tiver `{{ }}`, a conversão não é enviada. |
| Pixel da Meta | Fica desligado no `index.html`. Só ligar se a loja for anunciar na Meta. |

O que a página envia em cada clique:

| Clique | Analytics (observação) | Google Ads |
|---|---|---|
| Qualquer botão de WhatsApp | `clique_whatsapp` | conversão principal |
| Telefone | `clique_telefone` | conversão secundária |
| Ver como chegar | `clique_rota` | conversão secundária |

Os três eventos levam `botao` (qual botão), `origem` (`google` ou `site`) e `versao_topo` (qual versão do topo estava aberta).

- [ ] Validar nas duas pontas, com a página já no domínio (nunca abrindo o arquivo no computador):
      a requisição sai do navegador com o rótulo certo, e a conversão e o evento chegam nas contas
- [ ] Só depois disso subir a campanha

## GitHub

- Se o repositório for público (portfólio), combine antes com a loja: a página leva as fotos
  e o nome dela.
- Se ativar o **GitHub Pages**, a página fica no ar na internet. Só ative depois do checklist
  acima e não aponte anúncio para ela antes disso.
- Fotos e vídeos são da loja ou de banco de imagens; placas de clientes já estão borradas.
