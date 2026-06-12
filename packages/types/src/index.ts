export interface Profile {
  id: string;
  nome: string;
  foto: string | null;
  bio: string | null;
  curiosidades: string | null;
  created_at: string;
}

export interface StorySection {
  id: string;
  titulo: string;
  conteudo: string;
  ordem: number;
  created_at: string;
}

export interface Photo {
  id: string;
  image_url: string;
  data_foto: string;
  favorita: boolean;
  descricao: string | null;
  created_at: string;
}

export interface SpotifyStatus {
  id: string;
  usuario: string;
  musica: string;
  artista: string;
  album: string;
  capa: string;
  reproduzindo_agora: boolean;
  ultima_reproducao: string | null;
  created_at: string;
}

export interface Dedication {
  id: string;
  titulo: string;
  texto: string;
  imagem: string | null;
  autor: string;
  created_at: string;
}

export interface Event {
  id: string;
  titulo: string;
  descricao: string | null;
  data_evento: string;
  imagem: string | null;
  created_at: string;
}

export interface DailyMessage {
  id: string;
  autor: string;
  destinatario: string;
  mensagem: string;
  created_at: string;
}
