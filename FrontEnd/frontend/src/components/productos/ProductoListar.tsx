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
import { type ProductoDTO } from '../../types/ProductoDTO';
import ProductoQueryService from '../../services/productoQueryService';
import { eliminarProducto, restaurarProducto } from '../../services/productoCommandService';

// Styled Components
const StyledContainer = styled(Container)`
  max-width: 1400px;
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

const ProductInfo = styled.div`
  .product-name {
    font-weight: 600;
    color: #212529;
    margin-bottom: 0.25rem;
  }
  .product-description {
    color: #6c757d;
    font-size: 0.875rem;
  }
`;

const PriceCell = styled.td`
  font-weight: 600;
  color: #198754;
`;

interface ProductoListarProps {
  onEdit: (producto: ProductoDTO) => void;
  onCrear: () => void;
  refreshTrigger?: number;
}

const ProductoListar: React.FC<ProductoListarProps> = ({
  onEdit,
  onCrear,
  refreshTrigger
}) => {
  const [productos, setProductos] = useState<ProductoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mostrarEliminados, setMostrarEliminados] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [procesando, setProcesando] = useState<number | null>(null);

  const cargarProductos = async () => {
    setLoading(true);
    setError('');
    
    try {
      let data: ProductoDTO[];
      
      if (mostrarEliminados) {
        data = await ProductoQueryService.obtenerEliminados();
      } else {
        data = await ProductoQueryService.obtenerConEstadoStock();
        data = data.filter(p => !p.eliminado);
      }
      
      setProductos(data);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [mostrarEliminados, refreshTrigger]);

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este producto?')) {
      return;
    }

    setProcesando(id);
    try {
      await eliminarProducto(id);
      await cargarProductos();
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error('Error:', err);
    } finally {
      setProcesando(null);
    }
  };

  const handleRestaurar = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea restaurar este producto?')) {
      return;
    }

    setProcesando(id);
    try {
      await restaurarProducto(id);
      await cargarProductos();
    } catch (err) {
      setError('Error al restaurar el producto');
      console.error('Error:', err);
    } finally {
      setProcesando(null);
    }
  };

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
    producto.categoriaNombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'SIN_STOCK':
        return 'danger';
      case 'STOCK_BAJO':
        return 'warning';
      case 'STOCK_MEDIO':
        return 'success';
      case 'STOCK_ALTO':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStockText = (status: string) => {
    switch (status) {
      case 'SIN_STOCK':
        return 'Sin Stock';
      case 'STOCK_BAJO':
        return 'Stock Bajo';
      case 'STOCK_MEDIO':
        return 'Stock Medio';
      case 'STOCK_ALTO':
        return 'Stock Alto';
      default:
        return status;
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
            <h1 className="h3 mb-0">Gestión de Productos</h1>
          </Col>
          <Col xs={12} lg={6} className="text-lg-end mt-3 mt-lg-0">
            <ButtonGroup className="me-2">
              <Button
                variant={mostrarEliminados ? "danger" : "outline-secondary"}
                onClick={() => setMostrarEliminados(!mostrarEliminados)}
                size="sm"
              >
                {mostrarEliminados ? 'Mostrar Activos' : 'Mostrar Eliminados'}
              </Button>
            </ButtonGroup>
            
            {!mostrarEliminados && (
              <Button variant="success" onClick={onCrear} size="sm">
                Crear Producto
              </Button>
            )}
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Buscar productos por nombre, descripción o categoría..."
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

      {productosFiltrados.length === 0 ? (
        <EmptyState>
          <p>
            {mostrarEliminados 
              ? 'No hay productos eliminados'
              : 'No hay productos disponibles'
            }
          </p>
        </EmptyState>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => {
              const RowComponent = mostrarEliminados ? EliminadaRow : 'tr';
              return (
                <RowComponent key={producto.id}>
                  <td>
                    <ProductInfo>
                      <div className="product-name">{producto.nombre}</div>
                      <div className="product-description">{producto.descripcion}</div>
                    </ProductInfo>
                  </td>
                  <td>
                    <Badge bg="info" pill>
                      {producto.categoriaNombre}
                    </Badge>
                  </td>
                  <PriceCell>
                    {producto.precioFormateado || `$${producto.precio.toFixed(2)}`}
                  </PriceCell>
                  <td>
                    <span className="fw-semibold">{producto.stock}</span>
                  </td>
                  <td>
                    <Badge bg={getStockBadge(producto.stockStatus)} pill>
                      {getStockText(producto.stockStatus)}
                    </Badge>
                  </td>
                  <td className="text-end">
                    {mostrarEliminados ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleRestaurar(producto.id)}
                        disabled={procesando === producto.id}
                      >
                        {procesando === producto.id ? (
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
                          onClick={() => onEdit(producto)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => handleEliminar(producto.id)}
                          disabled={procesando === producto.id}
                        >
                          {procesando === producto.id ? (
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

export default ProductoListar;