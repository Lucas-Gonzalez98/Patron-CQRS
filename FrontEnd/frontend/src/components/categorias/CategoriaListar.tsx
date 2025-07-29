import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Button, 
  Table, 
  Form, 
  Alert, 
  Spinner, 
  Badge,
  ButtonGroup 
} from 'react-bootstrap';
import styled from 'styled-components';
import { type CategoriaDTO } from '../../types/CategoriaDTO';
import CategoriaQueryService from '../../services/categoriaQueryService';
import { eliminarCategoria, restaurarCategoria } from '../../services/categoriaCommandService';

// Styled Components
const StyledContainer = styled(Container)`
  max-width: 1200px;
  padding: 1.5rem;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  font-size: 1.1rem;
`;

const EliminadaRow = styled.tr`
  opacity: 0.6;
`;

interface CategoriaListarProps {
  onEdit: (categoria: CategoriaDTO) => void;
  onCrear: () => void;
  refreshTrigger?: number;
}

const CategoriaListar: React.FC<CategoriaListarProps> = ({
  onEdit,
  onCrear,
  refreshTrigger
}) => {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mostrarEliminadas, setMostrarEliminadas] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [procesando, setProcesando] = useState<number | null>(null);
  const [vistaEstadisticas, setVistaEstadisticas] = useState(false);

  const cargarCategorias = async () => {
    setLoading(true);
    setError('');
    
    try {
      let data: CategoriaDTO[];
      
      if (mostrarEliminadas) {
        data = await CategoriaQueryService.obtenerEliminadas();
      } else if (vistaEstadisticas) {
        data = await CategoriaQueryService.obtenerConEstadisticas();
        data = data.filter(c => !c.eliminado);
      } else {
        data = await CategoriaQueryService.obtenerConEstado();
        data = data.filter(c => !c.eliminado);
      }
      
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, [mostrarEliminadas, vistaEstadisticas, refreshTrigger]);

  const handleEliminar = async (id: number, nombre: string, cantidadProductos: number) => {
    if (cantidadProductos > 0) {
      alert(`No se puede eliminar la categoría "${nombre}" porque tiene ${cantidadProductos} productos asociados.`);
      return;
    }

    if (!window.confirm(`¿Está seguro de que desea eliminar la categoría "${nombre}"?`)) {
      return;
    }

    setProcesando(id);
    try {
      await eliminarCategoria(id);
      await cargarCategorias();
    } catch (err) {
      setError('Error al eliminar la categoría');
      console.error('Error:', err);
    } finally {
      setProcesando(null);
    }
  };

  const handleRestaurar = async (id: number, nombre: string) => {
    if (!window.confirm(`¿Está seguro de que desea restaurar la categoría "${nombre}"?`)) {
      return;
    }

    setProcesando(id);
    try {
      await restaurarCategoria(id);
      await cargarCategorias();
    } catch (err) {
      setError('Error al restaurar la categoría');
      console.error('Error:', err);
    } finally {
      setProcesando(null);
    }
  };

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (categoria.descripcion && categoria.descripcion.toLowerCase().includes(filtro.toLowerCase()))
  );

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'ACTIVA':
        return 'success';
      case 'INACTIVA':
        return 'danger';
      case 'SIN_PRODUCTOS':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'ACTIVA':
        return 'Activa';
      case 'INACTIVA':
        return 'Inactiva';
      case 'SIN_PRODUCTOS':
        return 'Sin Productos';
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner animation="border" variant="primary" />
      </LoadingWrapper>
    );
  }

  return (
    <StyledContainer>
      <HeaderSection>
        <Row className="align-items-center mb-3">
          <Col xs={12} lg={6}>
            <h1 className="h3 mb-0">Gestión de Categorías</h1>
          </Col>
          <Col xs={12} lg={6} className="text-lg-end mt-3 mt-lg-0">
            <ButtonGroup className="me-2">
              <Button
                variant={vistaEstadisticas ? "primary" : "outline-secondary"}
                onClick={() => setVistaEstadisticas(!vistaEstadisticas)}
                disabled={mostrarEliminadas}
                size="sm"
              >
                {vistaEstadisticas ? 'Vista Normal' : 'Con Estadísticas'}
              </Button>
              <Button
                variant={mostrarEliminadas ? "danger" : "outline-secondary"}
                onClick={() => {
                  setMostrarEliminadas(!mostrarEliminadas);
                  setVistaEstadisticas(false);
                }}
                size="sm"
              >
                {mostrarEliminadas ? 'Mostrar Activas' : 'Mostrar Eliminadas'}
              </Button>
            </ButtonGroup>
            
            {!mostrarEliminadas && (
              <Button variant="success" onClick={onCrear} size="sm">
                Crear Categoría
              </Button>
            )}
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Buscar categorías por nombre o descripción..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </Col>
        </Row>
      </HeaderSection>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {categoriasFiltradas.length === 0 ? (
        <EmptyState>
          <p>
            {mostrarEliminadas 
              ? 'No hay categorías eliminadas'
              : 'No hay categorías disponibles'
            }
          </p>
        </EmptyState>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Descripción</th>
              {(vistaEstadisticas || mostrarEliminadas) && (
                <th>Productos</th>
              )}
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categoriasFiltradas.map((categoria) => {
              const RowComponent = mostrarEliminadas ? EliminadaRow : 'tr';
              return (
                <RowComponent key={categoria.id}>
                  <td>
                    <strong>{categoria.nombre}</strong>
                  </td>
                  <td>
                    <div style={{ maxWidth: '300px' }} className="text-truncate">
                      {categoria.descripcion || 'Sin descripción'}
                    </div>
                  </td>
                  {(vistaEstadisticas || mostrarEliminadas) && (
                    <td>
                      <Badge 
                        bg={categoria.cantidadProductos > 0 ? 'info' : 'secondary'}
                        pill
                      >
                        {categoria.cantidadProductos} productos
                      </Badge>
                    </td>
                  )}
                  <td>
                    <Badge bg={getEstadoBadge(categoria.estado)} pill>
                      {getEstadoTexto(categoria.estado)}
                    </Badge>
                  </td>
                  <td className="text-end">
                    {mostrarEliminadas ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleRestaurar(categoria.id, categoria.nombre)}
                        disabled={procesando === categoria.id}
                      >
                        {procesando === categoria.id ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-1" />
                            Restaurando...
                          </>
                        ) : (
                          'Restaurar'
                        )}
                      </Button>
                    ) : (
                      <ButtonGroup size="sm">
                        <Button
                          variant="outline-primary"
                          onClick={() => onEdit(categoria)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleEliminar(categoria.id, categoria.nombre, categoria.cantidadProductos)}
                          disabled={procesando === categoria.id}
                        >
                          {procesando === categoria.id ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-1" />
                              Eliminando...
                            </>
                          ) : (
                            'Eliminar'
                          )}
                        </Button>
                      </ButtonGroup>
                    )}
                  </td>
                </RowComponent>
              );
            })}
          </tbody>
        </Table>
      )}
    </StyledContainer>
  );
};

export default CategoriaListar;