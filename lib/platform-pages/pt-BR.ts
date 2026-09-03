import { buildLocalizedPlatformPages } from "./localized-build"
import type { PlatformLocalePack, LocalizedPlatformApp } from "./localized-types"

const ptBR: PlatformLocalePack = {
  locale: "pt-BR",
  reviewed: "31 de agosto de 2026",
  sourceLabels: {
    Tinder: ["Tinder: verificação de fotos", "Tinder: requisitos de rosto e perfis ocultos", "Diretrizes da comunidade do Tinder"],
    Hinge: ["Hinge: como editar seu perfil", "Hinge: como adicionar e editar fotos", "Hinge: conteúdo e comportamento proibidos no Hinge"],
    Bumble: ["Bumble: regras para fotos de perfil", "Bumble: recurso Best Photo", "Diretrizes da comunidade do Bumble"],
  },
  variants: {
    Tinder: {
      focus: "clareza e variedade em um perfil que é percorrido rapidamente",
      requirement: "O Tinder costuma exigir um rosto claramente visível e pode ocultar perfis sem uma foto de rosto detectável.",
      firstPhoto: "uma foto solo recente, nítida e com o rosto reconhecível de imediato",
      specialFeature: "a verificação por selfie em vídeo",
      trustNote: "O Tinder compara um breve selfie em vídeo com as fotos do perfil. Por isso, uma imagem gerada nunca deve mostrar uma aparência que não seja realmente a sua hoje.",
    },
    Hinge: {
      focus: "a conexão entre as fotos e as respostas escritas do perfil",
      requirement: "O Hinge pede de quatro a seis fotos, dependendo da região, além de três respostas aos prompts.",
      firstPhoto: "um retrato solo recente em que seja fácil reconhecer você",
      specialFeature: "os prompts, legendas e respostas que dão contexto às imagens",
      trustNote: "O Hinge proíbe conteúdo gerado por IA quando ele é usado para enganar ou induzir alguém ao erro. As atividades e interesses mostrados precisam ser realmente seus.",
    },
    Bumble: {
      focus: "primeiros sinais claros e assuntos fáceis para iniciar uma conversa",
      requirement: "O Bumble permite até seis fotos ou vídeos e geralmente recomenda usar de quatro a seis.",
      firstPhoto: "uma foto solo recente e bem iluminada, com olhos e rosto visíveis",
      specialFeature: "o recurso Best Photo, que pode colocar na frente a foto com melhores reações dentro do aplicativo",
      trustNote: "O Bumble proíbe fotos artificiais ou alteradas quando elas são usadas para enganar. Mantenha imagens recentes e uma aparência fiel à realidade.",
    },
  },
  landing: (app: LocalizedPlatformApp, v) => ({
    eyebrow: "Fotos de namoro com IA para homens no " + app,
    title: "Fotos para " + app + " que dão ao seu perfil uma história visual convincente",
    description: "Crie 60 fotos realistas para " + app + " em 15 ensaios coerentes a partir de 4–6 selfies. Inclui 15 refações individuais e entrega em até 30 minutos por US$ 39 uma única vez.",
    answer: "A UnrealShot transforma 4–6 selfies atuais em 15 ideias de ensaio para o seu perfil do " + app + ". Cada ideia vira quatro fotos conectadas: cenário, roupa e luz permanecem coerentes, enquanto enquadramento e expressão variam. Você recebe 60 fotos, 15 refações individuais e a entrega em até 30 minutos, por US$ 39 uma única vez.",
    heroBullets: ["15 ensaios completos: 60 fotos", "Quatro imagens conectadas por ensaio", "15 refações individuais incluídas", "Entrega em até 30 minutos · US$ 39 uma única vez"],
    problemIntro: "A maioria dos homens já tem muitas fotos. O problema é que elas costumam mostrar o mesmo ângulo, o mesmo ambiente ou fases muito diferentes da vida. Assim fica difícil montar um perfil do " + app + " atual, natural e completo, principalmente quando a primeira impressão acontece em poucos segundos.",
    problems: [
      { title: "Sua melhor foto recente ainda é uma selfie", body: "Uma selfie nítida mostra o seu rosto, mas raramente mostra o ambiente, a postura e a distância de câmera de um momento real. O perfil acaba sem personalidade visual." },
      { title: "O restante da galeria fica repetitivo", body: "Mudar um pouco o ângulo não cria informação nova. Uma seleção melhor alterna ambientes, roupas, energia e composição sem deixar de parecer a mesma pessoa de hoje." },
      { title: "Imagens de IA soltas não parecem parte da mesma vida", body: "Quando rosto, corpo ou acabamento mudam sem lógica, a galeria parece montada. A UnrealShot conecta quatro imagens dentro de cada ensaio para manter uma cena convincente." },
    ],
    solutionIntro: "A UnrealShot transforma poucas referências atuais em um conjunto completo de fotos prontas para o " + app + ". As 15 ideias exploram ambientes, atividades, roupas e humores diferentes; as quatro imagens de cada ensaio continuam conectadas para você escolher o melhor enquadramento sem perder a continuidade.",
    differentiators: [
      { title: "Cada ensaio conta uma história visual", body: "O ambiente, a roupa e a luz permanecem consistentes dentro de uma ideia. Mudanças de enquadramento, postura e expressão parecem momentos do mesmo ensaio, não gerações independentes." },
      { title: "Quinze ideias criam variedade de verdade", body: "Sua entrega pode passar por momentos do dia a dia, atividades, cenas descontraídas e looks mais arrumados. Os exemplos do site mostram possibilidades; seus selfies e respostas orientam o seu pedido." },
      { title: "Seus interesses reais orientam a direção", body: "Suas respostas dão contexto para imaginar lugares e ações que combinam com você. Um interesse verdadeiro pode inspirar várias cenas, em vez de ficar preso a uma imagem pronta." },
      { title: "Selfies atuais mantêm a semelhança", body: "De quatro a seis referências recentes orientam os traços reconhecíveis em toda a entrega. As 15 refações permitem tentar de novo quando uma imagem boa precisa de outro detalhe." },
    ],
    deliveryPoints: [
      { title: "15 ideias de ensaio criadas para a sua entrega", body: "Cada entrega combina ambiente, estilo, atividade, luz e clima de uma forma diferente. As possibilidades vão além dos poucos exemplos exibidos no site." },
      { title: "Quatro fotos conectadas em cada ideia", body: "Cada ensaio produz quatro variações naturais do mesmo momento. A história visual permanece coerente enquanto enquadramento, postura e expressão mudam." },
      { title: "Uma semelhança consistente nas 60 fotos", body: "Seus selfies recentes continuam sendo a referência visual de toda a geração, para que o conjunto pareça uma única pessoa atual: você." },
    ],
    sections: [
      { heading: "Um perfil do " + app + " fica mais forte quando as fotos conversam entre si", paragraphs: ["As pessoas veem seu perfil como o de uma só pessoa, não como uma coleção de arquivos independentes. Diferenças grandes de rosto, idade, corpo ou acabamento geram dúvida, mesmo quando cada imagem é bonita sozinha.", "A UnrealShot também mantém a coerência dentro de cada ensaio. As quatro fotos compartilham ambiente, roupa e luz: você tem opções para escolher sem parecer que juntou gerações sem relação."] },
      { heading: "Semelhança atual e variedade que realmente informa", paragraphs: ["Seus selfies recentes orientam a semelhança; as 15 ideias trazem ambientes, atividades, enquadramentos e expressões diferentes. Essa combinação mostra outras facetas sem inventar uma nova identidade.", "O critério é simples: o resultado ainda precisa parecer com você hoje. Uma refação ajuda quando a ideia é boa, mas rosto, expressão ou composição precisam de outra tentativa."] },
      { heading: "Dos selfies de referência a 60 fotos prontas", paragraphs: ["Envie 4–6 selfies solo recentes, com o rosto visível de mais de um ângulo e em uma luz comum. Depois responda a três perguntas curtas sobre o estilo e os interesses que fazem parte da sua vida de verdade.", "A UnrealShot cria 15 ideias e quatro fotos conectadas para cada uma. A entrega chega em até 30 minutos; as 15 refações individuais permitem melhorar uma foto sem reiniciar o projeto inteiro."], bullets: ["Pagamento único: US$ 39", "Sem assinatura", "15 ensaios coerentes", "60 fotos no total", "15 refações individuais"] },
    ],
    exampleSlugs: app === "Tinder" ? ["outdoor-coffee", "city-walk", "gym-training", "dinner"] : app === "Hinge" ? ["home-cooking", "outdoor-coffee", "coastal-travel", "dinner"] : ["gym-training", "city-walk", "outdoor-coffee", "rooftop"],
    policy: [v.requirement, v.trustNote, "Use apenas imagens que representem com honestidade sua aparência atual e seus interesses reais, e confira as regras oficiais do " + app + " antes de publicar."],
    faqs: [
      { question: "O que são fotos de " + app + " geradas por IA?", answer: "São opções de fotos de perfil criadas a partir de selfies de referência atuais. A UnrealShot imagina vários ensaios e produz quatro imagens conectadas por ideia para você comparar enquadramentos e expressões." },
      { question: "Como minhas ideias de ensaio para " + app + " são criadas?", answer: "Seus selfies atuais e três respostas curtas dão o contexto. A UnrealShot gera 15 ideias diferentes; os exemplos do site mostram possibilidades, não um catálogo fechado." },
      { question: "Quantas fotos a UnrealShot cria para o " + app + "?", answer: "Um pedido de US$ 39 inclui 15 ensaios de quatro fotos, ou 60 imagens, além de 15 refações individuais." },
      { question: "Como a semelhança comigo é mantida?", answer: "Seus 4–6 selfies atuais orientam a semelhança de toda a entrega. Compare as imagens com a sua aparência de hoje e peça uma refação se algum detalhe importante não estiver certo." },
      { question: "É permitido usar fotos de IA no " + app + "?", answer: v.trustNote + " Consulte as regras em vigor na sua região e mantenha fotos recentes que conectem seu perfil à vida real." },
      { question: "Posso melhorar uma foto específica?", answer: "Sim. As 15 refações individuais servem para gerar outra versão de uma imagem cuja ideia funciona, mas cujo rosto, expressão ou enquadramento precisa de ajuste." },
    ],
  }),
  guide: (app: LocalizedPlatformApp, v) => ({
    eyebrow: "Guia de fotos do " + app + " para homens",
    title: "Fotos para " + app + ": como montar uma seleção clara, variada e convincente",
    description: "Um guia prático de fotos para " + app + " sobre primeira imagem, ordem do perfil, enquadramentos, atividades, erros comuns, uso responsável de IA e regras atuais.",
    answer: "Uma boa seleção para o " + app + " começa com " + v.firstPhoto + " e depois acrescenta informações diferentes: corpo, atividade, roupa e momentos da vida. Cada foto seguinte deve responder a uma pergunta nova. Confira os enquadramentos no celular, mantenha sua aparência atual e use imagens de IA para preencher uma falta real, não para inventar uma vida mais interessante.",
    quickFacts: [["Função da primeira foto", "Ser reconhecido de imediato"], ["Variedade útil", "Rosto, corpo, atividade, contexto"], ["O que conferir", v.requirement], ["Recurso específico", v.specialFeature]],
    sections: [
      { heading: "A primeira foto precisa tornar você fácil de reconhecer", paragraphs: ["Comece com " + v.firstPhoto + ". Os olhos devem estar visíveis, a luz precisa ser clara e o rosto deve ocupar espaço suficiente para sobreviver ao corte do aplicativo. Uma imagem simples costuma ajudar mais do que um cenário espetacular.", "A primeira foto não precisa provar toda a sua personalidade. Sua função principal é a clareza; atividades, roupas diferentes e momentos espontâneos entram nos próximos espaços."] },
      { heading: "Dê uma função diferente a cada espaço", paragraphs: ["Monte uma base com retrato solo, foto de corpo inteiro, atividade verdadeira, outra roupa e um momento descontraído. Se você tem poucas fotos boas, use menos espaços em vez de preencher a galeria com repetições.", "Uma foto extra deve trazer informação nova. Dois retratos com a mesma roupa e no mesmo ambiente não cumprem duas funções diferentes."], bullets: ["Retrato solo nítido", "Foto cotidiana de corpo inteiro", "Atividade que você realmente pratica", "Contraste de roupa ou ocasião", "Momento descontraído e atual"] },
      { heading: "Escolha uma foto de corpo inteiro que pareça humana", paragraphs: ["Uma foto de corpo inteiro mostra corpo, postura e estilo cotidiano. Não vire uma figura minúscula em uma paisagem dramática e evite cortes nos tornozelos, joelhos ou no topo da cabeça.", "Caminhar, apoiar-se naturalmente ou parar em um lugar conhecido costuma funcionar melhor do que uma pose rígida. O lugar deve apoiar a foto, não virar o assunto principal."] },
      { heading: "A atividade precisa ser verdadeira antes de ser impressionante", paragraphs: ["Cozinhar, treinar, tomar café, ler ou caminhar só ajudam quando você poderia conversar sobre isso naturalmente. Um detalhe concreto abre mais conversa do que um cenário luxuoso escolhido apenas para impressionar.", "Acessórios não devem fabricar uma identidade. Um interesse simples e sincero vale mais do que uma viagem, um pet ou um hobby inventado que o restante do perfil não consegue sustentar."] },
      { heading: "Teste os cortes em um celular de verdade", paragraphs: ["Veja cada candidata no tamanho em que ela será realmente vista. O rosto e a ação devem continuar legíveis depois do corte da interface. Deixe espaço ao redor do sujeito sem escolher uma foto tão aberta que você desapareça.", "Procure detalhes que distraem: uma mão cortada, um sapato pela metade, outra pessoa na borda ou uma placa muito clara. Uma foto nítida ainda pode funcionar mal depois do corte."], bullets: ["Pré-visualizar cortes quadrado e vertical", "Manter os olhos longe da borda superior", "Deixar a ação principal no centro", "Conferir textos e reflexos no fundo", "Verificar a nitidez depois do upload"] },
      { heading: "Use fotos de IA como complemento, não como disfarce", paragraphs: ["Uma imagem gerada pode preencher uma falta real: uma foto nítida de corpo inteiro, uma roupa diferente ou uma cena cotidiana difícil de fotografar. Ela não deve substituir todas as evidências reais da sua vida.", "Compare cada candidata com as fotos atuais do celular. Descarte-a se formato do rosto, idade, cabelo, corpo ou detalhes da pele deixarem de parecer com você. Mantenha também fotos recentes da vida real."] },
      { heading: "Entenda as regras específicas do " + app, paragraphs: [v.requirement, v.trustNote, "As regras podem mudar, e uma imagem gerada não garante aprovação nem verificação. Publique apenas fotos fiéis à sua realidade e leia as fontes oficiais antes de finalizar o perfil."] },
      { heading: "Os erros que mais enfraquecem um perfil", paragraphs: ["Repetição é o problema mais evidente: vários selfies, vários espelhos da academia ou várias fotos com a mesma roupa. Também atrapalham um rosto difícil de ver, imagens antigas e atividades que parecem encenadas.", "Faça a revisão olhando a seleção inteira. Escreva em uma frase qual é a função de cada foto. Se duas frases forem iguais, fique com a mais clara e use o espaço para mostrar algo verdadeiro."], bullets: ["Primeira imagem pouco clara", "Várias fotos quase iguais", "Nenhuma foto de corpo inteiro", "Aparência antiga ou incoerente", "Filtros ou retoques muito visíveis", "Interesse inventado"] },
    ],
    checklist: ["Meu rosto está livre na primeira foto", "A primeira imagem combina com minha aparência atual", "Uma foto mostra meu corpo inteiro", "Pelo menos uma atividade é realmente minha", "As roupas e os lugares variam", "Nenhuma imagem repete exatamente a mesma função", "As imagens de IA combinam com minhas fotos reais", "Conferi cada corte no celular", "Nenhuma imagem inventa viagem, hobby ou estilo de vida", "Li as regras atuais do " + app],
    faqs: [
      { question: "Qual deve ser a primeira foto no " + app + "?", answer: "Escolha " + v.firstPhoto + ". Ser reconhecido importa mais do que um cenário chamativo ou uma pose complicada." },
      { question: "É preciso incluir uma foto de corpo inteiro?", answer: "Sim, ela acrescenta informações sobre corpo, postura e estilo do dia a dia. Ainda assim, mantenha o rosto reconhecível e evite aparecer minúsculo em uma paisagem." },
      { question: "Posso usar fotos geradas por IA?", answer: v.trustNote + " Use apenas imagens fiéis, mantenha fotos recentes da vida real e confira as regras do aplicativo." },
      { question: "Como devo ordenar as fotos?", answer: "Comece com a imagem mais clara do seu rosto e faça cada foto seguinte trazer uma informação nova: corpo inteiro, atividade, roupa, expressão ou um momento real." },
      { question: "Quantas fotos devo publicar?", answer: v.requirement + " Use os espaços disponíveis para funções diferentes, não para preencher a galeria com repetições." },
    ],
  }),
  guideLabel: (app) => "Ler o guia completo de fotos para " + app,
  productLabel: (app) => "Criar uma seleção completa de fotos para " + app,
}

export const ptBRPlatformPages = buildLocalizedPlatformPages(ptBR)
