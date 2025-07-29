import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Spinner, Row, Col, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { type CrearProductoCommand } from '../../types/CrearProductoCommand';
import { type ProductoDTO } from '../../types/ProductoDTO';
import { crearProducto, actualizarProducto } from '../../services/productoCommandService';

// Styled Components
const FormCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PriceInput = styled(InputGroup)`
  .input-group-text {
    background-color: #e9ecef;
    border-color: #ced4da;
  }
`;

interface ProductoFormProps {
  producto?: ProductoDTO;
  onSubmit: (success: boolean) => void;
  onCancel: () => void;
  categorias: Array<{ id: number; nombre: string }>;
}

const ProductoForm: React.FC<ProductoFormProps> = ({
  producto,
  onSubmit,
  onCancel,
  categorias
}) => {
  const [formData, setFormData] = useState<CrearProductoCommand>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoriaId: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!producto;

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoriaId: producto.categoriaId
      });
    }
  }, [producto]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (formData.categoriaId === 0) {
      newErrors.categoriaId = 'Debe seleccionar una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'stock' || name === 'categoriaId' 
        ? Number(value) 
        : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      if (isEditing && producto) {
        await actualizarProducto(producto.id, formData);
      } else {
        await crearProducto(formData);
      }
      onSubmit(true);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      onSubmit(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <Card.Header>
        <h4 className="mb-0">
          {isEditing ? 'Editar Producto' : 'Crear Producto'}
        </h4>
      </Card.Header>
      
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Nombre <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              isInvalid={!!errors.nombre}
              placeholder="Ingrese el nombre del producto"
            />
            <Form.Control.Feedback type="invalid">
              {errors.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Ingrese la descripción del producto"
              style={{ resize: 'vertical' }}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Precio <span className="text-danger">*</span>
                </Form.Label>
                <PriceInput>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    isInvalid={!!errors.precio}
                    placeholder="0.00"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.precio}
                  </Form.Control.Feedback>
                </PriceInput>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Stock <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  isInvalid={!!errors.stock}
                  placeholder="0"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.stock}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>
              Categoría <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleInputChange}
              isInvalid={!!errors.categoriaId}
            >
              <option value={0}>Seleccione una categoría</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.categoriaId}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="mt-4">
            <Col>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100 mb-2"
              >
                {loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    className="me-2"
                  />
                )}
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
              </Button>
            </Col>
            <Col>
              <Button
                variant="secondary"
                onClick={onCancel}
                disabled={loading}
                className="w-100"
              >
                Cancelar
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </FormCard>
  );
};

export default ProductoForm;