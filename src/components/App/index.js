import React, { Component } from "react";

import "./style.css";

import Check from "../../Icons/Check";
import Search from "../../Icons/Search";
import Trash from "../../Icons/Trash";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      areas: [
        {
          id: 1,
          area: "Alimentação",
          frequencia: "Diário",
          cor: "cor-1",
        },
        {
          id: 2,
          area: "Cultura",
          frequencia: "Mensal",
          cor: "cor-2",
        },
        {
          id: 3,
          area: "Flexível",
          frequencia: "Quinzenal",
          cor: "cor-3",
        },
        {
          id: 4,
          area: "Home Office",
          frequencia: "Mensal",
          cor: "cor-4",
        },
        {
          id: 5,
          area: "Mobilidade",
          frequencia: "Mensal",
          cor: "cor-5",
        },
        {
          id: 6,
          area: "Saúde",
          frequencia: "Mensal",
          cor: "cor-6",
        },
      ],

      categories: [
        {
          id: 1,
          categoria: "Alimentação",
          frequencia: "Mensal",
          valor: "752,25",
          total: "248.242,50",
        },
        {
          id: 2,
          categoria: "Combustível",
          frequencia: "Mensal",
          valor: "100,00",
          total: "6.600,00",
        },
        {
          id: 3,
          categoria: "Cultura",
          frequencia: "Mensal",
          valor: "100,00",
          total: "33.000,00",
        },
        {
          id: 4,
          categoria: "Educação",
          frequencia: "Mensal",
          valor: "1.000,25",
          total: "330.000,00",
        },
        {
          id: 5,
          categoria: "Flexível",
          frequencia: "Mensal",
          valor: "120,00",
          total: "000.000,00",
        },
      ],
    };
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-2 space"></div>
        <div className="col-sm-10">
          <div className="row">
            <div className="nav">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pesquisar"
                  aria-label="Pesquisar"
                  aria-describedby="basic-addon2"
                />
                <button className="btn btn-outline-secondary" type="button">
                  <Search />
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="main">
              <div className="column col-sm-7 category">
                <div className="top-title">
                  <h3>Categorias</h3>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                  >
                    <option selected className="selected">
                      Selecione um grupo
                    </option>
                    <option value="1">Alimentação</option>
                    <option value="2">Combustível</option>
                    <option value="3">Cultura</option>
                    <option value="2">Educação</option>
                    <option value="3">Flexível</option>
                  </select>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" className="first">
                        Categoria
                      </th>
                      <th scope="col">Frequência</th>
                      <th scope="col">Valor</th>
                      <th scope="col" className="fourth">
                        Valor total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.categoria}</td>
                        <td>{category.frequencia}</td>
                        <td>{category.valor}</td>
                        <td>{category.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="column col-sm-5 resume">
                <h3>Resumo</h3>
                <h6>Gestores de área</h6>
                <table className="table">
                  <tbody>
                    {this.state.areas.map((area) => (
                      <tr key={area.id} className={`${area.cor}`}>
                        <td>{area.area}</td>
                        <td>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            disabled
                          >
                            <option value="1">{area.frequencia}</option>
                          </select>
                        </td>
                        <td>
                          <Trash />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="buttons">
                  <button type="button" className="btn btn-primary primary">
                    <Check /> Ativar categoria
                  </button>
                  <button type="button" className="btn btn-secondary secondary">
                    Salvar alterações
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
