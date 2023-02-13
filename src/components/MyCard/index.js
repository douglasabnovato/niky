import "./style.css";

function MyCard() {
  return (
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-10">
        <div class="row">
          <div class="nav">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
              <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button">
                  Button
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="main">
            <div class="column col-sm-7">
              <h3>Categorias</h3>
              <select class="form-select" aria-label="Default select example">
                <option selected>Selecione um grupo</option>
                <option value="1">Alimentação</option>
                <option value="2">Combustível</option>
                <option value="3">Cultura</option>
                <option value="2">Educação</option>
                <option value="3">Flexível</option>
              </select>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Categoria</th>
                    <th scope="col">Frequência</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Valor total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Alimentação</td>
                    <td>Mensal</td>
                    <td>R$752,25</td>
                    <td>R$248.242,50</td>
                  </tr>
                  <tr>
                    <td>Combustível</td>
                    <td>Mensal</td>
                    <td>R$100,00</td>
                    <td>R$6.600,00</td>
                  </tr>
                  <tr>
                    <td>Cultura</td>
                    <td>Mensal</td>
                    <td>R$100,00</td>
                    <td>R$33.000,00</td>
                  </tr>
                  <tr>
                    <td>Educação</td>
                    <td>Anual</td>
                    <td>R$1000,25</td>
                    <td>R$330.000,00</td>
                  </tr>
                  <tr>
                    <td>Flexível</td>
                    <td>Mensal</td>
                    <td>R$120,00</td>
                    <td>R$000.000,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="column col-sm-5">
              <h3>Resumo</h3>
              <h4>Gestores de área</h4>
              <table class="table">
                <tbody>
                  <tr>
                    <td>Alimentação</td>
                    <td>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="1">Diário</option>
                        <option value="2">Quinzenal</option>
                        <option value="3">Mensal</option>
                        <option value="4">Anual</option>
                      </select>
                    </td>
                    <td>
                      <i class="bi bi-trash-fill"></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Cultura</td>
                    <td>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="1">Diário</option>
                        <option value="2">Quinzenal</option>
                        <option value="3">Mensal</option>
                        <option value="4">Anual</option>
                      </select>
                    </td>
                    <td>
                      <i class="bi bi-trash-fill"></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Flexível</td>
                    <td>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="1">Diário</option>
                        <option value="2">Quinzenal</option>
                        <option value="3">Mensal</option>
                        <option value="4">Anual</option>
                      </select>
                    </td>
                    <td>
                      <i class="bi bi-trash-fill"></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Home Office</td>
                    <td>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="1">Diário</option>
                        <option value="2">Quinzenal</option>
                        <option value="3">Mensal</option>
                        <option value="4">Anual</option>
                      </select>
                    </td>
                    <td>
                      <i class="bi bi-trash-fill"></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Mobilidade</td>
                    <td>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="1">Diário</option>
                        <option value="2">Quinzenal</option>
                        <option value="3">Mensal</option>
                        <option value="4">Anual</option>
                      </select>
                    </td>
                    <td>
                      <i class="bi bi-trash-fill"></i>
                    </td>
                  </tr>
                  <tr>
                    <td>Saúde</td>
                    <td>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="1">Diário</option>
                        <option value="2">Quinzenal</option>
                        <option value="3">Mensal</option>
                        <option value="4">Anual</option>
                      </select>
                    </td>
                    <td>
                      <i class="bi bi-trash-fill"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="btn btn-primary">
                <i class="bi bi-check-lg"></i> Ativar categoria
              </button>
              <button type="button" class="btn btn-primary">
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCard;
