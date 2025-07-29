import React, { useState, useEffect } from 'react';
import { Container, Alert, Breadcrumb, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import ProductoForm from '../components/productos/ProductoForm';
import ProductoListar from '../components/productos/ProductoListar';
import { type ProductoDTO } from '../types/ProductoDTO';
import CategoriaQueryService from '../services/categoriaQueryService';

// Interfaz para las categorías
interface Categoria {
  id: number;
  nombre: string;
}

// Styled Components
const StyledContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const NotificationWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
  min-width: 300px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  opacity: 0.7;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
`;

type Vista = 'lista' | 'crear' | 'editar';

const ProductoPage: React.FC = () => {
  const [vista, setVista] = useState<Vista>('lista');
  const [productoEditando, setProductoEditando] = useState<ProductoDTO | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'danger';
  } | null>(null);

  // Cargar categorías desde la API
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await CategoriaQueryService.obtenerTodas();
        // Filtrar solo categorías activas (no eliminadas)
        const categoriasActivas = data.filter(c => !c.eliminado).map(c => ({
          id: c.id,
          nombre: c.nombre
        }));
        setCategorias(categoriasActivas);
      } catch (error) {
        console.error('Error cargando categorías:', error);
        setNotification({
          message: 'Error al cargar las categorías',
          type: 'danger'
        });
      }
    };

    cargarCategorias();
  }, []);

  // Auto-ocultar notificaciones
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCrear = () => {
    setProductoEditando(null);
    setVista('crear');
  };

  const handleEditar = (producto: ProductoDTO) => {
    setProductoEditando(producto);
    setVista('editar');
  };

  const handleFormSubmit = (success: boolean) => {
    if (success) {
      const action = vista === 'crear' ? 'creado' : 'actualizado';
      setNotification({
        message: `Producto ${action} exitosamente`,
        type: 'success'
      });
      setRefreshTrigger(prev => prev + 1);
      setVista('lista');
      setProductoEditando(null);
    } else {
      setNotification({
        message: 'Error al guardar el producto',
        type: 'danger'
      });
    }
  };

  const handleCancelar = () => {
    setVista('lista');
    setProductoEditando(null);
  };

  const renderNotification = () => {
    if (!notification) return null;

    return (
      <NotificationWrapper>
        <Alert variant={notification.type} className="d-flex justify-content-between align-items-center">
          <span>{notification.message}</span>
          <CloseButton onClick={() => setNotification(null)}>
            ×
          </CloseButton>
        </Alert>
      </NotificationWrapper>
    );
  };

  const renderBreadcrumb = () => {
    return (
      <Breadcrumb>
        <Breadcrumb.Item 
          active={vista === 'lista'}
          onClick={() => vista !== 'lista' && setVista('lista')}
          style={{ cursor: vista !== 'lista' ? 'pointer' : 'default' }}
        >
        </Breadcrumb.Item>
        {vista === 'crear' && (
          <Breadcrumb.Item active>Crear Producto</Breadcrumb.Item>
        )}
        {vista === 'editar' && (
          <Breadcrumb.Item active>Editar Producto</Breadcrumb.Item>
        )}
      </Breadcrumb>
    );
  };

  return (
    <>
      {renderNotification()}
      
      <StyledContainer>
        <Row>
          <Col>
            {renderBreadcrumb()}
            
            {vista === 'lista' && (
              <ProductoListar
                onEdit={handleEditar}
                onCrear={handleCrear}
                refreshTrigger={refreshTrigger}
              />
            )}

            {(vista === 'crear' || vista === 'editar') && (
              <Row className="justify-content-center">
                <Col md={8} lg={6}>
                  <ProductoForm
                    producto={productoEditando || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelar}
                    categorias={categorias}
                  />
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </StyledContainer>
    </>
  );
};

export default ProductoPage;