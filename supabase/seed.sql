-- ============================================================================
-- SEED DATA
-- ============================================================================
-- This file populates the database with sample data for development.
-- Run with: supabase db reset

-- Story sections
insert into public.story_sections (titulo, conteudo, ordem) values
  ('Como Nos Conhecemos', 'Escreva aqui a história de como vocês se conheceram...', 1),
  ('Nosso Primeiro Encontro', 'Descreva o primeiro encontro...', 2),
  ('O Pedido', 'Como foi o pedido de namoro...', 3),
  ('Nossas Viagens', 'Lugares que marcaram a história...', 4);

-- Sample events
insert into public.events (titulo, descricao, data_evento) values
  ('Primeiro Encontro', 'O dia que tudo começou', '2023-06-15'),
  ('Pedido de Namoro', 'O sim mais importante', '2023-08-20'),
  ('Primeira Viagem', 'Nossa primeira aventura juntos', '2024-01-10');
