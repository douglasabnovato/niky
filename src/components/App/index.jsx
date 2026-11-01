/*
 * App · gestor de categorias de benefícios (itens 6, 8, 9 e 10 do teste Niky).
 * As duas tabelas são montadas a partir de GET /categorias; o resumo permite trocar a frequência
 * e excluir a linha, bloqueando a exclusão quando a frequência escolhida é "Mensal" (item 10.c).
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import "./style.css";
import Search from "../../Icons/Search";
import Trash from "../../Icons/Trash";
import ConfirmDialog from "../ConfirmDialog";
import { fetchCategorias } from "../../services/categorias";
import { formatBRL } from "../../utils/format";

export const FREQUENCIAS = ["Diária", "Semanal", "Quinzenal", "Mensal", "Anual"];
export const DELETE_QUESTION = "Deseja excluir essa categoria?";
export const MONTHLY_ERROR = "Não foi possível excluir: categorias com frequência Mensal não podem ser excluídas.";

/* Normaliza texto para busca sem acento e sem diferença de maiúsculas. */
function normalize(text) {
  return String(text).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/* Componente principal. */
function App() {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [resumo, setResumo] = useState([]);
  const [saved, setSaved] = useState([]);
  const [search, setSearch] = useState("");
  const [grupo, setGrupo] = useState("");
  const [pending, setPending] = useState(null);
  const [message, setMessage] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchCategorias({ signal: controller.signal })
      .then((data) => {
        setCategorias(data);
        const linhas = data.map((c) => ({ id: c.id, categoria: c.categoria, frequencia: c.recorrencia }));
        setResumo(linhas);
        setSaved(linhas);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setStatus("error");
      });
    return () => controller.abort();
  }, [attempt]);

  const visiveis = useMemo(() => {
    const termo = normalize(search.trim());
    return categorias.filter((c) => (!grupo || c.categoria === grupo) && (!termo || normalize(c.categoria).includes(termo)));
  }, [categorias, grupo, search]);

  const dirty = JSON.stringify(resumo) !== JSON.stringify(saved);

  /* Troca a frequência escolhida no combo da linha. */
  const changeFrequencia = (id, frequencia) => {
    setMessage(null);
    setResumo((linhas) => linhas.map((l) => (l.id === id ? { ...l, frequencia } : l)));
  };

  /* Aplica a regra do item 10 depois da confirmação. */
  const confirmDelete = useCallback(() => {
    const linha = pending;
    setPending(null);
    if (!linha) return;
    const atual = resumo.find((l) => l.id === linha.id);
    if (atual && atual.frequencia === "Mensal") {
      setMessage({ variant: "danger", text: MONTHLY_ERROR });
      return;
    }
    setResumo((linhas) => linhas.filter((l) => l.id !== linha.id));
    setMessage({ variant: "success", text: `Categoria ${linha.categoria} excluída. Salve para confirmar.` });
  }, [pending, resumo]);

  /* Salva as alterações do resumo (estado local; a API do item 7 é somente leitura). */
  const save = () => {
    setSaved(resumo);
    setMessage({ variant: "success", text: "Alterações salvas." });
  };

  /* Descarta as alterações não salvas. */
  const discard = () => {
    setResumo(saved);
    setMessage({ variant: "secondary", text: "Alterações descartadas." });
  };

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">Niky</span>
        <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="busca" className="visually-hidden">Pesquisar categoria</label>
          <input
            id="busca"
            type="search"
            className="form-control"
            placeholder="Pesquisar categoria"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <span className="search-icon"><Search /></span>
        </form>
      </header>

      <main className="content">
        {status === "loading" && (
          <div className="state" role="status">
            <Spinner animation="border" size="sm" /> Carregando categorias…
          </div>
        )}

        {status === "error" && (
          <Alert variant="danger" className="state">
            <p className="mb-2">{error}</p>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setAttempt((n) => n + 1)}>
              Tentar novamente
            </button>
          </Alert>
        )}

        {status === "ready" && (
          <div className="panels">
            <section className="panel" aria-labelledby="categorias-title">
              <div className="panel-header">
                <h1 id="categorias-title" className="h4">Categorias</h1>
                <label htmlFor="grupo" className="visually-hidden">Filtrar por grupo</label>
                <select id="grupo" className="form-select" value={grupo} onChange={(event) => setGrupo(event.target.value)}>
                  <option value="">Todos os grupos</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.categoria}>{c.categoria}</option>
                  ))}
                </select>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Categoria</th>
                      <th scope="col">Frequência</th>
                      <th scope="col" className="text-end">Valor</th>
                      <th scope="col" className="text-end">Valor total</th>
                      <th scope="col" className="text-end">Beneficiários</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visiveis.map((c) => (
                      <tr key={c.id}>
                        <td>{c.categoria}</td>
                        <td>{c.recorrencia}</td>
                        <td className="text-end">{formatBRL(c.valor)}</td>
                        <td className="text-end">{formatBRL(c.valorTotal)}</td>
                        <td className="text-end">{c.beneficiarios}</td>
                      </tr>
                    ))}
                    {visiveis.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-body-secondary" role="status">
                          Nenhuma categoria encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel" aria-labelledby="resumo-title">
              <h2 id="resumo-title" className="h4">Resumo</h2>
              <p className="subtitle">Gestores de área</p>
              {message && (
                <Alert variant={message.variant} role={message.variant === "danger" ? "alert" : "status"}>
                  {message.text}
                </Alert>
              )}
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Área</th>
                      <th scope="col">Frequência</th>
                      <th scope="col"><span className="visually-hidden">Ações</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumo.map((linha) => (
                      <tr key={linha.id}>
                        <td>{linha.categoria}</td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            aria-label={`Frequência de ${linha.categoria}`}
                            value={linha.frequencia}
                            onChange={(event) => changeFrequencia(linha.id, event.target.value)}
                          >
                            {FREQUENCIAS.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-link btn-delete"
                            aria-label={`Excluir ${linha.categoria}`}
                            onClick={() => setPending(linha)}
                          >
                            <Trash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="actions">
                <button type="button" className="btn btn-outline-secondary" disabled={!dirty} onClick={discard}>
                  Descartar alterações
                </button>
                <button type="button" className="btn btn-primary" disabled={!dirty} onClick={save}>
                  Salvar alterações
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      <ConfirmDialog
        show={Boolean(pending)}
        title="Excluir categoria"
        message={DELETE_QUESTION}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

export default App;
/* fim de App */
