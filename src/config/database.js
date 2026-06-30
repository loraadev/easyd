import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'path';

const caminhoBanco = resolve(process.env.DB_PATH || './easyd.db');

// A instância é criada uma vez e reutilizada por todo o processo.
// node:sqlite é síncrono por design — simples e direto pro caso de uso aqui.
let db;

export function obterBanco() {
  if (!db) {
    db = new DatabaseSync(caminhoBanco);
  }
  return db;
}

export function inicializarBanco() {
  const banco = obterBanco();

  banco.exec(`
    CREATE TABLE IF NOT EXISTS chamados (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      solicitante TEXT    NOT NULL,
      titulo      TEXT    NOT NULL,
      descricao   TEXT    NOT NULL,
      categoria   TEXT    NOT NULL CHECK (categoria IN ('hardware','software','rede','acesso','outro')),
      prioridade  TEXT    NOT NULL CHECK (prioridade IN ('baixa','media','alta')),
      status      TEXT    NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','em_andamento','concluido')),
      criado_em   TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      atualizado_em TEXT  NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )
  `);

  // Trigger pra manter atualizado_em sempre correto sem depender do código da aplicação
  banco.exec(`
    CREATE TRIGGER IF NOT EXISTS atualizar_timestamp
    AFTER UPDATE ON chamados
    FOR EACH ROW
    BEGIN
      UPDATE chamados SET atualizado_em = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
      WHERE id = OLD.id;
    END
  `);

  console.log(`Banco inicializado em: ${caminhoBanco}`);
}
