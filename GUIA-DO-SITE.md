# Guia do Site — Nossas Memórias

## Visão Geral

"Nossas Memórias" é uma cápsula do tempo digital para registrar e celebrar a história do relacionamento. O site combina fotos, músicas, mensagens e eventos em uma linha do tempo interativa.

---

## Páginas Públicas

### Home (`/`)

A página inicial exibe:

- **Contador de tempo** — há quanto tempo estão juntos
- **Recado do dia** — mensagem especial que aparece para os dois
- **Hoje em Outros Anos** — fotos, eventos e dedicatórias que aconteceram nesta mesma data em anos anteriores
- **Atalhos** — links rápidos para Dedicatórias, Galeria e Música

### Nossa História (`/historia`)

Página para contar a história do casal — como se conheceram, o primeiro encontro, pedido de namoro, etc. (Conteúdo a ser preenchido no admin).

### Sobre Nós (`/sobre`)

Perfil de cada um com foto e biografia. (Conteúdo a ser preenchido no admin).

### Galeria (`/galeria`)

Álbum de fotos com:

- Grade de fotos com zoom ao passar o mouse
- **Filtros por ano e mês** para navegar pelo tempo
- **Lightbox** — clique em uma foto para ver em tela cheia
- Destaque para fotos favoritas (★)
- Fotos sincronizadas do Google Photos ou enviadas manualmente

### Música (`/musica`)

Atividade musical do casal integrada ao Spotify:

- Mostra o que cada um está ouvindo no momento
- Capa do álbum, nome da música e artista
- Status "Ouvindo Agora" em tempo real
- Botão para conectar a conta Spotify

### Dedicatórias (`/dedicatorias`)

Cartas e mensagens especiais:

- Lista de dedicatórias publicadas
- Clique para ler o texto completo
- **Compartilhar** — envia o link da dedicatória por qualquer aplicativo (WhatsApp, email, etc.)
- Cada dedicatória tem autor, título e data

---

## Painel Admin (`/admin`)

Área restrita para gerenciar todo o conteúdo do site. Acesso protegido por login.

### Dashboard (`/admin`)

Visão geral com atalhos para todas as seções do admin.

### Dedicatórias (`/admin/dedicatorias`)

- Criar novas dedicatórias com título, texto e imagem opcional
- Editar ou excluir existentes
- As dedicatórias aparecem na página pública em ordem cronológica

### Galeria (`/admin/galeria`)

- **Upload de fotos** diretamente do computador
- Escolher a data da foto
- Marcar/desmarcar favoritas
- Excluir fotos
- Fotos enviadas aqui aparecem na galeria pública

### Eventos (`/admin/eventos`)

- Registrar eventos importantes com título, descrição e data
- Usado na linha do tempo "Hoje em Outros Anos"
- Excluir eventos existentes

### Recados Diários (`/admin/recados`)

- Escrever um recado especial que aparece na Home
- Cada recado substitui o anterior
- Ideal para mensagens do dia a dia

### Integrações (`/admin/integracoes`)

Configuração dos serviços externos:

**Spotify**
- Conectar a conta de cada um para compartilhar a atividade musical
- Duas contas disponíveis: "Pessoa A" e "Pessoa B"

**Google Fotos**
- Conectar a conta Google para sincronizar fotos
- **Listar Álbuns** — mostra todos os álbuns disponíveis
- Selecionar qual álbum sincronizar
- **Sincronizar Agora** — importa as fotos do álbum escolhido para a galeria

---

## Funcionalidades Técnicas

### Tema Escuro

Clique no ícone de lua/sol no canto superior direito para alternar entre tema claro e escuro. O tema escolhido é lembrado nas próximas visitas.

### Linha do Tempo "Hoje em Outros Anos"

Na Home, mostra o que aconteceu no relacionamento na mesma data em anos anteriores — une fotos, eventos e dedicatórias em uma linha do tempo emocionante.

### SEO

Cada página tem metadados próprios para aparecer bem em buscas e compartilhamentos (Google, WhatsApp, redes sociais).

### Sitemap & Robots

O site tem sitemap.xml e robots.txt para indexação correta pelos mecanismos de busca.

---

## Primeiros Passos

1. Acesse `/auth` para criar sua conta
2. Vá em `/admin` e comece a preencher o conteúdo
3. Conecte o Spotify em `/admin/integracoes`
4. Conecte o Google Fotos e selecione o álbum do casal
5. Publique a primeira dedicatória
6. Ajuste a data de início do relacionamento no código (se necessário)

---

Feito com ❤️
