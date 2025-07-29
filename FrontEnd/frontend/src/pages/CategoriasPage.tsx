import React, { useState, useEffect } from 'react';
import { Container, Alert, Breadcrumb, Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import CategoriaForm from '../components/categorias/CategoriaForm';
import CategoriaListar from '../components/categorias/CategoriaListar';
import { type CategoriaDTO } from '../types/CategoriaDTO';

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

const CategoriaPage: React.FC = () => {
  const [vista, setVista] = useState<Vista>('lista');
  const [categoriaEditando, setCategoriaEditando] = useState<CategoriaDTO | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'danger';
  } | null>(null);

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
    setCategoriaEditando(null);
    setVista('crear');
  };

  const handleEditar = (categoria: CategoriaDTO) => {
    setCategoriaEditando(categoria);
    setVista('editar');
  };

  const handleFormSubmit = (success: boolean) => {
    if (success) {
      const action = vista === 'crear' ? 'creada' : 'actualizada';
      setNotification({
        message: `Categoría ${action} exitosamente`,
        type: 'success'
      });
      setRefreshTrigger(prev => prev + 1);
      setVista('lista');
      setCategoriaEditando(null);
    } else {
      setNotification({
        message: 'Error al guardar la categoría',
        type: 'danger'
      });
    }
  };

  const handleCancelar = () => {
    setVista('lista');
    setCategoriaEditando(null);
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
          <Breadcrumb.Item active>Crear Categoría</Breadcrumb.Item>
        )}
        {vista === 'editar' && (
          <Breadcrumb.Item active>Editar Categoría</Breadcrumb.Item>
        )}
      </Breadcrumb>
    );
  };

  return (
    <>
      {renderNotification()}
      
      <StyledContainer fluid>
        <Row>
          <Col>
            {renderBreadcrumb()}
            
            {vista === 'lista' && (
              <CategoriaListar
                onEdit={handleEditar}
                onCrear={handleCrear}
                refreshTrigger={refreshTrigger}
              />
            )}

            {(vista === 'crear' || vista === 'editar') && (
              <Row className="justify-content-center">
                <Col md={8} lg={6}>
                  <CategoriaForm
                    categoria={categoriaEditando || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelar}
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

export default CategoriaPage;