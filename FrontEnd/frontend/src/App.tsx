import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Card } from 'react-bootstrap';
import styled from 'styled-components';
import ProductoPage from './pages/ProductosPage';
import CategoriaPage from './pages/CategoriasPage';
import 'bootstrap/dist/css/bootstrap.min.css';

// Styled Components
const AppWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const StyledNavbar = styled(Navbar)`
  background-color: #fff !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border-bottom: 1px solid #dee2e6;
`;

const NavBrand = styled(Navbar.Brand)`
  font-weight: 700;
  color: #212529 !important;
  font-size: 1.5rem;
  
  &:hover {
    color: #0d6efd !important;
  }
`;

const StyledNavLink = styled(Nav.Link)`
  color: #6c757d !important;
  font-weight: 500;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem !important;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #0d6efd !important;
    background-color: #f8f9fa;
  }
  
  &.active {
    color: #0d6efd !important;
    background-color: #e7f1ff;
  }
`;

const MainContent = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
  `;

const NotFoundCard = styled(Card)`
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
`;

const NotFoundWrapper = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Componente para determinar el enlace activo
const NavigationLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <StyledNavLink as={Link} to={to} className={isActive ? 'active' : ''}>
      {children}
    </StyledNavLink>
  );
};

const SimpleLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppWrapper>
      <StyledNavbar expand="lg" fixed="top">
        <Container>
          <NavBrand as={Link} to="/">
            📊 Sistema de Gestión
          </NavBrand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavigationLink to="/productos">
                🛍️ Productos
              </NavigationLink>
              <NavigationLink to="/categorias">
                📁 Categorías
              </NavigationLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </StyledNavbar>

      <MainContent style={{ marginTop: '80px' }}>
        {children}
      </MainContent>
    </AppWrapper>
  );
};

const NotFoundPage: React.FC = () => (
  <NotFoundWrapper>
    <NotFoundCard>
      <Card.Body className="text-center p-5">
        <div className="mb-4">
          <span style={{ fontSize: '4rem' }}>😵</span>
        </div>
        <h1 className="display-4 fw-bold text-danger mb-3">404</h1>
        <p className="fs-5 text-muted mb-4">
          Página no encontrada
        </p>
        <p className="text-muted mb-4">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
          <Link to="/productos" className="btn btn-primary">
            🛍️ Ir a Productos
          </Link>
          <Link to="/categorias" className="btn btn-outline-secondary">
            📁 Ir a Categorías
          </Link>
        </div>
      </Card.Body>
    </NotFoundCard>
  </NotFoundWrapper>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/productos" replace />} />
        <Route
          path="/productos"
          element={
            <SimpleLayout>
              <ProductoPage />
            </SimpleLayout>
          }
        />
        <Route
          path="/categorias"
          element={
            <SimpleLayout>
              <CategoriaPage />
            </SimpleLayout>
          }
        />
        <Route
          path="*"
          element={
            <SimpleLayout>
              <NotFoundPage />
            </SimpleLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;