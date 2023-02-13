import "./style.css";

function MyCard() {
  return (
    <div class="row">
      <div class="col-sm-2">col-2</div>
      <div class="col-sm-10">
        <div class="row">
          <div class="nav">nav</div>
        </div>
        <div class="row">
          <div class="main">
            <div class="column col-sm-7">
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
            <table class="table">
                <tbody>
                  <tr>
                    <td>Alimentação</td>
                    <td>Diário</td>
                    <td>DEL</td>
                  </tr>
                  <tr>
                    <td>Cultura</td>
                    <td>Mensal</td>
                    <td>DEL</td>
                  </tr>
                  <tr>
                    <td>Flexível</td>
                    <td>Quinzenal</td>
                    <td>DEL</td>
                  </tr>
                  <tr>
                    <td>Home Office</td>
                    <td>Mensal</td>
                    <td>DEL</td>
                  </tr>
                  <tr>
                    <td>Mobilidade</td>
                    <td>Mensal</td>
                    <td>DEL</td>
                  </tr>
                  <tr>
                    <td>Saúde</td>
                    <td>Mensal</td>
                    <td>DEL</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCard;
