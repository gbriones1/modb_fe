import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import {LinkContainer} from 'react-router-bootstrap';


const AppNavbar = ({ user }) => {
    // console.log(user)
    console.log("Rendering Navbar")
    return (
        <Navbar bg="dark" expand="lg" variant="dark" >
        <Container>
            <LinkContainer to="/">
                <Navbar.Brand>Muelles Obrero</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <NavDropdown title="Organizacion" id="basic-nav-dropdown">
                        <NavDropdown.Header>Recursos</NavDropdown.Header>
                        <LinkContainer to="/organization">
                            <NavDropdown.Item>Organizaciones</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/taxpayer">
                            <NavDropdown.Item>RFCs</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    <NavDropdown title="Materiales" id="basic-nav-dropdown">
                        <NavDropdown.Header>Recursos</NavDropdown.Header>
                        <LinkContainer to="/product">
                            <NavDropdown.Item>Productos</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/brand">
                            <NavDropdown.Item>Marcas</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/appliance">
                            <NavDropdown.Item>Aplicaciones</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/storagetype">
                            <NavDropdown.Item>Tipos de almacenes</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>Inventario</NavDropdown.Header>
                        <LinkContainer to="/storage">
                            <NavDropdown.Item>Almacenes</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/storage_products">
                            <NavDropdown.Item>Inventario</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>Movimientos</NavDropdown.Header>
                        <LinkContainer to="/input">
                            <NavDropdown.Item>Entradas</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/output">
                            <NavDropdown.Item>Salidas</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    <NavDropdown title="Finanzas" id="basic-nav-dropdown">
                        <NavDropdown.Header>Recursos</NavDropdown.Header>
                        <LinkContainer to="/provider">
                            <NavDropdown.Item>Proveedores</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/customer">
                            <NavDropdown.Item>Clientes</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/price">
                            <NavDropdown.Item>Precios</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>Compras</NavDropdown.Header>
                        <LinkContainer to="/workbuy">
                            <NavDropdown.Item>Gastos de trabajo</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/order">
                            <NavDropdown.Item>Ordenes de Compra</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/storagebuy">
                            <NavDropdown.Item>Autorizaciones</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>Ventas</NavDropdown.Header>
                        <LinkContainer to="/work">
                            <NavDropdown.Item>Hojas de Trabajo</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    <NavDropdown title="Trabajos" id="basic-nav-dropdown">
                        <NavDropdown.Header>Recursos</NavDropdown.Header>
                        <LinkContainer to="/employee">
                            <NavDropdown.Item>Trabajadores</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <NavDropdown.Header>Nomina</NavDropdown.Header>
                        <LinkContainer to="/employee_payment">
                            <NavDropdown.Item>Pagos</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    <LinkContainer to="/reports">
                        <Nav.Link>Reportes</Nav.Link>
                    </LinkContainer>
                </Nav>
                <Nav>
                    <LinkContainer to="/config">
                        <Nav.Link>Configuracion</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/user">
                        <Nav.Link>Usuarios</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/logout">
                        <Nav.Link>Salir</Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
};

export default AppNavbar;