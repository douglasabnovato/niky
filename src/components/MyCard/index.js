import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Nav from 'react-bootstrap/Nav';  

import "./style.css"

function MyCard() {
  return (
    <Container>
      <Row>
        <Col xs={2}>xs=2 - vazia</Col>
        <Col xs={10}>
          <Row>
            <Col>
              <Nav className="justify-content-center nav" activeKey="/home">
                <Nav.Item  className="float-left">
                    <form class="form-inline my-2 my-lg-0">
                      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
                      <button class="btn btn-outline-success my-2 my-sm-2" type="submit">Search</button>
                    </form>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
          <Row>
            <Col className="col" xs={7}>xs=7 - categorias</Col>
            <Col className="col" xs={5}>xs=5 - resumo</Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default MyCard;
